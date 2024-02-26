import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SearchBlack from '../../assets/search_black.png'
import ClearLogo from '../../assets/clear.png'
import { FilterImage, FilterPanel, ResetButtonPanel, FilterInputPanel } from './styled'

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
    <FilterImage
      isClear={isClear}
      onClick={() => {
        if (isClear) {
          setFilterValue('')
        }
      }}
    >
      <img src={isClear ? ClearLogo : SearchBlack} alt="search logo" />
    </FilterImage>
  )

  const ResetFilter = () => {
    return (
      <ResetButtonPanel
        onClick={() => {
          setFilterValue('')
          onReset()
        }}
      >
        {t('search.reset')}
      </ResetButtonPanel>
    )
  }

  return (
    <FilterPanel>
      {showReset && <ResetFilter />}
      <FilterIcon />
      <FilterInputPanel
        ref={inputElement}
        showReset={showReset ?? false}
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
    </FilterPanel>
  )
}

export default Filter
