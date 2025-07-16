import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import styles from './index.module.scss'
import { AggregateSearchResults } from './AggregateSearchResults'
import { ReactComponent as SearchIcon } from './search.svg'
import { ReactComponent as SpinnerIcon } from './spinner.svg'
import { ReactComponent as ClearIcon } from './clear.svg'
import SimpleButton from '../SimpleButton'
import { useIsMobile } from '../../hooks'
import { useSearch } from './useSearch'
import SearchInput from './SearchInput'
import { isMac } from '../../utils/util'

const Search: FC<{
  content?: string
  hasButton?: boolean
  onEditEnd?: () => void
  onClear?: () => void
}> = memo(({ content, hasButton, onEditEnd, onClear }) => {
  const { keyword, searchValue, setKeyword, handleSearch, isFetching, aggregateSearchResults } = useSearch({
    content,
    onEditEnd,
    onClear,
  })
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  return (
    <div
      className={styles.searchPanel}
      style={{
        height: hasButton ? '40px' : '32px',
        paddingRight: hasButton ? '0' : '8px',
      }}
    >
      {isFetching ? (
        <SpinnerIcon className={classNames(styles.preIcon, styles.spinner)} />
      ) : (
        <SearchIcon className={styles.preIcon} />
      )}

      <SearchInput
        autoFocus={!isMobile}
        loading={isFetching}
        value={keyword}
        onChange={event => setKeyword(event.target.value)}
        onEnter={handleSearch}
        placeholder={t('navbar.search_placeholder')}
      />

      {searchValue && (
        <SimpleButton className={styles.clear} title="clear" onClick={() => setKeyword('')}>
          <ClearIcon />
        </SimpleButton>
      )}
      <div className="text-xs text-gray-500 border border-gray-200 rounded-md px-1 py-0.5 ml-1">
        {isMac() ? '⌘+K' : 'Ctrl+K'}
      </div>
      {hasButton && (
        <div className={styles.searchButton} onClick={handleSearch}>
          {t('search.search')}
        </div>
      )}

      {(isFetching || aggregateSearchResults) && (
        <AggregateSearchResults keyword={keyword} results={aggregateSearchResults ?? []} loading={isFetching} />
      )}
    </div>
  )
})

export default Search
