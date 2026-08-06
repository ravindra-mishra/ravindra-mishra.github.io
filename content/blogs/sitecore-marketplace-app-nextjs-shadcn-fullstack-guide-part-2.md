---
title: Sitecore Marketplace App - Authentication, Testing & Conclusion (Part 2)
description: Continue your Sitecore Marketplace app journey with a full-stack
  build using Next.js and shadcn. This part covers authentication,
  authorization, API verification, testing, and final steps to complete and
  publish your Marketplace app.
keywords: Sitecore Marketplace App, Next.js, shadcn, Sitecore App Studio,
  Sitecore XM Cloud, Sitecore Cloud Portal, Marketplace SDK, OAuth
  authentication, full-stack development, extension points, Page Builder context
  panel, standalone app, Sitecore integration, app configuration, environment
  variables, Auth0 integration, Sitecore AI, custom Sitecore apps, developer
  guide, Sitecore starter kit, Quick Start using CLI
metaDescription: Learn how to build a full-stack Sitecore Marketplace app using
  Next.js and shadcn. This step-by-step guide covers Quick Start using CLI,
  authentication, Sitecore App Studio configuration, and running your app
  locally for XM Cloud integration.
featuredImage: /uploads/blog-sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-2.png
slug: sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-2
date: November 21, 2025 3:08 PM
tags:
  - tag: sitecore
  - tag: sitecore-marketplace
  - tag: nextjs-react-development
  - tag: sitecore-xm-cloud
---
In [the previous blog](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-1), we configured the app and ran it locally. In this next step, we will authorize the app and validate its authentication flow. We will also test the app using both extension points: *Standalone* and *Page Builder Panel*.

Here’s the series so far:

1. [Sitecore Marketplace Apps: Overview and Why They Matter](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-apps-overview-why-they-matter)
2. [Build Fullstack Sitecore Marketplace App with Next.js & shadcn (Part 1)](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-1)
2. [Sitecore Marketplace App: Authentication, Testing & Conclusion (Part 2)](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-2)

## Developer Setup (Part 2): Authorize & Test Your Marketplace App.
This guide continues from Step 3 in Part 1. If you haven’t completed those steps, check [the previous guide](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-1) first.
### Step 4: Authorize Marketplace App on Sitecore Portal

Open “https://localhost:3000” in a new browser tab. This triggers the OAuth flow and lets you authorize the app.

![Authorize Marketplace App on Sitecore Portal](/uploads/authorize-marketplace-app-on-sitecore-portal.jpg "Authorize Marketplace App on Sitecore Portal")

After authorization, reopen the app from the Sitecore portal to verify it. You can now explore its features.

**Common Issue:**

The first time you open the app in the Sitecore Cloud portal, you may see CORS errors with *auth.sitecorecloud.io* because the OAuth flow gets blocked inside the embedded view.

To fix this, open your app URL once in a separate tab, complete OAuth, then return to the portal.

![Issue - Auth Sitecore Cloud Refused to connect](/uploads/issue-auth-sitecore-cloud-refused-to-connect.jpg "Issue - Auth Sitecore Cloud Refused to connect")

### Step 5: Open Your Marketplace App in XM Cloud and Verify

Since we enabled two extension points during configuring the app—**Standalone** and **Page Builder context panel**—let’s try opening the app from both.

**Standalone:**

On the Sitecore Cloud portal home page, scroll down to the **Apps** section. Find your app and click it. This opens the app in *Standalone* mode.

![Standalone - App View in Sitecore Cloud Portal](/uploads/standalone-app-view-in-sitecore-cloud-portal.jpg "Standalone - App View in Sitecore Cloud Portal")

**Page builder context panel:** 

* Open your XMC or SitecoreAI instance where the app is installed. Navigate to the Page Builder and ensure you’re on the Editor tab (check the top navigation in Page Builder). 
* Look for the Apps icon—it’s the third icon from the top-right corner, after the Publish button.
* Click the icon and select your application. 

  ![Marketplace App Icon in Sitecore Page Builder](/uploads/marketplace-app-icon-in-sitecore-page-builder.png "Marketplace App Icon in Sitecore Page Builder")
* Your app should now appear inside the Page Builder panel.

  ![Page builder context panel - App View in Sitecore Cloud Portal](/uploads/page-builder-context-panel-app-view-in-sitecore-cloud-portal.jpg "Page builder context panel - App View in Sitecore Cloud Portal")

## Conclusion

Your app is now up and running. The *home* route loads by default unless you changed the *extension point* settings.

The page includes client-side and server-side Marketplace SDK examples. Test them to confirm everything works.

**Was this guide helpful?** 

If you have questions, feedback, or ran into any setup issues, feel free to share them in the comments - we’d love to hear from you!

Stay tuned for more articles in this series.