import { ComponentProps, FC, ReactNode } from 'react'
import classNames from 'classnames'
import styles from './CardHeader.module.scss'

interface CardHeaderProps extends ComponentProps<'div'> {
  leftContent?: ReactNode
  rightContent?: ReactNode
  leftProps?: ComponentProps<'div'>
  rightProps?: ComponentProps<'div'>
}

export const CardHeader: FC<CardHeaderProps> = ({ leftContent, rightContent, leftProps, rightProps, ...elProps }) => {
  return (
    <div {...elProps} className={classNames(styles.cardHeader, elProps.className)}>
      <div {...leftProps} className={classNames(styles.left, leftProps?.className)}>
        {leftContent}
      </div>
      {(rightProps || rightContent) && (
        <div {...rightProps} className={classNames(styles.right, rightProps?.className)}>
          {rightContent}
        </div>
      )}
    </div>
  )
}
