---
title: "Sitecore Marketplace Apps: Overview and Why They Matter"
description: Discover Sitecore Marketplace apps, their architecture, extension
  points, and why they’re essential for extending XM Cloud without altering its
  core.
keywords: Sitecore Marketplace, Sitecore XM Cloud, Sitecore SDK, Sitecore
  extensions, Sitecore app development, Sitecore integration, Sitecore AI,
  Next.js Sitecore app
metaDescription: Discover Sitecore Marketplace apps, their architecture,
  extension points, and why they’re essential for extending XM Cloud without
  altering its core.
featuredImage: /uploads/blog-sitecore-marketplace-apps-overview-and-why-they-matter.jpg
slug: sitecore-marketplace-apps-part1-overview
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

A Sitecore Marketplace app is a separate web application—typically built with Next.js (though other stacks are supported; check Sitecore documentation) and integrated with Sitecore Cloud portal.

**Hosted by you:** The app runs independently by you (on preferred infrastructure).

**Integrated inside Sitecore Portal (SaaS):** Through [extension points](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html), the app integrates into the Sitecore UI (for example, as a Dashboard Widget or Page Builder Panel). Currently, it supports only Sitecore AI (formerly XM Cloud), but future updates may include other Sitecore SaaS products.

* [Standalone](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html#standalone): The app appears on the Sitecore Cloud Portal’s home page and opens in a new tab. [](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html#full-screen)
* [Full screen](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html#full-screen): The app is listed in the SitecoreAI/XM Cloud navigation bar and displays full-screen under the header — ideal for deep workflows.
* [Page builder context panel (SitecoreAI/XMC)](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html#page-builder-context-panel): The app shows up as a panel next to the canvas in Page Builder, perfect for page-specific tools.
* [Page builder custom field (SitecoreAI/XMC)](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html#page-builder-custom-field): The app is triggered by a custom field in Page Builder, popping up in a modal to provide specialized data or controls.
* [Dashboard widget](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html#dashboard-widget): The app can be added to an SitecoreAI / XM Cloud dashboard to display metrics or insights across the site.

**Custom Implementation:** You can add any backend or frontend logic as per your needs—whether it’s calling external APIs, running workflows, or adding AI features.

**Sitecore Marketplace SDK support:** Sitecore is officially offering SDK to build custom sitecore marketplace apps. You can refer the [official documentation](https://doc.sitecore.com/mp/en/developers/sdk/latest/sitecore-marketplace-sdk/sitecore-marketplace-sdk-for-javascript.html#development-tasks-with-the-marketplace-sdk), this provides an overview of the SDK, its modules, and how developers can start using it. Here is the [repository link](https://github.com/Sitecore/marketplace-sdk/blob/main/docs/README.md) for the reference.

A quick overview of the key modules in the Sitecore Marketplace SDK — what they are and how they work.

* [@sitecore-marketplace-sdk/core](https://github.com/Sitecore/marketplace-sdk/blob/main/docs/core-sdk/README.md): Provides the foundational APIs and utilities for building Marketplace apps, including core logic and data models.
* [@sitecore-marketplace-sdk/client](https://github.com/Sitecore/marketplace-sdk/blob/main/docs/client/README.md): Enables client-side integration with Marketplace services, handling authentication and communication from the browser or frontend.
* [@sitecore-marketplace-sdk/xmc](https://github.com/Sitecore/marketplace-sdk/blob/main/docs/modules/xmc/README.md): Offers tools to integrate with Sitecore XM Cloud, including APIs for sites, pages, and content management
* [experimental_XMC - Server-to-Server API Access](https://github.com/Sitecore/marketplace-sdk/blob/main/docs/experimental-xmc.md): Provides server-to-server access to XM Cloud APIs using @sitecore-marketplace-sdk/xmc without iframe or client SDK, ideal for backend integrations

This architecture gives you full flexibility:

* Build lightweight client-side apps for quick UI enhancements.
* Or create full-stack apps with backend integrations for complex workflows.