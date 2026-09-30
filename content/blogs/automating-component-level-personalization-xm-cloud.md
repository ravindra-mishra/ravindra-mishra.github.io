---
title: "Automating Component-Level Personalization in Sitecore XM Cloud: From APIs to an AI-Assisted Workflow"
description: Learn how to automate Sitecore XM Cloud component-level personalization—create variant datasources, configure Sitecore Personalize audienceTraffic flows, and inject __Final Renderings rules via Authoring GraphQL and the Flow Definition API.
keywords: Sitecore XM Cloud personalization, component-level personalization automation, Sitecore Personalize Flow Definition API, __Final Renderings personalization rules, Authoring GraphQL createItem updateItem, variantId Personalize Sitecore bridge, audienceTraffic INTERACTIVE_API_FLOW, Set Data Source Hide Rendering automation, AI-assisted personalization workflow XM Cloud
metaDescription: Automate XM Cloud component personalization—variant datasources, Personalize audienceTraffic flows, and __Final Renderings rules via GraphQL and the Flow Definition API.
featuredImage: /uploads/blog-automating-component-level-personalization-xm-cloud.png
featuredImageAlt: Diagram of automating component-level personalization in Sitecore XM Cloud—Input, Personalize API, Variant ID, and XM Cloud rendering rules with AI suggestions and human confirmation
slug: automating-component-level-personalization-xm-cloud
date: September 30, 2026 2:18 PM
author: "Ravindra Mishra"
tags:
  - tag: sitecore
  - tag: sitecore-xm-cloud
faq:
  - question: What does automating component-level personalization in Sitecore XM Cloud replace?
    answer: It replaces the manual chain of creating variant datasources, configuring a Sitecore Personalize experience with audience splits, and attaching personalization rules to specific rendering instances in __Final Renderings layout XML.
  - question: How does variantId connect Sitecore Personalize and XM Cloud layout rules?
    answer: Personalize generates a variantId on each audienceTraffic split and embeds it in the split template; Sitecore personalization rules match that same variantId via s:VariantName, so audience logic stays in Personalize while XM Cloud applies Set Data Source or Hide Rendering.
  - question: Which APIs are used to automate XM Cloud personalization authoring?
    answer: Sitecore Personalize OAuth and Flow Definition API for experiences/splits, plus XM Cloud Authoring and Management GraphQL (item queries, createItem, updateItem) to create datasources and write __Final Renderings.
howto:
  name: Automate component-level personalization in Sitecore XM Cloud
  description: From a structured personalization payload, create variant datasources, configure a Personalize flow, and apply rules to rendering instances.
  steps:
    - name: Prepare structured input
      text: Describe the page, audience conditionGroups, and component actions (Set Data Source or Hide Rendering) in a validated JSON personalization payload.
    - name: Identify target component instances
      text: Resolve Hero/Promo rendering instance UIDs against live layout or __Final Renderings so rules attach to the correct instances.
    - name: Create variant datasources
      text: For Set Data Source actions, createItem under the page Data folder and updateItem with datasourceFields via Authoring GraphQL.
    - name: Configure the Personalize flow
      text: Create or update an INTERACTIVE_API_FLOW with audienceTraffic splits whose template embeds variantId for each variant.
    - name: Apply personalization to layout XML
      text: Inject ruleset rules on matching rendering UIDs that match the Personalize variantId and encode Set Data Source or Hide Rendering actions.
    - name: Persist __Final Renderings
      text: Write the transformed layout XML back to the page with Authoring GraphQL updateItem, then validate datasources, flow splits, and rules.
---
## Overview

Creating component-level personalization in Sitecore XM Cloud is usually a multi-system, multi-click process: pick a page, invent an audience, create variant content items, configure a Sitecore Personalize experience, then attach personalization rules to specific renderings in layout XML. That work is accurate when done carefully — and slow when repeated often.

This article explains how to **automate that authoring chain** by programmatically:

1. Creating Sitecore datasource items for personalized content  
2. Creating or updating a Sitecore Personalize **flow definition** with audience-based traffic splits  
3. Injecting personalization rules into the page’s `__Final Renderings` field  

### Where AI fits (optional)

There are two ways to provide the same input:

```text
Manual / CLI:
  Structured JSON
        ↓
  Deterministic automation

AI-assisted:
  Natural language / page context
        ↓
  AI generates a personalization strategy
        ↓
  Human confirms
        ↓
  Same structured JSON
        ↓
  Same deterministic automation
```

The rest of this article focuses on the **deterministic automation layer**. AI is simply another way of producing the same structured input — recommend → confirm → automate. It does not replace the API and XML steps below.

You will learn:

- What manual authoring steps this pattern replaces  
- How one concrete personalization scenario flows through every system  
- How `variantId` bridges Personalize and Sitecore layout rules  
- The APIs, schemas, and validation involved  

This is an **authoring / automation** guide. Runtime visitor decisioning and delivery are out of scope except where needed to explain that bridge.

---

## What are we actually building?

Suppose a product page has a **Hero** and a **Promo** component.

**Goal:** Visitors arriving from Google (`utm_source = google`) should see a Google-specific Hero, while the Promo should be hidden for that audience. Everyone else keeps the default layout.

Normally an author would:

1. Create a Google Hero datasource  
2. Configure a Personalize experience with that audience  
3. Add personalization rules on each rendering instance  

This article automates those steps for that scenario — referred to below as the **Google MacBook** example (`variantName = fromGoogleMacbook`).

### Expected result (keep this in mind)

```text
BEFORE

Hero
 └── Datasource: local:/Data/MacBook_Pro_Hero
 └── Personalization: none

Promo
 └── Visible (default datasource)
 └── Personalization: none

Personalize
 └── No experience for this page/language


AFTER

Hero
 ├── Default → local:/Data/MacBook_Pro_Hero
 └── Google (fromGoogleMacbook) → local:/Data/MacBook Pro from Google

Promo
 └── Google (fromGoogleMacbook) → Hide Rendering

Personalize
 └── Interactive experience (DRAFT)
 └── Split: fromGoogleMacbook + UTM source = google
 └── template embeds variantId (e.g. a1b2c3d4-...)

__Final Renderings
 └── Rules on Hero and Promo instances
 └── Condition matches that same variantId
```

---

## Manual process → what automation replaces

If you already know how to personalize in the UI, this mapping answers: **what exactly is being automated?**

| Manual authoring | Automation |
| ---------------- | ---------- |
| Select page | Page `id` / `path` / `language` / `version` / `siteId` in input |
| Select Hero / Promo rendering instance | Resolve rendering instance `UID` |
| Create variant datasource | Authoring GraphQL `createItem` + `updateItem` |
| Configure audience | Build `conditionGroups` in input |
| Create Personalize experience | `POST` / `PUT` Flow Definition API |
| Add personalization rule on component | Transform and write `__Final Renderings` |
| Repeat for another variant | Iterate `page.variants[]` |
| Review result | Automated validation + logs |

---

## How these objects connect

Page structure for the running example:

```text
Page (MacBook Pro)
 ├── Hero rendering instance
 │    ├── default datasource → MacBook_Pro_Hero
 │    └── personalization rules
 │          ├── Google audience → MacBook Pro from Google
 │          └── Default → keep original datasource
 └── Promo rendering instance
      ├── default datasource → mackbook-pro-promo1
      └── personalization rules
            ├── Google audience → Hide Rendering
            └── Default → keep visible
```

Information flow across systems:

```text
Audience (UTM source = google)
   ↓
Personalize Flow (audienceTraffic split)
   ↓
variantId generated for fromGoogleMacbook
   ↓
Sitecore personalization rule (s:VariantName = that variantId)
   ↓
Set Data Source / Hide Rendering
   ↓
Variant datasource (or hide action)
```

### The `variantId` bridge (most important link)

The same identifier must appear in Personalize and in Sitecore. Using a concrete example value:

```text
variantName = fromGoogleMacbook
variantId   = a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

```text
Variant input (name + conditionGroups + component actions)
   ↓
Personalize split created
   ↓
variantId generated/assigned
   ↓
Stored in split template:
   "template": "{\"variantId\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\"}"
   ↓
Same value written into Sitecore rule:
   s:name="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   s:VariantName="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   ↓
Sitecore can associate Hero Set Data Source / Promo Hide with that variant
```

Audience logic stays in Personalize. Sitecore does **not** re-implement UTM conditions in every rule — it matches the resolved `variantId`.

---

## Key concepts

### Audience

An audience answers: **which visitors should see this experience?**  
In the Google MacBook example: UTM source equals `google`. In Personalize configuration, that is expressed as `conditionGroups` on a traffic split.

### Flow definition

A **flow definition** is the API object for a Personalize experience or experiment. It holds name, `friendlyId`, type, status (`DRAFT` / `PRODUCTION`), schedule, and traffic splits. For embedded page personalization, the flow type used here is `INTERACTIVE_API_FLOW` with subtype `EXPERIENCE`.

### Variant / traffic split

A **variant** is one version of the experience — here, `fromGoogleMacbook`. In the flow payload, each split carries a `variantName`, optional `audienceName`, `conditionGroups`, and a `template` string that embeds a `variantId`. That `variantId` is the bridge Sitecore uses later in rendering rules.

### Rendering and rendering instance

A **rendering** is a component definition (template / presentation item).  
A **rendering instance** is a specific placement of that component on a page layout, identified by a unique `uid` on the `<r>` element in layout XML. Personalization targets the instance (this page’s Hero), not “the Hero rendering” in the abstract.

### Datasource

A **datasource** is the content item a rendering binds to. The Google variant needs different field values, so automation creates `MacBook Pro from Google` under the page’s `Data` folder and points Set Data Source at it.

### `__Final Renderings`

Sitecore stores final layout (including personalization rules) on the standard field `__Final Renderings` as XML. Authoring automation reads that field, transforms it, and writes it back with GraphQL `updateItem`. Experience Edge and preview layout APIs are not the write path for this field.

---

## Architecture / end-to-end flow

```
INPUT
  Structured personalization payload
  (page + variants + conditionGroups + component actions)
        │
        ▼
IDENTIFY TARGET
  Page item id / path / language / version / siteId
  Component instance UIDs from layout
        │
        ▼
PREPARE CONTENT
  For each "Set Data Source" action:
    resolve Datasource Template → createItem under page/Data
    updateItem with datasourceFields
        │
        ▼
CONFIGURE PERSONALIZE
  OAuth token → GET flow by friendlyId
  POST create or PUT update INTERACTIVE_API_FLOW
  audienceTraffic splits from conditionGroups
  → produces variantId per split
        │
        ▼
APPLY TO LAYOUT
  Read __Final Renderings
  Inject <rls>/<ruleset>/<rule> per matching <r uid="...">
  Condition matches Personalize variantId
  Action = Set Data Source or Hide Rendering
  updateItem writes XML back
        │
        ▼
VALIDATE / OUTPUT
  Datasource items + flow ref + updated layout rules (+ logs)
```

**System split of responsibility:**

| Concern | System |
|--------|--------|
| Who qualifies for a variant | Sitecore Personalize (`conditionGroups` on splits) |
| What content exists for a variant | XM Cloud items (datasources) |
| What the page does when a variant matches | XM Cloud `__Final Renderings` rules |

---

## Prerequisites: what already exists vs what automation creates

### Already exists (required before you run)

- Sitecore page (path, language, version)  
- Hero and Promo rendering instances on that page  
- Rendering datasource template(s) and a page `Data` folder  
- Sitecore Personalize environment with API access  
- OOTB personalization condition/action definitions (Set Data Source, Hide Rendering, variant-match condition)  
- Credentials for Personalize OAuth + XM Cloud Authoring GraphQL (or Marketplace access token)

### Created or changed by automation

- Variant datasource items (for Set Data Source actions)  
- Personalize flow definition / traffic splits  
- `__Final Renderings` rules on targeted rendering instances  

### Out of scope for this article

- Creating the component or datasource template itself  
- Runtime visitor identification / decisioning architecture  
- Publishing Sitecore items or promoting flows to `PRODUCTION` (unless you add that separately)  
- Custom personalization action implementation  
- Unrelated CDP, analytics, or commerce functionality  

---

## Available APIs and resources

These APIs appear in the workflow in order. Details below; use them as the toolkit for the steps that follow.

### Sitecore Personalize — OAuth

**Role in this workflow:** Obtain a Bearer token so the next calls can create or update the Google MacBook experience.

`POST https://auth.sitecorecloud.io/oauth/token`

**Authentication:** Client credentials.

**Request (form-urlencoded):**

```
client_id=<CLIENT_ID>
client_secret=<CLIENT_SECRET>
grant_type=client_credentials
audience=https://api.sitecorecloud.io
```

**Config:** API Key / API Secret from Sitecore Cloud Portal (Developer center / Personalize API keys). Cache the token and refresh before expiry.

**Docs:** [Request an access token](https://doc.sitecore.com/personalize/en/developers/api/request-an-access-token.html), [Create an API key](https://doc.sitecore.com/personalize/en/developers/api/create-an-api-key.html)

---

### Sitecore Personalize — Flow Definition API

**Role in this workflow:** Create or update the experience that contains the Google audience split. Once that exists, each split provides a `variantId` that Sitecore rendering rules can reference.

Base URL is **environment-dependent**. Implementations may call a legacy host such as `https://api.boxever.com/v2` or a regional Personalize base URL with `/v3`. Prefer the base URL shown for your tenant in Company information → Environment, and confirm against current docs.

| Operation | Method | Path pattern |
|-----------|--------|----------------|
| Get by friendly id | `GET` | `{BASE}/flowDefinitions/{friendlyId}` |
| Create | `POST` | `{BASE}/flowDefinitions` |
| Update | `PUT` | `{BASE}/flowDefinitions/{ref}` |

**Auth header:** `Authorization: Bearer <ACCESS_TOKEN>`

**Also required in create payloads:** `clientKey` (CDP/Personalize Client Key for the tenant).

**Docs:**

- [Flow definition REST API](https://doc.sitecore.com/personalize/en/developers/api/rest-apis/flow-definition-rest-api/index.html)  
- [Create a flow definition](https://doc.sitecore.com/personalize/en/developers/api/rest-apis/flow-definition-rest-api/create-a-flow-definition.html)  
- [Retrieve a flow definition](https://doc.sitecore.com/personalize/en/developers/api/rest-apis/flow-definition-rest-api/retrieve-a-flow-definition.html)  
- [Base URL](https://doc.sitecore.com/personalize/en/developers/api/base-url.html)

Companion API reference and Postman samples in this repo:

- `docs/blogs/sitecore-cdp-personalize-apis-guide.md`  
- `docs/postman/Sitecore-CDP-Personalize-APIs.postman_collection.json`

---

### Sitecore XM Cloud — Authoring and Management GraphQL

**Role in this workflow:** Create the Google Hero datasource, then read and write `__Final Renderings` so Hero/Promo instances get the personalization rules.

Typical operations used:

| GraphQL operation | Purpose |
|-------------------|---------|
| `item` query | Resolve Datasource Template, Data folder, current `__Final Renderings` |
| `createItem` | Create variant datasource under `{page.path}/Data` |
| `updateItem` | Fill datasource fields; write updated `__Final Renderings` |

**Auth:** Bearer token from an XM Cloud automation client, or a Marketplace / Auth0 access token when calling through the Marketplace XMC SDK (`authoring.graphql`).

**Docs:**

- [Authoring and Management GraphQL API](https://doc.sitecore.com/xp/en/developers/103/sitecore-experience-manager/sitecore-authoring-and-management-graphql-api.html)  
- [Query examples for authoring operations](https://doc.sitecore.com/sai/en/developers/sitecoreai/content-modeling-and-presentation/sitecore-authoring-and-management-graphql-api/query-examples-for-authoring-operations.html)  
- [Enabling and authorizing Authoring API requests](https://doc.sitecore.com/sai/en/developers/sitecoreai/content-modeling-and-presentation/sitecore-authoring-and-management-graphql-api/walkthrough--enabling-and-authorizing-requests-to-the-authoring-and-management-api.html)

**Read path for component discovery (optional):** Preview / layout GraphQL can list components and UIDs for AI or UI mapping. It is not used to persist personalization XML.

---

### Configuration values (structure only)

| Variable | Role |
|----------|------|
| Personalize client id / secret | OAuth for Flow API |
| Personalize / CDP `clientKey` | Included on flow create payload |
| Flow API base | Host + version for `flowDefinitions` |
| XM Cloud token or Marketplace access token | Authoring GraphQL |
| Database name | Often `master` for authoring |

Never commit real secrets. Use placeholders in docs and environment variables in code.

---

## Step 1 — Input / preparation

**Goal:** Describe the Google MacBook scenario in a machine-readable contract.

Automation needs three kinds of information:

1. **Where** — which page (id, path, language, version, siteId)  
2. **Who** — which audience (`conditionGroups`)  
3. **What** — which component instances change, and how (Set Data Source / Hide Rendering)

Conceptual shape:

```json
{
  "page": { "...page context..." },
  "variants": [
    {
      "name": "fromGoogleMacbook",
      "conditionGroups": [ "...UTM source = google..." ],
      "components": [
        { "name": "Hero", "action": "Set Data Source", "...": "..." },
        { "name": "Promo", "action": "Hide Rendering", "...": "..." }
      ]
    }
  ]
}
```

### Full input schema (unchanged structure)

The working contract used by automation:

```json
{
  "page": {
    "id": "{52C6E3B3-0DA8-4071-BF34-9317B47875E6}",
    "path": "/sitecore/content/Welcome to XMC/Your first site/Home/products/laptop/macbook-pro",
    "language": "en",
    "version": 1,
    "siteId": "{D9EAC5B1-98CF-4C6E-8A8F-111C431B1E33}",
    "variants": [
      {
        "name": "fromGoogleMacbook",
        "conditionGroups": [
          {
            "conditions": [
              {
                "templateId": "utm_value",
                "params": {
                  "type": "source",
                  "compares to": "is equal to",
                  "UTM value": "google"
                }
              }
            ]
          }
        ],
        "components": [
          {
            "UID": "{B1F293A7-7FC8-4D4E-BD2D-5537A5C443E0}",
            "id": "{6D0AAE4A-C2D1-4F3A-8285-705D13DE8244}",
            "name": "Hero",
            "action": {
              "name": "Set Data Source",
              "id": "{0F3C6BEC-E56B-4875-93D7-2846A75881D2}",
              "inputs": {
                "dataSource": "local:/Data/MacBook Pro from Google",
                "parameters": {},
                "datasourceFields": {
                  "Title": "MacBook Pro from Google",
                  "Description": "Special offer for Google visitors"
                }
              }
            }
          },
          {
            "UID": "{BED9EF34-72C4-438F-B515-13919BFA8418}",
            "id": "{51C13F03-8364-4F61-B860-2EC6CA7439B3}",
            "name": "Promo",
            "action": {
              "name": "Hide Rendering",
              "id": "{25F351A1-712D-45F8-857D-8AD95BB2ACE9}",
              "inputs": {}
            }
          }
        ]
      }
    ]
  }
}
```

**What to notice:** `UID` values identify Hero and Promo **instances**; `conditionGroups` describe Google traffic; `datasourceFields` become the Google Hero content.

**Important fields:**

| Field | Why it exists |
|-------|----------------|
| `page.id` / `path` / `language` / `version` | Target item for GraphQL read/write |
| `page.siteId` | Stored on the Personalize flow payload |
| `variants[].name` | Human-readable split name (`variantName`) |
| `variants[].conditionGroups` | Audience rules for Personalize splits |
| `components[].UID` | Rendering **instance** uid in layout XML |
| `components[].id` | Rendering definition item id (for Datasource Template lookup) |
| `action.name` / `action.id` | Sitecore personalization action to encode in XML |
| `inputs.dataSource` | Relative datasource path for Set Data Source |
| `inputs.datasourceFields` | Field values written onto the new datasource item |

**Preparation checks:**

- Required page fields present (`id`, `path`, `language`, `siteId`, `variants`)  
- Each variant has `name`, `conditionGroups`, and `components`  
- Variant names sanitized for predictable identifiers  
- OOTB actions only (`Set Data Source`, `Hide Rendering`) for fully automated apply; custom actions usually need code and should not be auto-written the same way  

**Output of this step:** A validated payload ready for targeting, content creation, and Personalize configuration.  
**Next:** Resolve the Hero/Promo UIDs against real layout so rules attach to the right instances.

---

## Step 2 — Identify the target component

```text
INPUT
  components[].UID for Hero and Promo
     ↓
ACTION
  Match those UIDs to <r> elements in layout / __Final Renderings
     ↓
OUTPUT
  Confirmed rendering instances + default datasources
     ↓
NEXT
  Create Google Hero datasource for the Hero instance
```

Component-level personalization is a chain:

**Page → rendering definition → rendering instance (`UID`) → datasource → variant → action → `__Final Renderings`**

Example layout fragment **before** personalization rules are added (Google MacBook page):

```xml
<r xmlns:p="p" xmlns:s="s" p:p="1">
  <d id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">
    <r uid="{B1F293A7-7FC8-4D4E-BD2D-5537A5C443E0}"
       p:before="*"
       s:ds="local:/Data/MacBook_Pro_Hero"
       s:id="{6D0AAE4A-C2D1-4F3A-8285-705D13DE8244}"
       s:par=""
       s:ph="headless-main" />
    <r uid="{BED9EF34-72C4-438F-B515-13919BFA8418}"
       p:after="*[1=2]"
       s:ds="local:/Data/mackbook-pro-promo1"
       s:id="{945776A1-8F30-4749-A668-4FCC434A60ED}"
       s:par="..."
       s:ph="headless-main" />
  </d>
</r>
```

- `uid` on `<r>` = instance to personalize (must match `components[].UID`)  
- `s:id` = rendering definition  
- `s:ds` = current default datasource  

**Why this matters:** If the UID is wrong, rules attach to the wrong instance or nowhere. Automation should resolve UIDs from live layout (Pages context, preview layout query, or an exported layout snapshot), not guess them.

**Next:** The page and UIDs are known, but the Google Hero content item does not exist yet. Create that datasource before wiring Set Data Source.

---

## Step 3 — Create variant content (datasources)

```text
INPUT
  Hero UID + action Set Data Source + datasourceFields
     ↓
ACTION
  Resolve Datasource Template → createItem under page/Data → updateItem fields
     ↓
OUTPUT
  Datasource item, e.g.
  /sitecore/content/.../macbook-pro/Data/MacBook Pro from Google
     ↓
NEXT
  That local:/Data/... path is used by the Set Data Source rule later
```

**What:** For each component action named `Set Data Source`, create a content item under `{page.path}/Data`.

**Why:** The Set Data Source action needs a real item (or a resolvable `local:/Data/...` path) holding the personalized field values — here, the Google Hero copy.

**How (Authoring GraphQL sequence):**

1. Read the rendering item’s `Datasource Template` field using `component.id`  
2. Resolve that template path to a `templateId`  
3. Resolve parent folder `{page.path}/Data` to `parentId`  
4. `createItem` with name derived from `inputs.dataSource`  
5. `updateItem` with `datasourceFields`, filtered to fields that exist on the template  

**Purpose of the create mutation:** create the Google Hero item; the resulting name/path later becomes `s:DataSource` on the Hero rule.

```graphql
mutation CreateItem($input: CreateItemInput!) {
  createItem(input: $input) {
    item {
      itemId
      path
      name
      fields(ownFields: true, excludeStandardFields: true) {
        nodes {
          name
          value
          templateField { type }
        }
      }
    }
  }
}
```

Variables pattern:

```json
{
  "input": {
    "name": "MacBook Pro from Google",
    "templateId": "<TEMPLATE_ITEM_ID>",
    "parent": "<DATA_FOLDER_ITEM_ID>",
    "language": "en"
  }
}
```

Update mutation shape for fields:

```graphql
mutation UpdateItem($input: UpdateItemInput!) {
  updateItem(input: $input) {
    item {
      itemId
      name
      fields(ownFields: true, excludeStandardFields: true) {
        nodes {
          name
          value
          templateField { type }
        }
      }
    }
  }
}
```

**Practical guardrails:**

- Skip if Datasource Template or Data folder is missing  
- Whitelist field names against the created item’s own fields  
- Image fields may need a default media reference if the template requires them  

`Hide Rendering` for Promo skips datasource creation — there is no content item to create.

**Next:** Variant content exists in XM Cloud, but the page still has no Personalize audience/variant identity and no layout rule pointing at that datasource. Configure the Personalize flow next (and generate `variantId`).

---

## Step 4 — Configure personalization (Personalize flow)

```text
INPUT
  variantName fromGoogleMacbook + conditionGroups (UTM google) + page/site context
     ↓
ACTION
  OAuth → GET flow by friendlyId → POST create or PUT update
     ↓
OUTPUT
  Flow with audienceTraffic split
  template: {"variantId":"a1b2c3d4-e5f6-7890-abcd-ef1234567890"}
     ↓
NEXT
  That variantId is written into Sitecore Hero/Promo rules
```

**What:** Create or update an `INTERACTIVE_API_FLOW` experience whose traffic type is `audienceTraffic`.

**Why:** Personalize owns audience evaluation and exposes a `variantId`. Sitecore layout rules later key off that id.

### Flow naming

A deterministic naming helper keeps one flow per page + language:

- `name`: `{pageName} {language} - {itemId}`  
- `friendlyId`: `embedded_{itemIdWithoutDashes}_{language}`  

Deterministic `friendlyId` values make `GET .../flowDefinitions/{friendlyId}` reliable for create-vs-update logic.

### Create payload (schema)

When the flow does not exist (`404` on GET), POST a payload shaped like:

```json
{
  "name": "macbook-pro en - 52c6e3b30da84071bf349317b47875e6",
  "friendlyId": "embedded_52c6e3b30da84071bf349317b47875e6_en",
  "clientKey": "<CLIENT_KEY>",
  "type": "INTERACTIVE_API_FLOW",
  "subtype": "EXPERIENCE",
  "channels": ["WEB"],
  "businessProcess": "interactive_v1",
  "siteId": "{D9EAC5B1-98CF-4C6E-8A8F-111C431B1E33}",
  "traffic": {
    "type": "audienceTraffic",
    "weightingAlgorithm": "USER_DEFINED",
    "splits": [
      {
        "template": "{\"variantId\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\"}",
        "variantName": "fromGoogleMacbook",
        "audienceName": "<OPTIONAL_AUDIENCE_LABEL>",
        "conditionGroups": [
          {
            "conditions": [
              {
                "templateId": "utm_value",
                "params": {
                  "type": "source",
                  "compares to": "is equal to",
                  "UTM value": "google"
                }
              }
            ]
          }
        ]
      }
    ]
  },
  "variants": [],
  "status": "DRAFT",
  "schedule": {
    "type": "simpleSchedule",
    "startDate": "2026-09-30T00:00:00.000Z"
  },
  "sampleSizeConfig": {
    "baseValue": 0.15,
    "minimumDetectableDifference": 0.02,
    "confidenceLevel": 0.95
  },
  "notificationEnabled": false
}
```

**What to notice:** `conditionGroups` carry the Google audience; `template` embeds the generated `variantId` that Step 5 will copy into XML. Values like `a1b2c3d4-...` are illustrative placeholders for a generated id from your run.

**Field notes:**

| Field | Role |
|-------|------|
| `type` / `subtype` | Interactive API experience (not a classic web experiment UI flow) |
| `traffic.type: audienceTraffic` | Audience-driven splits instead of simple percentage traffic |
| `splits[].template` | JSON string embedding `variantId` — the id Sitecore rules will match |
| `splits[].conditionGroups` | Audience conditions copied from the automation input |
| `status: DRAFT` | Keeps the experience unpublished until reviewed |
| `clientKey` | Tenant client key required by the API |

### Update behavior (see also “What happens if I run it again?”)

If the flow exists:

- **Archived:** unarchive, replace splits, `PUT` by `ref`  
- **Active:** for each incoming variant  
  - same `variantName` + same `conditionGroups` → skip  
  - same `variantName` + different conditions → overwrite split  
  - new `variantName` → append split  

This is lightweight idempotency, not a full governance model.

**Transition:** At this point the audience/variant definition exists and a `variantId` has been assigned — but Sitecore still does not know what to do with the Hero or Promo when that variant matches. The next step connects the Personalize variant to the actual component actions.

---

## Step 5 — Apply personalization to the rendering (XML transform)

```text
INPUT
  Hero/Promo UIDs + actions + variantId from Step 4
  + Google datasource path from Step 3
     ↓
ACTION
  Find matching <r uid="..."> → add ruleset rules
     ↓
OUTPUT
  Layout XML with personalization under those instances
     ↓
NEXT
  Persist XML via updateItem on __Final Renderings
```

We are **not** rebuilding the page layout. We locate each `<r>` whose `uid` identifies the Hero or Promo instance and add a ruleset beneath that rendering.

```text
Page layout XML
   ↓
Find <r uid="{B1F293A7-...}">  (Hero)
   ↓
Add personalization rules
   ↓
fromGoogleMacbook → Set Data Source → local:/Data/MacBook Pro from Google

Find <r uid="{BED9EF34-...}">  (Promo)
   ↓
fromGoogleMacbook → Hide Rendering
```

**What:** For each rendering instance whose `uid` appears in the payload, ensure an `<rls>` / `<ruleset>` exists and add a `<rule>` per variant.

**Why:** Without this step, Personalize may resolve `fromGoogleMacbook`, but the page layout has no rule to swap Hero content or hide Promo.

### Sitecore identifiers used in rules

| Purpose | Identifier |
|---------|------------|
| Condition: match Personalize variant | `{8E7426A4-12ED-4C44-8625-E7191860E726}` with `s:VariantName` |
| Action: Set Data Source | `{0F3C6BEC-E56B-4875-93D7-2846A75881D2}` |
| Action: Hide Rendering | `{25F351A1-712D-45F8-857D-8AD95BB2ACE9}` |
| Default rule condition | `{4888ABBB-F17D-4485-B14B-842413F88732}` |

These IDs come from Sitecore’s OOTB personalization rule definitions. Treat them as platform constants for this rule shape; confirm against your Sitecore version if behavior differs.

### Rule structure written into the ruleset

Same `variantId` as in the Personalize split `template`:

```xml
<rule uid="{<NEW_RULE_UID>}" s:name="a1b2c3d4-e5f6-7890-abcd-ef1234567890">
  <conditions>
    <condition
      uid="<CONDITION_UID>"
      s:id="{8E7426A4-12ED-4C44-8625-E7191860E726}"
      s:VariantName="a1b2c3d4-e5f6-7890-abcd-ef1234567890" />
  </conditions>
  <actions>
    <action
      uid="{<ACTION_UID>}"
      s:id="{0F3C6BEC-E56B-4875-93D7-2846A75881D2}"
      s:DataSource="local:/Data/MacBook Pro from Google" />
  </actions>
</rule>
```

For Promo Hide Rendering, the action uses `{25F351A1-712D-45F8-857D-8AD95BB2ACE9}` and does not set `s:DataSource`.

Transform behavior:

- Match `<r uid="...">` to `components[].UID`  
- Create `<rls>` and `<ruleset s:pet="true">` if missing  
- Skip adding a rule if a rule with the same `s:name` (`variantId`) already exists  
- Ensure a `Default` rule remains in the ruleset  

**Note:** Audience `conditionGroups` are **not** duplicated into Sitecore conditions in this pattern. Sitecore matches the Personalize variant; Personalize already applied audience filters.

**Next:** Persist the transformed XML on `__Final Renderings`.

---

## Step 6 — Update Sitecore configuration

```text
INPUT
  Transformed layout XML from Step 5
     ↓
ACTION
  Authoring GraphQL updateItem on __Final Renderings
     ↓
OUTPUT
  Page item stores Hero/Promo personalization rules
     ↓
NEXT
  Validate datasources, flow, and rules against the input
```

**What:** Persist the transformed XML on `__Final Renderings`.

**Read:**

```graphql
query GetFinalRenderings {
  item(
    where: {
      database: "master",
      itemId: "{52C6E3B3-0DA8-4071-BF34-9317B47875E6}"
    }
  ) {
    itemId
    name
    field(name: "__Final Renderings") {
      value
    }
  }
}
```

**Write:**

```graphql
mutation {
  updateItem(input: {
    fields: [{
      name: "__Final Renderings",
      value: "<transformed-xml>",
      reset: false
    }],
    database: "master",
    itemId: "{52C6E3B3-0DA8-4071-BF34-9317B47875E6}",
    language: "en",
    path: "/sitecore/content/.../macbook-pro",
    version: 1
  }) {
    item {
      name
      itemId
    }
  }
}
```

**Dependency:** Use the `variantId` values generated when creating Personalize splits — those same ids become `s:name` / `s:VariantName` in the XML. Creating the flow before transforming layout keeps that bridge consistent.

If `__Final Renderings` is empty, skip the transform; there is no layout instance to personalize.

---

## Step 7 — Validation

After automation, verify authoring state against the Google MacBook input:

| Check | What “good” looks like |
|-------|-------------------------|
| Datasources | `MacBook Pro from Google` exists under `{page}/Data` with expected fields |
| Template binding | Datasource template matches the Hero rendering’s Datasource Template |
| Flow | Flow exists for `friendlyId`; status as expected (often `DRAFT`) |
| Splits | Split `fromGoogleMacbook` has matching `conditionGroups` |
| Variant bridge | Split `template` embeds a `variantId` also present in Hero/Promo rules |
| Rendering target | Rules sit under the correct Hero and Promo `<r uid="...">` |
| Actions | Hero Set Data Source path and Promo Hide match the payload |
| Duplicates | Re-running with identical conditions does not multiply identical splits/rules |
| XML integrity | Ruleset still contains a Default rule; XML remains parseable |

A structured result object helps operators confirm success without opening every UI screen:

```ts
{
  success: boolean;
  flowId?: string;
  message: string;
  variants?: /* input variants */;
  datasources?: Array<{
    name: string;
    path: string;
    itemId: string;
    componentName: string;
    variantName: string;
  }>;
  logs?: Array<{ timestamp: string; level: string; message: string }>;
  error?: string;
}
```

---

## What happens if I run it again?

Automation readers care about re-runs as much as first runs. Behavior in this pattern:

```text
Same variantName + same conditionGroups
→ skip (do not create a duplicate Personalize split)

Same variantName + changed conditionGroups
→ update / overwrite the existing split

New variantName
→ append a new split

Existing XML rule with the same variantId (s:name)
→ do not duplicate the rule
```

That is **implemented lightweight idempotency**, not full governance (no approval workflow, no automatic publish, limited concurrent-edit protection). Treat stronger policies as recommended improvements, not assumed features.

---

## AI-assisted automation (detail)

As noted in the Overview, AI is a **front door** to the same pipeline.

```
Page context + components (+ analytics / audience signals)
        │
        ▼
AI / NLP consolidate step
  → personalization_strategy[]
     (component, audience, fields, Action Type ootb|custom)
        │
        ▼
Human confirm (e.g. “Personalize Variant”)
        │
        ▼
Map strategy → PersonalizationInput schema
  (same Google MacBook-shaped JSON)
        │
        ▼
Deterministic automation
  datasources → Personalize flow → __Final Renderings
```

**AI-assisted:** discovering opportunities, proposing audiences, drafting `datasourceFields`, choosing OOTB vs custom actions.  
**Deterministic:** GraphQL mutations, Flow Definition create/update, XML transform, duplicate checks.

Only strategies marked as OOTB actions should be auto-applied. Custom actions typically need engineering work and should stay outside the write path.

Do not claim the AI “publishes personalization autonomously” unless the implementation actually performs apply + publish without human confirmation. The safer default is recommend → confirm → automate.

---

## Result

Using the running example:

```text
BEFORE

Hero
 └── Datasource: local:/Data/MacBook_Pro_Hero
 └── No personalization rules

Promo
 └── Visible
 └── No personalization rules

Personalize
 └── No fromGoogleMacbook experience for this page


AFTER

Hero
 ├── Default → local:/Data/MacBook_Pro_Hero
 └── Google → local:/Data/MacBook Pro from Google
      (rule condition: s:VariantName = variantId)

Promo
 └── Google → Hide Rendering
      (same variantId)

Personalize
 └── Flow DRAFT
 └── Split variantName = fromGoogleMacbook
 └── template embeds that variantId

Authoring output
 └── flowId, datasource list, step logs
```

**Chain in one line:** Google audience → Personalize split → `variantId` → Sitecore rule on Hero/Promo → Set Data Source / Hide Rendering.

Publishing Sitecore items and promoting the Personalize flow from `DRAFT` to `PRODUCTION` remain separate operational steps unless explicitly automated.

---

## Governance / considerations

**Implemented in this pattern**

- Required-field validation on the input schema  
- Skip datasource creation when template or Data folder is missing  
- Field whitelist when updating datasources  
- Deterministic flow `friendlyId`  
- Duplicate split detection (same name + same `conditionGroups`)  
- Duplicate XML rule detection by `variantId`  
- Prefer `DRAFT` flow status on create  

**Environment / version caveats**

- Flow API host and version (`v2` vs `v3`, regional base URL) must match the tenant  
- OOTB rule/action item IDs should be confirmed for the Sitecore version in use  
- Marketplace SDK authoring calls differ from raw Authoring GraphQL HTTP, but the GraphQL operations are the same concepts  

**Recommended improvements (not assumed implemented)**

- Formal approval before writing layout or publishing flows  
- Soft-fail vs overwrite policy for divergent conditions (auto-overwrite is convenient and risky)  
- Explicit publish pipeline for XM Cloud + Personalize  
- Stronger concurrent-edit protection on `__Final Renderings`  
- Audit trail beyond ephemeral logs  

---

## Conclusion

Automating component-level personalization works when treated as a **three-system authoring contract**: structured input, Personalize for audience splits and `variantId`, XM Cloud for datasources and `__Final Renderings` rules.

The reusable takeaway:

1. Start from a concrete scenario (who sees what on which component)  
2. Target **rendering instances** by `uid`  
3. Create **variant datasources** before wiring Set Data Source  
4. Configure Personalize with **`audienceTraffic` splits** whose `template` embeds `variantId`  
5. Write Sitecore rules that match that **`variantId`**, not a second copy of every CDP condition  
6. Keep AI in the **proposal** layer and APIs in the **apply** layer  

That separation keeps automation explainable, testable, and safer to run repeatedly.

---

## References

**Official Sitecore documentation**

- [Flow definition REST API](https://doc.sitecore.com/personalize/en/developers/api/rest-apis/flow-definition-rest-api/index.html)  
- [Create a flow definition](https://doc.sitecore.com/personalize/en/developers/api/rest-apis/flow-definition-rest-api/create-a-flow-definition.html)  
- [Retrieve a flow definition](https://doc.sitecore.com/personalize/en/developers/api/rest-apis/flow-definition-rest-api/retrieve-a-flow-definition.html)  
- [Request an access token](https://doc.sitecore.com/personalize/en/developers/api/request-an-access-token.html)  
- [Create an API key (Personalize)](https://doc.sitecore.com/personalize/en/developers/api/create-an-api-key.html)  
- [Personalize base URL](https://doc.sitecore.com/personalize/en/developers/api/base-url.html)  
- [Authoring and Management GraphQL API](https://doc.sitecore.com/xp/en/developers/103/sitecore-experience-manager/sitecore-authoring-and-management-graphql-api.html)  
- [Query examples for authoring operations](https://doc.sitecore.com/sai/en/developers/sitecoreai/content-modeling-and-presentation/sitecore-authoring-and-management-graphql-api/query-examples-for-authoring-operations.html)  
- [Enabling and authorizing Authoring API requests](https://doc.sitecore.com/sai/en/developers/sitecoreai/content-modeling-and-presentation/sitecore-authoring-and-management-graphql-api/walkthrough--enabling-and-authorizing-requests-to-the-authoring-and-management-api.html)  
- [Marketplace extension points](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html)  

**Related local references**

- `docs/blogs/sitecore-cdp-personalize-apis-guide.md`  
- `docs/postman/Sitecore-CDP-Personalize-APIs.postman_collection.json`  
- Original draft: `docs/blogs/automating-sitecore-personalization-variant-creation.md`  
