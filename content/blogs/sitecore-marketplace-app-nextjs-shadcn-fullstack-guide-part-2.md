---
title: Sitecore Marketplace App fullstack development with Next.js & shadcn
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
Welcome back! This is the second post in our Sitecore Marketplace App series. In the first part, we explored what Marketplace apps are, why they matter, and how they fit into Sitecore XM Cloud.

Now it’s time to get hands-on. In this guide, we’ll show you how to build a full-stack Sitecore Marketplace app using Next.js and shadcn. You’ll learn how to set up your project, configure your app in Sitecore App Studio, add authentication, and run it locally.

Here’s the series so far:

1. [Sitecore Marketplace Apps: Overview and Why They Matter (Part 1)](https://ravindra-mishra.github.io/blogs/sitecore-marketplace-apps-overview-why-they-matter-part-1)
2. Sitecore Marketplace App fullstack development with Next.js & shadcn (Part 2)

As a developer working with Sitecore Cloud, I recently explored an alternative way to build a Marketplace app using Next.js and shadcn. While Sitecore provides a Marketplace Starter Kit on GitHub, this approach includes a pre-configured authentication setup and offers both client-side and server-side examples—making it a flexible, developer-friendly option.

## Developer Setup: Create and Configure Your Marketplace App

### Step 1: Scaffold Your Marketplace App

#### 1. Scaffold the app using the npx command

Create a folder for your Marketplace app project and open it in VS Code or PowerShell terminal.

Run the following command inside the folder:

```
npx shadcn@latest add https://blok-shadcn.vercel.app/r/marketplace/next/quickstart-with-full-stack-xmc.json
```

![Scaffolding the app using the npx command - Sitecore Marketplace App](/uploads/image-scaffold-the-app-using-the-npx-command.jpg "Scaffolding the app using the npx command - Sitecore Marketplace App")

#### 2. Enable Experimental HTTPS in package.json

As mentioned in the last line of the output after running the npx command, you can enable experimental HTTPS by adding the flag to your package.json scripts. This allows you to run your local app over HTTPS, which is often required for secure authentication flows.

Update your scripts section like this:

```
  "scripts": {
    "dev": "next dev --turbopack --experimental-https",
    "build": "next build --turbopack",
    "start": "next start --experimental-https",
    "lint": "eslint"
  },
```

#### 3. Review the Environment Variables

This process will create a .env or .env.local file containing variables like the ones shown below. You’ll get values for some of these in Step 2.

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

1. Create App in App Studio

* Go to Sitecore Cloud Portal. Click on “App Studio” from top navigation.
* Click on “Create App” button at top right corner of the screen.
* Enter App name you want to give and select Custom or Public based on your need. ([Refer documentation: App types](https://doc.sitecore.com/mp/en/developers/marketplace/introduction-to-sitecore-marketplace-for-custom-and-public-apps.html#app-types)) 

  ![Create App in App Studio - Configure Marketplace App in Sitecore App Studio](/uploads/image-create-app-in-app-studio.jpg "Create App in App Studio - Configure Marketplace App in Sitecore App Studio")
* Click on create and then configure the application. (App Studio > Click on the App)

#### 2. Configure your application

* Select **Extensions points** which you want to enable for your application, (you can also configure landing page for each extension points)
  In this example, we select Standalone and Page Context Panel.
* **API Access**: Select which Sitecore Cloud products your app can use ( currently only XMC / SitecoreAI is present, but more can be added in future)

  ![Selecting Sitecore Cloud products for API Access in Marketplace App](/uploads/image-selecting-sitecore-cloud-products-for-api-access-in-marketplace-app.jpg "Selecting Sitecore Cloud products for API Access in Marketplace App")
* **Deployment URL**: Since we are in the development stage, running our app locally, enter “https://localhost:3000” as input.
* **App Icon:** We need to use an image that is 512×512 and has the required file extension. In this example, I’m using a sample image, but you can use any logo you prefer—as long as it’s available via a public URL.

  e﻿g. https://fastly.picsum.photos/id/58/512/512.jpg?hmac=jxfe82GanXiWmTfpdeMNdzSvGv4RS_eqipxzUduQUeg

#### 3. Create Credentials

To enable your application to work with Sitecore App Studio, configure credentials for authorization. This involves setting up allowed URLs for callbacks, logout, and origins, then creating credentials to obtain the **Client ID** and **Client Secret** for future use. For now, we are adding localhost URLs to support local development. Multiple URLs can be added later for other environments like dev or staging.

* **Allowed callback URLs:** https://localhost:3000/auth/callback, https://localhost:3000
* **Allowed logout URLs:** https://localhost:3000
* **Allowed origins URLs:** https://localhost:3000
* **Allowed web origins URLs:** https://localhost:3000

Finally, click **Create Credentials** to generate the **Client ID** and **Client Secret**, and store them securely for future reference.

![Create Credentials for Sitecore Marketplace App - Regular App](/uploads/create-credentials-for-sitecore-marketplace-app-regular-app.jpg "Create Credentials for Sitecore Marketplace App - Regular App")

#### 4. Collect Important IDs for Frontend Configuration

Collect all important id’s from this page, that we will need to put in our frontend app’s .env file. 

* App ID (Marketplace app ID section, available on right side)
* Organization ID (from URL query, eg. ?organization=org_TLXXXXXXXPf)
* Client ID (Generated from client credentials)
* Tenant ID (we will get after Activating and Installing the app, refer 6 point)

![Configured Final View in App Studio - Sitecore Marketplace App](/uploads/configured-final-view-in-app-studio-sitecore-marketplace-app.jpg "Configured Final View in App Studio - Sitecore Marketplace App")

#### 5. Activate the application.

* Activate the application by clicking on CTA top right side.
* Once, we activate the app, it will start appearing in My apps section from top nav of the sitecore portal.

![Sitecore Marketplace app displayed in the My Apps section after activation](/uploads/marketplace-app-displayed-in-the-my-apps-section-after-activation.jpg "Sitecore Marketplace app displayed in the My Apps section after activation")

#### 6. Install App and get the Tenant Id

**Install the App:**

Install the app to the respective Sitecore AI / XMC instance where you want this integration.

**Retrieve Tenant ID:**

* After installing the app, navigate to the **Home** section of the Sitecore Cloud portal from the top navigation.
* Scroll down to the **Apps** section.
* Locate the app you recently created and click on it. It will open in a new tab.
* Copy the **tenantId** from the query string in the URL.

### Step 3: Update .env and Run the App

We now have all the IDs collected in the previous step that are required for the environment file. Update your .env file with the details you’ve gathered so far:

* NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
* NEXT_PUBLIC_SITECORE_APP_ID=your-marketplace-app-id
* NEXT_PUBLIC_SITECORE_ORGANIZATION_ID=your-org-id
* NEXT_PUBLIC_SITECORE_TENENT_ID=your-tenant-id

Now, run the application using `npm run dev`, then open your app URL—e.g., https://localhost:3000 - in a new browser tab.

### Step 4: Authorize Marketplace App on Sitecore Portal

Open “https://localhost:3000” in a new browser tab. This triggers the proper OAuth flow and lets you authorize the app.

![Authorize Marketplace App on Sitecore Portal](/uploads/authorize-marketplace-app-on-sitecore-portal.jpg "Authorize Marketplace App on Sitecore Portal")

Once authorization is complete, you can reopen your app from the Sitecore portal and verify it in the next step. From here, start exploring the app’s functionality.

**Common Issue:**

When you first open the app from inside the Sitecore Cloud portal, you might run into CORS issues with *auth.sitecorecloud.io*. This happens because the OAuth flow can be blocked when the app is embedded in the portal.

To avoid this, open your app URL in a separate browser tab the very first time before using it inside the portal.

![Issue - Auth Sitecore Cloud Refused to connect](/uploads/issue-auth-sitecore-cloud-refused-to-connect.jpg "Issue - Auth Sitecore Cloud Refused to connect")

### Step 5: Open Your Marketplace App in XM Cloud and Verify

Since we enabled two extension points while configuring the app—**Standalone** and **Page Builder context panel**—let’s try opening the app from both.

**Standalone:**

On the Sitecore Cloud portal home page, scroll down to the **Apps** section. Find your app and click it. This will open the app in standalone mode.

![Standalone - App View in Sitecore Cloud Portal](/uploads/standalone-app-view-in-sitecore-cloud-portal.jpg "Standalone - App View in Sitecore Cloud Portal")

**Page builder context panel:** 

* Open your XMC or Sitecore AI instance where the app is installed. Navigate to the Page Builder and ensure you’re on the Editor tab (check the top navigation in Page Builder). 
* Look for the Apps icon—it’s the third icon from the top-right corner, after the Publish button.
* Click the icon and select your application. 

  ![Marketplace App Icon in Sitecore Page Builder](/uploads/marketplace-app-icon-in-sitecore-page-builder.png "Marketplace App Icon in Sitecore Page Builder")
* Your app will now appear inside the Page Builder.

  ![Page builder context panel - App View in Sitecore Cloud Portal](/uploads/page-builder-context-panel-app-view-in-sitecore-cloud-portal.jpg "Page builder context panel - App View in Sitecore Cloud Portal")



## Conclusion

Your app is up and running! By default, the home route should be serving (unless you changed it in the extension settings).

This page includes examples of fetching data using the Marketplace SDK—both client-side and server-side. Take a moment to test and confirm everything works as expected.

**Was this guide helpful?** 

If you have questions, feedback, or ran into any setup issues, feel free to share them in the comments - we’d love to hear from you!

Stay tuned for more articles in this series.