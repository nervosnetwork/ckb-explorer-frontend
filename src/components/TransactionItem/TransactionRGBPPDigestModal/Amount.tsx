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
  const [integer, decimal] = amount.split('.')
  let className = ''
  if (diffStatus === 'negative') {
    className = styles.decrease
  } else if (diffStatus === 'positive') {
    className = styles.increase
  }

  return (
    <div className={className}>
      {brackets && '('}
      <span className={styles.integer}>{integer}</span>.
      <span className={styles.decimal}>
        {decimal ?? '00000000'}
        {brackets && 'CKB'}
      </span>
      {brackets && ')'}
    </div>
  )
}
