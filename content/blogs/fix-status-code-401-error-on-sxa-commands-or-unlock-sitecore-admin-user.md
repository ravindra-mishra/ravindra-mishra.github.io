---
title: How to Fix Status Code 401 Error on SXA Commands or Unlock Sitecore Admin User
description: "The Sitecore login get blocked due to multiple failed login
  attempts. Unlock the Sitecore login. Getting Status code: 401 Answer error for
  sxa r."
keywords: 401, DailySitecore, Docker, Sitecore, Sitecore Locked, SQL, Status
  Code 401, SXA, SXA R, Theme, Unlock Sitecore, User
metaDescription: "The Sitecore login get blocked due to multiple failed login
  attempts. Unlock the Sitecore login. Getting Status code: 401 Answer error for
  sxa r."
slug: fix-status-code-401-error-on-sxa-commands-or-unlock-sitecore-admin-user
date: August 8, 2022 4:01 PM
tags:
  - tag: sitecore
  - tag: sitecore-sxa
---
![Image: "Status Code: 401" error on sxa r cmd](/uploads/status-code-401-error-on-sxa-r-cmd-due-to-admin-user-locked.png "Status Code 401 - Sitecore Admin User Locked")

In Sitecore SXA, for theme building, JS & CSS magnification we use "**sxa r"** command from theme folder. 

**Challenge:**

Due to some reasons, I was not able to complete the operation and I was getting **"Status code: 401 Answer"** error continuously on the terminal as shown in above image. I re-verified the credentials but it won't worked. Also I was not able to login to Sitecore. 

After doing some research I found it was blocking the theme to deploy into the Sitecore because Sitecore login was failing. It happens when the login get blocked due to multiple failed login attempts (FailedPasswordAttempt). This is Sitecore Locked situation.

**Solution:**

Here, we need to unlock the Sitecore login. Lets see how to unlock Sitecore login.

## Unlock Sitecore user account:

### Scenario 1: If you have direct access to MSSQL server

Select Core database: Run the below SQL command

```sql
UPDATE  [aspnet_Membership]
SET     IsLockedOut = 0, 
        FailedPasswordAttemptCount = 0
WHERE   UserId IN (SELECT UserId FROM [aspnet_Users] WHERE UserName = 'sitecore\Admin')
```

This will reset the **IsLockedOut** and **FailedPaswordAttemptCount** & you will be able to login with the respective account and try hitting **"sxa r"** command again it will work.

![Image: SQL command to reset Sitecore User Lock](/uploads/sql-command-to-reset-sitecore-user-lock.png "SQL command to reset Sitecore User Lock")

### Scenario 2: Unlock Sitecore user account in Docker.

In my case, my Sitecore instance was running on Docker. So I didn't had direct access to MS SQL. Hence, I opted to replaced the Core database MDF & LDF files with older one I had as backup.

In docker instance, the MDF & LDF file of MS SQL database is located in the data/mssql folder.

*eg. YourProjectFolder/docker/data/mssql/*

Remember to take backup the mdf & ldf before replacing.

![Image: Locate MDF & LDF for MSSQL in Docker](/uploads/locate-mdf-ldf-for-mssql-in-docker.png "Locate MDF & LDF for MSSQL in Docker")

**\[U﻿pdate on 26 Dec, 2024]**

If you don't have backups or don't want to lose the changes you made in the code database, here's another option you can try. I highly recommend going through this blog by David.

<https://blogs.perficient.com/2022/07/14/how-to-reset-the-sitecore-admin-password-inside-a-docker-container/>

Hope this article was helpful. Please use comment section if you have any suggestions on this.

**Happy Learning !**