import { postRequest } from "@api/preference/RequestService";
import { useState } from "react";
import Cookies from "js-cookie";
import { login } from "src/store/slice/userSlice";
import { useDispatch } from "react-redux";
import Router from "next/router";
import { HOME_PAGE_ROUTE, LOCAL_FORAGE_PERMISSION_KEY, LOGIN_URL_ROUTE } from "@constants/AppConstant";
import Toast from "@components/Common/Toast";
import localforage from "localforage";
interface Permissionmetadata {
  page_name: string;
  permission_type: string[];
}

interface PermissionType {
  id: string;
  Permissionmetadata: Permissionmetadata[];
  permission_name: string;
}
  /**
   * all same page_name value will be merged with a unique array
   * @param arrays: Permissionmetadata[]
   * @returns object: Permissionmetadata
   */
  function mergeArrays(arrays: Permissionmetadata[]) {
    const merged: { [key: string]: string[] } = {};
    arrays.forEach((item) => {
      const { page_name, permission_type } = item;
      if (merged.hasOwnProperty(page_name)) {
        merged[page_name].push(...permission_type);
        merged[page_name] = [...new Set(merged[page_name])];
      } else {
        merged[page_name] = permission_type.slice();
      }
    });
    return merged;
  }

export const useLoginHandler = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

  const submitHandler = async (values: { [key: string]: unknown }) => {
    setLoading(true)
    try {
      const ENDPOINT =  `/api/login`
      const res = await postRequest(ENDPOINT, values)
      if (res.data.status) {
        const result = res.data.data;
        
        // set first time for redux on page refresh the below code will not track
        dispatch(login(res.data.data));
        
        Cookies.set("username", res.data.data.username as string)

        const permissionsArray = (
          result.permission as PermissionType
        ).Permissionmetadata.map((item: Permissionmetadata) => ({
          page_name: item.page_name,
          permission_type: item.permission_type || [],
        })).flat();

        const finalPermissions = mergeArrays(
          permissionsArray as Permissionmetadata[]
        );

        // store the permission at login time
        localforage.setItem(LOCAL_FORAGE_PERMISSION_KEY, finalPermissions);

        // token will be set based on configures to the cookie
        Cookies.set("center_token", res.data.data.token as string);
        Router.replace(HOME_PAGE_ROUTE)
      } else {
        Toast('error', '', res.data.message)
      }
    } catch (err) {

    } finally {
      setLoading(false)
    }
  };

  return {
    loading,
    submit: submitHandler
  }
}

export const logoutFunc = () => {
        Router.replace(LOGIN_URL_ROUTE)
        Cookies.remove("center_token");
        Cookies.remove('username')
        Cookies.remove('role')
}
// basically logout handler will be cleared all cookies information
export const useLogoutHandler = () => {
    const dispatch = useDispatch()
    const logout = () => {
        logoutFunc()
        dispatch(login({}))
    }
    return {
        logout
    }

}