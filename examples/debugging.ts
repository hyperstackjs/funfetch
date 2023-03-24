/* eslint-disable no-console */
// on CLI/node:
// $ DEBUG=funfetch yarn ts-node examples/debugging.ts
//
// on browsers:
// (console) localStorage.debug='funfetch'
// then refresh

import type { ParsedResponse } from '../src'
import { funfetch } from '../'

const { get } = funfetch({
  fullResponse: true,
  throwIfBadStatus: (res) => {
    if (res.status === 404) {
      throw new Error('Hello from custom error')
    }
  },
  throwIfError: (res: ParsedResponse) => {
    if (res.body?.match && res.body?.match(/iana/)) {
      throw new Error('Hello from body matching error')
    }
  },
})

const ok = get('http://echo.jsontest.com/key/value/one/two')
const bad = get('http://github.com/404')
const lookForIana = get('http://example.com')

const main = async () => {
  console.log('fetching...')
  console.log('ok', await ok())
  try {
    await bad()
  } catch (e) {
    console.log('ERR', e)
  }
  try {
    await lookForIana()
  } catch (e) {
    console.log('ERR', e)
  }
}
main()
