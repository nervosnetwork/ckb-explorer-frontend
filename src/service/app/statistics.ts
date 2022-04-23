import { fetchStatistics } from '../http/fetcher'
import { AppDispatch } from '../../contexts/reducer'
import { AppActions, PageActions } from '../../contexts/actions'
import { NEXT_HARD_FORK_EPOCH } from '../../constants/common'

export const getStatistics = (dispatch: AppDispatch) => {
  fetchStatistics().then((wrapper: Response.Wrapper<State.Statistics> | null) => {
    if (wrapper) {
      dispatch({
        type: PageActions.UpdateStatistics,
        payload: {
          statistics: wrapper.attributes,
        },
      })
      const { epochNumber, index, epochLength } = wrapper.attributes.epochInfo
      const hs = NEXT_HARD_FORK_EPOCH - (+epochNumber + +index / +epochLength)
      if (hs <= 0) {
        dispatch({
          type: AppActions.UpdateHardForkStatus,
          payload: {
            hasFinishedHardFork: true,
          },
        })
      }
    }
  })
}

export default getStatistics
