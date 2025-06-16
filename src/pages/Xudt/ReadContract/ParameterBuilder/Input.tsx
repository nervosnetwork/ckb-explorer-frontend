import React from 'react'
import styles from './Input.module.scss'

const Input = (props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; errorMessage?: string }) => {
  const { className, label, errorMessage, ...rest } = props
  return (
    <div className="inputWrapper">
      {label && <label className="label">{label}</label>}
      <input className={`${styles.input} ${className}`} {...rest} />
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
    </div>
  )
}

export default Input
