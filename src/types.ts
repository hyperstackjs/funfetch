export interface ParsedResponse {
  body: string | any
  status: number
  headers: Record<string, string>
}
export type SimpleResponse = string | any

export interface MethodConfig {
  bearer?: string
  basic?: { user: string; password: string }
  base?: string
  fetch?: any
  baseOpts?: RequestInit
  fullResponse?: boolean
  responseHandler?: (res: Response) => ParsedResponse | SimpleResponse
  throwIfBadStatus?: (res: Response) => void
  throwIfError?: (res: ParsedResponse | SimpleResponse) => void
}
export type Endpoint<TParams, TData, TQuery, TRes> = (
  data?: EndpointData<TParams, TData, TQuery>
) => Promise<TRes>

export type DynamicEndpoint = Endpoint<any, any, any, any>

export interface EndpointData<TParams, TData, TQuery> {
  params?: TParams | any
  data?: TData | any
  query?: TQuery | any
  opts?: RequestInit
}
export interface EndpointParams {
  ep: any
  config?: MethodConfig
}

export interface RequestParams<TParams, TData, TQuery> {
  method: string
  params?: TParams
  data?: TData
  query?: TQuery
  baseOpts?: RequestInit
  opts?: RequestInit
}

export interface Funfetch {
  post: <TParams, TData, TQuery, TRes>(
    ep: string | ((params: any) => string)
  ) => Endpoint<TParams, TData, TQuery, TRes>
  get: <TParams, TData, TQuery, TRes>(
    ep: string | ((params: any) => string)
  ) => Endpoint<TParams, TData, TQuery, TRes>
  put: <TParams, TData, TQuery, TRes>(
    ep: string | ((params: any) => string)
  ) => Endpoint<TParams, TData, TQuery, TRes>
  del: <TParams, TData, TQuery, TRes>(
    ep: string | ((params: any) => string)
  ) => Endpoint<TParams, TData, TQuery, TRes>
}
