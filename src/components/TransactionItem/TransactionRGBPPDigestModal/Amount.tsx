import styles from './styles.module.scss'

export const Amount = ({ amount, className }: { amount: string; className: string }) => {
  const [integer, decimal] = amount.split('.')
  return (
    <div className={className}>
      <span className={styles.integer}>{integer}</span>.<span className={styles.decimal}>{decimal}</span>
    </div>
  )
}
