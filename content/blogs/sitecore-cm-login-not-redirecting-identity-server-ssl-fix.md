---
title: Sitecore CM Login Not Redirecting to Identity Server? Troubleshooting Guide
description: Sitecore CM login not redirecting to Identity Server? Check certificate trust, IIS binding, hostname, SAN/DNS, authentication configuration, and logs with this practical troubleshooting guide.
keywords: Sitecore CM login not redirecting to Identity Server, Sitecore Identity Server troubleshooting, Sitecore Identity Server certificate trust, Sitecore Identity Server SSL, Sitecore WDP installation, Sitecore certificate SAN mismatch
metaDescription: Sitecore CM login not redirecting to Identity Server? Check certificate trust, IIS binding, hostname, SAN/DNS, authentication configuration, and logs with this practical troubleshooting guide.
featuredImage: /uploads/2026-08-10-19_42_58-certlm-certificates-local-computer_personal_certificates-.png
slug: sitecore-cm-login-not-redirecting-to-identity-server
date: August 10, 2026 6:58 PM
modifiedDate: August 10, 2026 6:58 PM
tags:
  - tag: sitecore
author: Ravindra Mishra
faq:
  - question: Why is Sitecore CM not redirecting to Identity Server?
    answer: The cause can be Sitecore configuration, disabled authentication, certificate trust, certificate SAN/DNS mismatch, IIS binding, hostname resolution, or certificate permissions. In my environment, the issue was an untrusted root certificate.
  - question: Why does Identity Server work directly but CM does not redirect?
    answer: Direct browser access does not guarantee that the CM-to-Identity Server authentication flow can establish a trusted HTTPS connection.
  - question: Where should the Identity Server root certificate be installed?
    answer: For the local Windows setup described here, install the root CA certificate under Local Machine > Trusted Root Certification Authorities.
  - question: Do I need to export the Identity Server private key?
    answer: No. For the certificate trust fix described here, export only the public root CA certificate as a .cer file.
  - question: What should I check if Sitecore CM still does not redirect?
    answer: Check the CM configuration, Identity Server configuration, authentication settings, certificate trust, SAN/DNS, IIS binding, hosts file, private-key permissions, and CM logs.
howto:
  name: Sitecore CM Login Not Redirecting to Identity Server? Troubleshooting Guide
  description: Troubleshoot Sitecore CM login redirect issues by checking certificate trust, IIS binding, hostname, authentication configuration, and related connectivity settings.
---

# Sitecore CM Login Not Redirecting to Identity Server? Troubleshooting Guide

If your **Sitecore CM login is not redirecting to Identity Server**, even though Identity Server itself opens correctly, the cause can be Sitecore configuration, authentication settings, SSL certificates, certificate trust, IIS bindings, or hostname configuration.

I ran into this issue while manually configuring Sitecore using **WDP packages without SIF or SIA**. The CM and Identity Server configuration looked correct, and Identity Server was accessible directly, but the Sitecore login page still did not redirect to Identity Server.

In my case, the problem was **certificate-chain trust**. The root CA certificate used by the Identity Server certificate was not trusted correctly in the Local Machine certificate store.

This guide gives you the fix first, followed by the troubleshooting checks and the details of what happened in my WDP installation.

## My Sitecore URLs

For the examples in this article, I am using:

| Purpose | URL |
| --- | --- |
| Sitecore CM | `https://sc104cm.dev.local` |
| Sitecore CM login | `https://sc104cm.dev.local/sitecore` |
| Sitecore Identity Server | `https://sc104identityserver.dev.local/` |

The expected authentication flow is:

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

Your URLs will be different, but the important part is to use the **same Identity Server hostname consistently** across Sitecore configuration, IIS, the certificate SAN/DNS name, and the Windows hosts file.

---

# Quick Fix

If your Sitecore CM and Identity Server configuration is already correct, check the Identity Server certificate trust first.

If you only have a few minutes, start here.

### 1. Open the Local Machine certificate store

Press **Win + R**, enter `certlm.msc`, and press **Enter**.

Go to **Personal → Certificates** and find the SSL certificate used by `https://sc104identityserver.dev.local/`.

### 2. Check the certificate chain

Open the Identity Server certificate and select **Certification Path**.

Select the **root CA certificate** at the top of the chain and click **View Certificate**.

Go to **Details → Copy to File...** and export it as a `.cer` file.

You only need the public certificate for this step.

**Do not export the private key.**

### 3. Trust the root certificate

Open the exported `.cer` file and select **Install Certificate**.

Choose:

1. **Local Machine**
2. **Place all certificates in the following store**
3. **Trusted Root Certification Authorities**
4. Complete the import.

The certificate should be installed under:

`Local Computer → Trusted Root Certification Authorities`

### 4. Verify the Identity Server IIS binding

Open **IIS Manager**, find the Identity Server website, and open **Bindings...**.

Verify the HTTPS binding:

```text
Type:        https
Port:        443
Hostname:    sc104identityserver.dev.local
Certificate: Identity Server SSL Certificate
```

Make sure the certificate selected in IIS is the certificate being used by Identity Server.

### 5. Verify the hostname

Make sure `sc104identityserver.dev.local` is used consistently in:

- Sitecore CM configuration
- Identity Server configuration
- IIS HTTPS binding
- Certificate SAN/DNS name
- Windows hosts file

### 6. Restart IIS

Run:

`iisreset`

Then open `https://sc104cm.dev.local/sitecore` and try the login again.

In my environment, this restored the expected **CM → Identity Server** redirect.

> **Note:** Certificate trust was the cause in my environment. It is not the only possible cause of a Sitecore CM → Identity Server redirect problem.

---

# Troubleshooting Checklist

Before changing configuration, check these areas:

| Area | What to check |
| --- | --- |
| CM configuration | `identityServerAuthority` uses the correct HTTPS URL |
| Identity Server | Certificate and client configuration are correct |
| Authentication | Identity Server/OWIN authentication is not disabled |
| Certificate | Correct certificate exists in `LocalMachine\My` |
| Certificate chain | Root CA certificate is trusted |
| Certificate SAN | Identity Server hostname is covered |
| IIS | Correct certificate is bound to the Identity Server hostname |
| Hosts file | Identity Server hostname resolves correctly |
| Private key | Required application pool permissions are available |
| Logs | Look for errors such as `IDX20803` |

If the basic Sitecore configuration is already correct, focus on the **certificate, certificate chain, hostname, and IIS binding** first.

---

# 1. Check the Sitecore CM Configuration

On the CM instance, check `App_Config\Sitecore\Owin.Authentication.IdentityServer` and look for `Sitecore.Owin.Authentication.IdentityServer.config`.

Verify the Identity Server authority.

For example:

```xml
<sc.variable
    name="identityServerAuthority"
    value="https://sc104identityserver.dev.local" />
```

The authority should point to the Identity Server hostname you actually use.

Avoid accidentally mixing hostnames such as:

- `https://sc104identityserver.dev.local`
- `https://identityserver.dev.local`
- `https://sc104cm.dev.local`

The Identity Server URL should remain consistent throughout the configuration.

---

# 2. Check the Identity Server Configuration

On the Identity Server instance, check the relevant production configuration, such as `Config\production\Sitecore.IdentityServer.Host.xml`.

Verify the certificate and client configuration.

For example:

```xml
<CertificateThumbprint>YOUR_CERTIFICATE_THUMBPRINT</CertificateThumbprint>
<CertificateStoreLocation>LocalMachine</CertificateStoreLocation>
<CertificateStoreName>My</CertificateStoreName>
```

Copy the certificate thumbprint directly from **Certificate Manager → Local Machine → Personal → Certificates** and make sure there are no accidental spaces or extra characters.

Also verify the CM/client configuration and allowed origins required for your Sitecore version.

The CM URL and Identity Server URL should use the same hostnames configured elsewhere in the environment.

---

# 3. Check Whether Identity Server Authentication Is Disabled

This is an easy configuration issue to overlook.

Because the redirect starts from the **CM instance**, check the CM `App_Config` folder and its subfolders for authentication-related configuration files.

In particular, check for files such as:

- `Sitecore.Owin.Authentication.Disabler`
- `Sitecore.Owin.Authentication.IdentityServer.Disabler`

If these disabler configurations are enabled when they should not be, they can prevent the expected Identity Server authentication flow.

If your certificate and IIS configuration look correct, this is one of the first Sitecore configuration checks I would make.

---

# 4. Check the Identity Server Certificate

Open the Local Machine certificate store with `certlm.msc`.

Navigate to **Personal → Certificates** and find the certificate used by Identity Server.

Verify that:

- The certificate exists.
- The certificate is not expired.
- It is the certificate configured for Identity Server.
- It is the certificate bound to the Identity Server IIS site.
- The certificate covers `sc104identityserver.dev.local`.

---

# 5. Check the Certificate Chain

This is where I found the problem in my environment.

Open the Identity Server certificate and select **Certification Path**.

You may see a chain such as:

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

If the root CA is not trusted, select it and click **View Certificate → Details → Copy to File...**.

Export it as a `.cer` file.

You only need the public certificate.

**Do not export the private key.**

---

# 6. Install the Root Certificate as Trusted

Open the `.cer` file you exported.

Select **Install Certificate**.

When Windows asks where to install it, select:

1. **Local Machine**
2. **Place all certificates in the following store**
3. **Trusted Root Certification Authorities**

Complete the import.

You should end up with the root CA under:

`Local Computer → Trusted Root Certification Authorities`

This was the missing piece in my environment.

---

# 7. Check the Identity Server IIS Binding

Open **IIS Manager** and find the website for `sc104identityserver.dev.local`.

Open **Bindings...** and check the HTTPS binding.

For example:

```text
Type:        https
Port:        443
Hostname:    sc104identityserver.dev.local
Certificate: Identity Server SSL Certificate
```

Make sure the certificate selected in IIS is the same certificate being used by Identity Server.

---

# 8. Check the Certificate SAN/DNS Name

The Identity Server hostname must be covered by the certificate.

For example, if IIS uses:

`sc104identityserver.dev.local`

the certificate should contain a matching DNS name/SAN.

You can check this from the certificate under **Details → Subject Alternative Name**.

A hostname mismatch can cause HTTPS communication problems even when Identity Server appears to work correctly in the browser.

Make sure the same hostname is used across:

`Sitecore CM configuration → Identity Server URL → IIS hostname → Certificate SAN/DNS → Hosts file`

---

# 9. Check the Windows Hosts File

For a local environment, check:

`C:\Windows\System32\drivers\etc\hosts`

You may have:

```text
127.0.0.1    sc104cm.dev.local
127.0.0.1    sc104identityserver.dev.local
```

The exact IP address depends on your local setup.

The important part is that `sc104identityserver.dev.local` resolves to the expected machine and the same hostname is used everywhere else.

---

# 10. Check Private-Key Permissions

Private-key permissions are another possible cause of Identity Server certificate problems.

You can check the certificate through:

`certlm.msc → Personal → Certificates → Identity Server Certificate → All Tasks → Manage Private Keys`

If the certificate has a private key, verify that the Identity Server application pool has the required access.

However, this was **not the solution in my case**.

When I tried this approach, Windows showed:

`No key found for certificate!`

So I moved away from the private-key-permission troubleshooting path and investigated the certificate chain instead.

---

# 11. Restart IIS and Test Again

After making certificate, IIS, or Sitecore configuration changes, restart IIS:

`iisreset`

Then open:

`https://sc104cm.dev.local/sitecore`

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

---

# If It Still Doesn't Work

If the certificate-trust fix does not resolve the problem, check the **CM logs** rather than continuing to change certificates blindly.

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

If you see an error such as `IDX20803: Unable to obtain configuration`, investigate the CM → Identity Server connection and the Identity Server configuration rather than assuming the certificate is the cause.

You can also run Identity Server directly from its webroot to expose startup or runtime errors:

```powershell
dotnet .\Sitecore.IdentityServer.Host.dll
```

If Identity Server reports a startup or runtime error, resolve that issue before continuing with the CM redirect troubleshooting.

Similar Sitecore redirect issues can also come from configuration overrides or dependency/version mismatches, so check the actual error rather than applying the certificate fix blindly.

---

# Why This Happened in My WDP Installation

My environment was installed manually using **WDP packages**, without SIF or SIA.

The basic setup was already working:

- Sitecore CM was installed.
- Identity Server was installed.
- HTTPS was configured.
- `https://sc104identityserver.dev.local/` opened successfully.
- CM had the Identity Server authority configured.
- Identity Server had the expected CM/client configuration.

But `https://sc104cm.dev.local/sitecore` was not redirecting to Identity Server.

I checked the normal Sitecore configuration and the certificate private-key permissions first.

The issue turned out to be the **certificate chain**.

The root CA certificate used by the Identity Server certificate was not trusted correctly by the Local Machine certificate store.

After installing the root certificate under **Local Machine → Trusted Root Certification Authorities**, and verifying the IIS binding and hostname, the CM → Identity Server redirect started working.

That was the main reason I wanted to document this issue: **Identity Server worked directly in the browser, which made the certificate-trust problem easy to overlook.**

---

# Related Reading

If you are creating the local SSL certificates as part of a Sitecore setup, see **How to Create SSL Certificates for Sitecore Locally** for the certificate creation, certificate-store, IIS binding, and Sitecore configuration steps.

You can also refer to the original **Sitecore Stack Exchange discussion** for other possible causes and troubleshooting approaches related to CM → Identity Server redirect problems.

---

# Frequently Asked Questions

## Why is Sitecore CM not redirecting to Identity Server?

The cause can be Sitecore configuration, disabled authentication, certificate trust, certificate SAN/DNS mismatch, IIS binding, hostname resolution, or certificate permissions. In my environment, the issue was an untrusted root CA certificate.

## Why does Identity Server work directly but CM does not redirect?

Direct browser access does not guarantee that the CM-to-Identity Server authentication flow can establish a trusted HTTPS connection. Certificate trust, hostname, SAN/DNS, IIS binding, and Sitecore configuration can still affect the authentication flow.

## Where should the Identity Server root certificate be installed?

For the local Windows setup described in this article, install the root CA certificate under **Local Machine → Trusted Root Certification Authorities**.

## Do I need to export the Identity Server private key?

No. For the certificate-trust fix described here, export only the public root CA certificate as a `.cer` file.

## What should I check if Sitecore CM still does not redirect?

Check the CM configuration, Identity Server configuration, authentication settings, certificate trust, SAN/DNS, IIS binding, hosts file, private-key permissions, and CM logs.

---

# Conclusion

When **Sitecore CM login is not redirecting to Identity Server**, start with the configuration and connectivity basics before changing Sitecore settings randomly.

Check the Identity Server URL, CM and Identity Server configuration, authentication settings, certificate chain, SAN/DNS, IIS binding, hosts file, private-key permissions, and CM logs.

For my manually configured **Sitecore WDP installation**, the missing piece was **certificate-chain trust**. Installing the root CA certificate into **Local Machine → Trusted Root Certification Authorities**, then verifying the IIS binding and hostname, resolved the CM → Identity Server redirect problem.

If you're experiencing the same issue, **start with the Quick Fix at the top**. If that doesn't work, use the troubleshooting checklist to identify which part of the CM → Identity Server communication is failing.

## Related Links & Discussions

If you are troubleshooting Sitecore Identity Server or setting up a local Sitecore environment, these resources may also be useful:

* **Creating SSL Certificates for Sitecore Locally** — A practical guide covering local SSL certificate creation, certificate stores, IIS bindings, and Sitecore certificate configuration.
  [How to Create SSL Certificates for Sitecore Locally](https://sitecorehelphouse.wordpress.com/2025/07/29/how-to-create-ssl-certificates-for-sitecore-locally/?utm_source=chatgpt.com)

* **Original Sitecore Stack Exchange Question** — Community discussion covering different causes of Sitecore CM login not redirecting to Identity Server, including authentication configuration, certificate permissions, and SSL/hostname-related issues.
  [Sitecore CM Login Not Redirecting to Identity Server – Stack Exchange](https://sitecore.stackexchange.com/questions/32025/sitecore-cm-login-not-redirecting-to-identity-server?utm_source=chatgpt.com)

* **My Stack Exchange Answer** — The answer where I documented the certificate-chain trust fix described in this article: exporting the root/issuer certificate and installing it under the Local Machine Trusted Root Certification Authorities store.
  [My Stack Exchange Answer – Certificate Trust Fix](https://sitecore.stackexchange.com/questions/32025/sitecore-cm-login-not-redirecting-to-identity-server?utm_source=chatgpt.com)
