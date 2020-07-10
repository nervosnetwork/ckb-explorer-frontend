import React from 'react'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import Content from '../../components/Content'
import Search from '../../components/Search'
import i18n from '../../utils/i18n'
import { SearchFailType } from '../../utils/const'
import { isMainnet } from '../../utils/chain'
import { SearchContent, SearchPanel } from './styled'
import CONFIG from '../../config'

const chainErrorMessage = () => {
  return isMainnet() ? i18n.t('search.address_type_testnet_error') : i18n.t('search.address_type_mainnet_error')
}

const chainUrlMessage = () => {
  return isMainnet() ? i18n.t('search.address_type_testnet_url') : i18n.t('search.address_type_mainnet_url')
}

export const chainUrl = () => {
  const mainnetUrl = `${CONFIG.MAINNET_URL}`
  const testnetUrl = `${CONFIG.MAINNET_URL}/${CONFIG.TESTNET_NAME}`

  return isMainnet() ? testnetUrl : mainnetUrl
}

export default ({ address }: { address?: string }) => {
  const { search } = useLocation()
  const parsed = queryString.parse(search)
  let { q, type } = parsed
  q = address ? address : q

  return (
    <Content>
      <SearchPanel className="container">
        <div className="search__fail__bar">
          <Search content={q as string} hasButton />
        </div>
        <SearchContent>
          {(type && type === SearchFailType.CHAIN_ERROR) || address ? (
            <div>
              <span>{chainErrorMessage()}</span>
              <a href={`${chainUrl()}/address/${q}`} rel="noopener noreferrer">
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
