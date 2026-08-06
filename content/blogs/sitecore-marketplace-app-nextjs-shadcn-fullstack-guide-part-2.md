---
title: Sitecore Marketplace App - Authentication, Testing & Conclusion (Part 2)
description: Authorize your Sitecore Marketplace app, fix auth.sitecorecloud.io
  CORS inside the portal iframe, then verify Standalone and Page Builder
  context panel extension points in SitecoreAI / XM Cloud.
keywords: Sitecore Marketplace OAuth authorize, auth.sitecorecloud.io CORS iframe,
  Marketplace Standalone extension test, Page Builder context panel app icon,
  Sitecore Cloud Portal authorize localhost, Marketplace SDK client server
  examples, SitecoreAI Marketplace app testing
metaDescription: Part 2—authorize your Marketplace app, resolve portal CORS
  with auth.sitecorecloud.io, and verify Standalone plus Page Builder panel
  extension points in SitecoreAI / XM Cloud.
featuredImage: /uploads/blog-sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-2.png
slug: sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-2
date: November 21, 2025 3:08 PM
modifiedDate: August 6, 2026 2:30 PM
tags:
  - tag: sitecore
  - tag: sitecore-marketplace
  - tag: nextjs-react-development
  - tag: sitecore-xm-cloud
faq:
  - question: Why does auth.sitecorecloud.io refuse to connect inside the Sitecore portal?
    answer: The first OAuth authorization often fails inside the embedded portal
      view because of CORS. Open https://localhost:3000 in a normal browser tab,
      complete OAuth once, then reopen the app from the Sitecore Cloud portal.
  - question: How do I open a Marketplace app in the Page Builder context panel?
    answer: In Page Builder Editor, use the Apps icon near the top-right (after
      Publish), select your application, and the app loads in the context panel
      beside the canvas.
  - question: How do I test Standalone mode for a Marketplace app?
    answer: On the Sitecore Cloud portal home page, scroll to Apps, click your
      app, and it opens in Standalone mode in a new browsing context.
howto:
  name: Authorize and test a Sitecore Marketplace app (Part 2)
  description: Complete OAuth authorization and verify Standalone and Page
    Builder extension points after Part 1 setup.
  steps:
    - name: Trigger OAuth from localhost
      text: With the app running, open https://localhost:3000 in a new browser
        tab to start the OAuth authorize flow.
    - name: Fix portal CORS if needed
      text: If auth.sitecorecloud.io is blocked inside the portal iframe,
        finish OAuth in a standalone tab first, then reopen the app from the
        portal.
    - name: Verify Standalone extension point
      text: From Sitecore Cloud portal Apps, open your app and confirm it loads
        in Standalone mode.
    - name: Verify Page Builder context panel
      text: In SitecoreAI / XM Cloud Page Builder Editor, open Apps, select your
        app, and confirm it renders in the context panel.
    - name: Exercise SDK samples
      text: On the home route, run the client-side and server-side Marketplace
        SDK examples to confirm API access works.
---
In [Part 1](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-1), we scaffolded the app, configured App Studio, and ran it locally. **This post (Part 2)** focuses only on authorization, a common portal CORS issue, and verifying both extension points you enabled earlier.

### Series navigation

1. [Sitecore Marketplace Apps: Overview and Why They Matter](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-apps-overview-why-they-matter)
2. [Build Fullstack Sitecore Marketplace App with Next.js & shadcn (Part 1)](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-1)
3. **Sitecore Marketplace App - Authentication, Testing & Conclusion (Part 2)** — you are here

### Prerequisites from Part 1

Before continuing, confirm:

- The app runs at `https://localhost:3000` with experimental HTTPS enabled
- App Studio has **Standalone** and **Page Builder context panel** extension points
- `.env` includes Client ID, App ID, Organization ID, and Tenant ID
- The app is activated and installed on your SitecoreAI or XM Cloud instance

If any of those are missing, finish [Part 1 first](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-1).

## Developer Setup (Part 2): Authorize & Test Your Marketplace App

This guide continues from Step 3 in Part 1.

### Step 4: Authorize Marketplace App on Sitecore Portal

Open `https://localhost:3000` in a new browser tab. This triggers the OAuth flow and lets you authorize the app.

![Authorize Marketplace App on Sitecore Portal](/uploads/authorize-marketplace-app-on-sitecore-portal.jpg "Authorize Marketplace App on Sitecore Portal")

After authorization, reopen the app from the Sitecore portal to verify it. You can now explore its features.

#### Common issue: auth.sitecorecloud.io blocked in the portal iframe

The first time you open the app in the Sitecore Cloud portal, you may see CORS errors with *auth.sitecorecloud.io* because the OAuth flow gets blocked inside the embedded view.

**Fix:**

1. Keep the Marketplace app running locally (`npm run dev`).
2. Open the app URL once in a **separate full browser tab** (not inside the portal iframe).
3. Complete the OAuth consent / login flow there.
4. Return to the Sitecore Cloud portal and open the app again from **Apps**.

![Issue - Auth Sitecore Cloud Refused to connect](/uploads/issue-auth-sitecore-cloud-refused-to-connect.jpg "Issue - Auth Sitecore Cloud Refused to connect")

This pattern is normal for local HTTPS Marketplace apps during the first authorize pass.

### Step 5: Open Your Marketplace App in XM Cloud and Verify

Since we enabled two extension points during configuration—**Standalone** and **Page Builder context panel**—verify both.

#### Standalone

On the Sitecore Cloud portal home page, scroll down to the **Apps** section. Find your app and click it. This opens the app in *Standalone* mode.

![Standalone - App View in Sitecore Cloud Portal](/uploads/standalone-app-view-in-sitecore-cloud-portal.jpg "Standalone - App View in Sitecore Cloud Portal")

**What success looks like:** the app loads outside Page Builder, usually on the route you configured for the Standalone extension point (often the home route).

#### Page Builder context panel

1. Open your XMC or SitecoreAI instance where the app is installed.
2. Navigate to **Page Builder** and ensure you are on the **Editor** tab (top navigation in Page Builder).
3. Look for the **Apps** icon—the third icon from the top-right corner, after the Publish button.
4. Click the icon and select your application.

![Marketplace App Icon in Sitecore Page Builder](/uploads/marketplace-app-icon-in-sitecore-page-builder.png "Marketplace App Icon in Sitecore Page Builder")

Your app should now appear inside the Page Builder panel.

![Page builder context panel - App View in Sitecore Cloud Portal](/uploads/page-builder-context-panel-app-view-in-sitecore-cloud-portal.jpg "Page builder context panel - App View in Sitecore Cloud Portal")

**What success looks like:** the panel opens beside the canvas without a blank iframe, and any client/server Marketplace SDK samples on the page can call APIs with your tenant context.

### Step 6: Validate Marketplace SDK samples on the home route

Your app is up and running. The *home* route loads by default unless you changed the *extension point* settings.

The starter page typically includes:

- **Client-side** Marketplace SDK examples (browser / iframe context)
- **Server-side** examples for authorized API calls

Run both paths once after OAuth succeeds. If client calls work but server calls fail, re-check Client ID/Secret, allowed callback URLs, and that Tenant ID in `.env` matches the installed instance.

### Troubleshooting quick reference

| Symptom | Likely cause | What to try |
| --- | --- | --- |
| `auth.sitecorecloud.io` refused in portal | OAuth blocked in iframe | Authorize once in a normal tab, then reopen from Apps |
| App missing under Apps | Not activated or not installed | Activate in App Studio, install on the target instance from My Apps |
| Blank Page Builder panel | Wrong extension point URL or app not installed on that site | Confirm Page Builder context panel URL and reinstall/update from My Apps |
| 401 on server SDK calls | Bad credentials or tenant mismatch | Regenerate credentials; confirm Tenant ID from the installed app URL |

## Conclusion

You now have an end-to-end path for a full-stack Sitecore Marketplace app:

1. Concepts and architecture — [Overview](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-apps-overview-why-they-matter)
2. Scaffold + App Studio + local HTTPS — [Part 1](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-1)
3. Authorize + verify Standalone and Page Builder — **Part 2 (this post)**

**Was this guide helpful?**

If you have questions, feedback, or ran into any setup issues, feel free to share them in the comments.
