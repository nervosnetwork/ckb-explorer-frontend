import React from 'react'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import Content from '../../components/Content'
import Search from '../../components/Search'
import i18n from '../../utils/i18n'
import { SearchFailType } from '../../utils/const'
import { isMainnet } from '../../utils/chain'
import { baseUrl } from '../../utils/util'
import { SearchContent, SearchPanel } from './styled'

const chainErrorMessage = () => {
  return isMainnet() ? i18n.t('search.address_type_testnet_error') : i18n.t('search.address_type_mainnet_error')
}

const chainUrlMessage = () => {
  return isMainnet() ? i18n.t('search.address_type_testnet_url') : i18n.t('search.address_type_mainnet_url')
}

export default () => {
  const { search } = useLocation()
  const parsed = queryString.parse(search)
  const { q, type } = parsed

  return (
    <Content>
      <SearchPanel className="container">
        <div className="search__fail__bar">
          <Search content={q as string} hasButton />
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
            <>
              <span>{i18n.t('search.empty_result')}</span>
              <span className="search__fail__items">{i18n.t('search.empty_result_items')}</span>
            </>
          )}
        </SearchContent>
      </SearchPanel>
    </Content>
  )
}
