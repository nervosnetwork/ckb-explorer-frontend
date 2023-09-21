import { useEffect } from 'react'
import { useAppState, useDispatch } from '../../contexts/providers'
import { AlertPanel } from './styled'
import i18n, { currentLanguage } from '../../utils/i18n'
import { dayjs, parseSimpleDateNoSecond } from '../../utils/date'
import SimpleButton from '../SimpleButton'
import { ComponentActions } from '../../contexts/actions'
import { AppCachedKeys } from '../../constants/cache'
import { IS_MAINTAINING } from '../../constants/common'
import styles from './styles.module.scss'
import { useStatistics } from '../../services/ExplorerService'
import { createGlobalState, createGlobalStateSetter, useGlobalState } from '../../utils/state'

const FIFTEEN_MINUTES = 15 * 60 * 1000

const globalMaintenanceMsg = createGlobalState<[string, string] | []>([])

export const setMaintenanceMsg = createGlobalStateSetter(globalMaintenanceMsg)

const Alert = () => {
  const dispatch = useDispatch()
  const { reorgStartedAt } = useStatistics()
  const {
    components: { maintenanceAlertVisible },
  } = useAppState()
  const [[startTime, endTime]] = useGlobalState(globalMaintenanceMsg)

  const hideAlert = () => {
    sessionStorage.setItem(AppCachedKeys.MaintenanceAlert, 'hide')
    dispatch({
      type: ComponentActions.UpdateMaintenanceAlertVisible,
      payload: {
        maintenanceAlertVisible: false,
      },
    })
  }

  useEffect(() => {
    const hideMaintenance = sessionStorage.getItem(AppCachedKeys.MaintenanceAlert) === 'hide'
    if (startTime && endTime && !hideMaintenance) {
      dispatch({
        type: ComponentActions.UpdateMaintenanceAlertVisible,
        payload: {
          maintenanceAlertVisible: true,
        },
      })
    }
  }, [startTime, endTime, dispatch])

  if (reorgStartedAt && new Date(reorgStartedAt).getTime() + FIFTEEN_MINUTES < new Date().getTime()) {
    return (
      <div className={styles.container}>
        {i18n.t('toast.handling-reorg', {
          time: dayjs(reorgStartedAt).format('YYYY-MM-DD HH:mm:ss'),
        })}
      </div>
    )
  }

  if (IS_MAINTAINING) {
    return <div className={styles.container}>{i18n.t('error.maintain')}</div>
  }

  return maintenanceAlertVisible && startTime && endTime ? (
    <AlertPanel isEn={currentLanguage() === 'en'}>
      <div>
        <span>
          {i18n.t('toast.maintenance', {
            start: parseSimpleDateNoSecond(startTime, '-', false),
            end: parseSimpleDateNoSecond(endTime, '-', false),
          })}
        </span>
        <div className="alert__dismiss__panel">
          <SimpleButton className="alert__dismiss" onClick={() => hideAlert()}>
            {i18n.t('toast.dismiss')}
          </SimpleButton>
        </div>
      </div>
    </AlertPanel>
  ) : null
}

export default Alert
