import { parse } from 'uri-js'

export const lastPathOfUrl = (url: string) => {
  if (url) {
    const { path } = parse(url)
    if (path) {
      const paths: string[] = path.split('/')
      return paths[paths.length - 1]
    }
  }
  return undefined
}

export default {
  lastPathOfUrl,
}
