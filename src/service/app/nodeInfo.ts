import { fetchNodeVersion } from '../http/fetcher'
import { AppActions, AppDispatch } from '../../contexts/providers/reducer'

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
