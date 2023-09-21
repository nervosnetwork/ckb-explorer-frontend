import { useState } from 'react'
import { AlertPanel } from './styled'
import i18n, { currentLanguage } from '../../utils/i18n'
import { dayjs, parseSimpleDateNoSecond } from '../../utils/date'
import SimpleButton from '../SimpleButton'
import { AppCachedKeys } from '../../constants/cache'
import { IS_MAINTAINING } from '../../constants/common'
import styles from './styles.module.scss'
import { useStatistics } from '../../services/ExplorerService'
import { createGlobalState, createGlobalStateSetter, useGlobalState } from '../../utils/state'

const FIFTEEN_MINUTES = 15 * 60 * 1000

const globalMaintenanceMsg = createGlobalState<[string, string] | []>([])

export const setMaintenanceMsg = createGlobalStateSetter(globalMaintenanceMsg)

const Alert = () => {
  const { reorgStartedAt } = useStatistics()
  const [[startTime, endTime]] = useGlobalState(globalMaintenanceMsg)
  const [isHideMaintenance, setIsHideMaintenance] = useState(
    () => sessionStorage.getItem(AppCachedKeys.MaintenanceAlert) === 'hide',
  )

  const hideAlert = () => {
    sessionStorage.setItem(AppCachedKeys.MaintenanceAlert, 'hide')
    setIsHideMaintenance(true)
  }

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

  return startTime && endTime && !isHideMaintenance ? (
    <AlertPanel isEn={currentLanguage() === 'en'}>
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
    </AlertPanel>
  ) : null
}

export default Alert
