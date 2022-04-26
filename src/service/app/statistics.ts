import { fetchStatistics } from '../http/fetcher'
import { AppDispatch } from '../../contexts/reducer'
import { AppActions, PageActions } from '../../contexts/actions'
import { NEXT_HARD_FORK_EPOCH, EPOCH_HOURS } from '../../constants/common'

export const getStatistics = (dispatch: AppDispatch) => {
  return fetchStatistics().then((wrapper: Response.Wrapper<State.Statistics> | null) => {
    if (wrapper) {
      dispatch({
        type: PageActions.UpdateStatistics,
        payload: {
          statistics: wrapper.attributes,
        },
      })
      const { epochNumber, index, epochLength } = wrapper.attributes.epochInfo
      const hs = (NEXT_HARD_FORK_EPOCH - (+epochNumber + +index / +epochLength)) * EPOCH_HOURS * 60 * 60
      dispatch({
        type: AppActions.UpdateHardForkStatus,
        payload: {
          miranaHardForkSecondsLeft: Math.floor(hs),
          hasFinishedHardFork: hs <= 0,
        },
      })
    }
  })
}

export default getStatistics
