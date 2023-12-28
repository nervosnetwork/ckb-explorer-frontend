import classNames from 'classnames'
import LoadingImage from '../../assets/loading.gif'
import LoadingBlueImage from '../../assets/blue_loading.gif'
import { isMainnet } from '../../utils/chain'
import styles from './index.module.scss'

export default ({ show, className }: { show: boolean; className?: string }) =>
  show ? (
    <div className={classNames(styles.loadingWrapper, className)}>
      <img src={isMainnet() ? LoadingImage : LoadingBlueImage} alt="loading" />
    </div>
  ) : null
