import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import SearchLogo from '../../../assets/search_black.png'
import ClearLogo from '../../../assets/clear.png'
import i18n from '../../../utils/i18n'
import { AppActions, ComponentActions } from '../../../contexts/actions'
import { useDispatch, useAppState } from '../../../contexts/providers'
import { getUDTTransactionsWithAddress } from '../../../service/app/udt'
import { isMobile } from '../../../utils/screen'
import { UDTSearchInputPanel, UDTSearchImage, UDTSearchPanel } from './styled'

const clearSearchInput = (inputElement: any) => {
  const input: HTMLInputElement = inputElement.current
  input.value = ''
  input.blur()
}

const setSearchContent = (inputElement: any, content: string) => {
  const input: HTMLInputElement = inputElement.current
  if (input) {
    input.value = content
  }
  input.blur()
}

const UDT_SEARCH_TRANSACTIONS = 100

const UDTSearch = ({ typeHash, content }: { typeHash: string; content?: string }) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const SearchPlaceholder = useMemo(() => {
    return t('udt.search_placeholder')
  }, [t])
  const [searchValue, setSearchValue] = useState(content || '')
  const [placeholder, setPlaceholder] = useState(SearchPlaceholder)
  const inputElement = useRef<HTMLInputElement>(null)
  const {
    components: { searchBarEditable },
    udtState: { status },
  } = useAppState()

  const handleSearchResult = () => {
    const query = searchValue.trim().replace(',', '') // remove front and end blank and ','
    if (!query) {
      dispatch({
        type: AppActions.ShowToastMessage,
        payload: {
          message: i18n.t('toast.invalid_content'),
        },
      })
    } else {
      setSearchContent(inputElement, i18n.t('search.loading'))
      getUDTTransactionsWithAddress(query, typeHash, 1, UDT_SEARCH_TRANSACTIONS, dispatch)
    }
  }

  useEffect(() => {
    if (status === 'InProgress') {
      setSearchContent(inputElement, i18n.t('search.loading'))
    } else if (status === 'OK') {
      clearSearchInput(inputElement)
    } else {
      clearSearchInput(inputElement)
      dispatch({
        type: AppActions.ShowToastMessage,
        payload: {
          type: 'warning',
          message: i18n.t('toast.result_not_found'),
        },
      })
    }
  }, [status, dispatch])

  // update input placeholder when language change
  useEffect(() => {
    setPlaceholder(SearchPlaceholder)
  }, [SearchPlaceholder])

  const ClearIconButton = () => {
    const dispatch = useDispatch()
    return (
      <UDTSearchImage
        isRight={true}
        role="button"
        tabIndex={-1}
        onKeyPress={() => {}}
        onClick={() => {
          dispatch({
            type: ComponentActions.UpdateHeaderSearchEditable,
            payload: {
              searchBarEditable: false,
            },
          })
        }}
      >
        <img src={ClearLogo} alt="search clear logo" />
      </UDTSearchImage>
    )
  }

  return (
    <UDTSearchPanel>
      {!searchBarEditable && (
        <UDTSearchImage
          role="button"
          tabIndex={-1}
          onKeyPress={() => {}}
          onClick={() => {
            handleSearchResult()
          }}
        >
          <img src={SearchLogo} alt="search logo" />
        </UDTSearchImage>
      )}
      <UDTSearchInputPanel
        isRight={isMobile() && searchBarEditable}
        ref={inputElement}
        placeholder={placeholder}
        defaultValue={searchValue || ''}
        onBlur={() => {
          setPlaceholder(SearchPlaceholder)
        }}
        onChange={(event: any) => {
          setSearchValue(event.target.value)
        }}
        onKeyUp={(event: any) => {
          if (event.keyCode === 13) {
            handleSearchResult()
          }
        }}
      />
      {searchBarEditable && <ClearIconButton />}
    </UDTSearchPanel>
  )
}

export default UDTSearch
