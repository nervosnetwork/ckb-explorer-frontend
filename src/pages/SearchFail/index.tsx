import Content from '../../components/Content'
import Search from '../../components/Search'
import i18n from '../../utils/i18n'
import { SearchFailType, MAINNET_URL, TESTNET_URL } from '../../constants/common'
import { isMainnet } from '../../utils/chain'
import { SearchContent, SearchPanel } from './styled'
import { useSearchParams } from '../../utils/hook'

const chainErrorMessage = () =>
  isMainnet() ? i18n.t('search.address_type_testnet_error') : i18n.t('search.address_type_mainnet_error')

const chainUrlMessage = () =>
  isMainnet() ? i18n.t('search.address_type_testnet_url') : i18n.t('search.address_type_mainnet_url')

const targetUrl = isMainnet() ? TESTNET_URL : MAINNET_URL

export default ({ address }: { address?: string }) => {
  const params = useSearchParams('q', 'type')
  const { q, type } = params
  const query = address || q

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
              <span>{i18n.t('search.empty_result')}</span>
              <span className="searchFailItems">{i18n.t('search.empty_result_items')}</span>
            </>
          )}
        </SearchContent>
      </SearchPanel>
    </Content>
  )
}
