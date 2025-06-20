/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { MouseEventHandler, ReactNode } from 'react'
import classNames from 'classnames'
import styles from './index.module.scss'

export default ({
  id,
  className,
  title,
  onClick,
  onMouseOver,
  children,
}: {
  id?: string
  className?: string
  title?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  onMouseOver?: MouseEventHandler<HTMLDivElement>
  children: ReactNode | string
}) => (
  <div
    id={id}
    className={classNames(styles.buttonPanel, className)}
    title={title}
    role="button"
    tabIndex={-1}
    onKeyDown={() => {}}
    onMouseOver={event => {
      if (onMouseOver) {
        onMouseOver(event)
      }
    }}
    onClick={event => {
      if (onClick) {
        onClick(event)
      }
    }}
  >
    {children}
  </div>
)
