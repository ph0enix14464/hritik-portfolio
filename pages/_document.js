import { Html, Head, Main, NextScript } from 'next/document'
 
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="description" content="Hritik Jung Basnet — Cyber Security Professional, Network Security & SecOps" />
        <meta name="theme-color" content="#0a0e13" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}