import { fetchStatistics } from '../http/fetcher'
import { AppDispatch } from '../../contexts/reducer'
import { AppActions, PageActions } from '../../contexts/actions'
import { NEXT_HARD_FORK_EPOCH, EPOCH_HOURS } from '../../constants/common'
import { storeCachedData } from '../../utils/cache'
import { AppCachedKeys } from '../../constants/cache'
import { isMainnet as isMainnetFunc } from '../../utils/chain'

const isMainnet = isMainnetFunc()

export const getStatistics = (dispatch: AppDispatch) => {
  return fetchStatistics().then((wrapper: Response.Wrapper<State.Statistics> | null) => {
    if (wrapper) {
      dispatch({
        type: PageActions.UpdateStatistics,
        payload: {
          statistics: wrapper.attributes,
        },
      })
      if (isMainnet) {
        const { epochNumber, index, epochLength } = wrapper.attributes.epochInfo
        const hs = (NEXT_HARD_FORK_EPOCH - (+epochNumber + +index / +epochLength)) * EPOCH_HOURS * 60 * 60
        const hasFinishedHardFork = hs <= 0
        const hardForkInfo = {
          miranaHardForkSecondsLeft: Math.floor(hs),
          hasFinishedHardFork,
        }
        if (hasFinishedHardFork && !localStorage.get(AppCachedKeys.NewAddrFormat)) {
          localStorage.set(AppCachedKeys.NewAddrFormat, 'true')
        }
        storeCachedData(AppCachedKeys.HardForkInfo, hardForkInfo)
        dispatch({
          type: AppActions.UpdateHardForkStatus,
          payload: hardForkInfo,
        })
      }
    }
  })
}

export default getStatistics
