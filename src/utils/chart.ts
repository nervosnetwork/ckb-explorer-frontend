import BigNumber from 'bignumber.js'
import { EChartOption } from 'echarts'
import { ChartColor } from '../constants/common'
import { SeriesItem } from '../pages/StatisticsChart/common'
import type { FeeRateTracker } from '../services/ExplorerService'

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
export const getFeeRateSamples = (feeRates: FeeRateTracker.TransactionFeeRate[], TPM: number, avgBlockTime = 12) => {
  if (feeRates.length === 0) return feeRates

  const SAMPLES_MIN_COUNT = 100

  const sampleCount = Math.max(SAMPLES_MIN_COUNT, Number.isNaN(TPM) ? 0 : Math.floor(TPM) * 10)
  const validSamples = feeRates.filter(i => i.confirmationTime).sort((a, b) => a.feeRate - b.feeRate)

  // check if lowest fee rate has ideal confirmation time
  const lowests = validSamples.slice(0, SAMPLES_MIN_COUNT)
  const avgOfLowests = lowests.reduce((acc, cur) => acc + cur.confirmationTime, 0) / validSamples.length

  const ACCEPTABLE_CONFIRMATION_TIME = 2 * avgBlockTime

  if (avgOfLowests <= ACCEPTABLE_CONFIRMATION_TIME) {
    return lowests
  }

  // if lowest fee rate doesn't hit acceptable confirmation time, sample by iqrs

  // Calculate the first and third quartiles (Q1 and Q3)
  const q1Index = Math.floor(validSamples.length * 0.25)
  const q3Index = Math.floor(validSamples.length * 0.75)
  const q1 = validSamples[q1Index].feeRate
  const q3 = validSamples[q3Index].feeRate

  // Calculate the Interquartile Range (IQR)
  const iqr = q3 - q1
  // // Define the lower and upper bounds for outliers
  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr

  // Filter out the outliers
  const filteredData = validSamples.filter(item => item.feeRate >= lowerBound && item.feeRate <= upperBound)

  const samples = filteredData
    .sort((a, b) => a.confirmationTime - b.confirmationTime)
    .reduce<FeeRateTracker.TransactionFeeRate[]>((acc, cur) => {
      const last = acc[acc.length - 1]
      if (!last || last.feeRate + 1.5 * iqr >= cur.feeRate) {
        return [...acc, cur]
      }
      return acc
    }, [])
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, sampleCount)

  return samples
}

export function assertIsArray<T>(value: T | T[]): asserts value is T[] {
  if (!Array.isArray(value)) {
    throw new Error(`Value is expected to be an array, but got a ${typeof value}`)
  }
}

export function assertNotArray<T>(value: T | T[]): asserts value is T {
  if (Array.isArray(value)) {
    throw new Error('value should not be an array')
  }
}

type AssertSerialsItem = (value: EChartOption.Tooltip.Format) => asserts value is SeriesItem
export const assertSerialsItem: AssertSerialsItem = (value: EChartOption.Tooltip.Format) => {
  if (
    typeof value.seriesName !== 'string' ||
    typeof value.name !== 'string' ||
    typeof value.color !== 'string' ||
    typeof value.dataIndex !== 'number'
  ) {
    throw new Error('invalid SeriesItem')
  }
}

export const assertSerialsDataIsString: (value: EChartOption.Tooltip.Format) => asserts value is { data: string } = (
  value: EChartOption.Tooltip.Format,
) => {
  if (typeof value.data !== 'string') {
    throw new Error(`Value is expected to be an string, but got a ${typeof value.data}`)
  }
}

export const assertSerialsDataIsStringArrayOf3: (
  value: EChartOption.Tooltip.Format,
) => asserts value is { data: [string, string, string] } = (value: EChartOption.Tooltip.Format) => {
  if (!Array.isArray(value.data) || value.data.length !== 3 || !value.data.every(item => typeof item === 'string')) {
    throw new Error('invalid SeriesItem length of 3')
  }
}
export const assertSerialsDataIsStringArrayOf4: (
  value: EChartOption.Tooltip.Format,
) => asserts value is { data: [string, string, string, string] } = (value: EChartOption.Tooltip.Format) => {
  if (!Array.isArray(value.data) || value.data.length !== 4 || !value.data.every(item => typeof item === 'string')) {
    throw new Error('invalid SeriesItem length of 4')
  }
}

export const assertSerialsDataIsStringArrayOf10: (value: EChartOption.Tooltip.Format) => asserts value is {
  data: [string, string, string, string, string, string, string, string, string, string]
} = (value: EChartOption.Tooltip.Format) => {
  if (!Array.isArray(value.data) || value.data.length !== 10 || !value.data.every(item => typeof item === 'string')) {
    throw new Error('invalid SeriesItem length of 10')
  }
}

const BASE_COLORS = [
  ...ChartColor.colors.slice(0, 2),
  '#FF5733',
  '#FFC300',
  '#DAF7A6',
  '#33FF57',
  '#33C1FF',
  '#8A33FF',
  '#FF33A8',
  '#FF33F6',
  '#FF8C33',
  '#FFE733',
]

export const variantColors = (count: number, baseColors: string[] = BASE_COLORS) => {
  // Helper function to adjust brightness
  function adjustColor(color: string, factor: number) {
    const hex = color.replace('#', '')
    const r = Math.min(255, Math.max(0, parseInt(hex.substring(0, 2), 16) + factor))
    const g = Math.min(255, Math.max(0, parseInt(hex.substring(2, 4), 16) + factor))
    const b = Math.min(255, Math.max(0, parseInt(hex.substring(4, 6), 16) + factor))
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  const colors = []
  let variantIndex = 0

  for (let i = 0; i < count; i++) {
    const baseColor = baseColors[i % baseColors.length]
    let adjustmentFactor = 0
    if (variantIndex % 3 === 1) {
      adjustmentFactor = 30
    } else if (variantIndex % 3 === 2) {
      variantIndex = -30
    }
    colors.push(adjustColor(baseColor, adjustmentFactor))
    if ((i + 1) % baseColors.length === 0) {
      variantIndex++
    }
  }

  return colors
}
