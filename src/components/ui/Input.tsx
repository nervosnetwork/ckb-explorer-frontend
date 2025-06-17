import * as React from 'react'
import classNames from 'classnames'
import styles from './Input.module.scss'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return <input type={type} data-slot="input" className={classNames(styles.input, className)} {...props} />
}

export { Input }
