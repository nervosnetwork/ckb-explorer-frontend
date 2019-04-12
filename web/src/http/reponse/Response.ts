export interface Response<T> {
  type: string
  data: T
  status: number
  message: string
  error: Errors
}

export interface Error {
  id: string
  code: string
  status: number
  title: string
  detail: string
  href: string
}

export interface Errors {
  message: string
  errors: Error[]
}
