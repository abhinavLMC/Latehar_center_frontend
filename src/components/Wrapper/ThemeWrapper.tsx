import { hexToRGBA } from "@utils/commonFunctions";
import { ConfigProvider } from "antd";
import Cookies from "js-cookie";
import React, { PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { login } from "src/store/slice/userSlice";

const ThemeWrapper = (props: PropsWithChildren<{}>) => {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.theme);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const username = Cookies.get("username");
      const role = Cookies.get("role");
      dispatch(login({ username, role }));
    }
  }, []);

  return (
    <ConfigProvider theme={theme}>
      <style jsx global>{`
        :root {
          --primary-color: ${theme.token?.colorPrimary};
          --primary-border-color: ${theme.token?.colorPrimary};
          --primary-outline-color: ${theme.token?.colorPrimary};
          --primary-bg-color-1: ${hexToRGBA( theme.token?.colorPrimary as string, 1 )};
          --primary-bg-color-2: ${hexToRGBA( theme.token?.colorPrimary as string, 0.3 )};
          --primary-bg-color-3: ${hexToRGBA( theme.token?.colorPrimary as string, 0.6 )};
          --primary-bg-color-4: ${hexToRGBA( theme.token?.colorPrimary as string, 0.08 )}; 
        }
      `}</style>
      {props.children}
    </ConfigProvider>
  );
};

export default ThemeWrapper;
