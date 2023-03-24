/* eslint-disable no-console */
// $ yarn ts-node examples/parameters-and-data.ts

import { funfetch } from '../src'

const { get, post } = funfetch({
  fullResponse: true,
})

const ok = get(({ id }) => `https://postman-echo.com/get/?id=${id}`)
const send = post(`https://postman-echo.com/post`)

const main = async () => {
  console.log('fetching...')
  console.log(
    'ok',
    await ok({ params: { id: 1 }, query: { search: 'foobar' } })
  )

  // nicely ignores params because 'send' is not a function
  console.log('ok', await send({ params: { id: 1 }, data: { hello: 'world' } }))
}
main()
