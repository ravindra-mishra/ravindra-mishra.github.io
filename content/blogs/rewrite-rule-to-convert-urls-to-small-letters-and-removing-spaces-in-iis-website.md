---
title: Rewrite rule to convert URLs to small letters and removing spaces in IIS
  Website
description: Rewrite rule to convert URLs to small letters and removing spaces.
  Convert uppercase URLs to lowercase URLs
featuredImage: /uploads/blog-password-reset-banner.jpg
keywords: Config, DailySitecore, IIS, Lowercase, Rewrite Url, SEO, Sitecore,
  Slug, Upparcase, URL, XML
metaDescription: Rewrite rule to convert URLs to small letters and removing
  spaces. Convert uppercase URLs to lowercase URLs
slug: rewrite-rule-to-convert-urls-to-small-letters-and-removing-spaces-in-iis-website
date: June 7, 2022 8:56 PM
tags:
  - tag: sitecore
---
This article will cover some of the rules which can be applied in URL Rewrite in IIS or rewriterules.config. The purpose of those rules will be to make the URL more SEO-friendly after the IIS handles the request. In this article, we will discuss two scenarios of URL.

This article is specific to Sitecore but can be helpful for other ASP.NET-based applications as well.

### 1. URL with Uppercase / Capital Letters:

It is recommended that the URL should be always in lowercase / small letters looking from an SEO perspective. Sometimes if the URL with a capital letter comes in through the request. We can detect it in URL Rewrite and redirect it by converting it to lowercase format. *Eg.*

**URL with Lowercase or small letters (non-SEO friendly):**

   https://mysite.local/products/**VEHICLES**/**W**heel **B**ased **A**rrow/**S**ome **W**heel **L**ok

**URL with Uppercase or Capital letters (SEO friendly):**

    https://mysite.local/products/**vehicles**/**w**heel**\-b**ased**\-a**rrow/**s**ome**\-w**heel**\-l**ok

Here, we have replaced the " " (blank space) from the URL with "`-` " and redirected the request to the newly formed URL.

### 2. URL with “ ” space in it or URL without Slug:

The URL request without any slug used in it or blank space within the URL is not considered SEO friendly. In such scenarios as well we can use URL Rewrite to redirect by replacing blank spaces with slug. *Eg.*

**URL without Slug (non-SEO friendly):**

    https://mysite.local/products/vehicles/wheel based arrow/some wheel lok

**URL with Slug (SEO friendly):**

    https://mysite.local/products/vehicles/wheel-based-arrow/some-wheel-lok

Here, we have replaced the " " (blank space) from the URL with "`-`" and redirected the request to the newly formed URL .

Let's see how to achieve it !!! 

## Changes in Rewrite rules

Locate to rewriterule.config file of your instance. Normally it is located at **C:\inetpub\wwwroot<mysite.local>\App_Config** .

Add the below rule under the **<rules>** node.

### For Non Sitecore Applications:

The below rules are specific to the Sitecore instance, if you want to use this for other ASP.Net applications. The file location may be different, to get more details please refer [the article](https://docs.microsoft.com/en-us/iis/extensions/url-rewrite-module/creating-rewrite-rules-for-the-url-rewrite-module) from Microsoft. 

For non-Sitecore applications, you can remove conditions from line 5 to 21 (in config shown in both rules) and add new ones as per your need. 

## 1. Convert uppercase URLs to lowercase URLs:

To match pattern from the URL, we are using  `<match url="\[A-Z]" ignoreCase="false" />`. Then we set an action to redirect the request using type attribute to the URL using `url="{ToLower:{URL}}"`.

We also incorporated some URL patterns related to Sitecore system URLs to avoid the Rewrite Rule effect to it using negate="true". 

At last, we added conditions for all POST requests to be get ignored, so that it should not redirect any POST request.

```xml
<add input="{REQUEST_METHOD}" matchType="Pattern" pattern="POST" ignoreCase="true" negate="true" />
```

###### Rule 1 in Rewriterules.config:

```xml
<rule name="LowerCaseRule1" enabled="true" stopProcessing="true">
        <match url="[A-Z]" ignoreCase="false" />
        <action type="Redirect" url="{ToLower:{URL}}" />
        <conditions logicalGrouping="MatchAll">
            <add input="{URL}" pattern=".*Captcha.*" negate="true" />
            <add input="{URL}" pattern=".*media.*" negate="true" />
            <add input="{URL}" pattern=".*services\/resources.*" negate="true" />
            <add input="{URL}" pattern=".*content.*" negate="true" />
            <add input="{URL}" pattern="^/sitecore" negate="true" />
            <add input="{URL}" pattern="^/sitecore%20modules" negate="true" />
            <add input="{URL}" pattern="^/sitecore modules" negate="true" />
            <add input="{URL}" pattern="^/temp" negate="true" />
            <add input="{URL}" pattern="^/ScriptResource" negate="true" />
            <add input="{URL}" pattern="^/WebResource" negate="true" />
            <add input="{URL}" pattern="\.axd" negate="true" />
            <add input="{URL}" pattern="\.asmx" negate="true" />
            <add input="{URL}" pattern="\.svc" negate="true" />
            <add input="{URL}" pattern="^/layouts/system" negate="true" />
            <add input="{HTTP_URL}" pattern="\?.*sc_mode" negate="true" />
            <add input="{URL}" pattern="\/-\/speak" negate="true" />
            <add input="{URL}" pattern="^/api" negate="true" />
	    <add input="{REQUEST_METHOD}" matchType="Pattern" pattern="POST" ignoreCase="true" negate="true" />
        </conditions>
    </rule>
```

## 2. Replace blank space from URLs with dash/hyphen (-):

To match pattern from the URL, we are using \`<match url="(.\\\\\*) (.\\\\\*)" ignoreCase="true" />\` . Then we set an action to redirect the request using \`<action type="Redirect" url="{R:1}-{R:2}" />\`.

Rest is almost similar to Rule 1.

```xml
<rule name="BlankSpaceRule"  enabled="true"  stopProcessing="true">
	<match url="(.*) (.*)" ignoreCase="true" />
		<action type="Redirect" url="{R:1}-{R:2}" />
		<conditions logicalGrouping="MatchAll">
			<add input="{URL}" pattern=".*Captcha.*" negate="true" />
            <add input="{URL}" pattern=".*media.*" negate="true" />
            <add input="{URL}" pattern=".*services\/resources.*" negate="true" />
            <add input="{URL}" pattern=".*content.*" negate="true" />
            <add input="{URL}" pattern="^/sitecore" negate="true" />
            <add input="{URL}" pattern="^/sitecore%20modules" negate="true" />
            <add input="{URL}" pattern="^/sitecore modules" negate="true" />
            <add input="{URL}" pattern="^/temp" negate="true" />
            <add input="{URL}" pattern="^/ScriptResource" negate="true" />
            <add input="{URL}" pattern="^/WebResource" negate="true" />
            <add input="{URL}" pattern="\.axd" negate="true" />
            <add input="{URL}" pattern="\.asmx" negate="true" />
            <add input="{URL}" pattern="\.svc" negate="true" />
            <add input="{URL}" pattern="^/layouts/system" negate="true" />
            <add input="{HTTP_URL}" pattern="\?.*sc_mode" negate="true" />
            <add input="{URL}" pattern="\/-\/speak" negate="true" />
            <add input="{URL}" pattern="^/api" negate="true" />
            <add input="{REQUEST_METHOD}" matchType="Pattern" pattern="POST" ignoreCase="true" negate="true" />
		</conditions>
    </rule>
```

Now, you can see the rules will be now visible on IIS.

### Related Articles:

Here are some articles if you want to explore URL rewrite in IIS:

[https://itsmycode.com/sitecore-url-rewrite-redirect-using-iis-module/ ](https://itsmycode.com/sitecore-url-rewrite-redirect-using-iis-module/%C2%A0)

<https://docs.microsoft.com/en-us/iis/extensions/url-rewrite-module/creating-rewrite-rules-for-the-url-rewrite-module>