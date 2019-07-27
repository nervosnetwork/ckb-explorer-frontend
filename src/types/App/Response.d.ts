declare namespace Response {
  export interface Response<T> {
    data: T
    meta?: Meta
    error?: Error[]
  }

  export interface Error {
    id: string
    code: number
    status: number
    title: string
    detail: string
    href: string
  }

  export interface Meta {
    total: number
    page_size: number
  }

  export interface Wrapper<T> {
    id: number
    type: string
    attributes: T
  }
}
