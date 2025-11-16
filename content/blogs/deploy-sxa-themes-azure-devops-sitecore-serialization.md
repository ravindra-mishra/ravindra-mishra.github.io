---
title: Deploy SXA Themes with Azure DevOps & Sitecore Content Serialization (SCS)
description: Streamline SXA theme deployment with Azure DevOps & Sitecore
  Content Serialization, eliminating pre-optimized file conflicts and
  simplifying team coll
featuredImage: /uploads/blog-deploy-sxa-themes-with-azure-devops-sitecore-content-serialization.jpg
keywords: Azure DevOps, SCS, Sitecore, Sitecore Content Serialization, SXA, Theme
metaDescription: Streamline SXA theme deployment with Azure DevOps & Sitecore
  Content Serialization, eliminating pre-optimized file conflicts and
  simplifying team coll
slug: deploy-sxa-themes-azure-devops-sitecore-serialization
date: August 18, 2024 3:53 PM
tags:
  - tag: sitecore-sxa
  - tag: azure-devops
---
In Sitecore's evolving landscape, efficiently managing and deploying SXA theme styles and scripts is crucial for non-headless projects. 

This blog builds on Richard Seal's insights on [SXA theme deployment with Unicorn serialization](https://www.sitecorenutsbolts.net/2021/01/29/TIHIDI-SXA-Theme-Deployment/), adapting them to the latest Sitecore Content Serialization technology. Special thanks to my colleague [Mark Ruiz](https://www.linkedin.com/in/markaruiz/) for invaluable guidance. 

We’ll explore setting up an auto theme build process using Azure DevOps and Sitecore Content Serialization.

#### Overview

This guide is designed for teams using it in non-headless SXA projects, aiming to streamline theme deployment and eliminate the need to manage  `pre-optimized-min.css` and `pre-optimized-min.js` files in source control. Managing these files can cause conflicts when multiple team members work on the theme simultaneously.

#### Background

In Richard Seal's blog, we saw how field filters can be used to skip fields like blobs, last modified dates, and others in the local environment, and then enable them in upper environments using Unicorn configs. This ensures that changes in the local environment don't appear in Git after every SXA theme build or rebuild.

#### Challange

After further research, we discovered that applying field filters at the item level and having environment-specific configurations is not possible with Sitecore Content Serialization.

#### Solution

As a result, we decided to take a different approach. We separated the optimized styles and scripts into a separate SCS module. This allows us to disable the module in local environments and enable it in upper environments using PowerShell. For the purpose of this guide, I'll assume that Sitecore Content Serialization has already been configured in your project, and that all the necessary items, including the media library and themes, have been successfully serialized. Let's go step by step.

## Step 1. Add Sitecore Content Serialization Configs for Seperating Optimized Theme Files

### Ignore Styles and Script folder

Let's assume your Site1 theme is located at `/sitecore/media library/Themes/Tenant/Site1`. You've already included all items under this node in your serialization. However, since we want to separate the pre-optimized scripts and styles, we need to exclude this specific folder. Below, we’ll add rules for this node to achieve that. Example module file: [`~/App_Config/Include/Project/Site1.Website.module.json`](https://github.com/ravindra-mishra/azdo-sxa-theme-build/blob/main/SC/src/Project/Site1/code/App_Config/Include/Project/Site1.Website.module.json)

```json
{
  "namespace": "Project.Site1.Website",
  "references": [
    "Foundation.*",
    "Feature.*"
  ],
  "items": {
    "includes": [
      {
       
      },
      {
        "name": "Themes",
        "path": "/sitecore/media library/Themes/Tenant/Site1",
        "database": "master",    
        "rules": [
          {
            "path": "/Site1/styles",
            "scope": "ignored"
          },
          {
            "path": "/Site1/scripts",
            "scope": "ignored"
          }
        ]
      }
    ]
  }
}
```

### Run \`Pull\` operation

Now, run the command `dotnet sitecore ser pull` to remove the above styles and scripts folders, along with their item `.yml` files, from your source control (solution).

### Add New Module Config File

Add a new configuration file at the same location specifically for the optimized files. For example, name it `Site1.Website.OptimizedThemes.module.json`.

```json
{
  "namespace": "Project.Site1.Website.OptimizedThemes",
  "references": [
    "Project.Site1.Website"
  ],
  "items": {
    "includes": [
      {
        "name": "OptimizedThemes",
        "path": "/sitecore/media library/Themes/Tenant/Site1/Site1",
        "database": "master",
        "scope": "descendantsOnly",
        "rules": [
          {
            "path": "/styles",
            "scope": "itemAndDescendants"
          },
          {
            "path": "/scripts",
            "scope": "itemAndDescendants"
          },
          {
            "path": "/*",
            "scope": "ignored"
          }
        ]
      }
    ]
  }
}
```

## Step 2. Pull and Store Styles and Scripts YAML Files for Placeholder Use in AzDo Pipeline

### Run \`Pull\` operation.

Run the command `dotnet sitecore ser pull` again to pull the styles and scripts folders, along with the pre-optimized `.yml` files, into your source control (solution). Commit the `.yml` files that will be used as placeholder files for scripts and styles in upper environments.

### Change file extension of newly created module file

Now, change the extension of the newly created configuration file by adding `.NONLOCAL` at the end. For example, you can rename it as [`Site1.Website.OptimizedThemes.module.json.NONLOCAL`](https://github.com/ravindra-mishra/azdo-sxa-theme-build/blob/main/SC/src/Project/Site1/code/App_Config/Include/Project/Site1.Website.OptimizedThemes.module.json.NONLOCAL). 

The reason for using the `.NONLOCAL` extension is to ensure that the file is not read as a module in `Sitecore.json` (located at the root of the project repository). 

For example:

![Example: Sitecore Json File](/uploads/example-sitecore-json-file.png "Example: Sitecore Json File")

## Step 3. Download PowerShell Scripts and Update Theme and YAML Paths

Download and add [`/scripts/AzurePipeline`](https://github.com/ravindra-mishra/azdo-sxa-theme-build/tree/main/SC/scripts/AzurePipeline) folder to your sitecore solution.

### Update the path of themes folder and yml folder

Now, edit the and update the theme details in the [`Invoke-ThemeOptimization.ps`](https://github.com/ravindra-mishra/azdo-sxa-theme-build/blob/main/SC/scripts/AzurePipeline/Invoke-ThemeOptimization.ps1). You can also remove or add new entries in themes object.

* Name*:* Enter your theme name.
* ThemePath*:* Path to your SXA theme folder.
* YmlPath*:* Path to the serialization folder for the OptimizedTheme. This folder should contain files such as `scripts/pre-optimized-min.yml` and others.

![Edit paths in Invoke-ThemeOptimization.ps](/uploads/edit-paths-in-invoke-themeoptimization.png "Edit paths in Invoke-ThemeOptimization.ps")

### Update Projects Directory Folder

Update the projects directory folder in [`Enable-ThemeOptmizationConfiguationFiles.ps1`](https://github.com/ravindra-mishra/azdo-sxa-theme-build/blob/main/SC/scripts/AzurePipeline/Enable-ThemeOptmizationConfiguationFiles.ps1) to include all projects with their `module.json` files.

![Enable ThemeOptimizationConfigurationFile.ps1](/uploads/enable-themeoptimizationconfiguration-file.png "Enable ThemeOptimizationConfigurationFile.ps1")

Save changes and commit. 

At this point, we have completed the necessary repository changes. In the next step, we need to edit our Azure DevOps build pipeline to automate the process of building the SXA theme using the Node SXA command (e.g., `sxa build`).

## Step 4. AzDo Build Pipeline - Add Theme Build Task

For this step, we assume that a build pipeline is already set up for our project. We will simply add a few additional tasks to the build pipeline to automate the SXA theme build process.

Since we want to run the SXA build command in the pipeline, which is based on a Node environment, we first need to add a task that enables us to use Node in DevOps. Follow the steps mentioned below:

#### Add the "Use Node" Task (Node.js Tool Installer)

1. Click the "+" button.
2. On the right side, type "node" in the search box.
3. Select "Node.js Tool Installer."
4. Set the parameters as per your project.

![Pipeline: Use Node Task](/uploads/use-node-js-task.png "Pipeline: Use Node Task")

### SXA Theme Build Task (Powershell)

Add a new task for the SXA theme build in the pipeline. For this, we will utilize our `Invoke-ThemeOptimization.ps1` PowerShell script, which we included in our source control in previous steps. To do this, we need to add a PowerShell task and provide the parameters as shown in the image below. 

![Pipeline: SXA Theme Build Task (Powershell)](/uploads/sxa-theme-build-task-powershell-.png "Pipeline: SXA Theme Build Task (Powershell)")

Save the build pipeline settings. 

### How This Will Work:

The SXA theme optimization task will call the `Invoke-ThemeOptimization.ps1` powershell. As a result, each theme will be built, and a pre-optimized physical file will be generated.

The script will also call the `Set-ThemeYaml.ps1` function for each theme, which will replace the existing blob of placeholder YAML files with the newly generated pre-optimized YAML files.

In the end, we will have the latest YAML files in the `Build.SourcesDirectory`.

We have completed all the necessary settings and changes to set up the automatic SXA themes build in the Azure build pipeline. The next step follows the standard process for creating and installing Sitecore Content Serialization (SCS) item packages

## Step 5: Configuring Build and Release Pipelines for Sitecore Content Serialization - Item Package Creation and Installation

I recommend reviewing the blog shared by Phil Paris on configuring the Azure pipeline for this process. Be sure to check out *[Automated Deployments with Sitecore Content Serialization in Azure DevOps](https://byteium.com/2020/09/automated-deployments-with-sitecore-content-serialization-in-azure-devops)* for further steps.

### Conclusion

Using Sitecore Content Serialization with Azure DevOps lets you automate and streamline SXA theme deployments in non-headless projects. This setup boosts efficiency and ensures consistent, reliable deployments. For more details and advanced configurations, check the official Sitecore documentation and community resources.