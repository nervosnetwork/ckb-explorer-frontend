import classNames from 'classnames'
import { MouseEventHandler, useRef } from 'react'
import UploadIcon from '../../assets/arrow_up_circle.png'
import DeleteIcon from '../../assets/delete.png'
import styles from './ImgUpload.module.scss'

type Props = {
  value: string | null
  label: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onClear: () => void
  labelRightAddon?: React.ReactNode
  placeholder?: string
  isRequired?: boolean
  className?: string
}

export const ImgUpload = (prop: Props) => {
  const { value, label, onChange, labelRightAddon, placeholder, isRequired, className, onClear } = prop
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClearUploadedImage: MouseEventHandler<HTMLButtonElement> = e => {
    onClear()
    e.stopPropagation()
  }
  const handleClick = () => {
    inputRef.current?.click()
  }
  // clear ref value on click to trigger onChange event event if choose the same file of last choice
  const clearValue = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }
  return (
    <div className={classNames(styles.container, className)}>
      <label htmlFor="image-upload" className={styles.label}>
        {label} {isRequired && <span className={styles.requiredIcon}>*</span>}
        {labelRightAddon && <span className={styles.labelRightAddon}>{labelRightAddon}</span>}
      </label>

      <input
        type="file"
        name="image-upload"
        onChange={onChange}
        className={styles.input}
        ref={inputRef}
        accept="image/*"
        onClick={clearValue}
      />
      <button type="button" className={styles.inputWrapper} onClick={handleClick}>
        {value ? (
          <>
            <img src={value} className={styles.uploadedIcon} alt="upload" />
            <button type="button" onClick={handleClearUploadedImage} className={styles.deleteIcon}>
              <img src={DeleteIcon} alt="upload" />
            </button>
          </>
        ) : (
          <div className={styles.uploadIconWrapper}>
            <img src={UploadIcon} className={styles.uploadIcon} alt="upload" />
            <div className={styles.placeholder}>{placeholder}</div>
          </div>
        )}
      </button>
    </div>
  )
}
