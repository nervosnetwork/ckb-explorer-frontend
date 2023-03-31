import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import SearchBlack from '../../../assets/search_black.png'
import ClearLogo from '../../../assets/clear.png'
import { FilterImage, FilterPanel, ResetButtonPanel, FilterInputPanel } from './styled'

const Filter = ({
  placeholder,
  onFilter,
  onReset,
  showReset,
}: {
  placeholder?: string
  onFilter: (query: string) => void
  onReset: () => void
  showReset?: boolean
}) => {
  const [t] = useTranslation()

  const [filterValue, setFilterValue] = useState('')
  const showClear = !!filterValue
  const inputElement = useRef<HTMLInputElement>(null)

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
        {t('nervos_dao.dao_search_reset')}
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
