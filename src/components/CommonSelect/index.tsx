/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import styles from './index.module.scss'
import Arrow from '../../assets/arrow_down_black.png'

type Option = Record<'label' | 'value', string>
type Props = {
  options: Option[]
  value?: string
  onChange: (value: string) => void
  defaultValue?: string
  placeholder?: string
  className?: string
}

function CommonSelect({ options, onChange, value: parentValue, defaultValue, placeholder, className }: Props) {
  const defaultLabel = options.find(option => option.value === defaultValue)?.label
  const [value, setValue] = useState(defaultLabel)
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleOptionClick = (option: Option) => {
    onChange(option.value)
    setValue(option.label)
    toggleExpand()
  }

  const [currentIndex, setCurrentIndex] = useState(-1)

  useEffect(() => {
    if (!isExpanded) {
      // keyboard selection is enabled only when the dropdown is expanded
      return
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      const { keyCode } = event
      event.preventDefault()

      switch (keyCode) {
        case 38:
          // up
          setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : currentIndex)
          break
        case 40:
          // down
          setCurrentIndex(currentIndex < options.length - 1 ? currentIndex + 1 : currentIndex)
          break
        case 27:
          // esc
          setCurrentIndex(-1)
          toggleExpand()
          break
        case 13:
          // enter
          if (currentIndex !== -1) {
            handleOptionClick(options[currentIndex])
          }
          toggleExpand()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isExpanded, options, options.length])

  return (
    <OutsideClickHandler onOutsideClick={() => setIsExpanded(false)}>
      <div onClick={toggleExpand} className={classNames(styles.select, className)}>
        <div className={styles.value}>
          {parentValue ?? value ?? placeholder}
          <img src={Arrow} alt="arrow" className={styles.arrow} data-is-flipped={isExpanded} />
        </div>
        {isExpanded && (
          <div className={styles.options}>
            {options.map((option, index) => (
              <div
                key={option.label}
                className={classNames(styles.option, index === currentIndex && styles.selected)}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  )
}

export default CommonSelect
