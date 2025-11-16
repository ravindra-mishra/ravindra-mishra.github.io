---
title: A Custom Switch Link Provider for Multisite setup in Sitecore 9
description: Custom Switch Link Provider for Multisite setup in Sitecore 9.1.
  Set custom site definition attribute for link provider for all sites.
featuredImage: /uploads/blog-a-custom-switch-link-provider-for-multisite-setup-in-sitecore-9.jpg
keywords: Sitecore, Sitecore 9, Custom Switch Link Provider, Link Manager,
  Multisite, Blog
metaDescription: Custom Switch Link Provider for Multisite setup in Sitecore
  9.1. Set custom site definition attribute for link provider for all sites.
slug: custom-switch-link-provider-for-multisite-setup-in-sitecore-9
date: June 3, 2022 8:06 PM
tags:
  - tag: sitecore
---
In some scenarios, a non-sxa Sitecore instance with a multi-site setup may require separate Link Providers for each site. The non-sxa sitecore instance does not have the feasibility to do it directly.  In this article, we will be talking about the simple way to configure a Site-Specific Link Provider. We will create a custom link provider which will work as a link provider switcher. 

The article is inspired by the article "[A Switching Link Provider in Sitecore (sitecoreskills.blogspot.com)](http://sitecoreskills.blogspot.com/2014/02/a-switching-link-provider.html)" with a bit simple latest approach specific to sc9.1. 

Let's get started !!

Related git-hub repository is available here: <https://github.com/ravindra-mishra/CustomSwitchLinkManager-Sitecore91>.

## **Step 1: Site Definition Config**

Set custom site definition attribute for link provider for all sites. Here we are linking **Site** with **LinkProvider** by adding a custom attribute.  

For the example, a custom attribute is added for `mysite1` same way we can add it to `mysite2` as well.

![Image - Sitecore Site definition config for Link provider](/uploads/site-config-for-link-provider-sitecore.png "Image - Sitecore Site definition config for Link provider")

## **Step 2: Changes in LinkManager config.**

**Link Manager Patch File:**

```xml
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/">
    <sitecore>
        <linkManager>
            <patch:attribute name="defaultProvider">switcherLinkProvider</patch:attribute>
            <patch:attribute name="fallbackProvider">sitecore</patch:attribute>
            <providers>
                <add name="mySite1LinkProvider" type="MySite1.Foundation.Multisite.Links.MySite1LinkProvider, MySite1.Foundation.Multisite" />
                <add name="mySite2LinkProvider" type="MySite2.Foundation.Multisite.Links.MySite2LinkProvider, MySite2.Foundation.Multisite" />
                <add name="switcherLinkProvider" type="DailySitecore.SwitchLinkManager.Links.SwitchLinkProvider, DailySitecore.SwitchLinkManager" />
            </providers>
        </linkManager>
    </sitecore>
</configuration>
```

![Image - Link Manager config ](/uploads/custom-link-manager-config.png "Image - Link Manager config ")



**(a) defaultProvider:**

We have added a patch attribute in linkManager setting node to define the default link provider. In our case, it must be switcherLinkProvider. 

Eg. 

```xml
<patch:attribute name="defaultProvider">switcherLinkProvider</patch:attribute>
```



**(b) fallbackProvider:** 

We have added a custom patch attribute in linkManager setting node to define the fallback link provider. It will be used when the custom site definition attribute "linkProvider" is missing from any site setting. In the example, we kept the standard "sitecore" link manager as the fallback provider. It can be changed as per need.

Eg. 

```xml
<patch:attribute name="fallbackProvider">sitecore</patch:attribute>
```



**(c) We had declared all available site-specific custom link providers.** 

Eg.  like mysite1, mysite2 & etc.

```xml
<add name="mySite1LinkProvider" type="MySite1.Foundation.Multisite.Links.MySite1LinkProvider, MySite1.Foundation.Multisite" />
```

At last, we will keep the switcher link provider.

Eg. 

```xml
<add name="switcherLinkProvider" type="DailySitecore.SwitchLinkManager.Links.SwitchLinkProvider, DailySitecore.SwitchLinkManager" />
```

We can also validate all changes in config using the below steps: 

1. Login to Sitecore admin > Launchpad > Control Panel > Administration Section > Click "Administration tools" > Configuration Section > Click "Show Config"
2. Search for "linkManager" and validate the changes & order of all link providers. Make sure that switchLinkProvider should be at last.

## **Step 3: Back-end implementation for Switch Link Provider**

Here, we have created a separate helix project for SwitchLinkManger named "DailySitecore.SwitchLinkManager". 

1. Created a new folder named "links" & added a class with the name "SwitchLinkProvider" which is inherited from LinkProvider.
2. Created a constructor, and added logic to get the fallback provider value from the config file & stored it in a variable. 
3. Created `GetContextProvider()` method to logically decide the related linkProvider for the context site to be returned.

To get all available linkproviders:

```csharp
var providerHelper = ServiceLocator.GetRequiredResetableService<Sitecore.Configuration.ProviderHelper<LinkProvider, LinkProviderCollection>>();
```

To get linkProvider of current site (context site):

```csharp
var providerName = Sitecore.Context.Site.Properties["linkProvider"];
```

**NOTE:**

"LinkManager.Provider" is deprecated in Sitecore 9 so we can use the below code as an alternative to get linkprovider.

```csharp
var providerHelper = ServiceLocator.GetRequiredResetableService<Sitecore.Configuration.ProviderHelper<LinkProvider, LinkProviderCollection>>();

LinkProvider myLinkProvider = providerHelper?.Value?.Providers["providerName"]
```

If providerName for the site is set then it will return the linkProvider which contains a key similar to the providerName variable. Otherwise, it will return the fallback link provider using **_fallbackProvider** value.

Now, override all options of linkprovider and use GetContextProvider to get values.

### SwitchLinkProvider.cs file:

```csharp
using System.Web;
using System.Xml;
using Sitecore.Configuration;
using Sitecore.Data.Items;
using Sitecore.DependencyInjection;
using Sitecore.Links;
using Sitecore.Web;

namespace DailySitecore.SwitchLinkManager.Links
{
    public class SwitchLinkProvider : LinkProvider
    {
        private string _fallbackProvider;

        public SwitchLinkProvider()
        {
            XmlNode linkManagerNode = Factory.GetConfigNode("linkManager");
            _fallbackProvider = linkManagerNode.Attributes["fallbackProvider"].Value;
        }

        private LinkProvider GetContextProvider()
        {
            var providerHelper = ServiceLocator.GetRequiredResetableService<Sitecore.Configuration.ProviderHelper<LinkProvider, LinkProviderCollection>>();
            var providerName = Sitecore.Context.Site.Properties["linkProvider"];
            return !string.IsNullOrEmpty(providerName) ? providerHelper?.Value?.Providers[providerName] : providerHelper?.Value?.Providers[_fallbackProvider];
        }

        public override bool AddAspxExtension
        {
            get { return GetContextProvider().AddAspxExtension; }
        }

        public override bool AlwaysIncludeServerUrl
        {
            get { return GetContextProvider().AlwaysIncludeServerUrl; }
        }

        public override bool EncodeNames
        {
            get { return GetContextProvider().EncodeNames; }
        }

        public override LanguageEmbedding LanguageEmbedding
        {
            get { return GetContextProvider().LanguageEmbedding; }
        }

        public override LanguageLocation LanguageLocation
        {
            get { return GetContextProvider().LanguageLocation; }
        }

        public override bool LowercaseUrls
        {
            get { return GetContextProvider().LowercaseUrls; }
        }

        public override bool ShortenUrls
        {
            get { return GetContextProvider().ShortenUrls; }
        }

        public override bool UseDisplayName
        {
            get { return GetContextProvider().UseDisplayName; }
        }

        public override string ExpandDynamicLinks(string text, bool resolveSites)
        {
            return GetContextProvider().ExpandDynamicLinks(text, resolveSites);
        }

        public override UrlOptions GetDefaultUrlOptions()
        {
            return GetContextProvider().GetDefaultUrlOptions();
        }

        public override string GetDynamicUrl(Item item, LinkUrlOptions options)
        {
            return GetContextProvider().GetDynamicUrl(item, options);
        }

        public override string GetItemUrl(Item item, UrlOptions options)
        {
            return GetContextProvider().GetItemUrl(item, options);
        }

        public override bool IsDynamicLink(string linkText)
        {
            return GetContextProvider().IsDynamicLink(linkText);
        }

        public override DynamicLink ParseDynamicLink(string linkText)
        {
            return GetContextProvider().ParseDynamicLink(linkText);
        }

        public override RequestUrl ParseRequestUrl(HttpRequest request)
        {
            return GetContextProvider().ParseRequestUrl(request);
        }
    }
}
```

### References

[https://www.partech.nl/en/publications/2017/06/how-to-get-the-deprecated-linkmanager-provider-and-providers-now#](https://www.partech.nl/en/publications/2017/06/how-to-get-the-deprecated-linkmanager-provider-and-providers-now)

[A Switching Link Provider in Sitecore (sitecoreskills.blogspot.com)](http://sitecoreskills.blogspot.com/2014/02/a-switching-link-provider.html)