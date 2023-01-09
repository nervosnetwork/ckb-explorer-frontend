export function pick<T extends any, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const newObj: Partial<Pick<T, K>> = {}
  keys.forEach(key => {
    newObj[key] = obj[key]
  })
  return newObj as Pick<T, K>
}
