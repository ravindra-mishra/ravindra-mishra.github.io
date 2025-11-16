---
title: Getting no records for search results in preview mode - Sitecore SXA
description: The search result is blank in Preview Mode of Experience Editor and
  Error messages are showing at top stating 'Object reference not set to an
  instance
featuredImage: /uploads/blog-getting-no-records-for-search-results-in-preview-mode-sitecore-sxa.jpg
keywords: preview mode, publishable, search, search api, SXA, unpublishable item
metaDescription: The search result is blank in Preview Mode of Experience Editor
  and Error messages are showing at top stating 'Object reference not set to an
  instance
slug: getting-no-records-for-search-results-in-preview-mode
date: September 21, 2022 3:45 PM
tags:
  - tag: sitecore
---
## Background:

There was a scenario where content authors has configured a sxa's search implementation in a page using search component (search result, result count, scope etc). The page is not published yet & it is in progress for editing. Authors have restricted the page for not to publishing.

## Issue:

When authors goes to preview the page in Experience Editor, the search result are not showing any records. The search result is blank in Preview Mode of Experience Editor and Error messages are showing at top stating 'Object reference not set to an instance of an object' and 'Item is null'.

![Error in preview mode on the search results page](/uploads/error-in-preview-mode-on-the-search-results-page.png "Error in preview mode on the search results page")

While investigating matter, went to the browsers network tab to see the search API endpoint call. The call was successful & returns response without any error. But response data does not had appropriate data which needed.

![Sitecore SXA's Search API response data](/uploads/sitecore-sxa-search-api-response-data.png "Sitecore SXA's Search API response data")

We can observe in given screenshot that its giving "7" in result count object which is correct, but giving empty in results object. Which looks odd. 

## Findings & Workaround:

After a bit investigation, I found that search API call not getting either page item (from where search is called) or source of search result (defined in scope eg. any folder, any tree node). 

In my case, its was due to my item (page & search source folder) was set to not publishable (never publish). Because of that, Sitecore was not getting the item during search call & we were getting item null error & not results in response.

So conclusion was Sitecore SXA search not work in preview mode if items (or its parent) are set to unpublishable (never publish).

You can also refer to answer of question asked related to similar scenario in community site: [preview and unpublishable item](https://sitecore.stackexchange.com/questions/13456/preview-an-unpublishable-item).

To fix this issue, check if your item (or its parents) has publishable 'unchecked' then 'check' this option.

## To make item publishable follow below steps:

1. Select Item

2. Go to 'Publish' tab > Change

3. In Publishing Settings prompt go to Item tab > mark 'publishable' checked.

![Make Sitecore Item Unpublishable](/uploads/make-sitecore-item-unpublishable.png "Make Sitecore Item Unpublishable")

Hope this article was helpful. Happy Learning !