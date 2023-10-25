import { useState, useRef, useEffect, FC, memo, RefObject, ChangeEvent } from 'react'
import { useHistory } from 'react-router'
import { TFunction, useTranslation } from 'react-i18next'
import { SearchImage, SearchInputPanel, SearchPanel, SearchButton, SearchContainer } from './styled'
import { explorerService, Response } from '../../services/ExplorerService'
import SearchLogo from '../../assets/search_black.png'
import ClearLogo from '../../assets/clear.png'
import { addPrefixForHash, containSpecialChar } from '../../utils/string'
import { HttpErrorCode, SearchFailType } from '../../constants/common'
import { useIsMobile } from '../../utils/hook'
import { isChainTypeError } from '../../utils/chain'
import { isAxiosError } from '../../utils/error'
// TODO: Refactor is needed. Should not directly import anything from the descendants of ExplorerService.
import { SearchResultType } from '../../services/ExplorerService/fetcher'

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

const handleSearchResult = async (
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
    const { data } = await explorerService.api.fetchSearchResult(addPrefixForHash(query))
    clearSearchInput(inputElement)
    setSearchValue('')

    switch (data.type) {
      case SearchResultType.Block:
        history.push(`/block/${data.attributes.blockHash}`)
        break

      case SearchResultType.Transaction:
        history.push(`/transaction/${data.attributes.transactionHash}`)
        break

      case SearchResultType.Address:
        history.push(`/address/${data.attributes.addressHash}`)
        break

      case SearchResultType.LockHash:
        history.push(`/address/${data.attributes.lockHash}`)
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
}> = memo(({ content, hasButton, onEditEnd }) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const history = useHistory()
  const SearchPlaceholder = t('navbar.search_placeholder')
  const [searchValue, setSearchValue] = useState(content || '')
  const [placeholder, setPlaceholder] = useState(SearchPlaceholder)
  const inputElement = useRef<HTMLInputElement>(null)

  // update input placeholder when language change
  useEffect(() => {
    setPlaceholder(SearchPlaceholder)
  }, [SearchPlaceholder])

  useEffect(() => {
    if (inputElement.current && !isMobile) {
      const input = inputElement.current as HTMLInputElement
      input.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearSearchAction = (isClear?: boolean) => {
    if (isClear) {
      setSearchValue('')
      clearSearchInput(inputElement)
      onEditEnd?.()
    }
  }

  const inputChangeAction = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
    if (!event.target.value) onEditEnd?.()
  }

  const searchKeyAction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      handleSearchResult(searchValue, inputElement, setSearchValue, history, t)
      onEditEnd?.()
    }
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
          placeholder={placeholder}
          defaultValue={searchValue || ''}
          onChange={event => inputChangeAction(event)}
          onKeyUp={event => searchKeyAction(event)}
        />
        {searchValue && <ImageIcon isClear />}
      </SearchPanel>
      {hasButton && (
        <SearchButton
          onClick={() => {
            handleSearchResult(searchValue, inputElement, setSearchValue, history, t)
            onEditEnd?.()
          }}
        >
          {t('search.search')}
        </SearchButton>
      )}
    </SearchContainer>
  )
})

export default Search
