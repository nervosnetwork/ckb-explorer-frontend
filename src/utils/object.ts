export function pick<T extends any, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const newObj: Partial<Pick<T, K>> = {}
  keys.forEach(key => {
    newObj[key] = obj[key]
  })
  return newObj as Pick<T, K>
}

export function omit<T extends Record<any, any>, U extends keyof T>(obj: T, keys: U[]): Omit<T, U> {
  const newObj = { ...obj }
  keys.forEach(key => {
    delete newObj[key]
  })
  return newObj
}
