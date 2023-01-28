import { AxiosError } from 'axios'

export function assert(assertion: unknown, msg = 'assertion failed'): asserts assertion {
  if (!assertion) {
    throw new Error(msg)
  }
}

export function isAxiosError<T = any>(err: unknown): err is AxiosError<T> {
  return err && typeof err === 'object' && (err as any).isAxiosError
}
