import i18n from '../../utils/i18n'
import { dayjs } from '../../utils/date'
import { IS_MAINTAINING } from '../../constants/common'
import styles from './styles.module.scss'
import { useStatistics } from '../../services/ExplorerService'

const FIFTEEN_MINUTES = 15 * 60 * 1000

const Alert = () => {
  const { reorgStartedAt } = useStatistics()

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

  return null
}

export default Alert
