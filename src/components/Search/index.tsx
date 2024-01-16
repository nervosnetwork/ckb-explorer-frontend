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
import { ImageButton, SearchInputPanel, SearchPanel, SearchButton, SearchContainer } from './styled'
import { explorerService, Response } from '../../services/ExplorerService'
import SearchLogo from '../../assets/search_black.png'
import ClearLogo from '../../assets/clear.png'
import { addPrefixForHash, containSpecialChar } from '../../utils/string'
import { HttpErrorCode, SearchFailType } from '../../constants/common'
import { useForkedState, useIsMobile } from '../../hooks'
import { isChainTypeError } from '../../utils/chain'
import { isAxiosError } from '../../utils/error'
// TODO: Refactor is needed. Should not directly import anything from the descendants of ExplorerService.
import { SearchResultType } from '../../services/ExplorerService/fetcher'
import styles from './index.module.scss'
import { SearchByNameResults } from './SearchByNameResults'
import { useSearchType } from '../../services/AppSettings/hooks'

const handleSearchById = async (
  searchValue: string,
  setInputLoading: (loading: boolean) => void,
  onClear: () => void,
  history: ReturnType<typeof useHistory>,
) => {
  const query = searchValue.trim().replace(',', '') // remove front and end blank and ','
  if (!query || containSpecialChar(query)) {
    history.push(`/search/fail?q=${query}`)
    return
  }
  if (isChainTypeError(query)) {
    history.push(`/search/fail?type=${SearchFailType.CHAIN_ERROR}&q=${query}`)
    return
  }

  setInputLoading(true)

  try {
    const { data } = await explorerService.api.fetchSearchByIdResult(addPrefixForHash(query))
    onClear()

    const { type, attributes } = data
    switch (type) {
      case SearchResultType.TypeScript:
        history.push(`/script/${attributes.scriptHash}/type`)
        break

      case SearchResultType.Block:
        history.push(`/block/${attributes.blockHash}`)
        break

      case SearchResultType.Transaction:
        history.push(`/transaction/${attributes.transactionHash}`)
        break

      case SearchResultType.Address:
        history.push(`/address/${attributes.addressHash}`)
        break

      case SearchResultType.LockHash:
        history.push(`/address/${attributes.lockHash}`)
        break

      case SearchResultType.UDT:
        history.push(data.attributes.udtType === 'omiga_inscription' ? `/inscription/${query}` : `/sudt/${query}`)
        break

      default:
        break
    }
  } catch (error) {
    setInputLoading(false)

    if (
      isAxiosError(error) &&
      error.response?.data &&
      error.response.status === 404 &&
      (error.response.data as Response.Error[]).find(
        (errorData: Response.Error) => errorData.code === HttpErrorCode.NOT_FOUND_ADDRESS,
      )
    ) {
      onClear()
      history.push(`/address/${query}`)
    } else {
      history.push(`/search/fail?q=${query}`)
    }
  }
}

const Search: FC<{
  content?: string
  hasButton?: boolean
  onEditEnd?: () => void
}> = memo(({ content, hasButton, onEditEnd: handleEditEnd }) => {
  // Currently, the API returns all search results, which could be extremely large in quantity.
  // Since the rendering component does not implement virtual scrolling, this leads to a significant decrease in page performance.
  // Therefore, here we are implementing a frontend-level limitation on the number of displayed results.
  const DISPLAY_COUNT = 10
  const isMobile = useIsMobile()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const [searchByType, setSearchByType] = useSearchType()
  const [isSearchByName, setIsSearchByName] = useState(searchByType === 'name')
  const history = useHistory()
  const [keyword, setKeyword] = useState(content || '')
  const [editEnded, setEditEnded] = useState(false)
  const searchValue = keyword.trim()
  const [inputLoading, setInputLoading] = useState(false)

  const toggleSearchType = () => {
    const newIsSearchByNames = !isSearchByName
    const searchTypePersistValue = newIsSearchByNames ? 'name' : 'id'
    setSearchByType(searchTypePersistValue)
    setIsSearchByName(newIsSearchByNames)
    queryClient.resetQueries(['searchByName'])
  }

  const {
    refetch: refetchSearchByName,
    data: searchByNameResults,
    isFetching,
  } = useQuery(['searchByName'], () => explorerService.api.fetchSearchByNameResult(searchValue), {
    // we need to control the fetch timing manually
    enabled: false,
  })

  const debouncedSearchByName = useMemo(
    () => debounce(refetchSearchByName, 1000, { trailing: true }),
    [refetchSearchByName],
  )

  const onClear = useCallback(() => {
    setKeyword('')
    debouncedSearchByName.cancel()
    queryClient.resetQueries(['searchByName'])
    setEditEnded(true)
  }, [debouncedSearchByName, queryClient])

  useEffect(() => {
    if (isSearchByName) {
      if (!searchValue) {
        debouncedSearchByName.cancel()
        queryClient.resetQueries(['searchByName'])
        return
      }

      debouncedSearchByName()
      return
    }

    if (editEnded && !!searchValue) {
      handleSearchById(searchValue, setInputLoading, onClear, history)
    }
  }, [debouncedSearchByName, editEnded, history, isSearchByName, onClear, queryClient, searchValue, t])

  useEffect(() => {
    if (editEnded) {
      handleEditEnd?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editEnded])

  return (
    <SearchContainer>
      <SearchPanel moreHeight={hasButton} hasButton={hasButton}>
        <ImageButton>
          <img src={SearchLogo} alt="search logo" />
        </ImageButton>
        <SearchInput
          autoFocus={!isMobile}
          value={inputLoading ? t('search.loading') : keyword}
          onChange={event => setKeyword(event.target.value)}
          onEditEndedChange={setEditEnded}
          placeholder={isSearchByName ? t('navbar.search_by_name_placeholder') : t('navbar.search_placeholder')}
        />
        <button type="button" className={styles.byNameOrId} onClick={toggleSearchType}>
          {isSearchByName ? t('search.by_name') : t('search.by_id')}
        </button>
        {searchValue && (
          <ImageButton onClick={onClear} isClear>
            <img src={ClearLogo} alt="clearButton" />
          </ImageButton>
        )}
        <SearchByNameResults
          udtQueryResults={searchByNameResults ? searchByNameResults.slice(0, DISPLAY_COUNT) : null}
          loading={isFetching}
        />
      </SearchPanel>
      {hasButton && <SearchButton onClick={() => setEditEnded(true)}>{t('search.search')}</SearchButton>}
    </SearchContainer>
  )
})

const SearchInput: FC<
  ComponentPropsWithoutRef<'input'> & {
    onEditEndedChange?: (editEnded: boolean) => void
  }
> = ({ onEditEndedChange, value: propsValue, onChange: propsOnChange, onKeyUp: propsOnKeyUp, ...elprops }) => {
  const [value, setValue] = useForkedState(propsValue)

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      setValue(event.target.value)
      propsOnChange?.(event)
      onEditEndedChange?.(event.target.value === '')
    },
    [onEditEndedChange, propsOnChange, setValue],
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

  return <SearchInputPanel value={value} onChange={onChange} onKeyUp={onKeyUp} {...elprops} />
}

export default Search
