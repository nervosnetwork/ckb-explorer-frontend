import { BehaviorSubject, Subscription, map, switchMap, timer } from 'rxjs'
import {
  BLOCKCHAIN_ALERT_POLLING_TIME,
  BLOCK_POLLING_TIME,
  FLUSH_CHART_CACHE_POLLING_TIME,
} from '../../constants/common'
import { APIReturn, apiFetcher } from './fetcher'
import { networkErrMsgs$ } from './requester'
import { CacheService, cacheService } from '../CacheService'

const initStatistics: APIReturn<'fetchStatistics'> = {
  tipBlockNumber: '0',
  averageBlockTime: '0',
  currentEpochDifficulty: '0',
  hashRate: '0',
  epochInfo: {
    epochNumber: '0',
    epochLength: '0',
    index: '0',
  },
  estimatedEpochTime: '0',
  transactionsLast24Hrs: '0',
  transactionsCountPerMinute: '0',
  reorgStartedAt: null,
}

class ExplorerService {
  api = apiFetcher

  // Here, we can use an `Observable` with `shareReplay` to automatically start the subscription.
  // However, in order to get the value from the Observable, we must subscribe to it.
  // This process usually makes the code asynchronous, and the Observable is a type that may have a null value,
  // so we need to do related logic, which will make the overall code design complex.
  // Therefore, we choose to implement it with a Subject here.
  latestStatistics$ = new BehaviorSubject<APIReturn<'fetchStatistics'>>(initStatistics)

  // Although the data is also available in latestStatistics$, it seems to have a longer caching time,
  // so another API is used here to obtain it separately.
  latestBlockNumber$ = new BehaviorSubject<number>(0)

  blockchainAlerts$ = new BehaviorSubject<string[]>([])

  networkErrMsgs$ = networkErrMsgs$

  private callbacksAtStop?: Subscription

  constructor(private cacheService: CacheService) {
    this.start()
  }

  start() {
    this.callbacksAtStop?.unsubscribe()
    this.callbacksAtStop = new Subscription()

    this.callbacksAtStop.add(
      timer(0, BLOCK_POLLING_TIME).pipe(switchMap(this.api.fetchStatistics)).subscribe(this.latestStatistics$),
    )

    this.callbacksAtStop.add(
      timer(0, BLOCK_POLLING_TIME)
        .pipe(
          switchMap(this.api.fetchTipBlockNumber),
          map(tipBlockNumber => Number(tipBlockNumber)),
        )
        .subscribe(this.latestBlockNumber$),
    )

    this.callbacksAtStop.add(
      timer(0, BLOCKCHAIN_ALERT_POLLING_TIME)
        .pipe(
          switchMap(this.api.fetchBlockchainInfo),
          map(wrapper => (wrapper?.attributes.blockchainInfo.alerts ?? []).map(alert => alert.message)),
        )
        .subscribe(this.blockchainAlerts$),
    )

    this.callbacksAtStop.add(
      timer(0, FLUSH_CHART_CACHE_POLLING_TIME)
        .pipe(
          switchMap(this.api.fetchFlushChartCache),
          map(({ flushCacheInfo }) => {
            if (flushCacheInfo.length === 0) return

            this.cacheService.clear()
          }),
        )
        .subscribe(),
    )
  }

  stop() {
    this.callbacksAtStop?.unsubscribe()
  }
}

export const explorerService = new ExplorerService(cacheService)

export * from './hooks'
export * from './types'
export type { APIFetcher, APIReturn, AggregateSearchResult } from './fetcher'
export { SearchResultType } from './fetcher'
