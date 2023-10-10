import i18n from '../../utils/i18n'
import { IS_MAINTAINING } from '../../constants/common'
import styles from './styles.module.scss'

const MaintainAlert = () => {
  if (IS_MAINTAINING) {
    return <div className={styles.container}>{i18n.t('error.maintain')}</div>
  }

  return null
}

export default MaintainAlert
