import classNames from 'classnames'
import LoadingImage from '../../../assets/loading.gif'
import LoadingWhiteImage from '../../../assets/loading_white.gif'
import LoadingBlueImage from '../../../assets/blue_loading.gif'
import { isMainnet } from '../../../utils/chain'
import styles from './index.module.scss'

export default ({ isWhite, className }: { isWhite?: boolean; className?: string }) => (
  <div className={styles.smallLoadingPanel}>
    {isWhite ? (
      <img className={classNames('loadingWhite', className)} src={LoadingWhiteImage} alt="loading" />
    ) : (
      <img className={className} src={isMainnet() ? LoadingImage : LoadingBlueImage} alt="loading" />
    )}
  </div>
)
