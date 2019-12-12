import i18n from './i18n'

export const formatData = (data: number) => {
  return data < 10 ? `0${data}` : data
}

export const parseSimpleDate = (timestamp: number | string) => {
  const date = new Date(Number(timestamp))
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${formatData(date.getHours())}:${formatData(
    date.getMinutes(),
  )}:${formatData(date.getSeconds())}`
}

export const parseSimpleDateNoSecond = (timestamp: number | string) => {
  const date = new Date(Number(timestamp))
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${formatData(date.getHours())}:${formatData(
    date.getMinutes(),
  )}`
}

export const parseDateNoTime = (timestamp: number | string) => {
  const date = new Date(Number(timestamp) * 1000)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

export const parseDate = (timestamp: number | string) => {
  const now = new Date().getTime()
  const diff = (now - Number(timestamp)) / 1000
  if (diff < 60) {
    return `${Math.floor(diff)} ${i18n.t('common.second_ago')}`
  }
  if (diff < 3600) {
    return `${Math.floor(diff / 60)} ${i18n.t('common.minute')} ${Math.floor(diff % 60)} ${i18n.t('common.second_ago')}`
  }
  return parseSimpleDate(timestamp)
}

export const getCurrentYear = () => {
  return new Date().getFullYear()
}

export const parseTime = (millisecond: number) => {
  let second = millisecond / 1000
  let minute = second / 60
  const hour = second / 3600

  if (hour >= 1) {
    minute %= 60
    second %= 60
    return `${Math.floor(hour)} h ${Math.floor(minute)} m ${second.toFixed(0)} s`
  }

  if (minute >= 1) {
    second %= 60
    return `${Math.floor(minute)} m ${second.toFixed(0)} s`
  }
  return `${second.toFixed(2)} s`
}

export default {
  parseDate,
  parseSimpleDate,
  getCurrentYear,
  parseTime,
}
