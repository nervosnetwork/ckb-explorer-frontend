import { Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import BigNumber from 'bignumber.js'
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
import Loading from '../../components/Loading'
import { udtSubmitEmail } from '../../utils/util'
import SmallLoading from '../../components/Loading/SmallLoading'
import styles from './styles.module.scss'
import { useIsMobile, usePaginationParamsInPage, useSortParam } from '../../hooks'
import { explorerService } from '../../services/ExplorerService'
import { QueryResult } from '../../components/QueryResult'
import { OmigaInscriptionCollection, UDT, isOmigaInscriptionCollection } from '../../models/UDT'

const TokenProgress: FC<{ token: OmigaInscriptionCollection }> = ({ token }) => {
  return (
    <span className={styles.progress}>
      <span
        className={styles.block}
        style={{
          width: `${BigNumber(token.totalAmount).div(BigNumber(token.expectedSupply)).toNumber() * 100}%`,
        }}
      />
    </span>
  )
}

const TokenItem = ({ token, isLast }: { token: UDT | OmigaInscriptionCollection; isLast?: boolean }) => {
  const { displayName, fullName, uan } = token
  const { t } = useTranslation()

  const name = displayName || fullName
  const symbol = uan || token.symbol || `#${token.typeHash.substring(token.typeHash.length - 4)}`
  const defaultName = t('udt.unknown_token')
  const isMobile = useIsMobile()

  const mintStatus =
    isOmigaInscriptionCollection(token) &&
    (isMobile ? (
      <TokensTitlePanel>
        <span>{`${t('udt.status')}:`}</span>
        <span>{t(`udt.mint_status_${token.mintStatus}`)}</span>
      </TokensTitlePanel>
    ) : (
      <>
        <span className={styles.mintStatus}>{t(`udt.mint_status_${token.mintStatus}`)}</span>
        <TokenProgress token={token} />
      </>
    ))
  const transactions = isMobile ? (
    <TokensTitlePanel>
      <span>{`${t('udt.transactions')}:`}</span>
      <span>{localeNumberString(token.h24CkbTransactionsCount)}</span>
    </TokensTitlePanel>
  ) : (
    localeNumberString(token.h24CkbTransactionsCount)
  )
  const addressCount = isMobile ? (
    <TokensTitlePanel>
      <span>{`${t('udt.address_count')}:`}</span>
      <span>{localeNumberString(token.addressesCount)}</span>
    </TokensTitlePanel>
  ) : (
    localeNumberString(token.addressesCount)
  )

  const isKnown = (Boolean(name) && token.published) || isOmigaInscriptionCollection(token)

  return (
    <TokensTableItem>
      <div className="tokensItemContent">
        <div className="tokensItemNamePanel">
          <img src={token.iconFile ? token.iconFile : SUDTTokenIcon} alt="token icon" />
          <div>
            <TokensItemNamePanel>
              {isKnown ? (
                <Link
                  className={styles.link}
                  to={
                    isOmigaInscriptionCollection(token)
                      ? `/inscription/${token.infoTypeHash}`
                      : `/sudt/${token.typeHash}`
                  }
                >
                  {symbol}
                  {!isOmigaInscriptionCollection(token) && <span className={styles.name}>{name}</span>}
                </Link>
              ) : (
                <>
                  <span>
                    {symbol}
                    <span className={styles.name}>{defaultName}</span>
                  </span>
                  <Tooltip placement="bottom" title={t('udt.unknown_token_description')}>
                    <img src={HelpIcon} alt="token icon" />
                  </Tooltip>
                </>
              )}
            </TokensItemNamePanel>
            {token.description && !isMobile && <div className="tokensItemDescription">{token.description}</div>}
          </div>
        </div>
        {isOmigaInscriptionCollection(token) && (
          <>
            {isMobile && <TokenProgress token={token} />}
            <div className="tokensItemMintStatus">{mintStatus}</div>
          </>
        )}
        <div className="tokensItemTransactions">{transactions}</div>
        <div className="tokensItemAddressCount">{addressCount}</div>
        {!isMobile && (
          <div className="tokensItemCreatedTime">{parseDateNoTime(Number(token.createdAt) / 1000, false, '-')}</div>
        )}
      </div>
      {!isLast && <div className="tokensItemSeparate" />}
    </TokensTableItem>
  )
}

const Tokens: FC<{ isInscription?: boolean }> = ({ isInscription }) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const { currentPage, pageSize: _pageSize, setPage } = usePaginationParamsInPage()
  const sortParam = useSortParam(undefined, 'transactions.desc')
  const { sort } = sortParam

  const query = useQuery(['tokens', currentPage, _pageSize, sort], async () => {
    const {
      data: tokens,
      total,
      pageSize,
    } = await explorerService.api[isInscription ? 'fetchOmigaInscriptions' : 'fetchTokens'](
      currentPage,
      _pageSize,
      sort ?? undefined,
    )
    if (tokens.length === 0) {
      throw new Error('Tokens empty')
    }
    return {
      tokens,
      total,
      pageSize,
    }
  })
  const total = query.data?.total ?? 0
  const pageSize = query.data?.pageSize ?? _pageSize
  const totalPages = Math.ceil(total / pageSize)

  return (
    <Content>
      <TokensPanel className="container">
        <div className="tokensTitlePanel">
          <span>{isInscription ? t('udt.inscriptions') : t('udt.tokens')}</span>
          <a rel="noopener noreferrer" target="_blank" href={udtSubmitEmail()}>
            {t('udt.submit_token_info')}
          </a>
        </div>
        <TokensTableTitle>
          {!isMobile && <span>{t('udt.uan_name')}</span>}
          {isInscription && (
            <span className={styles.colStatus}>
              {t('udt.status')}
              <SortButton field="mint_status" sortParam={sortParam} />
            </span>
          )}
          <span>
            {t('udt.transactions')}
            <SortButton field="transactions" sortParam={sortParam} />
          </span>
          <span>
            {t('udt.address_count')}
            <SortButton field="addresses_count" sortParam={sortParam} />
          </span>
          <span>
            {t('udt.created_time')}
            <SortButton field="created_time" sortParam={sortParam} />
          </span>
        </TokensTableTitle>

        <QueryResult
          query={query}
          errorRender={() => <TokensContentEmpty>{t('udt.tokens_empty')}</TokensContentEmpty>}
          loadingRender={() => (
            <TokensLoadingPanel>{isMobile ? <SmallLoading /> : <Loading show />}</TokensLoadingPanel>
          )}
        >
          {data => (
            <TokensTableContent>
              {data?.tokens.map((token, index) => (
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

export default Tokens
