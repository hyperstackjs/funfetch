export const headersToObject = (headers: Headers) => {
  const acc: Record<string, string> = {}
  for (const p of headers.entries()) {
    acc[p[0]] = p[1]
  }
  return acc
}
