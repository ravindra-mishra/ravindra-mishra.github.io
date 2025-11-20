---
title: "Sitecore Marketplace Apps: Overview and Why They Matter"
description: Discover Sitecore Marketplace apps, their architecture, extension
  points, and why they’re essential for extending XM Cloud without altering its
  core.
keywords: Sitecore Marketplace, Sitecore XM Cloud, Sitecore Marketplace SDK,
  Sitecore extensions, Sitecore app development, Sitecore integration,
  SitecoreAI, Next.js Sitecore app, Sitecore Cloud portal
metaDescription: Discover Sitecore Marketplace apps, their architecture,
  extension points, and why they’re essential for extending XM Cloud without
  altering its core.
featuredImage: /uploads/blog-sitecore-marketplace-apps-overview-and-why-they-matter.jpg
slug: sitecore-marketplace-apps-overview-why-they-matter-part-1
date: November 16, 2025 4:51 PM
tags:
  - tag: sitecore
---
## Overview

Welcome to the first post in our Sitecore Marketplace App series! 
In this article, we’ll cover the basics—what these apps do, how they work, and when it makes sense to build one. This will give you the foundation you need before jumping into the hands-on guide in the next part.
Here’s the full series:

1. Sitecore Marketplace Apps: Overview and Why They Matter (Part 1)
2. Building a Full-Stack Sitecore Marketplace App with Next.js and shadcn – Developer Guide (Part 2)

## Sitecore Marketplace App Architecture Explained

A Sitecore Marketplace app is an independent web application—typically built with Next.js (though other stacks are supported; check Sitecore documentation) and integrated with Sitecore Cloud portal.

**1. Hosted and managed by you:** The app runs independently by you (on preferred infrastructure).

**2. Integrated inside Sitecore Portal (SaaS):** Through [extension points](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html), the app integrates into the Sitecore UI (for example, as a Dashboard Widget or Page Builder Panel). Currently, it supports only Sitecore AI (formerly XM Cloud), but future updates may include other Sitecore SaaS products.

* [Standalone](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html#standalone): The app appears on the Sitecore Cloud Portal’s home page and opens in a new tab. [](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html#full-screen)
* [Full screen](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html#full-screen): The app is listed in the SitecoreAI/XM Cloud navigation bar and displays full-screen under the header — ideal for deep workflows.
* [Page builder context panel (SitecoreAI/XMC)](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html#page-builder-context-panel): The app shows up as a panel next to the canvas in Page Builder, perfect for page-specific tools.
* [Page builder custom field (SitecoreAI/XMC)](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html#page-builder-custom-field): The app is triggered by a custom field in Page Builder, popping up in a modal to provide specialized data or controls.
* [Dashboard widget](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html#dashboard-widget): The app can be added to an SitecoreAI / XM Cloud dashboard to display metrics or insights across the site.

**3. Custom Implementation:** You can add any backend or frontend logic as per your needs—whether it’s calling external APIs, running workflows, or adding AI features.

**4. Sitecore Marketplace SDK support:** Sitecore is officially offering SDK to build custom sitecore marketplace apps. You can refer the [official documentation](https://doc.sitecore.com/mp/en/developers/sdk/latest/sitecore-marketplace-sdk/sitecore-marketplace-sdk-for-javascript.html#development-tasks-with-the-marketplace-sdk), this provides an overview of the SDK, its modules, and how developers can start using it. Here is the [repository link](https://github.com/Sitecore/marketplace-sdk/blob/main/docs/README.md) for the reference.

A quick overview of the key modules in the Sitecore Marketplace SDK — what they are and how they work.

* [@sitecore-marketplace-sdk/core](https://github.com/Sitecore/marketplace-sdk/blob/main/docs/core-sdk/README.md): Provides the foundational APIs and utilities for building Marketplace apps, including core logic and data models.
* [@sitecore-marketplace-sdk/client](https://github.com/Sitecore/marketplace-sdk/blob/main/docs/client/README.md): Enables client-side integration with Marketplace services, handling authentication and communication from the browser or frontend.
* [@sitecore-marketplace-sdk/xmc](https://github.com/Sitecore/marketplace-sdk/blob/main/docs/modules/xmc/README.md): Offers tools to integrate with Sitecore XM Cloud, including APIs for sites, pages, and content management
* [experimental_XMC - Server-to-Server API Access](https://github.com/Sitecore/marketplace-sdk/blob/main/docs/experimental-xmc.md): Provides server-to-server access to XM Cloud APIs using @sitecore-marketplace-sdk/xmc without iframe or client SDK, ideal for backend integrations

This architecture gives you full flexibility:

* Build lightweight client-side apps for quick UI enhancements.
* Or create full-stack apps with backend integrations for complex workflows.

## Who Should Build a Sitecore Marketplace App & When

### 1. Who it’s for

The Sitecore marketplace app is ideal if you’re looking to extend Sitecore XM Cloud without altering its core. Typical audiences include:

* Developers or partners who want to add new capabilities or UI components inside Sitecore.
* Organizations that run repetitive tasks (e.g., publishing workflows, QA checks) and want to automate them.
* Teams planning to integrate external services like DAM, CRM, AI, analytics, etc.
* Agencies building reusable components that can serve multiple clients.

### 2. When it makes sense to build

Consider building a Marketplace app when you’re facing scenarios such as:

* The need for **custom UI elements** within XM Cloud (for example, a new panel in Page Builder or a dashboard widget).
* You want to **connect Sitecore to external APIs -** —for translation, personalization, CRM sync, analytics, and so on.
* You aim to **streamline editorial workflows**, such as bulk publishing, content audits or automation of repetitive tasks.
* You plan to **share your solution publicly** (or privately with one client or partner) so it can be reused or installed later.

### 3. Example Use Cases (Not Limited To These)

1. **Integration Apps:**

   * Connect Sitecore with Salesforce, HubSpot, or AI services
2. **Authoring Enhancements**

   * AI-powered content suggestions in Page Builder
   * Custom field pickers for taxonomy or media
3. **Monitoring & Analytics**

   * Health check dashboards
   * Real-time KPI widgets
4. **Marketing Tools**

   * Campaign management widgets
   * Personalization rule builders
5. **Agentic AI Applications**

   * *AI Content Assistant:* Suggest headlines, rewrite text, generate SEO-friendly content
   * *Autonomous Campaign Manager:* AI monitors analytics and launches campaigns automatically
   * *Predictive Personalization:* AI adjusts content blocks in real-time based on user intent
   * *Automated QA & Compliance:* AI checks content for brand compliance or accessibility before publishing

## What’s Next After Deciding to Build a Marketplace App?

Once you’ve decided to build a Sitecore Marketplace app, you have two great starting points:

### 1. The official Sitecore Marketplace Starter Kit

Available on [GitHub](https://github.com/Sitecore/marketplace-starter), this kit is perfect for learning the basics and following Sitecore’s recommended patterns.

**Features:**

* Demonstrates all five extension points: 

  * Custom Field
  * Dashboard Widget
  * Fullscreen
  * Pages Context Panel
  * Standalone
* Built using the Sitecore Marketplace SDK.
* Ideal for quick onboarding and understanding Sitecore’s architecture.

### 2. The shadcn starter kit

If you prefer a full-stack approach and a [quick start using the CLI](https://doc.sitecore.com/mp/en/developers/sdk/latest/sitecore-marketplace-sdk/quick-start--cli-.html#scaffold-an-app), the ShadCN kit provides more preconfigured components and examples.

**Features:**

* Pre-configured **Auth0 integration** for Sitecore Cloud
* Includes **client-side and server-side examples**
* Built with Next.js and provides **multiple example approaches**, including server-side implementations

Both options are solid—choose the one that fits your project needs and development style.

## Conclusion

Sitecore Marketplace apps open up endless possibilities for extending XM Cloud without touching its core. Whether you want to integrate external services, streamline workflows, or add AI-powered features, these apps give you the flexibility to innovate.

In the next part of this series, we’ll walk through building a full-stack Marketplace app using **Next.js** and **shadcn starter kit**, complete with authentication and extension points. Stay tuned!