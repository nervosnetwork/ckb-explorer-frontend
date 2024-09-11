import type { TransactionLeapDirection } from '../RGBPP/types'
import styles from './styles.module.scss'

const Portal = ({ type }: { type: TransactionLeapDirection }) => (
  <div className={styles.container} data-type={type}>
    <div className={styles.portal} data-side="left" />
    <div className={styles.portal} data-side="right" />
    <div className={styles.cube} />
  </div>
)

export default Portal
