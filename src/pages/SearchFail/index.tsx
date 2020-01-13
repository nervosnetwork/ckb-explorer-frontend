import React from 'react'
import styled from 'styled-components'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import Content from '../../components/Content'
import Search from '../../components/Search'
import i18n from '../../utils/i18n'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { SearchFailType } from '../../utils/const'
import CONFIG from '../../config'
import { isMainnet } from '../../utils/chain'

const SearchPanel = styled.div`
  margin-top: 211px;
  margin-bottom: 266px;

  @media (max-width: 700px) {
    margin-top: 120px;
    margin-bottom: 150px;
  }

  .search__fail__bar {
    width: 80%;
    margin-left: 10%;
  }
`

const SearchContent = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #606060;
  max-width: 434px;
  margin: 0 auto;
  margin-top: 39px;
  text-align: center;

  a {
    color: ${props => props.theme.primary};
    margin-left: 3px;
  }

  a:hover {
    color: ${props => props.theme.primary};
  }

  @media (max-width: 700px) {
    max-width: 70%;
    font-size: 12px;
    margin-top: 18px;
  }
`

const baseUrl = () => {
  const mainnetUrl = `${CONFIG.MAINNET_URL}`
  const testnetUrl = `${CONFIG.MAINNET_URL}/${CONFIG.TESTNET_NAME}`

  return isMainnet() ? testnetUrl : mainnetUrl
}

const chainErrorMessage = () => {
  return isMainnet() ? i18n.t('search.address_type_testnet_error') : i18n.t('search.address_type_mainnet_error')
}

const chainUrlMessage = () => {
  return isMainnet() ? i18n.t('search.address_type_testnet_url') : i18n.t('search.address_type_mainnet_url')
}

export default ({ dispatch }: React.PropsWithoutRef<StateWithDispatch>) => {
  const { search } = useLocation()
  const parsed = queryString.parse(search)
  const { q, type } = parsed

  return (
    <Content>
      <SearchPanel className="container">
        <div className="search__fail__bar">
          <Search hasBorder content={q as string} dispatch={dispatch} />
        </div>
        <SearchContent>
          {type && type === SearchFailType.CHAIN_ERROR ? (
            <div>
              <span>{chainErrorMessage()}</span>
              <a href={`${baseUrl()}/address/${q}`} rel="noopener noreferrer">
                {chainUrlMessage()}
              </a>
            </div>
          ) : (
            i18n.t('search.empty_result')
          )}
        </SearchContent>
      </SearchPanel>
    </Content>
  )
}
