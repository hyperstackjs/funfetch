import isFunction from 'lodash/isFunction'
import { Headers } from 'cross-fetch'
import merge from 'lodash/merge'
import type { EndpointParams, RequestParams } from './types'
import { headersToObject } from './utils'

const buildUrl = <TQuery>(targetUrl: string, query: TQuery, base?: string) => {
  // use a dummy example.com to avoid an exception, and in order
  // to later manipulate params via a fully parsed URL
  const newUrl = new URL(targetUrl, base || 'http://example.com')
  if (query) {
    Object.entries(query).forEach(([k, v]: [string, any]) =>
      newUrl.searchParams.append(k, v)
    )
  }

  // not an absolute URL originally, no one supplied a base,
  // this means we need to strip 'example.com'
  if (!targetUrl.startsWith('http') && !base) {
    return newUrl.pathname + newUrl.search + newUrl.hash
  }
  return newUrl.toString()
}

export const createRequest = <TParams, TData, TQuery>(
  { ep, config }: EndpointParams,
  {
    method,
    params,
    data,
    query,
    baseOpts,
    opts,
  }: RequestParams<TParams, TData, TQuery>
) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  })
  if (config?.basic) {
    headers.set(
      'Authorization',
      `Basic ${btoa(`${config.basic.user}:${config.basic.password}`)}`
    )
  }
  if (config?.bearer) {
    headers.set('Authorization', `Bearer ${config.bearer}`)
  }

  const customopts: RequestInit = {}
  customopts.headers = headersToObject(headers)

  const producedUrl = isFunction(ep) ? ep(params) : ep
  const targetUrl = buildUrl(producedUrl, query, config?.base)

  return {
    url: targetUrl,
    body: data ? JSON.stringify(data) : undefined,
    method,
    opts: merge({}, baseOpts, customopts, opts),
  }
}
