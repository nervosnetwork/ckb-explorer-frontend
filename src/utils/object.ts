export function pick<T extends any, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const newObj: Partial<Pick<T, K>> = {}
  keys.forEach(key => {
    newObj[key] = obj[key]
  })
  return newObj as Pick<T, K>
}

export function omit<T extends Record<any, any>, K extends keyof T>(obj: T, keys: K[]) {
  const newObj = {} as Omit<T, K>
  const newKeys = Object.keys(obj).filter(k => !keys.includes(k as K)) as Exclude<keyof T, K>[]
  newKeys.forEach(key => {
    if (obj[key] !== undefined) newObj[key] = obj[key]
  })
  return newObj
}
