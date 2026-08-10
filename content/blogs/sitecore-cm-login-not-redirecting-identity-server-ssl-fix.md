---
title: Sitecore CM Login Not Redirecting to Identity Server – SSL Certificate Fix
description: Sitecore CM login not redirecting to Identity Server? Fix SSL
  certificate trust by exporting and trusting the Identity Server root
  certificate. Learn quick steps to bind the correct SSL cert in IIS, update
  hosts file, and resolve the redirect issue in Sitecore 10+ (with checklist).
keywords: Sitecore CM not redirecting to Identity Server, Sitecore Identity
  Server login redirect issue, Sitecore Identity SSL certificate trust, Sitecore
  manual WDP installation, IdentityServer certificate trusted root, Sitecore
  hosts file configuration, certificate SAN mismatch Sitecore, Owin
  IdentityServer config
metaDescription: Sitecore CM login not redirecting to Identity Server? Fix SSL
  certificate trust by exporting and trusting the Identity Server root
  certificate. Learn quick steps to bind the correct SSL cert in IIS, update
  hosts file, and resolve the redirect issue in Sitecore 10+ (with checklist).
featuredImage: /uploads/2026-08-10-19_42_58-certlm-certificates-local-computer_personal_certificates-.png
slug: sitecore-cm-login-not-redirecting-identity-server-ssl-fix
date: August 10, 2026 6:58 PM
modifiedDate: August 10, 2026 6:58 PM
author: Ravindra Mishra
faq: []
howto:
  name: Sitecore CM Login Not Redirecting to Identity Server – SSL Certificate Fix
  description: Sitecore CM login not redirecting to Identity Server? Fix SSL
    certificate trust by exporting and trusting the Identity Server root
    certificate. Learn quick steps to bind the correct SSL cert in IIS, update
    hosts file, and resolve the redirect issue in Sitecore 10+ (with checklist).
---
If you're not sure what the error means, you can also copy the relevant log entry or error stack trace and provide it to an approved AI assistant such as ChatGPT or Microsoft Copilot for analysis.

When sharing logs, remove or mask any passwords, client secrets, connection strings, tokens, certificates/private keys, or other sensitive environment information before uploading them.

A useful prompt is:

I'm troubleshooting a Sitecore CM → Identity Server login redirect issue. The Identity Server URL works directly, but the CM login does not redirect to Identity Server. Here is the relevant CM log/error. Please identify the likely root cause, explain the error, and suggest the next troubleshooting steps without assuming the cause is a certificate issue.

Providing the full relevant exception and stack trace, rather than only the first error line, usually gives the AI more context to identify the problem.# Sitecore CM Login Not Redirecting to Identity Server? Troubleshooting Guide

If your **Sitecore CM login is not redirecting to Identity Server**, even though Identity Server itself opens correctly, the problem can be related to Sitecore configuration, authentication settings, SSL certificates, certificate trust, IIS bindings, or hostname configuration.

I ran into this issue while manually configuring Sitecore using **WDP packages without SIF or SIA**. The CM and Identity Server configuration looked correct, and Identity Server was accessible directly, but the Sitecore login page still did not redirect to Identity Server.

In my case, the problem was **certificate-chain trust**. The root/issuer certificate used by the Identity Server certificate was not trusted correctly in the Local Machine certificate store.

This article walks through the checks and the fix using a concrete local Sitecore setup.

- - -

## My Sitecore URLs

For the examples in this article, I am using the following URLs:

| Purpose                  | URL                                      |
| ------------------------ | ---------------------------------------- |
| Sitecore CM              | `https://sc104cm.dev.local`              |
| Sitecore CM login        | `https://sc104cm.dev.local/sitecore`     |
| Sitecore Identity Server | `https://sc104identityserver.dev.local/` |

So the expected authentication flow is:

```text
https://sc104cm.dev.local/sitecore
                |
                | Login
                v
https://sc104identityserver.dev.local/
                |
                | Authentication
                v
https://sc104cm.dev.local
```

Your URLs will be different, but the important thing is to use the **same hostname consistently** across Sitecore configuration, IIS, certificates, and the hosts file.

- - -

# Quick Fix

If your Sitecore CM and Identity Server configuration is already correct, check the Identity Server certificate trust first.

### 1. Open the Local Machine certificate store

1. Press: `Win + R`
2. Enter: `certlm.msc`
3. and press **Enter**.
4. Go to: 

   ```text
   Personal
   └── Certificates
   ```
5. Find the SSL certificate used by: `https://sc104identityserver.dev.local/`

- - -

### 2. Check the certificate chain

1. Open the Identity Server certificate and select: `Certification Path`
2. Select the **top/root certificate** in the certificate chain and click: `View Certificate`
3. Then go to:

   ```text
   Details
   └── Copy to File...
   ```
4. Export it as a `.cer` file.
5. You only need the public certificate for this step.

   **Do not export the private key.**

- - -

### 3. Trust the root certificate

1. Open the exported `.cer` file.
2. Select: `Install Certificate`
3. Choose: `Local Machine`
4. Then select: `Place all certificates in the following store`
5. Choose: `Trusted Root Certification Authorities`
6. Complete the certificate import.
7. The important part is:

```text
Local Computer
└── Trusted Root Certification Authorities
    └── Root Certificate
```

- - -

### 4. Verify the Identity Server IIS binding

1. Open **IIS Manager**.
2. Find the Identity Server website and open: `Bindings...`
3. Verify the HTTPS binding.
4. For this example:

```text
Type:        https
Port:        443
Hostname:    sc104identityserver.dev.local
Certificate: Identity Server SSL Certificate
```

- - -

### 5. Verify the hostname

Make sure the Identity Server hostname is: `sc104identityserver.dev.local`

and that the same hostname is used in:

* Sitecore CM configuration
* Identity Server configuration
* IIS HTTPS binding
* Certificate SAN/DNS name
* Windows hosts file

- - -

### 6. Restart IIS

Run: `iisreset`

Then open: `https://sc104cm.dev.local/sitecore`

and try the login again.

In my environment, this restored the expected **CM → Identity Server** redirect.

> **Note:** Certificate trust was the cause in my environment. It is not the only possible cause of a Sitecore CM → Identity Server redirect problem.

- - -

# What Does the Problem Look Like?

The problem in my environment was: `https://sc104cm.dev.local/sitecore`

did not redirect to: `https://sc104identityserver.dev.local/`

Instead, the CM login page remained on the Sitecore CM site.

At the same time, opening Identity Server directly worked:

```text
Browser
   |
   +----> https://sc104identityserver.dev.local/
   |       Works
   |
   +----> https://sc104cm.dev.local/sitecore
           Does not redirect
```

This can be confusing because a working Identity Server URL does not necessarily mean that the complete **CM → Identity Server authentication flow** is working correctly.

- - -

# Troubleshooting Checklist

Before changing configuration, check these areas:

| Area              | What to check                                                |
| ----------------- | ------------------------------------------------------------ |
| CM configuration  | `identityServerAuthority` uses the correct HTTPS URL         |
| Identity Server   | Certificate and client configuration are correct             |
| Authentication    | Identity Server/OWIN authentication is not disabled          |
| Certificate       | Correct certificate exists in `LocalMachine\My`              |
| Certificate chain | Root/issuer certificate is trusted                           |
| Certificate SAN   | Identity Server hostname is covered                          |
| IIS               | Correct certificate is bound to the Identity Server hostname |
| Hosts file        | Identity Server hostname resolves correctly                  |
| Private key       | Required application pool permissions are availabl           |

If the basic Sitecore configuration is already correct, focus on the **certificate, certificate chain, hostname, and IIS binding**.

- - -

# 1. Check the Sitecore CM Configuration

The first place to check is the **CM instance**.

In my environment, the CM instance is:

```text
C:\inetpub\wwwroot\sc104cm.dev.local
```

The Sitecore configuration files are under:

```text
C:\inetpub\wwwroot\sc104cm.dev.local\App_Config
```

Look under:

```text
C:\inetpub\wwwroot\sc104cm.dev.local\App_Config\Sitecore\Owin.Authentication.IdentityServer
```

Depending on your Sitecore version, you may find:

```text
Sitecore.Owin.Authentication.IdentityServer.config
```

Check the Identity Server authority.

For example:

```xml
<sc.variable
    name="identityServerAuthority"
    value="https://sc104identityserver.dev.local" />
```

The important part is that the authority points to:

```text
https://sc104identityserver.dev.local
```

and not to another hostname.

For example, avoid accidentally mixing:

```text
https://sc104identityserver.dev.local
https://identityserver.dev.local
https://sc104cm.dev.local
```

The Identity Server URL should be consistent throughout the configuration.

- - -

# 2. Check the Identity Server Configuration

Now check the **Identity Server instance**.

In my environment, Identity Server is installed under:

```text
C:\inetpub\wwwroot\sc104identityserver.dev.local
```

The production configuration is under:

```text
C:\inetpub\wwwroot\sc104identityserver.dev.local\Config\production
```

For example:

```text
C:\inetpub\wwwroot\sc104identityserver.dev.local\Config\production\Sitecore.IdentityServer.Host.xml
```

Open the relevant configuration file and verify the certificate and client configuration.

For example:

```xml
      <CertificateThumbprint>EXX62XXXXXXXXXXXXXXXXXXXXX931BXXX2F</CertificateThumbprint>
      <CertificateStoreLocation>LocalMachine</CertificateStoreLocation>
      <CertificateStoreName>My</CertificateStoreName>
```

Also, verify the CM/client configuration and allowed origins required for your Sitecore version.

Make sure the CertificateThumbprint is in uppercase. You can get the thumbprint from Certificate Manager → Local Machine → Personal → Certificates. Open the certificate used by Identity Server, go to the Details tab, find the Thumbprint field, and copy the value.

For this example, the CM URL is:

```text
https://sc104cm.dev.local
```

and Identity Server is:

```text
https://sc104identityserver.dev.local
```

These hostnames should be configured consistently.

- - -

# 3. Check Whether Identity Server Authentication Is Disabled

This is an easy configuration issue to overlook.

Because we are troubleshooting the **CM instance**, check the CM instance specifically:

```text
C:\inetpub\wwwroot\sc104cm.dev.local\App_Config
```

Look through this folder and its subfolders for configuration files related to authentication being disabled.

In particular, check for files such as:

```text
Sitecore.Owin.Authentication.Disabler
Sitecore.Owin.Authentication.IdentityServer.Disabler
```

For example, they may be located somewhere under:

```text
C:\inetpub\wwwroot\sc104cm.dev.local\App_Config
```

or one of its Sitecore configuration subfolders.

The important point is that you are checking the **CM instance configuration**, not the Identity Server instance.

If these disabler configurations are enabled when they should not be, they can prevent the expected Identity Server authentication flow.

If your certificate and IIS configuration look correct, this is one of the first configuration checks I would make.

- - -

# 4. Check the Identity Server Certificate

Now check the SSL certificate used by Identity Server.

Press:

```text
Win + R
```

and run:

```text
certlm.msc
```

Navigate to:

```text
Personal
└── Certificates
```

Find the certificate used by:

```text
https://sc104identityserver.dev.local/
```

Verify that:

* The certificate exists.
* The certificate is not expired.
* It is the certificate configured for Identity Server.
* It is the certificate bound to the Identity Server IIS site.
* The certificate covers `sc104identityserver.dev.local`.

- - -

# 5. Check the Certificate Chain

This is where I found the problem in my environment.

Open the Identity Server certificate and select:

```text
Certification Path
```

You should see the certificate chain.

For example:

```text
Root CA
   ↓
Identity Server Certificate
```

or:

```text
Root CA
   ↓
Intermediate CA
   ↓
Identity Server Certificate
```

Check whether the certificate chain is valid and trusted.

If the root certificate is not trusted, select the root certificate and click:

```text
View Certificate
```

Then:

```text
Details
└── Copy to File...
```

Export it as:

```text
.cer
```

You only need the public certificate.

**Do not export the private key.**

- - -

# 6. Install the Root Certificate as Trusted

Open the `.cer` file you exported.

Select:

```text
Install Certificate
```

When Windows asks where to install it, select:

```text
Local Machine
```

Then choose:

```text
Place all certificates in the following store
```

Select:

```text
Trusted Root Certification Authorities
```

Complete the import.

You should end up with something similar to:

```text
Local Computer
└── Trusted Root Certification Authorities
    └── Root Certificate
```

This was the missing piece in my environment.

- - -

# 7. Check the Identity Server IIS Binding

Open:

```text
IIS Manager
```

Find the website for:

```text
sc104identityserver.dev.local
```

Open:

```text
Bindings...
```

Check the HTTPS binding.

For example:

```text
Type:        https
Port:        443
Hostname:    sc104identityserver.dev.local
Certificate: Identity Server SSL Certificate
```

Make sure the certificate selected in IIS is the same certificate being used by Identity Server.

- - -

# 8. Check the Certificate SAN/DNS Name

The Identity Server hostname must be covered by the certificate.

For example, IIS is configured with:

```text
sc104identityserver.dev.local
```

The certificate should contain a matching DNS name/SAN:

```text
DNS Name:
sc104identityserver.dev.local
```

You can check this from the certificate:

```text
Certificate
└── Details
    └── Subject Alternative Name
```

A hostname mismatch can cause HTTPS communication problems even when Identity Server appears to work correctly in the browser.

Make sure these all use the same hostname:

```text
Sitecore CM configuration
        ↓
Identity Server URL
        ↓
IIS hostname
        ↓
Certificate SAN/DNS
        ↓
Hosts file
```

- - -

# 9. Check the Windows Hosts File

For a local environment, check:

```text
C:\Windows\System32\drivers\etc\hosts
```

You may have:

```text
127.0.0.1    sc104cm.dev.local
127.0.0.1    sc104identityserver.dev.local
```

The exact IP address depends on your local setup.

The important thing is that:

```text
sc104identityserver.dev.local
```

resolves to the expected machine.

Also make sure the same hostname is being used everywhere else.

- - -

# 10. Check Private-Key Permissions

Private-key permissions are another possible cause of Identity Server certificate problems.

You can check the certificate through:

```text
certlm.msc
    ↓
Personal
    ↓
Certificates
    ↓
Identity Server Certificate
    ↓
All Tasks
    ↓
Manage Private Keys
```

If the certificate has a private key, verify that the Identity Server application pool has the required access.

However, this was **not the solution in my case**.

When I tried this approach, Windows showed:

```text
No key found for certificate!
```

So I moved away from the private-key-permission troubleshooting path and investigated the certificate chain instead.

- - -

# 11. Restart IIS and Test Again

After making certificate, IIS, or Sitecore configuration changes, restart IIS:

```text
iisreset
```

Then open:

```text
https://sc104cm.dev.local/sitecore
```

The expected flow is:

```text
Sitecore CM
    |
    | Login
    v
https://sc104identityserver.dev.local/
    |
    | Authentication
    v
Sitecore CM
```

- - -

# If It Still Doesn't Work

If the certificate-trust fix doesn't resolve the problem, check the **CM logs** rather than continuing to change certificates blindly.

At that point, check:

1. Identity Server URL
2. HTTPS connectivity
3. Certificate trust
4. Certificate SAN/DNS
5. IIS binding
6. Hosts-file resolution
7. Identity Server availability
8. CM configuration
9. Identity Server configuration
10. Authentication/disabler configuration
11. Certificate private-key permissions

You can also run Identity Server directly from its webroot to expose startup or runtime errors.

For this example:

```text
C:\inetpub\wwwroot\sc104identityserver.dev.local
```

Open a command prompt or PowerShell in that directory and run:

```text
dotnet .\Sitecore.IdentityServer.Host.dll
```

If Identity Server reports a startup or runtime error, resolve that issue before continuing with the CM redirect troubleshooting.

- - -

# Why This Happened in My WDP Installation

My environment was installed manually using **WDP packages**, without SIF or SIA.

The basic setup was already working:

* Sitecore CM was installed at `C:\inetpub\wwwroot\sc104cm.dev.local`.
* Identity Server was installed at `C:\inetpub\wwwroot\sc104identityserver.dev.local`.
* HTTPS was configured.
* `https://sc104identityserver.dev.local/` opened successfully.
* CM had the Identity Server authority configured.
* Identity Server had the expected CM/client configuration.

But `https://sc104cm.dev.local/sitecore` was not redirecting to `https://sc104identityserver.dev.local/`

I checked the normal Sitecore configuration and the certificate private-key permissions first.

The issue turned out to be the **certificate chain**.

The root/issuer certificate used by the Identity Server certificate was not trusted correctly by the Local Machine certificate store.

After installing the root certificate under:

```text
Local Machine
└── Trusted Root Certification Authorities
```

and verifying the IIS binding and hostname, the CM → Identity Server redirect started working.

That was the main reason I wanted to document this issue: **Identity Server worked directly in the browser, which made the certificate-trust problem easy to overlook.**

- - -

# Conclusion

When **Sitecore CM login is not redirecting to Identity Server**, start with the configuration and connectivity basics before changing Sitecore settings randomly.

Check:

1. Identity Server URL
2. CM configuration
3. Identity Server configuration
4. Authentication/disabler configuration
5. SSL certificate
6. Certificate-chain trust
7. Certificate SAN/DNS
8. IIS binding
9. Hosts file
10. Private-key permissions
11. CM logs

For my manually configured **Sitecore WDP installation**, the missing piece was **certificate-chain trust**.

Installing the root certificate into:

```text
Local Machine
└── Trusted Root Certification Authorities
```

then verifying the IIS binding and hostname resolved the CM → Identity Server redirect problem.

If you're experiencing the same issue, **start with the Quick Fix at the top**. If that doesn't work, use the troubleshooting checklist to identify which part of the CM → Identity Server communication is failing.