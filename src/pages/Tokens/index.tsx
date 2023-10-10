import { Tooltip } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import Content from '../../components/Content'
import Pagination from '../../components/Pagination'
import SortButton from '../../components/SortButton'
import {
  TokensPanel,
  TokensTableTitle,
  TokensTableContent,
  TokensTableItem,
  TokensContentEmpty,
  TokensLoadingPanel,
  TokensTitlePanel,
  TokensItemNamePanel,
} from './styled'
import HelpIcon from '../../assets/qa_help.png'
import { parseDateNoTime } from '../../utils/date'
import { localeNumberString } from '../../utils/number'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import i18n from '../../utils/i18n'
import Loading from '../../components/Loading'
import { udtSubmitEmail } from '../../utils/util'
import SmallLoading from '../../components/Loading/SmallLoading'
import styles from './styles.module.scss'
import { useIsMobile, usePaginationParamsInPage } from '../../utils/hook'
import { explorerService } from '../../services/ExplorerService'
import { QueryResult } from '../../components/QueryResult'

const TokenItem = ({ token, isLast }: { token: State.UDT; isLast?: boolean }) => {
  const { displayName, fullName, uan } = token

  const name = displayName || fullName
  const symbol = uan || token.symbol || `#${token.typeHash.substring(token.typeHash.length - 4)}`
  const defaultName = i18n.t('udt.unknown_token')
  const isMobile = useIsMobile()

  const transactions = isMobile ? (
    <TokensTitlePanel>
      <span>{`${i18n.t('udt.transactions')}:`}</span>
      <span>{localeNumberString(token.h24CkbTransactionsCount)}</span>
    </TokensTitlePanel>
  ) : (
    localeNumberString(token.h24CkbTransactionsCount)
  )
  const addressCount = isMobile ? (
    <TokensTitlePanel>
      <span>{`${i18n.t('udt.address_count')}:`}</span>
      <span>{localeNumberString(token.addressesCount)}</span>
    </TokensTitlePanel>
  ) : (
    localeNumberString(token.addressesCount)
  )

  const isKnown = Boolean(name) && token.published

  return (
    <TokensTableItem>
      <div className="tokens__item__content">
        <div className="tokens__item__name__panel">
          <img src={token.iconFile ? token.iconFile : SUDTTokenIcon} alt="token icon" />
          <div>
            <TokensItemNamePanel>
              {isKnown ? (
                <Link to={`/sudt/${token.typeHash}`}>
                  {symbol}
                  <span className={styles.name}>{name}</span>
                </Link>
              ) : (
                <span>
                  {symbol}
                  <span className={styles.name}>{defaultName}</span>
                </span>
              )}
              {!isKnown && (
                <Tooltip placement="bottom" title={i18n.t('udt.unknown_token_description')}>
                  <img src={HelpIcon} alt="token icon" />
                </Tooltip>
              )}
            </TokensItemNamePanel>
            {token.description && !isMobile && <div className="tokens__item__description">{token.description}</div>}
          </div>
        </div>
        <div className="tokens__item__transactions">{transactions}</div>
        <div className="tokens__item__address__count">{addressCount}</div>
        {!isMobile && (
          <div className="tokens__item__created__time">
            {parseDateNoTime(Number(token.createdAt) / 1000, false, '-')}
          </div>
        )}
      </div>
      {!isLast && <div className="tokens__item__separate" />}
    </TokensTableItem>
  )
}

export default () => {
  const isMobile = useIsMobile()
  const { currentPage, pageSize: _pageSize, setPage } = usePaginationParamsInPage()

  const { location } = useHistory()
  const sort = new URLSearchParams(location.search).get('sort')

  const query = useQuery(['tokens', currentPage, _pageSize, sort], async () => {
    const { data, meta } = await explorerService.api.fetchTokens(currentPage, _pageSize, sort ?? undefined)
    if (data == null || data.length === 0) {
      throw new Error('Tokens empty')
    }
    return {
      total: meta?.total ?? 0,
      tokens: data.map(wrapper => wrapper.attributes),
      pageSize: meta?.pageSize,
    }
  })
  const total = query.data?.total ?? 0
  const pageSize = query.data?.pageSize ?? _pageSize
  const totalPages = Math.ceil(total / pageSize)

  return (
    <Content>
      <TokensPanel className="container">
        <div className="tokens__title__panel">
          <span>{i18n.t('udt.tokens')}</span>
          <a rel="noopener noreferrer" target="_blank" href={udtSubmitEmail()}>
            {i18n.t('udt.submit_token_info')}
          </a>
        </div>
        <TokensTableTitle>
          {!isMobile && <span>{i18n.t('udt.uan_name')}</span>}
          <span>
            {i18n.t('udt.transactions')}
            <SortButton field="transactions" />
          </span>
          <span>
            {i18n.t('udt.address_count')}
            <SortButton field="addresses_count" />
          </span>
          <span>
            {i18n.t('udt.created_time')}
            <SortButton field="created_time" />
          </span>
        </TokensTableTitle>

        <QueryResult
          query={query}
          errorRender={() => <TokensContentEmpty>{i18n.t('udt.tokens_empty')}</TokensContentEmpty>}
          loadingRender={() => (
            <TokensLoadingPanel>{isMobile ? <SmallLoading /> : <Loading show />}</TokensLoadingPanel>
          )}
        >
          {data => (
            <TokensTableContent>
              {data.tokens.map((token, index) => (
                <TokenItem key={token.typeHash} token={token} isLast={index === data.tokens.length - 1} />
              ))}
            </TokensTableContent>
          )}
        </QueryResult>

        <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setPage} />
      </TokensPanel>
    </Content>
  )
}
