---
title: Redirect URL with file extensions using Constellation Redirect Manager
description: Redirect URL containing file extensions like PDF and PHP using
  Constellation Redirect Manager.
featuredImage: /uploads/blog-redirect-url-with-file-extensions-using-constellation-redirect-manager.jpg
keywords: Allowed extensions, Config, Constellation, DailySitecore, File
  Extensions, Patch, Redirect, Redirect Manager, Sitecore, SXA
metaDescription: Redirect URL containing file extensions like PDF and PHP using
  Constellation Redirect Manager.
slug: redirect-url-containing-file-extensions-like-pdf-and-php-using-constellation-redirect-manager
date: August 10, 2022 4:17 PM
tags:
  - tag: sitecore-sxa
---
In scenarios when we are migrating the website from other platforms to Sitecore CMS. We might have many URL to be get redirect to new URL. In such cases most of the older URLs may also contain extensions like *\~/oldurl.php, \~/oldurlpdfdoc.pdf* or *~/oldurl.aspx*.

Sitecore SXA's provide redirect feature but with some limitations. Here we get the feasibility to set Redirect but that only work for below scenarios.

1. Redirecting **existing item in Sitecore tree** to new.
2. We **can't** redirect any link containing extensions like php or pdf.

But again old url can not always be in Sitecore item URL formats and we may need some other solutions apart from this. Hence such requirements can be fulfilled by using Constellation Redirect Manager (an external package for marketing redirects). Please refer the [official documentation here.](https://constellation4sitecore.com/feature/redirects/#:~:text=Installing%20Constellation.-,Feature.,anywhere%20in%20your%20content%20tree.) 

**Constellation Redirect Manager:**

![Image: Constellation Redirect Manager](/uploads/constellation-redirect-manager.png "Constellation Redirect Manager")

1. Redirecting **any url** (without extensions) to new which can be relative or absolute URLs (including other domains).
2. Including file extension in old URL **does not come by default** (but can be implemented).

I have read its documentation and found it has mentioned that file extensions can be included in old URLs only if developers can enable to use it in the Constellation Redirect Manager. 

![Image: Constellation Documentation for file extensions in URLs.](/uploads/constellation-documentation-for-file-extensions-in-urls..png "Constellation Documentation for file extensions in URLs.")

## How to Enable Redirect URLs Containing Extensions Like PDF and PHP Using Constellation Redirect Manager

To make it possible the request should be able to be reach to constellation redirect code. But here the problem is Sitecore **NOT** allowing any other request with contains file extensions in URL. It only allow the below file extensions in the request.

![Image: Config for allow extensions in Sitecore](/uploads/config-for-allow-extensions-in-sitecore.png "Config for allow extensions in Sitecore")

Because of that any request containing file extension can't reach to constellation program. So, here we add exception for pdf or php so that the request can be reach to constellations redirect code.

Here we will make some changes in Sitecore configurations. We will **add the file extensions** we want to the **Allowed extensions** list of the Sitecore configurations.

I have created a separate patch file and will keep Sitecore's existing file extensions (like aspx, ashx, asmx) & file extensions we need (like pdf, php) as shown below. Add this patch file to the respective project App_Config folder.

```xml
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/" xmlns:role="http://www.sitecore.net/xmlconfig/role/" >
  <sitecore>
    <pipelines>
      <preprocessRequest>
        <processor>
          <param desc="Allowed extensions (comma separated)">aspx, ashx, asmx, pdf, php</param>
        </processor>
      </preprocessRequest>
    </pipelines>
  </sitecore>
</configuration>
```

![Image: Patch Config file for allow extensions in Sitecore](/uploads/patch-config-file-for-allow-extensions-in-sitecore.png "Patch Config file for allow extensions in Sitecore")

Here, your Sitecore instance will start allowing the request with pdf and php urls. Now you can add redirect on your Redirect Manager and verify the changes.