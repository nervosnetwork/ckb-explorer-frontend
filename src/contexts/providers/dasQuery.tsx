import { createContext, FC, useCallback, useContext, useMemo, useRef } from 'react'
import { useQuery } from 'react-query'
import { v2AxiosIns } from '../../service/http/fetcher'
import { unique } from '../../utils/array'
import { throttle } from '../../utils/function'
import { pick } from '../../utils/object'

export type DASAccount = string

export type DASAccountMap = Record<string, DASAccount | null>

export interface DASQueryContextValue {
  getDASAccounts: (addresses: string[]) => Promise<DASAccountMap>
}

export const DASQueryContext = createContext<DASQueryContextValue>({
  getDASAccounts: async () => ({}),
})

interface PendingQuery {
  addresses: string[]
  handler: {
    resolve: (result: DASAccountMap) => void
    reject: (reason: unknown) => void
  }
}

async function fetchDASAccounts(addresses: string[]): Promise<DASAccountMap> {
  const { data } = await v2AxiosIns.post<Record<string, string>>('das_accounts', {
    addresses,
  })
  const dataWithNormalizeEmptyValue = Object.fromEntries(
    Object.entries(data).map(([addr, account]) => {
      return account === '' ? [addr, null] : [addr, account]
    }),
  )
  return dataWithNormalizeEmptyValue
}

export const DASQueryContextProvider: FC = ({ children }) => {
  const accountMap = useRef<DASAccountMap>({})
  const pendingQueries = useRef<PendingQuery[]>([])

  const processPendingQueries = useCallback(async () => {
    const queries = pendingQueries.current.splice(0)
    const addressesWithMissCache = unique(
      queries
        .map(({ addresses }) => addresses)
        .flat()
        .filter(addr => !(addr in accountMap.current)),
    )

    try {
      const newAccountMap = await fetchDASAccounts(addressesWithMissCache)
      Object.assign(accountMap.current, newAccountMap)
      queries.forEach(({ addresses, handler }) => {
        handler.resolve(pick(accountMap.current, addresses))
      })
    } catch (err) {
      queries.forEach(({ handler }) => {
        handler.reject(err)
      })
    }
  }, [])

  const throttledProcessPendingQueries = useMemo(
    () =>
      throttle(processPendingQueries, 1000, {
        trailing: true,
      }),
    [processPendingQueries],
  )

  const getDASAccounts: DASQueryContextValue['getDASAccounts'] = useCallback(
    addresses => {
      return new Promise((resolve, reject) => {
        const addressesWithUnique = unique(addresses)
        const fullCacheHit = addressesWithUnique.every(addr => addr in accountMap.current)
        if (fullCacheHit) {
          resolve(pick(accountMap.current, addressesWithUnique))
          return
        }

        pendingQueries.current.push({
          addresses,
          handler: {
            resolve,
            reject,
          },
        })
        throttledProcessPendingQueries()
      })
    },
    [throttledProcessPendingQueries],
  )

  return <DASQueryContext.Provider value={{ getDASAccounts }}>{children}</DASQueryContext.Provider>
}

export function useDASAccount(address: string): DASAccount | null {
  const { getDASAccounts } = useContext(DASQueryContext)

  const { data } = useQuery(['getDASAccount', address], async () => {
    if (address === '') return null

    const map = await getDASAccounts([address])
    return map[address]
  })

  return data ?? null
}
