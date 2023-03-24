/* eslint-disable no-console */
// $ yarn ts-node examples/full-client.ts

import { funfetch } from '../src'
import type { DynamicEndpoint } from '../src'

class FancyService {
  list: DynamicEndpoint
  show: DynamicEndpoint
  update: DynamicEndpoint
  destroy: DynamicEndpoint

  constructor(api: string) {
    const { get, put, del } = funfetch({ base: api })
    const resource = ({ id }) => `/resource/${id}`
    this.list = get('/resource')
    this.show = get(resource)
    this.update = put(resource)
    this.destroy = del(resource)
  }
}

const main = async () => {
  // go here before running: https://beeceptor.com/console/funfetch
  console.log('visit before running: https://beeceptor.com/console/funfetch')
  console.log('fetching...')
  const api = new FancyService('https://funfetch.free.beeceptor.com')
  console.log('ok', await api.list())
  console.log('ok', await api.show({ params: { id: 1 } }))
  console.log(
    'ok',
    await api.update({ params: { id: 1 }, data: { hello: 'world' } })
  )
  console.log('ok', await api.destroy({ params: { id: 1 } }))
}
main()
