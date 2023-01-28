export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

export const BooleanT =
  <T>() =>
  (a: T | '' | 0 | 0n | false | null | undefined | void): a is T => {
    return Boolean(a)
  }
