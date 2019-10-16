import { fetchNervosDao } from '../http/fetcher'
import { AppDispatch, PageActions } from '../../contexts/providers/reducer'

export const getNervosDao = (dispatch: AppDispatch) => {
  fetchNervosDao().then((wrapper: Response.Wrapper<State.NervosDao> | null) => {
    if (wrapper) {
      dispatch({
        type: PageActions.UpdateNervosDao,
        payload: {
          nervosDao: wrapper.attributes,
        },
      })
    }
  })
}

export default getNervosDao
