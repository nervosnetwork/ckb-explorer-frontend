import { fetchNodeVersion } from '../http/fetcher'
import { AppDispatch } from '../../contexts/reducer'
import { AppActions } from '../../contexts/actions'

export const initNodeVersion = (dispatch: AppDispatch) => {
  fetchNodeVersion().then((wrapper: Response.Wrapper<State.NodeVersion> | null) => {
    if (wrapper) {
      dispatch({
        type: AppActions.UpdateNodeVersion,
        payload: {
          nodeVersion: wrapper ? wrapper.attributes.version : '',
        },
      })
    }
  })
}

export default {
  initNodeVersion,
}
