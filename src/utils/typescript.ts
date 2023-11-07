export type MutexAttr<T1 extends Object, T2 extends Object> =
  | ({
      [K1 in keyof T1]: T1[K1]
    } & {
      [K2 in keyof T2]?: never
    })
  | ({
      [K1 in keyof T1]?: never
    } & {
      [K2 in keyof T2]: T2[K2]
    })
