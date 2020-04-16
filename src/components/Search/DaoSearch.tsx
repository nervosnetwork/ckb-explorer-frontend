import React, { useState, useRef, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import GreenSearchLogo from '../../assets/search_green.png'
import BlueSearchLogo from '../../assets/search_blue.png'
import i18n from '../../utils/i18n'
import { AppActions } from '../../contexts/providers/reducer'
import { isMainnet } from '../../utils/chain'
import { searchNervosDaoTransactions, getNervosDaoTransactions } from '../../service/app/nervosDao'
import { useDispatch } from '../../contexts/providers'

const SearchPanel = styled.div`
  width: 600px;
  height: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 750px) {
    width: 84vw;
    height: 25px;
  }
`

const SearchImage = styled.div`
  display: inline-block;
  margin-left: ${(props: { showReset: boolean }) => (props.showReset ? '-65px' : '-45px')};
  width: 50px;
  z-index: 2;
  display: flex;
  justify-content: center;

  @media (max-width: 750px) {
    width: 40px;
    margin-left: ${(props: { showReset: boolean }) => (props.showReset ? '-45px' : '-35px')};
  }

  img {
    margin-top: 3px;
    width: 20px;
    height: 20px;

    @media (max-width: 750px) {
      margin-top: 0;
      width: 12px;
      height: 12px;
    }
  }
`

const SearchInputPanel = styled.input`
  position: relative;
  width: ${(props: { showReset: boolean }) => (props.showReset ? '85%' : '100%')};
  height: 100%;
  font-size: 16px;
  padding-left: 15px;
  padding-right: 50px;
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

  @media (max-width: 750px) {
    width: ${(props: { showReset: boolean }) => (props.showReset ? '83%' : '100%')};
    font-size: 12px;
    padding-left: 10px;
    padding-right: 30px;
  }
`

const ResetButtonPanel = styled.div`
  background: ${props => props.theme.primary};
  color: white;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  width: 65px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;

  @media (max-width: 750px) {
    border-radius: 3px;
    font-size: 12px;
    width: 45px;
    height: 24px;
    line-height: 24px;
  }
`

const clearSearchInput = (inputElement: any) => {
  const input: HTMLInputElement = inputElement.current
  input.value = ''
  input.blur()
}

const DEPOSIT_RANK_COUNT = 100

const DaoSearch = ({ content }: { content?: string }) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const SearchPlaceholder = useMemo(() => {
    return t('nervos_dao.dao_search_placeholder')
  }, [t])
  const [searchValue, setSearchValue] = useState(content || '')
  const [placeholder, setPlaceholder] = useState(SearchPlaceholder)
  const [showReset, setShowReset] = useState(false)
  const inputElement = useRef<HTMLInputElement>(null)

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
      searchNervosDaoTransactions(query, dispatch, (isSuccess: boolean) => {
        if (isSuccess) {
          clearSearchInput(inputElement)
          setShowReset(true)
        } else {
          dispatch({
            type: AppActions.ShowToastMessage,
            payload: {
              message: i18n.t('toast.result_not_found'),
            },
          })
        }
      })
    }
  }

  // update input placeholder when language change
  useEffect(() => {
    setPlaceholder(SearchPlaceholder)
  }, [SearchPlaceholder])

  const SearchIconButton = () => {
    return (
      <SearchImage
        role="button"
        showReset={showReset}
        tabIndex={-1}
        onKeyPress={() => {}}
        onClick={() => {
          handleSearchResult()
        }}
      >
        <img src={isMainnet() ? GreenSearchLogo : BlueSearchLogo} alt="search logo" />
      </SearchImage>
    )
  }

  return (
    <SearchPanel>
      {showReset && (
        <ResetButtonPanel
          onClick={() => {
            setShowReset(false)
            getNervosDaoTransactions(dispatch, 1, DEPOSIT_RANK_COUNT)
          }}
        >
          {i18n.t('nervos_dao.dao_search_reset')}
        </ResetButtonPanel>
      )}
      <SearchInputPanel
        ref={inputElement}
        showReset={showReset}
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
      <SearchIconButton />
    </SearchPanel>
  )
}

export default DaoSearch
