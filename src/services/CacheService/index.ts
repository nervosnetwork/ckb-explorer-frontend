import { ONE_DAY_MILLISECOND } from '../../constants/common'
import CONFIG from '../../config'
import { PersistenceService, persistenceService } from '../PersistenceService'
import { MutexAttr } from '../../utils/typescript'

export const NAMESPACE_CACHE = 'cache'

type ExpireOptions = MutexAttr<{ expireTime?: number }, { expireAt?: Date | number }>

type CacheOptions = ExpireOptions & {
  /**
   * The default value is false. If it is false, different cache keys will be created based on the current network type,
   * so the data cached on the mainnet and testnet will be different. If it is true, all networks will use the same key and data.
   */
  networkTypeAgnostic?: boolean
}

export interface CacheData<T = unknown> {
  expireAt?: number
  data: T
}

export class CacheService {
  constructor(private persistenceService: PersistenceService) {
    this.getAllKeys().forEach(key => this.removeIfExpired(key, this.persistenceService.get<CacheData<unknown>>(key)))
  }

  get<T = unknown>(key: string): T | undefined
  get<T = unknown>(key: string, defaultValue: T): T
  get<T = unknown>(key: string, defaultValue?: T): T | undefined {
    const keyInChain = `${NAMESPACE_CACHE}_${CONFIG.CHAIN_TYPE}_${key}`
    const cacheInChain = this.persistenceService.get<CacheData<T>>(keyInChain)
    if (cacheInChain != null && !this.removeIfExpired(keyInChain, cacheInChain)) {
      return cacheInChain.data
    }

    const keyAllChain = `${NAMESPACE_CACHE}_${key}`
    const cacheAllChain = this.persistenceService.get<CacheData<T>>(keyAllChain)
    if (cacheAllChain != null && !this.removeIfExpired(keyAllChain, cacheAllChain)) {
      return cacheAllChain.data
    }

    return defaultValue
  }

  set<T = unknown>(key: string, value: T, opts: CacheOptions = {}): boolean {
    const { expireTime = ONE_DAY_MILLISECOND * 7, expireAt, networkTypeAgnostic } = opts

    const keyPrefix = networkTypeAgnostic ? NAMESPACE_CACHE : `${NAMESPACE_CACHE}_${CONFIG.CHAIN_TYPE}`
    const finalKey = `${keyPrefix}_${key}`

    try {
      const opt: CacheData<T> = {
        expireAt: expireAt instanceof Date ? expireAt.getTime() : expireAt ?? Date.now() + expireTime,
        data: value,
      }
      if (opt.expireAt === Number.POSITIVE_INFINITY) {
        delete opt.expireAt
      }
      this.persistenceService.set<CacheData<T>>(finalKey, opt)
      return true
    } catch (err) {
      // Cache failure is acceptable, just swallow the error.
      // TODO: When there is not enough space, automatically remove old cache according to some rules.
      return false
    }
  }

  getAllKeys() {
    return this.persistenceService.getAllKeys().filter(key => key.startsWith(`${NAMESPACE_CACHE}_`))
  }

  clear() {
    this.getAllKeys().forEach(key => this.persistenceService.remove(key))
  }

  removeIfExpired(key: string, cacheData: CacheData<unknown> | undefined) {
    if (cacheData == null) return true
    if (cacheData.expireAt === undefined || cacheData.expireAt > Date.now()) return false

    this.persistenceService.remove(key)
    return true
  }
}

export const cacheService = new CacheService(persistenceService)
