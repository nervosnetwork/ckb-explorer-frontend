import { fetchStatistics } from '../http/fetcher'
import { AppDispatch, PageActions } from '../../contexts/providers/reducer'

export const getStatistics = (dispatch: AppDispatch) => {
  fetchStatistics().then((wrapper: Response.Wrapper<State.Statistics> | null) => {
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
