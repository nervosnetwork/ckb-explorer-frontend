import { isMainnet } from '../../utils/chain'
import styles from './index.module.scss'

const miranaAliveText = `Mirana\nis live`

export default () => {
  return (
    <div className={styles.Root} data-alive>
      {isMainnet() && (
        <div className={styles.TextContain}>
          <h1 className={styles.Text} data-text={miranaAliveText}>
            {miranaAliveText}
          </h1>
          <div className={styles.Gradient} />
          <div className={styles.Spotlight} />
        </div>
      )}
    </div>
  )
}
