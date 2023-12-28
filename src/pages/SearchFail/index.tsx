import { useTranslation } from 'react-i18next'
import Content from '../../components/Content'
import Search from '../../components/Search'
import { SearchFailType, MAINNET_URL, TESTNET_URL } from '../../constants/common'
import { isMainnet } from '../../utils/chain'
import { SearchContent, SearchPanel } from './styled'
import { useSearchParams } from '../../hooks'

const targetUrl = isMainnet() ? TESTNET_URL : MAINNET_URL

export default ({ address }: { address?: string }) => {
  const { t } = useTranslation()
  const params = useSearchParams('q', 'type')
  const { q, type } = params
  const query = address || q

  const chainErrorMessage = () =>
    isMainnet() ? t('search.address_type_testnet_error') : t('search.address_type_mainnet_error')

  const chainUrlMessage = () =>
    isMainnet() ? t('search.address_type_testnet_url') : t('search.address_type_mainnet_url')

  return (
    <Content>
      <SearchPanel className="container">
        <div className="searchFailBar">
          <Search content={query as string} hasButton />
        </div>
        <SearchContent>
          {type === SearchFailType.CHAIN_ERROR || address ? (
            <div>
              <span>{chainErrorMessage()}</span>
              <a href={`${targetUrl}address/${q}`} rel="noopener noreferrer">
                {chainUrlMessage()}
              </a>
            </div>
          ) : (
            <>
              <span>{t('search.empty_result')}</span>
              <span className="searchFailItems">{t('search.empty_result_items')}</span>
            </>
          )}
        </SearchContent>
      </SearchPanel>
    </Content>
  )
}
