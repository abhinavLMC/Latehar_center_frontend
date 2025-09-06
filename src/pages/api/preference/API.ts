import Toast from '@components/Common/Toast'
import { ALL_API_OBJECT } from '@constants/ApiConstant'
import axios from 'axios'
import { logoutFunc } from 'src/hook/useAuth'


export const API = axios.create()
let callOnce = 0

interface MyErrorType {
  code?: string
  response?: {
    status: number
    data?: {}
    error?: boolean
    message?: string
  }
}

API.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/require-await
  async (req) => {
    req.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    req.headers.Pragma = 'no-cache'
    req.headers.Expires = 0
    req.headers['Content-Type'] = 'application/json',
    req.headers['Endpoint'] = !!req && ALL_API_OBJECT[(req.url as string).replace('/api/', '')];
    req.maxContentLength = Infinity; 
    req.maxBodyLength = Infinity;
    return req
  },
  async (err) => await Promise.reject(err)
)

// API response interceptor
API.interceptors.response.use(
  (res) => {
    return res
  },
  async (err: MyErrorType) => {
    if (typeof window !== 'undefined') {
      if (((err?.response?.status === 401) || (err?.response?.status === 403 ))) {
        callOnce = 1
        Toast('error', '', 'Your session has expired! Please Re-login.')
        logoutFunc()
      }
    }
    return await Promise.reject(err)
  }
)

export default API