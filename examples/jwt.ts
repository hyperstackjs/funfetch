/* eslint-disable no-console */
// on CLI/node:
// $ yarn ts-node examples/jwt.ts

import { funfetch } from '../src'

const { get } = funfetch({
  fullResponse: true,
  bearer: 'any-token',
})

const ok = get('https://postman-echo.com/get')

const main = async () => {
  console.log('fetching...')
  console.log('ok', await ok())
}
main()
