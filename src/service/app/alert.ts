import { fetchMaintenanceInfo } from '../http/fetcher'
import { AppDispatch } from '../../contexts/reducer'
import { AppActions } from '../../contexts/actions'

export const getMaintenanceInfo = (dispatch: AppDispatch) => {
  fetchMaintenanceInfo().then((wrapper: Response.Wrapper<State.MaintenanceInfo> | null) => {
    if (wrapper) {
      const { maintenanceInfo = null } = wrapper.attributes
      dispatch({
        type: AppActions.UpdateAppErrors,
        payload: {
          appError: {
            type: 'Maintenance',
            message: maintenanceInfo ? [maintenanceInfo.startAt, maintenanceInfo.endAt] : [],
          },
        },
      })
    }
  })
}

export default {
  getMaintenanceInfo,
}
