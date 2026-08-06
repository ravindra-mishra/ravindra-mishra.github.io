---
title: How to Reset Sitecore Admin User Password Using SQL
description: Learn how to reset the Sitecore admin user password using SQL by
  updating the aspnet_Membership table in the sitecore_core database. Identify
  the hash algorithm and apply the correct query.
featuredImage: /uploads/blog-password-reset-banner.jpg
keywords: Sitecore, Sitecore admin password reset, identity server, Sitecore SQL
  query, reset admin password Sitecore, Sitecore core database, Sitecore
  security, Sitecore membership table, Sitecore hash algorithm, hsa1, sha512
metaDescription: Learn how to reset the Sitecore admin user password using SQL
  by updating the aspnet_Membership table in the sitecore_core database.
  Identify the hash algorithm and apply the correct query.
slug: reset-sitecore-admin-user-password-using-sql
date: March 7, 2025 2:59 PM
tags:
  - tag: sitecore
faq:
  - question: Where is the Sitecore admin password stored?
    answer: In the Core database aspnet_Membership table. The value is hashed according to the hashAlgorithmType configured for the instance (SHA1 or SHA512).
  - question: How do I reset the Sitecore admin password using SQL?
    answer: Identify hashAlgorithmType in identityServer.xml or web.config, then run the matching UPDATE on aspnet_Membership for UserName sitecore\Admin to set Password, PasswordSalt, IsApproved, and IsLockedOut.
howto:
  name: Reset Sitecore admin password with SQL
  description: Reset the sitecore\Admin password to b by updating aspnet_Membership in the Core database.
  steps:
    - name: Identify the hash algorithm
      text: Check identityServer.xml (Identity Server enabled) or web.config (disabled) for hashAlgorithmType — SHA1 or SHA512.
    - name: Run the matching SQL update on the Core database
      text: UPDATE aspnet_Membership SET Password and PasswordSalt to the known values for password b, set IsApproved to 1 and IsLockedOut to 0 for sitecore\Admin.
---
## Introduction

In Sitecore, the admin user password is stored in the `core` database (`<sitecore_instance>_Core`) within the `aspnet_Membership` table. The password value is hashed and depends on the `hashAlgorithmType` configured for your instance.

This guide provides SQL queries to **reset the "admin" password to "b"** based on the hashing algorithm used in your Sitecore instance.

## Identify the Hash Algorithm Used

Before resetting the password, you need to determine which hashing algorithm is being used in your Sitecore instance. The configuration can be found in the following files:

### Case 1: Identity Server Enabled

* Check the configuration file

```
C:\inetpub\wwwroot\<sitecore_identity_server_instance>\sitecore\Sitecore.Plugin.IdentityServer\Config\identityServer.xml
```

![Password Hash Algorithm in Identity Server XML file - Identity Server Enabled](/uploads/password-hash-algorithm-in-identityserver.xml.png "Password Hash Algorithm in Identity Server XML file - Identity Server Enabled")

### Case 2: Identity Server Disabled

* Look for the following file:

```
C:\inetpub\wwwroot\<sitecore_cm_instance>\web.config
```

![Password Hash Algorithm in Web.config file - Identity Server Disabled](/uploads/password-hash-algorithm-in-web-config.png "Password Hash Algorithm in Web.config file - Identity Server Disabled")

Inside these files, search for the `hashAlgorithmType` setting to identify whether SHA1 or SHA512 is used.

## SQL Queries to Reset Password

Once you have identified the hash algorithm, use the appropriate SQL query to update the admin password.

### For SHA1

```sql
UPDATE [aspnet_Membership] 
  SET 
    [Password] = 'qOvF8m8F2IcWMvfOBjJYHmfLABc=', 
    [PasswordSalt] = 'OM5gu45RQuJ76itRvkSPFw==', 
    [IsApproved] = '1', 
    [IsLockedOut] = '0' 
  WHERE 
    UserId IN 
    (
          SELECT UserId FROM dbo.aspnet_Users WHERE UserName = 'sitecore\Admin'
    ) 
```

### For SHA512

```sql
UPDATE [aspnet_Membership] 
	SET 
			[Password]='K8N8GUW8UiNT2mPdjvuBDH+QmvA3R61M9buVvCwFHwtDjpMzTxs34lg0uQ0azCITqh6FkUZlX4kM72lsAyuyXQ==', 
			[PasswordSalt]='p5B6HOWKt0ctMZaSNXTlfw==', 
			[IsApproved] = '1', 
			[IsLockedOut] = '0'
    WHERE 
			UserId IN 
            (
				SELECT UserId FROM dbo.aspnet_Users WHERE UserName = 'sitecore\admin'
            );
```

**Note:** Make sure you run this SQL query on the `<sitecore_instance>_Core` database.



Hope you found this article helpful! Feel free to share any feedback or suggestions in the comments section.

If you're only looking to unlock the Sitecore admin user, check out this blog:
[Fix Status Code 401 Error on SXA Commands or Unlock Sitecore Admin User](https://ravindra-mishra.github.io/blogs/fix-status-code-401-error-on-sxa-commands-or-unlock-sitecore-admin-user).