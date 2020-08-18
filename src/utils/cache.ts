import { getCSTTime } from './date'

export const storeCachedData = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const fetchCachedData = <T>(key: string): T | null => {
  const data: string | null = localStorage.getItem(key)
  if (data) {
    try {
      const object = JSON.parse(data) as T
      if (object) {
        return object
      }
    } catch (error) {
      console.error(error)
    }
  }
  return null
}

export const removeCachedData = (key: string) => {
  localStorage.removeItem(key)
}

export const storeDateChartCache = (key: string, value: any) => {
  // cacheKey format: key + & + CST timestamp
  let cacheKey = fetchCachedData<string>(key)
  // Detect stored data and if null, remove it
  if (cacheKey && fetchCachedData(cacheKey)) {
    localStorage.removeItem(cacheKey)
  }
  cacheKey = `${key}&${getCSTTime()}`
  storeCachedData(key, cacheKey)
  storeCachedData(cacheKey, value)
}

export const fetchDateChartCache = (key: string) => {
  // cacheKey format: key + & + CST timestamp
  const cacheKey = fetchCachedData<string>(key)
  if (!cacheKey) return null
  const storeTime = Number(cacheKey.substring(cacheKey.indexOf('&') + 1))
  const now = new Date(getCSTTime()) // current CST time
  // Chart data will be updated at 0:10(CST) every day
  const dataUpdateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 10, 0).getTime()
  // If last storage time is bigger than data update time, return cache data. Otherwise return null
  return storeTime > dataUpdateTime ? fetchCachedData(cacheKey) : null
}

export const storeEpochChartCache = (key: string, value: any) => {
  storeDateChartCache(key, value)
}

const ThreeHours = 3 * 60 * 60 * 1000
export const fetchEpochChartCache = (key: string) => {
  // cacheKey format: key + & + CST timestamp
  const cacheKey = fetchCachedData<string>(key)
  if (!cacheKey) return null
  const storeTime = Number(cacheKey.substring(cacheKey.indexOf('&') + 1))
  // If last storage time is bigger than data update time, return cache data. Otherwise return null
  return getCSTTime() - storeTime < ThreeHours ? fetchCachedData(cacheKey) : null
}

export default {
  storeCachedData,
  fetchCachedData,
  storeDateChartCache,
  fetchDateChartCache,
  storeEpochChartCache,
  fetchEpochChartCache,
}
