import classNames from 'classnames'
import styles from './index.module.scss'

type Props = {
  name: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
}

export default (props: Props) => {
  const { name, onClick, disabled, loading, className } = props
  return (
    <button
      type="button"
      className={classNames(styles.container, (disabled || loading) && styles.isDisabled, className)}
      onKeyDown={disabled ? undefined : onClick}
      onClick={disabled ? undefined : onClick}
    >
      {name}
      {loading && (
        <span className={styles.loading}>
          <span className={styles.dot}>.</span>
          <span className={styles.dot}>.</span>
          <span className={styles.dot}>.</span>
        </span>
      )}
    </button>
  )
}
