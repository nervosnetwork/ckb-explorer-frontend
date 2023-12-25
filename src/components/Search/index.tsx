import { useState, useRef, useEffect, FC, memo, RefObject, ChangeEvent, useMemo, useCallback } from 'react'
import { useHistory } from 'react-router'
import { TFunction, useTranslation } from 'react-i18next'
import debounce from 'lodash.debounce'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { SearchImage, SearchInputPanel, SearchPanel, SearchButton, SearchContainer } from './styled'
import { explorerService, Response } from '../../services/ExplorerService'
import SearchLogo from '../../assets/search_black.png'
import ClearLogo from '../../assets/clear.png'
import { addPrefixForHash, containSpecialChar } from '../../utils/string'
import { HttpErrorCode, SearchFailType } from '../../constants/common'
import { useIsMobile } from '../../hooks'
import { isChainTypeError } from '../../utils/chain'
import { isAxiosError } from '../../utils/error'
// TODO: Refactor is needed. Should not directly import anything from the descendants of ExplorerService.
import { SearchResultType } from '../../services/ExplorerService/fetcher'
import styles from './index.module.scss'
import { SearchByNameResults } from './SearchByNameResults'
import { useSearchType } from '../../services/AppSettings/hooks'

const clearSearchInput = (inputElement: RefObject<HTMLInputElement>) => {
  const input = inputElement.current
  if (input) {
    input.value = ''
    input.blur()
  }
}

const setSearchLoading = (inputElement: RefObject<HTMLInputElement>, t: TFunction) => {
  const input = inputElement.current
  if (input) {
    input.value = t('search.loading')
  }
}

const setSearchContent = (inputElement: RefObject<HTMLInputElement>, content: string) => {
  const input = inputElement.current
  if (input) {
    input.value = content
  }
}

const handleSearchById = async (
  searchValue: string,
  inputElement: RefObject<HTMLInputElement>,
  setSearchValue: Function,
  history: ReturnType<typeof useHistory>,
  t: TFunction,
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

  setSearchLoading(inputElement, t)

  try {
    const { data } = await explorerService.api.fetchSearchByIdResult(addPrefixForHash(query))
    clearSearchInput(inputElement)
    setSearchValue('')

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
        history.push(`/sudt/${query}`)
        break

      default:
        break
    }
  } catch (error) {
    setSearchContent(inputElement, query)

    if (
      isAxiosError(error) &&
      error.response?.data &&
      error.response.status === 404 &&
      (error.response.data as Response.Error[]).find(
        (errorData: Response.Error) => errorData.code === HttpErrorCode.NOT_FOUND_ADDRESS,
      )
    ) {
      clearSearchInput(inputElement)
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
  const [searchValue, setSearchValue] = useState(content || '')
  const inputElement = useRef<HTMLInputElement>(null)

  const toggleSearchType = () => {
    const newIsSearchByNames = !isSearchByName
    const searchTypePersistValue = newIsSearchByNames ? 'name' : 'id'
    setSearchByType(searchTypePersistValue)
    setIsSearchByName(newIsSearchByNames)
    queryClient.resetQueries(['searchByName', searchValue])
  }

  const {
    refetch: refetchSearchByName,
    data: searchByNameResults,
    isFetching,
  } = useQuery(['searchByName', searchValue], () => explorerService.api.fetchSearchByNameResult(searchValue), {
    // we need to control the fetch timing manually
    enabled: false,
  })

  const debouncedSearchByName = useMemo(
    () => debounce(refetchSearchByName, 1000, { trailing: true }),
    [refetchSearchByName],
  )

  useEffect(() => {
    if (inputElement.current && !isMobile) {
      const input = inputElement.current as HTMLInputElement
      input.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!searchValue || !isSearchByName) {
      return
    }
    debouncedSearchByName()
  }, [searchValue, isSearchByName, debouncedSearchByName])

  const clearSearchAction = (isClear?: boolean) => {
    if (isClear) {
      setSearchValue('')
      clearSearchInput(inputElement)
      queryClient.resetQueries(['searchByName', searchValue])
      handleEditEnd?.()
    }
  }

  const onEditEnd = useCallback(() => {
    if (!isSearchByName) {
      handleSearchById(searchValue, inputElement, setSearchValue, history, t)
    }
    handleEditEnd?.()
  }, [history, isSearchByName, handleEditEnd, searchValue, t])

  const searchKeyAction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      onEditEnd()
    }
  }

  const inputChangeAction = async (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    setSearchValue(inputValue)
    if (!inputValue) onEditEnd()
  }

  const ImageIcon = ({ isClear }: { isClear?: boolean }) => (
    <SearchImage isClear={isClear} onClick={() => clearSearchAction(isClear)}>
      <img src={isClear ? ClearLogo : SearchLogo} alt="search logo" />
    </SearchImage>
  )

  return (
    <SearchContainer>
      <SearchPanel moreHeight={hasButton} hasButton={hasButton}>
        <ImageIcon />
        <SearchInputPanel
          ref={inputElement}
          placeholder={isSearchByName ? t('navbar.search_by_name_placeholder') : t('navbar.search_placeholder')}
          defaultValue={searchValue || ''}
          onChange={event => inputChangeAction(event)}
          onKeyUp={event => searchKeyAction(event)}
        />
        <button type="button" className={styles.byNameOrId} onClick={toggleSearchType}>
          {isSearchByName ? t('search.by_name') : t('search.by_id')}
        </button>
        {searchValue && <ImageIcon isClear />}
        <SearchByNameResults
          udtQueryResults={searchByNameResults ? searchByNameResults.slice(0, DISPLAY_COUNT) : null}
          loading={isFetching}
        />
      </SearchPanel>
      {hasButton && <SearchButton onClick={onEditEnd}>{t('search.search')}</SearchButton>}
    </SearchContainer>
  )
})

export default Search
