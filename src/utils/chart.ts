import BigNumber from 'bignumber.js'

export const DATA_ZOOM_CONFIG = [
  {
    show: true,
    realtime: true,
    start: 0,
    end: 100,
    xAxisIndex: [0],
  },
  {
    type: 'inside',
    realtime: true,
    start: 0,
    end: 100,
    xAxisIndex: [0],
  },
]

export const parseNumericAbbr = (value: BigNumber | string | number, decimal?: number, hideZero?: boolean) => {
  const bigValue = typeof value === 'string' || typeof value === 'number' ? new BigNumber(value) : value
  if (bigValue.isNaN() || bigValue.isZero()) return '0'
  const kv = bigValue.dividedBy(1000)
  const mv = kv.dividedBy(1000)
  const bv = mv.dividedBy(1000)
  const tv = bv.dividedBy(1000)

  if (tv.isGreaterThanOrEqualTo(1)) {
    return `${decimal !== undefined ? tv.toFixed(decimal) : tv.toFixed()}T`
  }
  if (bv.isGreaterThanOrEqualTo(1)) {
    return `${decimal !== undefined ? bv.toFixed(decimal) : bv.toFixed()}B`
  }
  if (mv.isGreaterThanOrEqualTo(1)) {
    return `${decimal !== undefined ? mv.toFixed(decimal) : mv.toFixed()}M`
  }
  if (kv.isGreaterThanOrEqualTo(1)) {
    return `${decimal !== undefined ? kv.toFixed(decimal) : kv.toFixed()}K`
  }
  return `${decimal && !hideZero ? bigValue.toFixed(decimal) : bigValue.toFixed()}`
}

export const handleAxis = (value: BigNumber | string | number, decimal?: number, hideZero?: boolean) => {
  const bigValue = typeof value === 'string' || typeof value === 'number' ? new BigNumber(value) : value
  if (bigValue.isNaN() || bigValue.isZero()) return '0'
  const kv = bigValue.dividedBy(1000)
  const mv = kv.dividedBy(1000)
  const gv = mv.dividedBy(1000)
  const tv = gv.dividedBy(1000)
  const pv = tv.dividedBy(1000)
  const ev = pv.dividedBy(1000)
  const zv = ev.dividedBy(1000)
  const yv = zv.dividedBy(1000)

  if (yv.isGreaterThanOrEqualTo(1)) {
    return `${decimal !== undefined ? yv.toFixed(decimal) : yv.toFixed()}Y`
  }
  if (zv.isGreaterThanOrEqualTo(1)) {
    return `${decimal !== undefined ? zv.toFixed(decimal) : zv.toFixed()}Z`
  }
  if (ev.isGreaterThanOrEqualTo(1)) {
    return `${decimal !== undefined ? ev.toFixed(decimal) : ev.toFixed()}E`
  }
  if (pv.isGreaterThanOrEqualTo(1)) {
    return `${decimal !== undefined ? pv.toFixed(decimal) : pv.toFixed()}P`
  }
  if (tv.isGreaterThanOrEqualTo(1)) {
    return `${decimal !== undefined ? tv.toFixed(decimal) : tv.toFixed()}T`
  }
  if (gv.isGreaterThanOrEqualTo(1)) {
    return `${decimal !== undefined ? gv.toFixed(decimal) : gv.toFixed()}G`
  }
  if (mv.isGreaterThanOrEqualTo(1)) {
    return `${decimal !== undefined ? mv.toFixed(decimal) : mv.toFixed()}M`
  }
  if (kv.isGreaterThanOrEqualTo(1)) {
    return `${decimal !== undefined ? kv.toFixed(decimal) : kv.toFixed()}K`
  }
  return `${decimal && !hideZero ? bigValue.toFixed(decimal) : bigValue.toFixed()}`
}

export const handleLogGroupAxis = (value: BigNumber | string | number, suffix?: string) => {
  const bigValue = typeof value === 'string' || typeof value === 'number' ? new BigNumber(value) : value
  return `[${bigValue.isGreaterThanOrEqualTo(1000) ? handleAxis(bigValue.dividedBy(10), 0) : '0'}, ${handleAxis(
    value,
    0,
  )}${suffix || ''}]`
}

export const handleStepGroupAxis = (value: BigNumber | string | number, step?: number, suffix?: string) => {
  const bigValue = typeof value === 'string' || typeof value === 'number' ? new BigNumber(value) : value
  return `[${bigValue.minus(step || 100)}, ${value}${suffix || ''}]`
}

export const parseInterval = (max: number, min: number) => {
  const count = 20
  const interval = (max - min) / count
  const { length } = Math.ceil(interval).toString()
  const factor = 10 ** (length > 2 ? length - 2 : 0)
  return (Math.ceil(interval / factor) + 1) * factor
}

// This is a hotfix to avoid outliers in production environment, final algorithm will be decided later at
// https://github.com/Magickbase/ckb-explorer-public-issues/issues/394
// TODO: add tests for the sample function
export const getFeeRateSamples = (feeRates: Array<FeeRateTracker.TransactionFeeRate>, TPM: number) => {
  if (feeRates.length === 0) return feeRates

  const SAMPLES_MIN_COUNT = 100

  const sampleCount = Math.max(SAMPLES_MIN_COUNT, Number.isNaN(TPM) ? 0 : Math.floor(TPM) * 10)

  const samples = feeRates
    .filter(i => i.confirmationTime)
    .sort((a, b) => a.confirmationTime - b.confirmationTime)
    .reduce<Array<FeeRateTracker.TransactionFeeRate>>((acc, cur) => {
      const last = acc[acc.length - 1]
      if (!last || last.feeRate >= cur.feeRate) {
        return [...acc, cur]
      }
      return acc
    }, [])
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, sampleCount)

  return samples
}
