import React, { useContext, useState, useRef } from 'react'
import styled, { css } from 'styled-components'
import AppContext from '../../contexts/App'
import { fetchSearchResult } from '../../http/fetcher'
import { BlockWrapper } from '../../http/response/Block'
import { TransactionWrapper } from '../../http/response/Transaction'
import { AddressWrapper } from '../../http/response/Address'
import browserHistory from '../../routes/history'
import SearchLogo from '../../assets/search.png'
import { searchTextCorrection } from '../../utils/string'
import i18n from '../../utils/i18n'

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

  > div {
    display: inline-block;
    width: 30px;
    height: 30px;

    @media (max-width: 700px) {
      width: 14px;
      height: 14px;
      margin-left: -20px;
    }

    margin-left: -35px;
    opacity: 0.8;
    img {
      width: 100%;
      height: 100%;
    }
  }
`

const SearchInputPanel = styled.input`
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 16px;
  @media (max-width: 700px) {
    font-size: 12px;
    width: 100%;
    padding-left: 10px;
    padding-right: 20px;
    border-radius: 6px;
  }
  padding-left: 20px;
  padding-right: 50px;
  border-width: 0px;
  border-radius: 6px 0 0 6px;
  opacity: 0.8;

  ${(props: { opacityStyle: boolean }) =>
    props.opacityStyle &&
    css`
      opacity: 1;
      border: 2px solid #606060;
    `};

  background: rgba(255, 255, 255, 0.2);
  &: focus {
    color: black;
    background: rgba(255, 255, 255, 1) !important;
    color: #333333 !important;
    outline: none;
  }
  &::placeholder {
    color: #bababa;
  }
`

const SearchPlaceholder = i18n.t('navbar.search_placeholder')

const Search = ({ opacity = false, content }: { opacity?: boolean; content?: string }) => {
  const appContext = useContext(AppContext)
  const [searchValue, setSearchValue] = useState(content || '')
  const inputElement = useRef(null)

  const handleSearchResult = () => {
    const query = searchValue.replace(/^\s+|\s+$/g, '') // remove front and end blank
    if (!query) {
      appContext.toastMessage(i18n.t('toast.invalid_content'), 3000)
    } else {
      fetchSearchResult(searchTextCorrection(query))
        .then((response: any) => {
          const input: any = inputElement.current!
          input.value = ''
          const { data } = response
          if (data.type === 'block') {
            browserHistory.push(`/block/${(data as BlockWrapper).attributes.block_hash}`)
          } else if (data.type === 'ckb_transaction') {
            browserHistory.push(`/transaction/${(data as TransactionWrapper).attributes.transaction_hash}`)
          } else if (data.type === 'address') {
            browserHistory.push(`/address/${(data as AddressWrapper).attributes.address_hash}`)
          } else if (data.type === 'lock_hash') {
            browserHistory.push(`/lockhash/${(data as AddressWrapper).attributes.lock_hash}`)
          } else {
            setSearchValue(query)
            browserHistory.push(`/search/fail?q=${query}`)
          }
        })
        .catch(() => {
          setSearchValue(query)
          browserHistory.push(`/search/fail?q=${query}`)
        })
    }
  }

  return (
    <SearchPanel>
      <SearchInputPanel
        ref={inputElement}
        placeholder={SearchPlaceholder}
        defaultValue={searchValue || ''}
        opacityStyle={!!opacity}
        onChange={(event: any) => setSearchValue(event.target.value)}
        onKeyUp={(event: any) => {
          if (event.keyCode === 13) {
            handleSearchResult()
          }
        }}
      />
      <div
        role="button"
        tabIndex={-1}
        onKeyPress={() => {}}
        onClick={() => {
          handleSearchResult()
        }}
      >
        <img src={SearchLogo} alt="search logo" />
      </div>
    </SearchPanel>
  )
}

export default Search
