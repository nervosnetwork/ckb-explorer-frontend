import React, { useContext } from 'react'
import styled from 'styled-components'
import Content from '../../components/Content'
import SearchLogo from '../../asserts/search.png'
import browserHistory from '../../routes/history'
import AppContext from '../../contexts/App'
import { fetchSearchResult } from '../../http/fetcher'
import { BlockWrapper } from '../../http/response/Block'
import { TransactionWrapper } from '../../http/response/Transaction'
import { AddressWrapper } from '../../http/response/Address'

const SearchPanel = styled.div`
  margin-top: ${(props: { width: number }) => (350 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (440 * props.width) / 1920}px;
`

const SearchInput = styled.div`
  max-width: 650px;
  width: 100%;
  margin: 0 auto;
  height: 65px;
  text-align: center;
  position: relative;
  > input {
    position: relative;
    width: 100%;
    color: #bababa;
    height: 65px;
    font-size: 16px;
    padding-left: 20px;
    padding-right: 106px;
    border: 2px solid rgb(24, 50, 93);
    border-radius: 6px;
    background-color: #ffffff;
    &: focus {
      color: black;
      opacity: 1;
    }
  }

  > div img {
    position: absolute;
    top: 14px;
    right: 9px;
    width: 41px;
    height: 41px;
    opacity: 0.8;
    &: hover {
      opacity: 1;
      cursor: pointer;
    }
  }
`

const SearchContent = styled.div`
  font-size: 20px;
  max-width: 423px;
  margin: 0 auto;
  margin-top: 39px;
  text-align: center;
`

export default () => {
  const appContext = useContext(AppContext)
  const handleSearchResult = (q: string) => {
    if (!q) {
      appContext.toastMessage('Please input valid content', 3000)
    } else {
      fetchSearchResult(q)
        .then((json: any) => {
          const { data } = json
          if (data.type === 'block') {
            browserHistory.push(`/block/${(data as BlockWrapper).attributes.block_hash}`)
          } else if (data.type === 'ckb_transaction') {
            // interface here should change by backyard ckb_transaction to transaction
            browserHistory.push(`/transaction/${(data as TransactionWrapper).attributes.transaction_hash}`)
          } else if (data.type === 'address') {
            browserHistory.push(`/address/${(data as AddressWrapper).attributes.address_hash}`)
          } else {
            browserHistory.push('/search/fail')
          }
        })
        .catch(() => {
          browserHistory.push(`/search/fail?q=${q}`)
        })
    }
  }
  return (
    <Content>
      <SearchPanel width={window.innerWidth} className="container">
        <SearchInput>
          <input
            id="search__bar"
            placeholder="Block Heigth / Block Hash / TxHash / Address"
            onKeyUp={(event: any) => {
              if (event.keyCode === 13) {
                handleSearchResult(event.target.value)
              }
            }}
          />
          <div
            role="button"
            tabIndex={-1}
            onKeyPress={() => {}}
            onClick={() => {
              const searchBar = document.getElementById('search__bar') as HTMLInputElement
              handleSearchResult(searchBar.value)
            }}
          >
            <img src={SearchLogo} alt="search logo" />
          </div>
        </SearchInput>
        <SearchContent>Opps! Your search did not match any record. Please try different keywords~</SearchContent>
      </SearchPanel>
    </Content>
  )
}
