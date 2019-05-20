export interface Response<T> {
  data: T
  meta?: Meta
  error?: Error[]
}

export interface Error {
  id: string
  code: string
  status: number
  title: string
  detail: string
  href: string
}

export interface Meta {
  total: number
}
