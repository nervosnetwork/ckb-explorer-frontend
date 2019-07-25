import React, { useState, useRef } from 'react'
import styled, { css } from 'styled-components'
import { AxiosError } from 'axios'
import { fetchSearchResult } from '../../service/http/fetcher'
import browserHistory from '../../routes/history'
import SearchLogo from '../../assets/search.png'
import GreenSearchLogo from '../../assets/search_green.png'
import { searchTextCorrection } from '../../utils/string'
import i18n from '../../utils/i18n'
import { HttpErrorCode } from '../../utils/const'
import { AppDispatch, AppActions } from '../../contexts/providers/reducer'

const SearchPanel = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 50px;
  @media (max-width: 700px) {
    height: 30px;
  }
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SearchImage = styled.div`
  display: inline-block;
  margin-left: ${(props: { greenIcon: boolean }) => (props.greenIcon ? '-45px' : '0')};
  z-index: 2;

  @media (max-width: 700px) {
    margin-left: ${(props: { greenIcon: boolean }) => (props.greenIcon ? '-25px' : '0')};
  }

  img {
    width: 32px;
    height: 32px;

    @media (max-width: 700px) {
      width: 14px;
      height: 14px;
    }
  }
`

const SearchInputPanel = styled.input`
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 16px;
  padding-left: 20px;
  padding-right: 50px;
  background: rgba(255, 255, 255, 0);
  border: 0 solid #606060;
  border-radius: 0;
  color: #bababa;

  &: focus {
    color: #bababa;
    outline: none;
  }

  ${(props: { hasBorder: boolean }) =>
    props.hasBorder &&
    css`
      opacity: 1;
      border: 2px solid #606060;
      color: #666666;
      border-radius: 6px;

      &: focus {
        color: #666666;
        outline: none;
      }
    `};

  &::placeholder {
    color: #bababa;
  }

  @media (max-width: 700px) {
    font-size: 12px;
    width: 100%;
    padding-left: 10px;
    padding-right: 20px;
    border: 1px solid #606060;
    border-radius: 6px;
  }
`

const SearchPlaceholder = i18n.t('navbar.search_placeholder')

const Search = ({ dispatch, hasBorder, content }: { dispatch: AppDispatch; hasBorder?: boolean; content?: string }) => {
  const [searchValue, setSearchValue] = useState(content || '')
  const inputElement = useRef(null)

  const handleSearchResult = () => {
    const query = searchValue.replace(/^\s+|\s+$/g, '').replace(',', '') // remove front and end blank and ','
    if (!query) {
      dispatch({
        type: AppActions.ShowToastMessage,
        payload: {
          text: i18n.t('toast.invalid_content'),
          timeout: 3000,
        },
      })
    } else {
      fetchSearchResult(searchTextCorrection(query))
        .then((response: any) => {
          const input: any = inputElement.current!
          input.value = ''
          const { data } = response
          if (data.type === 'block') {
            browserHistory.push(`/block/${(data as Response.Wrapper<State.Block>).attributes.block_hash}`)
          } else if (data.type === 'ckb_transaction') {
            browserHistory.push(
              `/transaction/${(data as Response.Wrapper<State.Transaction>).attributes.transaction_hash}`,
            )
          } else if (data.type === 'address') {
            browserHistory.push(`/address/${(data as Response.Wrapper<State.Address>).attributes.address_hash}`)
          } else if (data.type === 'lock_hash') {
            browserHistory.push(`/lockhash/${(data as Response.Wrapper<State.Address>).attributes.lock_hash}`)
          } else {
            setSearchValue(query)
            browserHistory.push(`/search/fail?q=${query}`)
          }
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            if (
              (error.response.data as Response.Error[]).find((errorData: Response.Error) => {
                return errorData.code === HttpErrorCode.NOT_FOUND_ADDRESS
              })
            ) {
              browserHistory.push(`/address/${query}`)
            } else {
              setSearchValue(query)
              browserHistory.push(`/search/fail?q=${query}`)
            }
          } else {
            setSearchValue(query)
            browserHistory.push(`/search/fail?q=${query}`)
          }
        })
    }
  }

  const SearchIconButton = ({ greenIcon }: { greenIcon?: boolean }) => {
    return (
      <SearchImage
        greenIcon={!!greenIcon}
        role="button"
        tabIndex={-1}
        onKeyPress={() => {}}
        onClick={() => {
          if (greenIcon) handleSearchResult()
        }}
      >
        <img src={greenIcon ? GreenSearchLogo : SearchLogo} alt="search logo" />
      </SearchImage>
    )
  }

  return (
    <SearchPanel>
      {!hasBorder && <SearchIconButton />}
      <SearchInputPanel
        ref={inputElement}
        placeholder={SearchPlaceholder}
        defaultValue={searchValue || ''}
        hasBorder={!!hasBorder}
        onChange={(event: any) => setSearchValue(event.target.value)}
        onKeyUp={(event: any) => {
          if (event.keyCode === 13) {
            handleSearchResult()
          }
        }}
      />
      {hasBorder && <SearchIconButton greenIcon />}
    </SearchPanel>
  )
}

export default Search
