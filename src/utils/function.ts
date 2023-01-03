export type ThrottledFunction<T extends (...args: any) => any, This extends any> = (
  this: This,
  ...args: Parameters<T>
) => Promise<{ isSkipped: true } | { isSkipped: false; result: ReturnType<T> }>

export function throttle<T extends (...args: any) => any, This extends any>(
  this: This,
  fn: T,
  wait: number,
  opts: {
    leading?: boolean
    trailing?: boolean
  } = {
    leading: true,
  },
): ThrottledFunction<T, This> {
  let throttling = false
  let prevPendingResolve: ((result: Awaited<ReturnType<ThrottledFunction<T, This>>>) => void) | null = null

  return function throttled(...args) {
    return new Promise(resolve => {
      if (throttling) {
        prevPendingResolve?.({
          isSkipped: true,
        })
        prevPendingResolve = resolve
        return
      }

      const onThrottleStart = () => {
        if (opts.leading) {
          resolve({
            isSkipped: false,
            result: fn.apply(this, args),
          })
        } else {
          prevPendingResolve = resolve
        }
      }

      const onThrottleEnd = () => {
        if (opts.trailing) {
          prevPendingResolve?.({
            isSkipped: false,
            result: fn.apply(this, args),
          })
        } else {
          prevPendingResolve?.({
            isSkipped: true,
          })
        }
        prevPendingResolve = null
      }

      throttling = true
      setTimeout(() => {
        throttling = false
        onThrottleEnd()
      }, wait)
      onThrottleStart()
    })
  }
}
