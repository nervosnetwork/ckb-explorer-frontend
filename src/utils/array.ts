export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

// https://fettblog.eu/typescript-array-includes/
export function includes<T extends U, U>(coll: readonly T[], el: U): el is T {
  return coll.includes(el as T)
}

export const BooleanT =
  <T>() =>
  (a: T | '' | 0 | 0n | false | null | undefined | void): a is T => {
    return Boolean(a)
  }
