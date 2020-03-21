import React, { useState, useRef, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import SearchLogo from '../../assets/search_black.png'
import ClearLogo from '../../assets/clear.png'
import i18n from '../../utils/i18n'
import { AppActions, ComponentActions } from '../../contexts/providers/reducer'
import { useDispatch, useAppState } from '../../contexts/providers'
import { getSimpleUDTTransactionsWithAddress } from '../../service/app/udt'
import { isMobile } from '../../utils/screen'

const SearchPanel = styled.div`
  width: 360px;
  height: 38px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1440px) {
    width: 320px;
  }

  @media (max-width: 750px) {
    width: 84vw;
  }
`

const SearchImage = styled.div`
  display: inline-block;
  margin-right: -36px;
  margin-left: 8px;
  width: 18px;
  z-index: 2;
  display: flex;
  justify-content: center;

  @media (max-width: 750px) {
    margin-right: ${(props: { isRight?: boolean }) => (props.isRight ? '8px' : '-36px')};
    margin-left: ${(props: { isRight?: boolean }) => (props.isRight ? '-24px' : '8px')};
  }

  img {
    width: 18px;
    height: 18px;
  }
`

const SearchInputPanel = styled.input`
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 16px;
  padding-left: ${(props: { isRight?: boolean }) => (props.isRight ? '8px' : '30px')};
  padding-right: ${(props: { isRight?: boolean }) => (props.isRight ? '30px' : '8px')};
  background: rgba(255, 255, 255, 0);
  opacity: 1;
  border: 1px solid #b3b3b3;
  color: #666666;
  border-radius: 6px;

  &: focus {
    color: #666666;
    outline: none;
  }

  &::placeholder {
    color: #bababa;
  }
`

const clearSearchInput = (inputElement: any) => {
  const input: HTMLInputElement = inputElement.current
  input.value = ''
  input.blur()
}

const UDT_ADDRESS_SEARCH_TRANSACTIONS = 100

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
      getSimpleUDTTransactionsWithAddress(
        query,
        typeHash,
        1,
        UDT_ADDRESS_SEARCH_TRANSACTIONS,
        dispatch,
        (isSuccess: boolean) => {
          if (isSuccess) {
            clearSearchInput(inputElement)
          } else {
            dispatch({
              type: AppActions.ShowToastMessage,
              payload: {
                message: i18n.t('toast.result_not_found'),
              },
            })
          }
        },
      )
    }
  }

  // update input placeholder when language change
  useEffect(() => {
    setPlaceholder(SearchPlaceholder)
  }, [SearchPlaceholder])

  const ClearIconButton = () => {
    const dispatch = useDispatch()
    return (
      <SearchImage
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
      </SearchImage>
    )
  }

  return (
    <SearchPanel>
      {!searchBarEditable && (
        <SearchImage
          role="button"
          tabIndex={-1}
          onKeyPress={() => {}}
          onClick={() => {
            handleSearchResult()
          }}
        >
          <img src={SearchLogo} alt="search logo" />
        </SearchImage>
      )}
      <SearchInputPanel
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
    </SearchPanel>
  )
}

export default UDTSearch
