import { postRequest } from '@api/preference/RequestService'
import Toast from '@components/Common/Toast'
import Router from 'next/router'
import { useState } from 'react'

// update handler for toggle switch function
export const useUpdateHandler = (endPoint:string)  => {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(false)
    const [data, setData] = useState<any>()

    const updateStatus = async (payload: any, callBack?: () => {}) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await postRequest(endPoint, payload);
            if (res.data.status) {
              setData(res.data.data)
              setStatus(true)
              Toast("success", "", res.data.message);
              callBack && callBack()
            } else {
              Toast("error", "", res.data.message);
            }
          } catch (err) {
            Toast("error", "", (err as Error).message);
          } finally {
            setLoading(false);
          }
    }

    

    return {
        data, loading, status, updateStatus
    }
}


/**
 * 
 * @param successToast : boolean default = false
 * @param failToast : boolean default = true
 *! @returns {data, status, buttonLoading, submit}
 */

export const usePostRequestHandler = (
  query?: { [key: string]: unknown } | null,
  successToast = true,
  failToast = true
) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [data, setData] = useState<any>();

  const submit = async (
    endPoint: string,
    payload?: { [key: string]: unknown },
    goBack?: string | null,
    callBack?: () => void
  ) => {
    if (buttonLoading) return;
    setButtonLoading(true);
    let response;
    try {
      const res = await postRequest(endPoint, query || payload || {});
      if (res.data.status) {
        setData(res.data.data);
        setStatus(true);
        
          
        successToast ? Toast("success", "", res.data.message) : null;
        goBack && Router.push(goBack);
        callBack && callBack();
        // added for get the data after submit
        response = res.data
      } else {
        const message = res.data.message;
        const msg = typeof message === "string" ? res.data.message : "Got some wrong error message";
        
        failToast ? Toast("error", "", msg) : null;
        response = res.data;
      }
    } catch (err) {
      Toast("error", "", (err as Error).message);
    } finally {
      setButtonLoading(false);
    }
    return response
  };

  return {
    data,
    status,
    buttonLoading,
    submit,
  };
};


/**
 * 
 * @param successToast : boolean default = false
 * @param failToast : boolean default = true
 *! @returns {data, status, loading, fetchData}
 */
export const useGetRequestHandler = (
  successToast = false,
  failToast = true
) => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);
  const [data, setData] = useState<any>();

  const fetchData = async (
    endPoint: string,
    payload?: { [key: string]: unknown },
  ) => {
    setLoading(true)
    try {
      const res = await postRequest(endPoint, payload || {});
      if (res.data.status) {
        setData(res.data.data);
        setStatus(true);
        successToast ? Toast("success", "", res.data.message) : null;
      } else {
        setData(null);
        failToast ? Toast("error", "", res?.data?.message?.length > 0 ? res?.data?.message : 'Something Went Wrong') : null;
        setStatus(res.data.status);
      }
    } catch (err) {
      Toast("error", "", (err as Error).message);
      setStatus(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    setLoading,
    status,
    fetchData,
  };
};