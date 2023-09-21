import { fetchMaintenanceInfo } from '../http/fetcher'
import { setMaintenanceMsg } from '../../components/Alert'

export const getMaintenanceInfo = () => {
  fetchMaintenanceInfo().then((wrapper: Response.Wrapper<State.MaintenanceInfo> | null) => {
    if (wrapper) {
      const { maintenanceInfo = null } = wrapper.attributes
      setMaintenanceMsg(maintenanceInfo ? [maintenanceInfo.startAt, maintenanceInfo.endAt] : [])
    }
  })
}

export default {
  getMaintenanceInfo,
}
