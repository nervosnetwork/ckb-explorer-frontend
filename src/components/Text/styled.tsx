import classNames from 'classnames'
import { FC, HTMLAttributes } from 'react'
import styles from './index.module.scss'

export const HighLightPanel: FC<HTMLAttributes<HTMLDivElement>> = props => {
  const { children, className, ...rest } = props
  return (
    <div className={classNames(styles.HighLightPanel, className)} {...rest}>
      {children}
    </div>
  )
}
