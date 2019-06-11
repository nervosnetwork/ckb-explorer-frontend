import React, { useContext } from 'react'
import styled from 'styled-components'
import AppContext from '../../contexts/App'
import { fetchSearchResult } from '../../http/fetcher'
import { BlockWrapper } from '../../http/response/Block'
import { TransactionWrapper } from '../../http/response/Transaction'
import { AddressWrapper } from '../../http/response/Address'
import browserHistory from '../../routes/history'
import SearchLogo from '../../asserts/search.png'

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
  > input {
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 16px;
    @media (max-width: 700px) {
      font-size: 12px;
    }
    padding-left: 20px;
    padding-right: 50px;
    border-radius: 6px;
    border-width: 0px;

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
  }

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

const Search = ({ opacity = false, content }: { opacity?: boolean; content?: string }) => {
  const appContext = useContext(AppContext)

  const handleSearchResult = (q: string) => {
    const query = q.replace(/^\s+|\s+$/g, '') // remove front and end blank
    if (!query) {
      appContext.toastMessage('Please input valid content', 3000)
    } else {
      appContext.showLoading()
      fetchSearchResult(query)
        .then((json: any) => {
          appContext.hideLoading()
          const homeSearchBar = document.getElementById('home__search__bar') as HTMLInputElement
          homeSearchBar.value = ''
          const { data } = json
          if (data.type === 'block') {
            browserHistory.push(`/block/${(data as BlockWrapper).attributes.block_hash}`)
          } else if (data.type === 'ckb_transaction') {
            browserHistory.push(`/transaction/${(data as TransactionWrapper).attributes.transaction_hash}`)
          } else if (data.type === 'address') {
            browserHistory.push(`/address/${(data as AddressWrapper).attributes.address_hash}`)
          } else if (data.type === 'lock_hash') {
            browserHistory.push(`/lockhash/${(data as AddressWrapper).attributes.lock_hash}`)
          } else {
            homeSearchBar.value = q
            browserHistory.push(`/search/fail?q=${query}`)
          }
        })
        .catch(() => {
          appContext.hideLoading()
          browserHistory.push(`/search/fail?q=${query}`)
        })
    }
  }

  const fetchStyle = () => {
    if (opacity) {
      return {
        opacity: 1,
        border: '2px solid #606060',
      }
    }
    if (window.innerWidth < 700) {
      return {
        borderRadius: '6px',
      }
    }
    return {
      borderRadius: '6px 0 0 6px',
    }
  }

  const searchPlaceholder = 'Block / Transaction / Address'

  return (
    <SearchPanel>
      {
        <input
          id="home__search__bar"
          placeholder={searchPlaceholder}
          defaultValue={content || ''}
          onKeyUp={(event: any) => {
            if (event.keyCode === 13) {
              const homeSearchBar = document.getElementById('home__search__bar') as HTMLInputElement
              handleSearchResult(homeSearchBar.value)
            }
          }}
          style={fetchStyle()}
        />
      }
      <div
        role="button"
        tabIndex={-1}
        onKeyPress={() => {}}
        onClick={() => {
          const homeSearchBar = document.getElementById('home__search__bar') as HTMLInputElement
          handleSearchResult(homeSearchBar.value)
        }}
      >
        <img src={SearchLogo} alt="search logo" />
      </div>
    </SearchPanel>
  )
}

export default Search
