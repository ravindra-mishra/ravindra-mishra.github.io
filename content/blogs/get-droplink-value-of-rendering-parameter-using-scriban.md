---
title: Get droplink value of rendering parameter using scriban in Sitecore
description: How to get droplink value of rendering parameter using scriban in Sitecore SXA
featuredImage: /uploads/blog-password-reset-banner.jpg
keywords: Component, DailySitecore, Droplink, Droplist, OOTB, parameter,
  Rendering Parameter, Scriban, Sitecore, SXA
metaDescription: How to get droplink value of rendering parameter using scriban in Sitecore SXA
slug: get-droplink-value-of-rendering-parameter-using-scriban
date: August 4, 2022 3:46 PM
tags:
  - tag: sitecore-sxa
  - tag: sitecore
---
In this article, we will discuss how we can get the value of Rendering Parameter of type droplink.

**Challange:**

There was a scenario content author should be able to choose the background color from droplink from rendering parameters and I want use the CSS class associated with background color inside the Scriban code.

![Image: Droplink source](/uploads/droplink-source.png "Droplink source")

![Image: Rendering Parameter Template](/uploads/rendering-parameter-template.png "Rendering Parameter Template")

![Image: Rendering Parameter Selection Dialog Box](/uploads/rendering-parameter-selection-dialog-box.png "Rendering Parameter Selection Dialog Box")

I tried to using sc_parameter like below.

```csharp
{{ backgroundColor = sc_parameter 'TipBackgroundColor' }}
```

And tried getting its value directly using ***{{ backgroundColor.Value }}*** but it was giving me blank value.

So, I tried to print backgroundColor directly I saw it was printing the ID of the selected item.

**Solution:**

I found a solution from other sources to get value of selected droplink item. That I am gonna share in this blog.

Here, we can use the ID of item which we are getting and search it in the tree to get the **item** using **sc_query**. Then after we can access **item**'schild field. The example is given below.

*Scriban:*

```csharp
{{
  backgroundColorId = sc_parameter 'TipBackgroundColor' 
  backgroundColorCssClass = ''
}}

{{
  for i_child in (sc_query i_item "query:/sitecore/content/Tenant/Site/Presentation/Styles/Background color//*[@@id = '" + backgroundColorId + "']")
    backgroundColorCssClass = i_child.Value
    break
  end
}}

...
...

<div class="{{ backgroundColorCssClass.Raw }}">
...
</div>
```

Hope this article was helpful !