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

export default {
  storeCachedData,
  fetchCachedData,
}
