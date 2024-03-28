import { DiffStatus } from '../../../utils/transfer'
import styles from './styles.module.scss'

export const Amount = ({
  amount,
  diffStatus,
  brackets,
}: {
  amount: string
  diffStatus: DiffStatus
  brackets?: boolean
}) => {
  const [integer, decimal = '00000000'] = amount.split('.')

  return (
    <div className={styles.amount} data-diff-status={diffStatus}>
      {brackets && '('}
      <span className={styles.integer}>{integer}</span>.
      <span className={styles.decimal}>
        {decimal}
        {brackets && 'CKB'}
      </span>
      {brackets && ')'}
    </div>
  )
}
