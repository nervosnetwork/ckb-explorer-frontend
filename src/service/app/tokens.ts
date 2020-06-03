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

export const getTokens = (dispatch: AppDispatch) => {
  handleStatus(dispatch, 'InProgress')
  fetchTokens()
    .then((wrappers: Response.Wrapper<State.TokenInfo>[] | null) => {
      if (wrappers) {
        dispatch({
          type: PageActions.UpdateTokens,
          payload: {
            tokens: wrappers.map(wrapper => wrapper.attributes),
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
