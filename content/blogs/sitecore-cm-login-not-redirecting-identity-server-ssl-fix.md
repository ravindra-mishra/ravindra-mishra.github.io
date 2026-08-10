---
title: Sitecore CM Login Not Redirecting to Identity Server? Troubleshooting Guide
description: Sitecore CM login not redirecting to Identity Server? Check
  certificate trust, IIS binding, hostname, SAN/DNS, authentication
  configuration, and logs with this practical troubleshooting guide.
keywords: Sitecore CM login not redirecting to Identity Server, Sitecore
  Identity Server troubleshooting, Sitecore Identity Server certificate trust,
  Sitecore Identity Server SSL, Sitecore WDP installation, Sitecore certificate
  SAN mismatch
metaDescription: Sitecore CM login not redirecting to Identity Server? Check
  certificate trust, IIS binding, hostname, SAN/DNS, authentication
  configuration, and logs with this practical troubleshooting guide.
featuredImage: /uploads/2026-08-10-19_42_58-certlm-certificates-local-computer_personal_certificates-.png
slug: sitecore-cm-login-not-redirecting-to-identity-server
date: August 10, 2026 6:58 PM
modifiedDate: August 10, 2026 6:58 PM
author: Ravindra Mishra
faq:
  - question: Why is Sitecore CM not redirecting to Identity Server?
    answer: The cause can be Sitecore configuration, disabled authentication,
      certificate trust, certificate SAN/DNS mismatch, IIS binding, hostname
      resolution, or certificate permissions. In my environment, the issue was
      an untrusted root certificate.
  - question: Why does Identity Server work directly but CM does not redirect?
    answer: Direct browser access does not guarantee that the CM-to-Identity Server
      authentication flow can establish a trusted HTTPS connection.
  - question: Where should the Identity Server root certificate be installed?
    answer: For the local Windows setup described here, install the root CA
      certificate under Local Machine > Trusted Root Certification Authorities.
  - question: Do I need to export the Identity Server private key?
    answer: No. For the certificate trust fix described here, export only the public
      root CA certificate as a .cer file.
  - question: What should I check if Sitecore CM still does not redirect?
    answer: Check the CM configuration, Identity Server configuration,
      authentication settings, certificate trust, SAN/DNS, IIS binding, hosts
      file, private-key permissions, and CM logs.
howto:
  name: Sitecore CM Login Not Redirecting to Identity Server? Troubleshooting Guide
  description: Troubleshoot Sitecore CM login redirect issues by checking
    certificate trust, IIS binding, hostname, authentication configuration, and
    related connectivity settings.
tags:
  - tag: sitecore
---
# Sitecore CM Login Not Redirecting to Identity Server? Troubleshooting Guide

If your **Sitecore CM login is not redirecting to Identity Server**, even though Identity Server itself opens correctly, the cause can be Sitecore configuration, authentication settings, SSL certificates, certificate trust, IIS bindings, or hostname configuration.

I ran into this issue while manually configuring Sitecore using **WDP packages without SIF or SIA**. The CM and Identity Server configuration looked correct, and Identity Server was accessible directly, but the Sitecore login page still did not redirect to Identity Server.

In my case, the problem was **certificate-chain trust**. The root CA certificate used by the Identity Server certificate was not trusted correctly in the Local Machine certificate store.

This guide gives you the fix first, followed by the troubleshooting checks and the details of what happened in my WDP installation.

## Assumptions

Before starting, I am assuming that:

Sitecore CM is already installed and accessible.
Sitecore Identity Server is already installed and configured.
The Identity Server SSL certificate has already been created and is being used by Identity Server.
The required Sitecore CM and Identity Server configuration is already in place.
The Identity Server hostname is configured consistently across Sitecore, IIS, the certificate SAN/DNS name, and the Windows hosts file.

For the examples in this article, I am using:

- Sitecore CM: `https://sc104cm.dev.local`
- Sitecore Identity Server: `https://sc104identityserver.dev.local/`

Your URLs will be different, but use the same Identity Server hostname consistently throughout your local setup.

- - -

## Quick Fix

If your Sitecore CM and Identity Server configurations are already correct, you can also try the fixes below.

### 1. Open the Local Machine certificate store

Press **Win + R** enter `certlm.msc`, and press **Enter**.

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

Next, verify the **HTTPS binding** for the Identity Server site in IIS. Make sure the binding is using HTTPS on port **443**, the hostname matches your Identity Server URL, and the correct SSL certificate is selected.


For example:


```text
Type:        https
Port:        443
Hostname:    sc104identityserver.dev.local
Certificate: Identity Server SSL Certificate
```

The hostname and certificate should match the Identity Server configuration you are using.

### 5. Verify the hostname

Make sure `sc104identityserver.dev.local` is used consistently in:

* Sitecore CM configuration
* Identity Server configuration
* IIS HTTPS binding
* Certificate SAN/DNS name
* Windows hosts file

### 6. Restart IIS

Run `iisreset` in the terminal to restart IIS and apply the changes. Then open `https://sc104cm.dev.local/sitecore` in your browser and try logging in again.

- - -

## Frequently Asked Questions

### Why is Sitecore CM not redirecting to Identity Server?

The cause can be Sitecore configuration, disabled authentication, certificate trust, certificate SAN/DNS mismatch, IIS binding, hostname resolution, or certificate permissions. In my environment, the issue was an untrusted root CA certificate.

### Why does Identity Server work directly but CM does not redirect?

Direct browser access does not guarantee that the CM-to-Identity Server authentication flow can establish a trusted HTTPS connection. Certificate trust, hostname, SAN/DNS, IIS binding, and Sitecore configuration can still affect the authentication flow.

### Where should the Identity Server root certificate be installed?

For the local Windows setup described in this article, install the root CA certificate under **Local Machine → Trusted Root Certification Authorities**.

### Do I need to export the Identity Server private key?

No. For the certificate-trust fix described here, export only the public root CA certificate as a `.cer` file.

### What should I check if Sitecore CM still does not redirect?

Check the CM configuration, Identity Server configuration, authentication settings, certificate trust, SAN/DNS, IIS binding, hosts file, private-key permissions, and CM logs.

- - -

## Conclusion

In this troubleshooting guide, we identified and fixed one specific issue: a certificate-chain trust problem between Sitecore CM and Identity Server. Installing the root CA certificate in the Local Machine → Trusted Root Certification Authorities store, along with verifying the IIS binding and hostname, resolved the redirect issue in our setup.

### Related Links & Discussions

If you are troubleshooting Sitecore Identity Server or setting up a local Sitecore environment, these resources may also be useful:

* [How to Create SSL Certificates for Sitecore Locally](https://sitecorehelphouse.wordpress.com/2025/07/29/how-to-create-ssl-certificates-for-sitecore-locally)
* [Sitecore CM Login Not Redirecting to Identity Server – Stack Exchange](https://sitecore.stackexchange.com/questions/32025/sitecore-cm-login-not-redirecting-to-identity-server)
* [My Stack Exchange Answer – Certificate Trust Fix](https://sitecore.stackexchange.com/questions/32025/sitecore-cm-login-not-redirecting-to-identity-server)