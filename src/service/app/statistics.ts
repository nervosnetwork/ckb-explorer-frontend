import { fetchStatistics } from '../http/fetcher'
import { AppDispatch } from '../../contexts/reducer'
import { PageActions } from '../../contexts/actions'

export const getStatistics = (dispatch: AppDispatch) => {
  return fetchStatistics().then((wrapper: Response.Wrapper<State.Statistics> | null) => {
    if (wrapper) {
      dispatch({
        type: PageActions.UpdateStatistics,
        payload: {
          statistics: wrapper.attributes,
        },
      })
    }
  })
}

export default getStatistics
