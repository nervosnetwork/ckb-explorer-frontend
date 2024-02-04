import classNames from 'classnames'
import styles from './LabeledInput.module.scss'

type Props = {
  name: string
  label: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  labelRightAddon?: React.ReactNode
  placeholder?: string
  isRequired?: boolean
  className?: string
  isError?: boolean
  children?: React.ReactNode
  disabled?: boolean
}

export const LabeledInput = (props: Props) => {
  const {
    value,
    name,
    label,
    isError,
    onChange,
    labelRightAddon,
    placeholder,
    isRequired,
    children,
    className,
    disabled = false,
  } = props
  return (
    <div className={classNames(styles.container, className)}>
      <label htmlFor={name} className={styles.label}>
        {label} {isRequired && <span className={styles.requiredIcon}>*</span>}
        {labelRightAddon && <span className={styles.labelRightAddon}>{labelRightAddon}</span>}
      </label>

      {children ?? (
        <input
          disabled={disabled}
          id={name}
          name={name}
          type="text"
          data-is-error={isError}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  )
}
