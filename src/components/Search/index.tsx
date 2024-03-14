import {
  useState,
  useEffect,
  FC,
  memo,
  useMemo,
  useCallback,
  ChangeEventHandler,
  KeyboardEventHandler,
  ComponentPropsWithoutRef,
} from 'react'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import debounce from 'lodash.debounce'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { SearchPanel, SearchButton } from './styled'
import { explorerService, Response, SearchResultType } from '../../services/ExplorerService'
import { addPrefixForHash, containSpecialChar } from '../../utils/string'
import { HttpErrorCode, SearchFailType } from '../../constants/common'
import { useForkedState, useIsMobile } from '../../hooks'
import { isChainTypeError } from '../../utils/chain'
import { isAxiosError } from '../../utils/error'
import styles from './index.module.scss'
import { SearchByNameResults } from './SearchByNameResults'
import { useSearchType } from '../../services/AppSettings/hooks'
import { ReactComponent as SearchIcon } from './search.svg'
import { ReactComponent as SpinnerIcon } from './spinner.svg'
import { ReactComponent as ClearIcon } from './clear.svg'
import SimpleButton from '../SimpleButton'

// Currently, the API returns all search results, which could be extremely large in quantity.
// Since the rendering component does not implement virtual scrolling, this leads to a significant decrease in page performance.
// Therefore, here we are implementing a frontend-level limitation on the number of displayed results.
const DISPLAY_COUNT = 10

const Search: FC<{
  content?: string
  hasButton?: boolean
  onEditEnd?: () => void
  onClear?: () => void
}> = memo(({ content, hasButton, onEditEnd: handleEditEnd, onClear: handleClear }) => {
  const history = useHistory()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [searchType, setSearchType] = useSearchType()
  const isSearchByName = searchType === 'name'

  const [keyword, setKeyword] = useState(content || '')
  const [editEnded, _setEditEnded] = useState(false)
  const searchValue = keyword.trim()

  const setEditEnded = useCallback(
    (value: boolean) => {
      _setEditEnded(value)
      if (value) handleEditEnd?.()
    },
    [handleEditEnd],
  )

  const {
    refetch: refetchSearchById,
    data: urlByIdSearch,
    isFetching: isFetchingById,
  } = useQuery(['searchById', searchValue], () => getURLByIdSearch(searchValue), {
    enabled: false,
    cacheTime: 0,
  })

  useEffect(() => {
    if (urlByIdSearch) {
      history.push(urlByIdSearch)
    }
  }, [history, urlByIdSearch])

  const {
    refetch: refetchSearchByName,
    data: searchByNameResults,
    isFetching: isFetchingByName,
    // TODO: Previously, for some reasons, 'searchValue' was not added to the 'search' key here.
    // However, no problems were found in the tests after refactoring, so it has been added back for now.
    // If problems occur later, you can confirm here again. If no problems are found after a period of time, this comment can be removed.
  } = useQuery(['searchByName', searchValue], () => explorerService.api.fetchSearchByNameResult(searchValue), {
    enabled: false,
  })

  const debouncedSearchByName = useMemo(
    () => debounce(refetchSearchByName, 1000, { trailing: true }),
    [refetchSearchByName],
  )

  const resetSearchByName = useCallback(() => {
    debouncedSearchByName.cancel()
    queryClient.resetQueries(['searchByName', searchValue])
  }, [debouncedSearchByName, queryClient, searchValue])

  useEffect(() => {
    if (isSearchByName) {
      if (!searchValue) {
        resetSearchByName()
      } else {
        debouncedSearchByName()
      }
      return
    }

    if (editEnded && !!searchValue) {
      refetchSearchById()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editEnded, isSearchByName, searchValue])

  const switchSearchType = useCallback(() => {
    setSearchType(type => (type === 'name' ? 'id' : 'name'))
    resetSearchByName()
  }, [resetSearchByName, setSearchType])

  const onClear = useCallback(() => {
    setKeyword('')
    resetSearchByName()
    handleClear?.()
  }, [resetSearchByName, handleClear])

  return (
    <SearchPanel moreHeight={hasButton} hasButton={hasButton}>
      {isFetchingById ? (
        <SpinnerIcon className={classNames(styles.preIcon, styles.spinner)} />
      ) : (
        <SearchIcon className={styles.preIcon} />
      )}

      <SearchInput
        autoFocus={!isMobile}
        loading={isFetchingById}
        value={keyword}
        onChange={event => setKeyword(event.target.value)}
        onEditEndedChange={setEditEnded}
        placeholder={isSearchByName ? t('navbar.search_by_name_placeholder') : t('navbar.search_placeholder')}
      />

      {searchValue && (
        <SimpleButton className={styles.clear} title="clear" onClick={onClear}>
          <ClearIcon />
        </SimpleButton>
      )}
      <SimpleButton className={styles.byNameOrId} onClick={switchSearchType}>
        {isSearchByName ? t('search.by_name') : t('search.by_id')}
      </SimpleButton>
      {hasButton && <SearchButton onClick={() => setEditEnded(true)}>{t('search.search')}</SearchButton>}

      {(isFetchingByName || searchByNameResults) && (
        <SearchByNameResults
          udtQueryResults={searchByNameResults?.slice(0, DISPLAY_COUNT) ?? []}
          loading={isFetchingByName}
        />
      )}
    </SearchPanel>
  )
})

const SearchInput: FC<
  ComponentPropsWithoutRef<'input'> & {
    onEditEndedChange?: (editEnded: boolean) => void
    loading?: boolean
  }
> = ({ loading, onEditEndedChange, value: propsValue, onChange: propsOnChange, onKeyUp: propsOnKeyUp, ...elprops }) => {
  const [value, setValue] = useForkedState(propsValue)

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      if (loading) {
        return
      }
      setValue(event.target.value)
      propsOnChange?.(event)
      onEditEndedChange?.(event.target.value === '')
    },
    [onEditEndedChange, propsOnChange, setValue, loading],
  )

  const onKeyUp: KeyboardEventHandler<HTMLInputElement> = useCallback(
    event => {
      const isEnter = event.keyCode === 13
      if (isEnter) {
        onEditEndedChange?.(true)
      }
      propsOnKeyUp?.(event)
    },
    [onEditEndedChange, propsOnKeyUp],
  )

  return <input className={styles.searchInputPanel} value={value} onChange={onChange} onKeyUp={onKeyUp} {...elprops} />
}

const getURLByIdSearch = async (searchValue: string) => {
  // check whether is btc address
  if (isBtcAddress(searchValue)) {
    return `/address/${searchValue}`
  }
  // TODO: Is this replace needed?
  const query = addPrefixForHash(searchValue).replace(',', '')
  if (!query || containSpecialChar(query)) {
    return `/search/fail?q=${query}`
  }
  if (isChainTypeError(query)) {
    return `/search/fail?type=${SearchFailType.CHAIN_ERROR}&q=${query}`
  }

  try {
    const { data } = await explorerService.api.fetchSearchByIdResult(addPrefixForHash(query))
    const { type, attributes } = data
    switch (type) {
      case SearchResultType.TypeScript:
        return `/script/${attributes.scriptHash}/type`

      case SearchResultType.Block:
        return `/block/${attributes.blockHash}`

      case SearchResultType.Transaction:
        return `/transaction/${attributes.transactionHash}`

      case SearchResultType.Address:
        return `/address/${attributes.addressHash}`

      case SearchResultType.LockHash:
        return `/address/${attributes.lockHash}`

      case SearchResultType.UDT:
        return data.attributes.udtType === 'omiga_inscription' ? `/inscription/${query}` : `/sudt/${query}`

      case SearchResultType.BTC_TX:
        return `/transaction/${attributes.transactionHash}`

      default:
        break
    }
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response?.data &&
      error.response.status === 404 &&
      (error.response.data as Response.Error[]).find(
        (errorData: Response.Error) => errorData.code === HttpErrorCode.NOT_FOUND_ADDRESS,
      )
    ) {
      return `/address/${query}`
    }

    return `/search/fail?q=${query}`
  }
}

const isBtcAddress = (value: string) => {
  // check Pay-to-Public-Key-Hash and SegWit
  return /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/.test(value) || /bc1[a-z0-9]{38,59}\b/.test(value)
}

export default Search
