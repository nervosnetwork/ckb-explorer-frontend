import { useTranslation } from 'react-i18next'
import { IS_MAINTAINING } from '../../constants/common'
import styles from './styles.module.scss'

const MaintainAlert = () => {
  const { t } = useTranslation()
  if (IS_MAINTAINING) {
    return <div className={styles.container}>{t('error.maintain')}</div>
  }

  return null
}

export default MaintainAlert
