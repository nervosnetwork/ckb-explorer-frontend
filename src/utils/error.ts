export function assert(assertion: unknown, msg = 'assertion failed'): asserts assertion {
  if (!assertion) {
    throw new Error(msg)
  }
}
