import { fetchStatistics } from '../http/fetcher'
import { AppDispatch, PageActions } from '../../contexts/providers/reducer'
import { fetchCachedData, storeCachedData } from '../../utils/cached'
import { CachedKeys } from '../../utils/const'

export const getStatistics = (dispatch: AppDispatch) => {
  const cachedStatistics = fetchCachedData<State.Statistics>(CachedKeys.Statistics)
  if (cachedStatistics) {
    dispatch({
      type: PageActions.UpdateStatistics,
      payload: {
        statistics: cachedStatistics,
      },
    })
  }
  fetchStatistics().then((wrapper: Response.Wrapper<State.Statistics>) => {
    if (wrapper) {
      dispatch({
        type: PageActions.UpdateStatistics,
        payload: {
          statistics: wrapper.attributes,
        },
      })
      storeCachedData(CachedKeys.Statistics, wrapper.attributes)
    }
  })
}

export default getStatistics
