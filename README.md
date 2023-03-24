# funfetch

A type-safe, fetch based, functional HTTP toolkit for building API clients quickly.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [funfetch](#funfetch)
  - [Features](#features)
  - [Quick Start](#quick-start)
  - [Examples](#examples)
    - [Full vs Simple Response](#full-vs-simple-response)
    - [Parameters, Data and Query](#parameters-data-and-query)
    - [Cache, Throttling, Retry, and More](#cache-throttling-retry-and-more)
    - [Bearer Token / JWT Auth](#bearer-token--jwt-auth)
    - [Basic Auth](#basic-auth)
    - [Custom Headers](#custom-headers)
    - [Error Handling](#error-handling)
    - [Debugging](#debugging)
  - [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features


* 🌍 **Universal:** works on browsers and node.js
* 🍰 **Functional:** use the whole thing, or pieces of it -- build your own mix
* 🦸‍♀️ **Developer first:** better developer experience for 3rd party APIs -- draw your routes, get your client
* 🦺 **Type safe:** Built type safe with Typescript
* 🍭 **Use case driven:** and not REST driven -- funfetch is designed to support many use cases and not just one paradigm
* 👟 **Make simple things easy** and run fast automatic JSON parsing, good defaults, great debugging story
* 🔌 **Extensible:** use your own response handler and error handler
* 👍 **Lightweight:** funfetch is actually a microframework, with a minimal set of dependencies
* 🔑 **BYOF**: bring your own fetch. Use the fetch abstraction you prefer -- we use a universal fetch implementation by default 

## Quick Start


```
$ pnpm add @hyperstackjs/funfetch
```

A quick network action:

```js
import { funfetch } from '@hyperstackjs/funfetch'
const { get } = funfetch()

// this function now represents the network call, can be reused, passed around
const callHome = get('/home')

// make the request
await callHome()
```

You can pass your network actions to a higher abstraction (a class) for better architecture and/or testing posture:

```js
import { funfetch } from '@hyperstackjs/funfetch'
const { get } = funfetch()
const httpResultFetcher = get("/results")

class Superclient{
    cache: null
    constructor(private fetchResults)
    async getResults(){
        if(!cache){
            const res = await this.fetchResults()
            this.cache = res
        }
    }
}
const client = new Superclient(httpResultFetcher)
```

Or just quickly shape your client using a dict like you want it:

```js
const createClient = ()=>{
    const {get, post} = funfetch()
    return {
        users: {
            create: post(({userId})=>`/users/${userId}`),
            list: get('/users')
        } 
    }
}

const client = createClient()
const res = await client.users.create({
    params: {userId: 'foobar'}, 
    data: {firstName: "Foo", lastName: "Bar"}
})
const res = await client.users.list()
```


## Running Examples in `examples/`

All of our examples are runnable, and you can go to [/examples](examples/) to try them out.

Some examples on the CLI (demos universal usage on `node`):

```bash
$ pnpm ts-node examples/jwt.ts
fetching...
ok {
  body: {
    args: {},
    headers: {
...
```

```bash
$ pnpm ts-node examples/parameters-and-data.ts
```

```bash
$ pnpm ts-node examples/headers.ts
```

```bash
$ pnpm ts-node examples/basic-auth.ts
```

For a `React` example (demo universal usage on the browser):

### Full vs Simple Response

By default, responses are just the body, JSON or otherwise are detected automatically. If you want a full response (status, body, headers), you can turn on a flag:

```js
const { get } = funfetch({
  fullResponse: true,
})
```


### Parameters, Data and Query

* `params` - URL / route parameters. Pass a function to any funfetch request creator and you'll get those as the function parameter (see `{ id }` below)
* `data` - will be POSTed
* `query` - a dictionary with key/value pairs that will turn into a properly escaped query string

```js
const ok = get(({ id }) => `https://postman-echo.com/get/?id=${id}`)
const send = post(`https://postman-echo.com/post`)

console.log(
'ok',
await ok({ params: { id: 1 }, query: { search: 'foobar' } })
)

// nicely ignores params because 'send' is not a function
console.log('ok', await send({ params: { id: 1 }, data: { hello: 'world' } }))
```


### Cache, Throttling, Retry, and More

We are by-design deferring these to other libraries, to be use in composition with funfetch. A great example is [react-query](https://react-query.tanstack.com/):

```js
const repoData = get('https://api.github.com/repos/tannerlinsley/react-query')
const { isLoading, error, data } = useQuery('repoData', repoData)
```


### Bearer Token / JWT Auth

Bearer and JWT auth are first-class and have a dedicated flag (`bearer`), set it to use:

```js
const { get } = funfetch({
  fullResponse: true,
  bearer: 'any-token',
})
```

### Basic Auth

```js
const { get } = funfetch({
  fullResponse: true,
  basic: { user: 'postman', password: 'password' },
})

const ok = get('https://postman-echo.com/basic-auth')
```


### Custom Headers

You can set anything that a proper node `Request` takes (`RequestInit` type) as a baseline for all requests, between those, headers:

```js
const { get } = funfetch({
  baseOpts: {
    headers: {
      'User-Agent': 'foobar'
    }
  },
})
```

### Error Handling

You can check for status code, and content:

```js
const { get } = funfetch({
  fullResponse: true,
  throwIfBadStatus: (res) => {
    if (res.status === 404) {
      throw new Error('Hello from custom error')
    }
  },
  throwIfError: (res) => {
    if (res.body.match && res.body.match(/iana/)) {
      throw new Error('Hello from body matching error')
    }
  },
})
```

### Debugging

For node:

```
$ DEBUG=funfetch yarn ts-node examples/debugging.ts
```

On browsers:
```
(console) localStorage.debug='funfetch'
```
And then refresh

```js
const { get } = funfetch({
  fullResponse: true,
  throwIfBadStatus: (res) => {
    if (res.status === 404) {
      throw new Error('Hello from custom error')
    }
  },
  throwIfError: (res) => {
    if (res.body.match && res.body.match(/iana/)) {
      throw new Error('Hello from body matching error')
    }
  },
})

const ok = get('http://echo.jsontest.com/key/value/one/two')
const bad = get('http://github.com/404')
const lookForIana = get('http://example.com')
```

## License

MIT
