import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SearchBlack from '../../assets/search_black.png'
import ClearLogo from '../../assets/clear.png'
import styles from './index.module.scss'
import SimpleButton from '../SimpleButton'

const Filter = ({
  defaultValue = '',
  placeholder,
  onFilter,
  onReset,
  showReset,
}: {
  defaultValue?: string
  placeholder?: string
  onFilter: (query: string) => void
  onReset: () => void
  showReset?: boolean
}) => {
  const [t] = useTranslation()

  const [filterValue, setFilterValue] = useState(defaultValue)
  const showClear = !!filterValue
  const inputElement = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFilterValue(defaultValue)
  }, [defaultValue])

  const FilterIcon = ({ isClear }: { isClear?: boolean }) => (
    <SimpleButton
      className={isClear ? `${styles.filterImage} ${styles.isClear}` : styles.filterImage}
      onClick={() => {
        if (isClear) {
          setFilterValue('')
        }
      }}
    >
      <img src={isClear ? ClearLogo : SearchBlack} alt="search logo" />
    </SimpleButton>
  )

  const ResetFilter = () => {
    return (
      <div
        className={styles.resetButtonPanel}
        onClick={() => {
          setFilterValue('')
          onReset()
        }}
      >
        {t('search.reset')}
      </div>
    )
  }

  return (
    <div className={styles.filterPanel}>
      {showReset && <ResetFilter />}
      <FilterIcon />
      <input
        className={showReset ? `${styles.filterInputPanel} ${styles.showReset}` : styles.filterInputPanel}
        ref={inputElement}
        placeholder={placeholder}
        value={filterValue}
        onChange={event => setFilterValue(event.target.value)}
        onKeyUp={event => {
          if (event.keyCode === 13) {
            const query = filterValue.trim().replace(',', '')
            if (query !== '') {
              onFilter(query)
            } else {
              onReset()
            }
          }
        }}
      />
      {showClear && <FilterIcon isClear />}
    </div>
  )
}

export default Filter
