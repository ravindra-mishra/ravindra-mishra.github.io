import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Netlify Widget */}
          <Script
            strategy="afterInteractive" // Load after the page content is interactive
            src="https://identity.netlify.com/v1/netlify-identity-widget.js"
            async // Load asynchronously to avoid blocking page render
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
            as="style"
            type="text/css"
            crossOrigin="anonymous"
          />
          {/* Non-blocking Font Awesome for CWV; activate stylesheet after load. */}
          <link
            id="fa-stylesheet"
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
            media="print"
          />
          <noscript>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
            />
          </noscript>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){var l=document.getElementById("fa-stylesheet");if(!l)return;function a(){l.media="all"}l.addEventListener("load",a);if(l.sheet)a();})();`,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              if (window.netlifyIdentity) {
                window.netlifyIdentity.on("init", user => {
                  if (!user) {
                    window.netlifyIdentity.on("login", () => {
                      document.location.href = "/admin/";
                    });
                  }
                });
              }
          `,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
