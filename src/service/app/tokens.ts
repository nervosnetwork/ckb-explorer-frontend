import { AppDispatch } from '../../contexts/reducer'
import { PageActions } from '../../contexts/actions'
import { fetchTokens } from '../http/fetcher'

const handleStatus = (dispatch: AppDispatch, status: State.FetchStatus) => {
  dispatch({
    type: PageActions.UpdateTokensStatus,
    payload: {
      status,
    },
  })
}

export const getTokens = (page: number, size: number, dispatch: AppDispatch) => {
  handleStatus(dispatch, 'InProgress')
  fetchTokens(page, size)
    .then(response => {
      const { data, meta } = response as Response.Response<Response.Wrapper<State.UDT>[]>
      if (meta) {
        dispatch({
          type: PageActions.UpdateTokensTotal,
          payload: {
            total: meta.total,
          },
        })
      }
      if (data && data.length > 0) {
        const tokens = data.map((wrapper: Response.Wrapper<State.UDT>) => wrapper.attributes)
        dispatch({
          type: PageActions.UpdateTokens,
          payload: {
            tokens,
          },
        })
        handleStatus(dispatch, 'OK')
      } else {
        handleStatus(dispatch, 'Error')
      }
    })
    .catch(() => {
      handleStatus(dispatch, 'Error')
    })
}

export default getTokens
