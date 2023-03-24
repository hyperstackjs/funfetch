import fetch from 'cross-fetch'
import createDebug from 'debug'
import type {
  Endpoint,
  EndpointData,
  Funfetch,
  MethodConfig,
  ParsedResponse,
  SimpleResponse,
} from './types'
import { createRequest } from './create-request'
import { headersToObject } from './utils'

export * from './types'

const debug = createDebug('funfetch')

const noop = (_res: ParsedResponse | SimpleResponse) => {}

const fullResponseJsonHandler = async (
  x: Response
): Promise<ParsedResponse> => {
  const { headers } = x
  const contentType = headers.get('Content-Type')
  if (contentType?.includes('application/json')) {
    return {
      body: await x.json(),
      status: x.status,
      headers: headersToObject(x.headers),
    }
  }
  return {
    body: await x.text(),
    status: x.status,
    headers: headersToObject(x.headers),
  }
}
const simpleResponseJsonHandler = async (
  x: Response
): Promise<SimpleResponse> => {
  const { headers } = x
  const contentType = headers.get('Content-Type')
  if (contentType?.includes('application/json')) {
    return await x.json()
  }
  return await x.text()
}

const throwIfBadStatus = (response: Response) => {
  if (response.status >= 400 && response.status < 600) {
    throw new Error(JSON.stringify(response))
  }
}

export const createMethod =
  (method: string, config?: MethodConfig) =>
  <TParams, TData, TQuery, TRes>(
    ep: string | ((params: TParams | any) => string)
  ): Endpoint<TParams, TData, TQuery, TRes> =>
  async ({
    params,
    data,
    query,
    opts,
  }: EndpointData<TParams, TData, TQuery> = {}): Promise<TRes> => {
    const fetcher = config?.fetch || fetch
    const req = createRequest<TParams, TData, TQuery>(
      { ep, config },
      { method, params, data, query, opts, baseOpts: config?.baseOpts }
    )
    debug('request: %j', req)
    const res = await fetcher(req.url, {
      method: req.method,
      body: req.body,
      ...req.opts,
    })

    const throwIfBad = config?.throwIfBadStatus || throwIfBadStatus
    throwIfBad(res)

    const convertedResponse = await (
      config?.responseHandler ||
      (config?.fullResponse
        ? fullResponseJsonHandler
        : simpleResponseJsonHandler)
    )(res)

    // parsed response can be: ParsedResponse (full), string (text()), any (json())
    debug('response: %O', convertedResponse)

    const throwIfError = config?.throwIfError || noop
    throwIfError(convertedResponse)

    debug('done: (no errors)')
    return convertedResponse
  }

export const funfetch = (config: MethodConfig = {}): Funfetch => {
  return {
    post: createMethod('POST', config),
    get: createMethod('GET', config),
    put: createMethod('PUT', config),
    del: createMethod('DELETE', config),
  }
}
