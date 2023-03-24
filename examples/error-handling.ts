/* eslint-disable no-console */
// $ yarn ts-node examples/error-handling.ts

import type { ParsedResponse } from '../src'
import { funfetch } from '../src'

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
