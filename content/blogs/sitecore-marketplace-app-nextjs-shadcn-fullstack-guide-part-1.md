---
title: Build Fullstack Sitecore Marketplace App with Next.js & shadcn (Part 1)
description: Learn how to build a full-stack Sitecore Marketplace app using
  Next.js and shadcn. This step-by-step guide covers Quick Start using CLI,
  authentication, Sitecore App Studio configuration, and running your app
  locally for XM Cloud integration.
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
date: November 20, 2025 4:25 PM
tags:
  - tag: sitecore
  - tag: sitecore-marketplace
  - tag: nextjs-react-development
  - tag: sitecore-xm-cloud
---
In the [previous blog](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-apps-overview-why-they-matter), we explored what Marketplace apps are, why they matter, and how they fit into Sitecore XM Cloud. 

In this guide, you’ll build a full-stack Sitecore Marketplace app using Next.js and shadcn—from project setup to App Studio configuration.

Here’s the series so far:

1. [Sitecore Marketplace Apps: Overview and Why They Matter](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-apps-overview-why-they-matter)
2. [Build Fullstack Sitecore Marketplace App with Next.js & shadcn (Part 1)](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-1)
2. [Sitecore Marketplace App - Authentication, Testing & Conclusion (Part 2)](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-2)

Here’s another way to build a Marketplace app using Next.js and shadcn. While Sitecore provides a [Marketplace Starter Kit on GitHub](https://github.com/Sitecore/marketplace-starter), this approach includes preconfigured authentication and examples for both client-side and server-side use.

## Developer Setup (Part 1): Create and Configure Your Marketplace App

### Step 1: Scaffold Your Marketplace App

#### 1. Scaffold the app using the npx command

Create a project folder, open it in VS Code or a terminal, and run:

```
npx shadcn@latest add https://blok-shadcn.vercel.app/r/marketplace/next/quickstart-with-full-stack-xmc.json
```

![Scaffolding the app using the npx command - Sitecore Marketplace App](/uploads/image-scaffold-the-app-using-the-npx-command.jpg "Scaffolding the app using the npx command - Sitecore Marketplace App")

#### 2. Enable Experimental HTTPS in package.json

Enable experimental HTTPS by adding a flag to your `package.json` scripts. This lets the app run locally over HTTPS, which is required for secure authentication.

Update the scripts section like this:

```
  "scripts": {
    "dev": "next dev --turbopack --experimental-https",
    "build": "next build --turbopack",
    "start": "next start --experimental-https",
    "lint": "eslint"
  },
```

#### 3. Review the Environment Variables

This creates a `.env` file with variables like the ones below. You’ll fill some of these in *Step 2*.

```
NEXT_PUBLIC_AUTH0_DOMAIN=https://auth.sitecorecloud.io
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api-webapp.sitecorecloud.io
NEXT_PUBLIC_AUTH0_SCOPE=openid profile email offline_access
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
NEXT_PUBLIC_SITECORE_APP_ID=your-marketplace-app-id
NEXT_PUBLIC_SITECORE_ORGANIZATION_ID=your-org-id
NEXT_PUBLIC_SITECORE_TENENT_ID=your-tenant-id
NEXT_PUBLIC_APP_BASE_URL=https://localhost:3000
```

### Step 2: Configure Your App in Sitecore App Studio

#### 1. Create App in App Studio

* Go to Sitecore Cloud Portal. Click on “App Studio” from top navigation.
* Click on “Create App” button at top right corner of the screen.
* Enter an app name and select **Custom** or **Public**, depending on your requirement. ([Refer documentation: App types](https://doc.sitecore.com/mp/en/developers/marketplace/introduction-to-sitecore-marketplace-for-custom-and-public-apps.html#app-types)) 

  ![Create App in App Studio - Configure Marketplace App in Sitecore App Studio](/uploads/image-create-app-in-app-studio.jpg "Create App in App Studio - Configure Marketplace App in Sitecore App Studio")
* Click **Create**, then configure the application. (App Studio > Click on the App)

#### 2. Configure your application

* Choose the **Extension Points** you want to enable, and optionally set a landing page for each.
  Here, we’re using *Standalone* and *Page Context Panel*.
* **API Access**: Select the Sitecore Cloud products where your app can be installed. Currently, only XMC and SitecoreAI are available, but additional options may be added in the future.

  ![Selecting Sitecore Cloud products for API Access in Marketplace App](/uploads/image-selecting-sitecore-cloud-products-for-api-access-in-marketplace-app.jpg "Selecting Sitecore Cloud products for API Access in Marketplace App")
* **Deployment URL**: For local development, use https://localhost:3000.
* **App Icon**: Use a 512×512 publicly accessible image URL. Any logo works, as long as the URL is publicly accessible.

  e﻿g. https://fastly.picsum.photos/id/58/512/512.jpg?hmac=jxfe82GanXiWmTfpdeMNdzSvGv4RS_eqipxzUduQUeg

#### 3. Create Credentials

Configure authorization credentials, as they are required for server-side custom authorization of Sitecore API requests. Add the allowed callback, logout, and origin URLs, then generate the Client ID and Client Secret. For now, include localhost URLs; you can add dev or staging URLs later.

* **Allowed callback URLs:** https://localhost:3000/auth/callback, https://localhost:3000
* **Allowed logout URLs:** https://localhost:3000
* **Allowed origins URLs:** https://localhost:3000
* **Allowed web origins URLs:** https://localhost:3000

Finally, click **Create Credentials** to generate the **Client ID** and **Client Secret**, and store them securely for future reference.

![Create Credentials for Sitecore Marketplace App - Regular App](/uploads/create-credentials-for-sitecore-marketplace-app-regular-app.jpg "Create Credentials for Sitecore Marketplace App - Regular App")

#### 4. Collect Important IDs for Frontend Configuration

Collect the IDs you’ll add to your `.env` file.

* App ID (Marketplace app ID section, available on right side)
* Organization ID (from URL query, eg. `?organization=org_TLXXXXXXXPf`)
* Client ID (Generated from client credentials)
* Tenant ID (we will get after Activating and Installing the app, refer *6 point*)

![Configured Final View in App Studio - Sitecore Marketplace App](/uploads/configured-final-view-in-app-studio-sitecore-marketplace-app.jpg "Configured Final View in App Studio - Sitecore Marketplace App")

#### 5. Activate the application.

* Click Activate in the top-right.
* After activation, the app appears under **My Apps** (from top nav bar) in the Sitecore portal.

![Sitecore Marketplace app displayed in the My Apps section after activation](/uploads/marketplace-app-displayed-in-the-my-apps-section-after-activation.jpg "Sitecore Marketplace app displayed in the My Apps section after activation")

#### 6. Install App and get the Tenant Id

**Install the App:**

Go to **My Apps** and install the app on the SitecoreAI or XMC instance.

**Retrieve Tenant ID:**

* After installing the app, navigate to the **Home** section of the Sitecore Cloud portal from the top navigation.
* Scroll down to the **Apps** section.
* Locate the app you recently created and click on it. It will open in a new tab.
* Copy the **tenantId** from the query string in the URL.

**Note:** After installing the app, any changes made in App Studio must be updated again from the My Apps section to ensure they are reflected.

### Step 3: Update .env and Run the App

Use the IDs collected in the previous steps to update your `.env` file.

* NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
* NEXT_PUBLIC_SITECORE_APP_ID=your-marketplace-app-id
* NEXT_PUBLIC_SITECORE_ORGANIZATION_ID=your-org-id
* NEXT_PUBLIC_SITECORE_TENENT_ID=your-tenant-id

Now, run `npm run dev`, then open `https://localhost:3000` in a new tab. 

At this point, your app is fully configured and running locally.
In [the next part](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-2), we’ll continue with authorization, testing inside XM Cloud, and validating extension points.

**Continue reading:** Next Part — [Authorize & Test Your Marketplace App](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-app-nextjs-shadcn-fullstack-guide-part-2)