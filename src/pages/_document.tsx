/*
This custom document is needed to workaround this bug in antd + nextjs:
    https://github.com/ant-design/ant-design/issues/38767
The actual fix -- i.e., this entire file -- comes from
    https://github.com/ant-design/ant-design/issues/38767#issuecomment-1350362026
which is for a different bug in antd + nextjs, but it happens to fix
the same problem, and fortunately also works with the older nextjs 12.x, which
we are currently stuck with.
See also the discussion at https://github.com/ant-design/ant-design/issues/39891
*/

import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import Document, { Html, Head, Main, NextScript } from "next/document";
// eslint-disable-next-line no-duplicate-imports
import type { DocumentContext, DocumentInitialProps } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const cache = createCache();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          (
            <StyleProvider cache={cache}>
              <App {...props} />
            </StyleProvider>
          ),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {/* This is hack, `extractStyle` does not currently support returning JSX or related data. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `</script>${extractStyle(cache)}<script>`,
            }}
          />
        </>
      ),
    };
  }
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
