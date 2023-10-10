import { useObservableState } from 'observable-hooks'
import { explorerService } from '.'

export function useStatistics() {
  return useObservableState(explorerService.latestStatistics$)
}

export function useLatestBlockNumber() {
  return useObservableState(explorerService.latestBlockNumber$)
}
