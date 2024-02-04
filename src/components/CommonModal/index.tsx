import React, { useEffect } from 'react'
import classNames from 'classnames'
import OutsideClickHandler from 'react-outside-click-handler'
import styles from './index.module.scss'

type Props = {
  isOpen: boolean
  children: React.ReactNode
  onClose: () => void
  className?: string
}

export default (props: Props) => {
  const { isOpen, children, onClose, className } = props

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // close modal when press ESC
      if (event.keyCode === 27) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  if (!isOpen) {
    return null
  }
  return (
    <>
      <div className={styles.overlay} />
      <OutsideClickHandler onOutsideClick={onClose}>
        <div className={classNames(styles.container, className)}>{children}</div>
      </OutsideClickHandler>
    </>
  )
}
