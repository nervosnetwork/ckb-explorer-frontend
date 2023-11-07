import PC404mage from './pc_404.png'
import Mobile404Image from './mobile_404.png'
import PCBlue404Image from './blue_pc_404.png'
import MobileBlue404Image from './blue_mobile_404.png'
import { useIsMobile } from '../../utils/hook'
import { isMainnet } from '../../utils/chain'
import styles from './index.module.scss'

const get404Image = (isMobile: boolean) => {
  if (isMainnet()) {
    return isMobile ? Mobile404Image : PC404mage
  }
  return isMobile ? MobileBlue404Image : PCBlue404Image
}

export default () => {
  const isMobile = useIsMobile()

  return (
    <div className={styles.container}>
      <img className={styles.notFoundImage} src={get404Image(isMobile)} alt="404" />
    </div>
  )
}
