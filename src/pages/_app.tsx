import "@scss/reset.scss";
import "@scss/ant-override.scss";
import "@scss/utility-class.scss";
import "@scss/_colors.scss";
import "@scss/globals.scss";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React from "react";
import { Provider } from "react-redux";
import { store } from "src/store";

import LayoutWrapper from "../components/Wrapper/LayoutWrapper";
import ThemeWrapper from "@components/Wrapper/ThemeWrapper";
import { LOGIN_URL_ROUTE } from "@constants/AppConstant";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const { asPath } = useRouter();

  // login_url_ROUTE is equal to '/auth/login'
  const loginURL = asPath === LOGIN_URL_ROUTE;

  return (
    <Provider store={store}>
      {loginURL ? (
        <ThemeWrapper>
          <Component {...pageProps} />
        </ThemeWrapper>
      ) : (
        <ThemeWrapper>
          <LayoutWrapper>
            <Component {...pageProps} />
          </LayoutWrapper>
        </ThemeWrapper>
      )}
    </Provider>
  );
}

export default MyApp;
