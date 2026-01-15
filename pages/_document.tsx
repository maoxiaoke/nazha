import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <Script
        id="clarity-script"
        strategy="afterInteractive"
      >
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "r1e18db9hh");
        `}
      </Script>
      <body className="dark">
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){var a=document.body.classList;a.remove("dark");var e=localStorage.getItem("theme");e?a.add(e.replace(/"/g,"")):window.matchMedia("(prefers-color-scheme: dark)").matches?a.add("dark"):a.add("light")}()`
          }}
        />

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
