import { fetchNodeVersion } from '../http/fetcher'
import { AppDispatch, AppActions } from '../../contexts/providers/reducer'

export const handleNodeVersion = (dispatch: AppDispatch) => {
  fetchNodeVersion().then((wrapper: Response.Wrapper<State.NodeVersion>) => {
    dispatch({
      type: AppActions.UpdateNodeVersion,
      payload: {
        nodeVersion: wrapper ? wrapper.attributes.version : '',
      },
    })
  })
}

export default {
  handleNodeVersion,
}
