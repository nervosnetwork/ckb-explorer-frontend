export const formatData = (data: number) => {
  return data < 10 ? `0${data}` : data
}

export const parseDate = (timestamp: number) => {
  const now = new Date().getTime()
  const diff = (now - timestamp) / 1000
  if (diff < 60) {
    return `${Math.floor(diff)} secs ago`
  }
  if (diff < 3600) {
    return `${Math.floor(diff / 60)} minutes ${Math.floor(diff % 60)} secs ago`
  }
  const date = new Date(timestamp)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${formatData(date.getHours())}:${formatData(
    date.getMinutes(),
  )}:${formatData(date.getSeconds())}`
}

export const parseSimpleDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${formatData(date.getHours())}:${formatData(
    date.getMinutes(),
  )}:${formatData(date.getSeconds())}`
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
    return `${Math.floor(hour)} h ${Math.floor(minute)} m ${second.toFixed(2)} s`
  }
  if (minute >= 1) {
    second %= 60
    return `${Math.floor(minute)} m ${second.toFixed(2)} s`
  }
  return `${second.toFixed(2)} s`
}

export default {
  parseDate,
  parseSimpleDate,
  getCurrentYear,
  parseTime,
}
