import { BooleanT } from '../../utils/array'

export const NAMESPACE_PS = 'ps'

export const KEY_DATA_VERSION = `${NAMESPACE_PS}_dataVersion`

export class PersistenceService {
  oldDataVersion = this.get<string>(KEY_DATA_VERSION)

  currentDataVersion = '1'

  dataVersionChanged = this.oldDataVersion !== this.currentDataVersion

  constructor() {
    this.handleDataMigration()
    this.set<string>(KEY_DATA_VERSION, this.currentDataVersion)
  }

  handleDataMigration() {
    if (!this.dataVersionChanged) return

    switch (this.oldDataVersion) {
      case null:
      case undefined:
        localStorage.clear()
        break

      default:
        break
    }
  }

  get<T = unknown>(key: string): T | undefined
  get<T = unknown>(key: string, defaultValue: T): T
  get<T = unknown>(key: string, defaultValue?: T): T | undefined {
    const jsonStr = localStorage.getItem(key)
    if (!jsonStr) return defaultValue
    try {
      return JSON.parse(jsonStr) as T
    } catch (err) {
      // Here, it can only be a serialization error, which should be treated as data corruption that cannot be auto fixed.
      // Swallowing this error should have no impact.
      return defaultValue
    }
  }

  set<T = unknown>(key: string, value: T): T {
    localStorage.setItem(key, JSON.stringify(value))
    return value
  }

  remove(key: string): void {
    localStorage.removeItem(key)
  }

  getAllKeys() {
    return new Array(localStorage.length)
      .fill(null)
      .map((_, idx) => localStorage.key(idx))
      .filter(BooleanT())
  }

  // TODO: Consider providing a change event or changeEvent$.
}

export const persistenceService = new PersistenceService()
