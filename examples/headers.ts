/* eslint-disable no-console */
// on CLI/node:
// $ yarn ts-node examples/basic-auth.ts

import { funfetch } from '../src'

const { get } = funfetch({
  baseOpts: {
    headers: {
      'User-Agent': 'foobar',
    },
  },
})

const ok = get('https://postman-echo.com/get')

const main = async () => {
  console.log('fetching...')
  console.log('ok', await ok())
}
main()
