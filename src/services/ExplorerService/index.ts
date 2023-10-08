import { BehaviorSubject, Subscription, map, switchMap, timer } from 'rxjs'
import { BLOCK_POLLING_TIME } from '../../constants/common'
import * as apiFetcher from './fetcher'

const initStatistics: State.Statistics = {
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
  latestStatistics$ = new BehaviorSubject<State.Statistics>(initStatistics)

  // Although the data is also available in latestStatistics$, it seems to have a longer caching time,
  // so another API is used here to obtain it separately.
  latestBlockNumber$ = new BehaviorSubject<number>(0)

  private callbacksAtStop?: Subscription

  constructor() {
    this.start()
  }

  start() {
    this.callbacksAtStop = new Subscription()
    this.callbacksAtStop.add(
      timer(0, BLOCK_POLLING_TIME)
        .pipe(
          switchMap(this.api.fetchStatistics),
          map(wrapper => wrapper.attributes),
        )
        .subscribe(this.latestStatistics$),
    )

    this.callbacksAtStop.add(
      timer(0, BLOCK_POLLING_TIME)
        .pipe(
          switchMap(this.api.fetchTipBlockNumber),
          map(wrapper => Number(wrapper.attributes.tipBlockNumber)),
        )
        .subscribe(this.latestBlockNumber$),
    )
  }

  stop() {
    this.callbacksAtStop?.unsubscribe()
  }
}

export const explorerService = new ExplorerService()

export * from './hooks'
export * from './types'
