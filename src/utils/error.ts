import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { RequestError } from '../services/ExplorerService/requester'

export function assert(assertion: unknown, msg = 'assertion failed'): asserts assertion {
  if (!assertion) {
    throw new Error(msg)
  }
}

export function isRequestError<T = any>(err: unknown): err is RequestError<T> {
  return err && typeof err === 'object' && (err as any).isRequestError
}

export function initSentry(dsn: string) {
  Sentry.init({
    dsn,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1,
    // https://github.com/maslianok/react-resize-detector/issues/45
    // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
    ignoreErrors: ['ResizeObserver loop limit exceeded'],
  })
}

export function captureException(err: unknown): void {
  if (err == null) return

  if (!(err instanceof Error)) {
    const msg = typeof err === 'object' ? String((err as Record<string, unknown>).message) : String(err)
    // eslint-disable-next-line no-param-reassign
    err = new Error(msg)
  }

  Sentry.captureException(err)
}

export function listenUnhandledError(handler: (err: unknown) => void): () => void {
  const onError = (event: ErrorEvent) => handler(event.error ?? event)
  window.addEventListener('error', onError)
  const onUnhandledRejection = (event: PromiseRejectionEvent) => handler(event.reason)
  window.addEventListener('unhandledrejection', onUnhandledRejection)

  return () => {
    window.removeEventListener('error', onError)
    window.removeEventListener('unhandledrejection', onUnhandledRejection)
  }
}
