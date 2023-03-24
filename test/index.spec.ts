import http from 'http'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import L from 'lodash'
import { funfetch } from '../src'
import app from './fixtures/app'

const normalize = (res) => {
  return L.omit(res, [
    'headers.date',
    'headers.etag',
    'headers.host',
    'body.headers.host',
  ])
}
export const client = (opts) => {
  const { post, get, del } = funfetch(opts)
  return {
    app: {
      queryString: get('/querystring'),
      queryStringDelete: del('/querystring'),
      status400WithMessage: post('/400-with-message'),
      status404: get('/404'),
      status404WithJson: get('/404-with-valid-json'),
      status404WithInvalidJson: get('/404-with-invalid-json'),
      status404WithError: get('/404-with-stripe-error'),
      delay: get('/delay'),
      users: get(({ userId }) => `/users/${userId}`),
      createUser: post(({ userId }) => `/users/${userId}`),
      postContent: post(`/post-content`),
    },
  }
}

describe('funfetch', () => {
  let server: any = null
  let serverAddr: string | null = null
  beforeAll(async () => {
    await new Promise((resolve, _reject) => {
      server = http.createServer(app as any).listen(() => {
        resolve(true)
      })
      serverAddr = `http://localhost:${server.address().port}`
    })
  })
  afterAll(() => {
    server.close()
  })
  it('full response', async () => {
    const c = client({
      base: serverAddr,
      baseOpts: {
        headers: {
          'User-Agent': 'funfetch/1.0',
        },
      },
      fullResponse: true,
      throwIfBadStatus: () => {},
    })

    expect(
      normalize(await c.app.queryString({ query: { hello: 'get query' } }))
    ).toMatchSnapshot('GET/queryString')

    expect(
      normalize(await c.app.queryStringDelete({ query: { prop: 'del query' } }))
    ).toMatchSnapshot('DELETE/queryString')

    expect(normalize(await c.app.status400WithMessage())).toMatchSnapshot(
      'POST/400 with message'
    )

    expect(normalize(await c.app.status404())).toMatchSnapshot('get/404')

    expect(normalize(await c.app.status404WithJson())).toMatchSnapshot(
      'get/404 with json'
    )

    try {
      expect(normalize(await c.app.status404WithInvalidJson())).toMatchSnapshot(
        'get/404 with invalid json'
      )
    } catch (err) {
      expect(err).toBeTruthy()
    }

    expect(normalize(await c.app.status404WithError())).toMatchSnapshot(
      'get/404 with invalid json'
    )

    expect(normalize(await c.app.delay())).toMatchSnapshot('get/delay')

    expect(
      normalize(await c.app.users({ params: { userId: 'id-22334' } }))
    ).toMatchSnapshot('get/users')

    expect(
      normalize(
        await c.app.createUser({
          params: { userId: 'id-22334' },
          data: { firstName: 'foo' },
        })
      )
    ).toMatchSnapshot('post/users')

    expect(normalize(await c.app.postContent())).toMatchSnapshot('post-content')
  })

  it('simple response: default throw status', async () => {
    const c = client({ base: serverAddr })

    try {
      await c.app.status400WithMessage()
      throw new Error('should not be here')
    } catch (e) {}
  })

  it('simple response', async () => {
    const c = client({ base: serverAddr, throwIfBadStatus: () => {} })

    expect(
      normalize(await c.app.queryString({ query: { hello: 'get query' } }))
    ).toMatchSnapshot('GET/queryString')

    expect(
      normalize(await c.app.queryStringDelete({ query: { prop: 'del query' } }))
    ).toMatchSnapshot('DELETE/queryString')

    expect(normalize(await c.app.status400WithMessage())).toMatchSnapshot(
      'POST/400 with message'
    )

    expect(normalize(await c.app.status404())).toMatchSnapshot('get/404')

    expect(normalize(await c.app.status404WithJson())).toMatchSnapshot(
      'get/404 with json'
    )

    try {
      expect(normalize(await c.app.status404WithInvalidJson())).toMatchSnapshot(
        'get/404 with invalid json'
      )
    } catch (err) {
      expect(err).toBeTruthy()
    }

    expect(normalize(await c.app.status404WithError())).toMatchSnapshot(
      'get/404 with invalid json'
    )

    expect(normalize(await c.app.delay())).toMatchSnapshot('get/delay')

    expect(
      normalize(await c.app.users({ params: { userId: 'id-22334' } }))
    ).toMatchSnapshot('get/delay')

    expect(normalize(await c.app.postContent())).toMatchSnapshot('post-content')
  })

  it('custom response handler', async () => {
    const c = client({
      base: serverAddr,
      responseHandler: (x) => x.statusText.toString(),
      throwIfBadStatus: () => {},
    })

    expect(
      await c.app.queryString({ query: { hello: 'get query' } })
    ).toMatchSnapshot('GET/queryString')
  })
})
