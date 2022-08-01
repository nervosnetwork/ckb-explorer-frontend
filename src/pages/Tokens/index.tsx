import { useEffect, useCallback } from 'react'
import { Tooltip } from 'antd'
import { Link, useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import Content from '../../components/Content'
import Pagination from '../../components/Pagination'
import {
  TokensPanel,
  TokensTableTitle,
  TokensTableContent,
  TokensTableItem,
  TokensContentEmpty,
  TokensLoadingPanel,
  TokensTitlePanel,
  TokensItemNamePanel,
  TokensPagination,
} from './styled'
import HelpIcon from '../../assets/qa_help.png'
import { parseDateNoTime } from '../../utils/date'
import { localeNumberString } from '../../utils/number'
import { useAppState, useDispatch } from '../../contexts/providers'
import getTokens from '../../service/app/tokens'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import i18n from '../../utils/i18n'
import Loading from '../../components/Loading'
import { isMobile } from '../../utils/screen'
import { udtSubmitEmail } from '../../utils/util'
import SmallLoading from '../../components/Loading/SmallLoading'
import { PageParams } from '../../constants/common'
import { parsePageNumber } from '../../utils/string'
import styles from './styles.module.scss'

const TokenItem = ({ token, isLast }: { token: State.UDT; isLast?: boolean }) => {
  const { displayName, fullName, uan } = token

  const name = displayName || fullName
  const symbol = uan || token.symbol || `#${token.typeHash.substring(token.typeHash.length - 4)}`
  const defaultName = i18n.t('udt.unknown_token')

  const transactions = isMobile() ? (
    <TokensTitlePanel>
      <span>{`${i18n.t('udt.transactions')}:`}</span>
      <span>{localeNumberString(token.h24CkbTransactionsCount)}</span>
    </TokensTitlePanel>
  ) : (
    localeNumberString(token.h24CkbTransactionsCount)
  )
  const addressCount = isMobile() ? (
    <TokensTitlePanel>
      <span>{`${i18n.t('udt.address_count')}:`}</span>
      <span>{localeNumberString(token.addressesCount)}</span>
    </TokensTitlePanel>
  ) : (
    localeNumberString(token.addressesCount)
  )

  return (
    <TokensTableItem>
      <div className="tokens__item__content">
        <div className="tokens__item__name__panel">
          <img src={token.iconFile ? token.iconFile : SUDTTokenIcon} alt="token icon" />
          <div>
            <TokensItemNamePanel>
              {name ? (
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
              {!name && (
                <Tooltip placement="bottom" title={i18n.t('udt.unknown_token_description')}>
                  <img src={HelpIcon} alt="token icon" />
                </Tooltip>
              )}
            </TokensItemNamePanel>
            {token.description && !isMobile() && <div className="tokens__item__description">{token.description}</div>}
          </div>
        </div>
        <div className="tokens__item__transactions">{transactions}</div>
        <div className="tokens__item__address__count">{addressCount}</div>
        {!isMobile() && (
          <div className="tokens__item__created__time">
            {parseDateNoTime(Number(token.createdAt) / 1000, false, '-')}
          </div>
        )}
      </div>
      {!isLast && <div className="tokens__item__separate" />}
    </TokensTableItem>
  )
}

const TokensTableState = () => {
  const {
    tokensState: { tokens, status },
  } = useAppState()

  switch (status) {
    case 'Error':
      return <TokensContentEmpty>{i18n.t('udt.tokens_empty')}</TokensContentEmpty>
    case 'OK':
      return (
        <TokensTableContent>
          {tokens.map((token, index) => (
            <TokenItem key={token.typeHash} token={token} isLast={index === tokens.length - 1} />
          ))}
        </TokensTableContent>
      )
    case 'InProgress':
    case 'None':
    default:
      return <TokensLoadingPanel>{isMobile() ? <SmallLoading /> : <Loading show />}</TokensLoadingPanel>
  }
}

export default () => {
  const dispatch = useDispatch()
  const { search } = useLocation()
  const history = useHistory()
  const parsed = queryString.parse(search)
  const currentPage = parsePageNumber(parsed.page, PageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, PageParams.PageSize)

  const {
    tokensState: { total },
  } = useAppState()

  const totalPages = Math.ceil(total / pageSize)

  const onChange = useCallback(
    (page: number) => {
      history.replace(`/tokens?page=${page}&size=${pageSize}`)
    },
    [history, pageSize],
  )

  useEffect(() => {
    if (pageSize > PageParams.MaxPageSize) {
      history.replace(`/tokens?page=${currentPage}&size=${PageParams.MaxPageSize}`)
    }
    getTokens(currentPage, pageSize, dispatch)
  }, [currentPage, pageSize, dispatch, history])

  return (
    <Content>
      <TokensPanel className="container">
        <div className="tokens__title__panel">
          <span>{i18n.t('udt.tokens')}</span>
          <a rel="noopener noreferrer" target="_blank" href={udtSubmitEmail()}>
            {i18n.t('udt.submit_token_info')}
          </a>
        </div>
        {!isMobile() && (
          <TokensTableTitle>
            <span>{i18n.t('udt.uan_name')}</span>
            <span>{i18n.t('udt.transactions')}</span>
            <span>{i18n.t('udt.address_count')}</span>
            <span>{i18n.t('udt.created_time')}</span>
          </TokensTableTitle>
        )}
        <TokensTableState />
        {totalPages > 1 && (
          <TokensPagination>
            <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
          </TokensPagination>
        )}
      </TokensPanel>
    </Content>
  )
}
