// eslint-disable-next-line import/named
import type { AxiosResponse } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface responseType {
  code: number
  message: string
  data: Record<string, unknown>
  status: 'success' | 'fail'

}

export interface dataResponse extends AxiosResponse {
  data: responseType
  message?: string
  status: number
}
export interface RolesType {
  _id: string
  app_access: string[]
  app_slug: string
  description: string
  name: string
  user_count: number
}
export interface ModuleType {
  _id: string
  app_slug: string
  slug: string
  name: string
}
export interface ActionType {
  _id: string
  app_slug: string
  slug: string
  name: string
  description: string
}
export interface RolePermissionType extends AxiosResponse {
  data: {
    results: {
      results: {
        data: RolesType[] | ModuleType[] | ActionType[]
      }
    }
  }
  message?: string
  status: number
}

// for serverSide req type
export interface reqType extends NextApiRequest {
  headers: Record<string, string>
  cookies: Record<string, string>
}

// for serverSide res type
export interface resType extends NextApiResponse {
  statusCode: number
}

export interface fileType {
  name?: string
  originFileObj?: fileType
  percent?: number
  size?: number
  status?: string
  type?: string
  uid?: string
  thumbUrl?: string
  original_name?: string
  fileId?: string
  originalImg?: string
}

export interface FormFields {
  [key: string]: unknown;
}