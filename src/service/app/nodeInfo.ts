import { fetchNodeVersion } from '../http/fetcher'
import { App } from '../../contexts/App'

export const handleNodeVersion = (appContext: App) => {
  fetchNodeVersion().then((wrapper: Response.Wrapper<State.NodeVersion>) => {
    appContext.updateNodeVersion(wrapper ? wrapper.attributes.version : '')
  })
}

export default {
  handleNodeVersion,
}
