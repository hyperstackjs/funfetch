import { describe, expect, it } from 'vitest'
import { createRequest } from '../src/create-request'

const ep1 = '/api/users'
const functionalEp = ({ company }) => `/api/${company}/listing`
describe('createRequest', () => {
  it('routes', async () => {
    expect(
      createRequest({ ep: ep1, config: {} }, { method: 'GET' })
    ).toMatchSnapshot('simple GET')
    expect(
      createRequest(
        {
          ep: 'https://api.github.com/repos/tannerlinsley/react-query',
          config: {},
        },
        { method: 'GET' }
      )
    ).toMatchSnapshot('absolute URL')
    expect(
      createRequest(
        { ep: ep1, config: {} },
        { method: 'GET', query: { page: 2 } }
      )
    ).toMatchSnapshot('simple GET with query')
    expect(
      createRequest(
        { ep: ep1, config: { base: 'http://microsoft.com' } },
        { method: 'GET', query: { page: 2 } }
      )
    ).toMatchSnapshot('base URL')
    expect(
      createRequest(
        { ep: functionalEp, config: {} },
        { method: 'GET', params: { company: 'microsoft' }, query: { page: 2 } }
      )
    ).toMatchSnapshot('functional endpoint')
    expect(
      createRequest(
        { ep: functionalEp, config: {} },
        {
          method: 'POST',
          data: { user: { name: 'bill' } },
          params: { company: 'microsoft' },
          query: { page: 2 },
        }
      )
    ).toMatchSnapshot('POST data')
    expect(
      createRequest(
        { ep: functionalEp, config: { bearer: 'magic-string' } },
        {
          method: 'POST',
          data: { user: { name: 'bill' } },
          params: { company: 'microsoft' },
          query: { page: 2 },
        }
      )
    ).toMatchSnapshot('use bearer token')
    expect(
      createRequest(
        { ep: functionalEp, config: { bearer: 'magic-string' } },
        {
          method: 'POST',
          data: { user: { name: 'bill' } },
          params: { company: 'microsoft' },
          query: { page: 2 },
          opts: { headers: { Authorization: 'Basic X' } },
        }
      )
    ).toMatchSnapshot('override base opts')
  })
})
