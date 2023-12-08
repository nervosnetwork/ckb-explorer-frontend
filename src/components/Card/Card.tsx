import { ComponentProps, FC } from 'react'
import classNames from 'classnames'
import styles from './Card.module.scss'

export interface CardProps extends ComponentProps<'div'> {
  rounded?: boolean | 'top' | 'bottom'
}

export const Card: FC<CardProps> = ({ children, rounded = true, ...elProps }) => {
  return (
    <div
      {...elProps}
      className={classNames(
        styles.card,
        {
          [styles.rounded]: rounded === true,
          [styles.roundedTop]: rounded === 'top',
          [styles.roundedBottom]: rounded === 'bottom',
        },
        elProps.className,
      )}
    >
      {children}
    </div>
  )
}
