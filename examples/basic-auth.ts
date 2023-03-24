/* eslint-disable no-console */
// on CLI/node:
// $ yarn ts-node examples/basic-auth.ts

import { funfetch } from '../src'

const { get } = funfetch({
  fullResponse: true,
  basic: { user: 'postman', password: 'password' },
})

const ok = get('https://postman-echo.com/basic-auth')

const main = async () => {
  console.log('fetching...')
  console.log('ok', await ok())
}
main()
