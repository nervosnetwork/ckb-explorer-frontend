import PCDataNotFoundImage from './pc_data_not_found.png'
import MobileDataNotFoundImage from './mobile_data_not_found.png'
import { useIsMobile } from '../../../hooks'
import styles from './index.module.scss'

export default () => {
  const isMobile = useIsMobile()
  return (
    <div className={styles.errorPanel}>
      <img alt="data not found" src={isMobile ? MobileDataNotFoundImage : PCDataNotFoundImage} />
    </div>
  )
}
