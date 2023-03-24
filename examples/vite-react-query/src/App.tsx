import React from 'react'
import ReactDOM from 'react-dom'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { funfetch } from 'funfetch'

const { get } = funfetch()
const repoData = get('https://api.github.com/repos/tannerlinsley/react-query')
const fourohfour = get('https://api.github.com/404')
const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
      <BadBehaving />
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  )
}

function BadBehaving() {
  const { isLoading, error, data } = useQuery(['fourohfour'], () =>
    fourohfour()
  ) as any

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>`An error has occurred: ${error.message}`</div>
  }

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  )
}

function Example() {
  const { isLoading, error, data } = useQuery(['repoData'], () =>
    repoData()
  ) as any

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>`An error has occurred: ${error.message}`</div>
  }

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
