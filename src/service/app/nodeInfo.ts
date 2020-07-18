import { fetchNodeVersion } from '../http/fetcher'
import { AppDispatch } from '../../contexts/reducer'
import { AppActions } from '../../contexts/actions'
import { fetchCachedData, storeCachedData } from '../../utils/cache'
import { AppCachedKeys } from '../../utils/const'

const DAY_TIMESTAMP = 24 * 60 * 60 * 1000

export const initNodeVersion = (dispatch: AppDispatch) => {
  // version cache format: version&timestamp
  const data = fetchCachedData<string>(AppCachedKeys.Version)
  if (data && data.indexOf('&') > -1) {
    const timestamp = Number(data.substring(data.indexOf('&') + 1))
    if (new Date().getTime() - timestamp < DAY_TIMESTAMP) {
      dispatch({
        type: AppActions.UpdateNodeVersion,
        payload: {
          nodeVersion: data.substring(0, data.indexOf('&')),
        },
      })
      return
    }
  }
  fetchNodeVersion().then((wrapper: Response.Wrapper<State.NodeVersion> | null) => {
    if (wrapper) {
      dispatch({
        type: AppActions.UpdateNodeVersion,
        payload: {
          nodeVersion: wrapper ? wrapper.attributes.version : '',
        },
      })
      storeCachedData(AppCachedKeys.Version, `${wrapper.attributes.version}&${new Date().getTime()}`)
    }
  })
}

export default {
  initNodeVersion,
}
