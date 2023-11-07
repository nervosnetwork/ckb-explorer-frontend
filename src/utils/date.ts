import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import BigNumber from 'bignumber.js'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
import { useTranslation } from 'react-i18next'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.extend(utc)

dayjs.extend(weekday)
dayjs.extend(localeData)

export { dayjs }

export const formatData = (data: number) => (data < 10 ? `0${data}` : data)

export const parseSimpleDate = (timestamp: number | string) => {
  const date = new Date(Number(timestamp))
  return `${date.getFullYear()}/${formatData(date.getMonth() + 1)}/${formatData(date.getDate())} ${formatData(
    date.getHours(),
  )}:${formatData(date.getMinutes())}:${formatData(date.getSeconds())}`
}

export const parseSimpleDateNoSecond = (timestamp: number | string | Date, connector = '-', isMillisecond = true) => {
  const date = timestamp instanceof Date ? timestamp : new Date(Number(timestamp) * (isMillisecond ? 1 : 1000))
  return `${date.getFullYear()}${connector}${formatData(date.getMonth() + 1)}${connector}${formatData(
    date.getDate(),
  )} ${formatData(date.getHours())}:${formatData(date.getMinutes())}`
}

export const parseDiffDate = (startTime: number | string, endTime: number | string) => {
  const second = (Number(endTime) - Number(startTime)) / 1000
  if (second < 0) {
    throw Error('End timestamp must be bigger than start timestamp')
  }
  const hour = Math.floor((second / 3600) % 24)
  const day = Math.floor(second / 3600 / 24)
  return `${day} days ${hour} hrs`
}

export const parseTimeNoSecond = (millisecond: number | string) => {
  const second = Number(millisecond) / 1000
  const minute = Math.floor((second / 60) % 60)
  const hour = Math.floor(second / 3600)
  return `${hour} h ${minute} m`
}

export const parseDateNoTime = (timestamp: number | string | Date, noYear = false, connector = '/') => {
  const date = timestamp instanceof Date ? timestamp : new Date(Number(timestamp) * 1000)
  const year = noYear ? '' : `${date.getFullYear()}${connector}`
  return `${year}${formatData(date.getMonth() + 1)}${connector}${formatData(date.getDate())}`
}

export const useParseDate = () => {
  const { t } = useTranslation()
  return (timestamp: number | string, now = new Date().getTime()) => {
    const diff = (now - Number(timestamp)) / 1000
    if (diff < 60) {
      return `${Math.floor(diff)}${t('common.second_ago')}`
    }
    if (diff < 3600) {
      return `${Math.floor(diff / 60)}${t('common.minute')} ${Math.floor(diff % 60)}${t('common.second_ago')}`
    }
    return parseSimpleDate(timestamp)
  }
}

export const getCurrentYear = () => new Date().getFullYear()

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

export const parseHourFromMinute = (minutes: number | string) => {
  const num = typeof minutes === 'string' ? Number(minutes) : minutes
  return parseFloat((num / 60).toFixed(2))
}

export const parseHourFromMillisecond = (millisecond: string) => {
  const minutes = new BigNumber(millisecond).div(1000 * 60, 10).toNumber()
  return parseHourFromMinute(minutes)
}
