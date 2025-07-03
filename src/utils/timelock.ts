import { parseSimpleDate } from './date'
import { parseSince } from './util'

export const getTimelock = (since: { raw: string; median_timestamp?: string | undefined } | undefined) => {
  let s
  try {
    if (since) {
      s = parseSince(since.raw)
      if (s && s.type === 'timestamp') {
        if (s.base === 'relative') {
          s.value = `${+s.value / 3600} Hrs`
        } else {
          s.value = parseSimpleDate(+s.value * 1000)
        }
      }
    }
  } catch {
    // ignore
  }
  return s
}
