import { useState, useRef, useEffect, useMemo, FC, memo } from 'react'
import { useHistory } from 'react-router'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { SearchImage, SearchInputPanel, SearchPanel, SearchButton, SearchContainer } from './styled'
import { fetchSearchResult } from '../../service/http/fetcher'
import SearchLogo from '../../assets/search_black.png'
import ClearLogo from '../../assets/clear.png'
import { addPrefixForHash, containSpecialChar } from '../../utils/string'
import i18n from '../../utils/i18n'
import { HttpErrorCode, SearchFailType } from '../../constants/common'
import { AppDispatch } from '../../contexts/reducer'
import { ComponentActions } from '../../contexts/actions'
import { useDispatch } from '../../contexts/providers'
import { useIsMobile } from '../../utils/hook'
import { isChainTypeError } from '../../utils/chain'

enum SearchResultType {
  Block = 'block',
  Transaction = 'ckb_transaction',
  Address = 'address',
  LockHash = 'lock_hash',
  UDT = 'udt',
}

const clearSearchInput = (inputElement: any) => {
  const input: HTMLInputElement = inputElement.current
  if (input) {
    input.value = ''
    input.blur()
  }
}

const setSearchLoading = (inputElement: any) => {
  const input: HTMLInputElement = inputElement.current
  input.value = i18n.t('search.loading')
}

const setSearchContent = (inputElement: any, content: string) => {
  const input: HTMLInputElement = inputElement.current
  if (input) {
    input.value = content
  }
}

const hideMobileMenu = (dispatch: AppDispatch) => {
  dispatch({
    type: ComponentActions.UpdateHeaderMobileMenuVisible,
    payload: {
      mobileMenuVisible: false,
    },
  })
}

const handleSearchResult = (
  searchValue: string,
  inputElement: any,
  dispatch: AppDispatch,
  setSearchValue: Function,
  history: ReturnType<typeof useHistory>,
  isMobile: boolean,
) => {
  if (isMobile) hideMobileMenu(dispatch)
  const query = searchValue.trim().replace(',', '') // remove front and end blank and ','
  if (!query || containSpecialChar(query)) {
    history.push(`/search/fail?q=${query}`)
    return
  }
  if (isChainTypeError(query)) {
    history.push(`/search/fail?type=${SearchFailType.CHAIN_ERROR}&q=${query}`)
    return
  }

  setSearchLoading(inputElement)
  fetchSearchResult(addPrefixForHash(query))
    .then((response: any) => {
      const { data } = response
      if (!response || !data.type) {
        history.push(`/search/fail?q=${query}`)
        return
      }
      clearSearchInput(inputElement)
      setSearchValue('')
      if (data.type === SearchResultType.Block) {
        history.push(`/block/${(data as Response.Wrapper<State.Block>).attributes.blockHash}`)
      } else if (data.type === SearchResultType.Transaction) {
        history.push(`/transaction/${(data as Response.Wrapper<State.Transaction>).attributes.transactionHash}`)
      } else if (data.type === SearchResultType.Address) {
        history.push(`/address/${(data as Response.Wrapper<State.Address>).attributes.addressHash}`)
      } else if (data.type === SearchResultType.LockHash) {
        history.push(`/address/${(data as Response.Wrapper<State.Address>).attributes.lockHash}`)
      } else if (data.type === SearchResultType.UDT) {
        history.push(`/sudt/${query}`)
      }
    })
    .catch((error: AxiosError) => {
      setSearchContent(inputElement, query)
      if (
        error.response &&
        error.response.data &&
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
    })
}

const Search: FC<{
  content?: string
  hasButton?: boolean
  onEditEnd?: () => void
}> = memo(({ content, hasButton, onEditEnd }) => {
  const isMobile = useIsMobile()
  const dispatch = useDispatch()
  const history = useHistory()
  const [t] = useTranslation()
  const SearchPlaceholder = useMemo(() => t('navbar.search_placeholder'), [t])
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

  const inputChangeAction = (event: any) => {
    setSearchValue(event.target.value)
    if (!event.target.value) onEditEnd?.()
  }

  const searchKeyAction = (event: any) => {
    if (event.keyCode === 13) {
      handleSearchResult(searchValue, inputElement, dispatch, setSearchValue, history, isMobile)
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
          onChange={(event: any) => inputChangeAction(event)}
          onKeyUp={(event: any) => searchKeyAction(event)}
        />
        {searchValue && <ImageIcon isClear />}
      </SearchPanel>
      {hasButton && (
        <SearchButton
          onClick={() => {
            handleSearchResult(searchValue, inputElement, dispatch, setSearchValue, history, isMobile)
            onEditEnd?.()
          }}
        >
          {i18n.t('search.search')}
        </SearchButton>
      )}
    </SearchContainer>
  )
})

export default Search
