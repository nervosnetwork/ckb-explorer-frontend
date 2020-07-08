import React, { useEffect } from 'react'
import { useAppState, useDispatch } from '../../contexts/providers'
import { AlertPanel } from './styled'
import i18n from '../../utils/i18n'
import { parseSimpleDateNoSecond } from '../../utils/date'
import SimpleButton from '../SimpleButton'
import { ComponentActions } from '../../contexts/actions'

const Alert = () => {
  const dispatch = useDispatch()
  const {
    app: { appErrors },
    components: { maintenanceAlertVisible },
  } = useAppState()
  const [startTime, endTime] = appErrors[2].message

  const hideAlert = () => {
    dispatch({
      type: ComponentActions.UpdateMaintenanceAlertVisible,
      payload: {
        maintenanceAlertVisible: false,
      },
    })
  }

  useEffect(() => {
    if (startTime && endTime) {
      dispatch({
        type: ComponentActions.UpdateMaintenanceAlertVisible,
        payload: {
          maintenanceAlertVisible: true,
        },
      })
    }
  }, [startTime, endTime, dispatch])

  return maintenanceAlertVisible ? (
    <AlertPanel>
      <div>
        <span>
          {i18n.t('toast.maintenance', {
            start: parseSimpleDateNoSecond(startTime, '-', false),
            end: parseSimpleDateNoSecond(endTime, '-', false),
          })}
        </span>
        <SimpleButton className="alert__dismiss" onClick={() => hideAlert()}>
          {i18n.t('toast.dismiss')}
        </SimpleButton>
      </div>
    </AlertPanel>
  ) : null
}

export default Alert
