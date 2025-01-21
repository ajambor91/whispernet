import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body style={{backgroundColor: "#14133b", maxHeight: '100vh', overflow: 'hidden'}}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
