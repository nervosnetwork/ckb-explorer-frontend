import { Table, Tooltip } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { FC, Fragment, ReactNode, useState } from 'react'
import BigNumber from 'bignumber.js'
import { ColumnGroupType, ColumnType } from 'antd/lib/table'
import { Link } from '../../components/Link'
import Content from '../../components/Content'
import Pagination from '../../components/Pagination'
import SortButton from '../../components/SortButton'
import { TokensPanel, TokensContentEmpty, TokensLoadingPanel } from './styled'
import HelpIcon from '../../assets/qa_help.png'
import { parseDateNoTime } from '../../utils/date'
import { localeNumberString } from '../../utils/number'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import Loading from '../../components/Loading'
import SmallLoading from '../../components/Loading/SmallLoading'
import styles from './styles.module.scss'
import { useIsMobile, usePaginationParamsInPage, useSortParam } from '../../hooks'
import { explorerService } from '../../services/ExplorerService'
import { QueryResult } from '../../components/QueryResult'
import { SubmitTokenInfo } from '../../components/SubmitTokenInfo'
import { OmigaInscriptionCollection, UDT, isOmigaInscriptionCollection } from '../../models/UDT'
import { FilterSortContainerOnMobile } from '../../components/FilterSortContainer'
import { Card } from '../../components/Card'
import { BooleanT } from '../../utils/array'

type SortField = 'transactions' | 'addresses_count' | 'created_time' | 'mint_status'

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

const TokenInfo: FC<{ token: UDT | OmigaInscriptionCollection }> = ({ token }) => {
  const { displayName, fullName, uan } = token
  const { t } = useTranslation()

  const name = displayName || fullName
  const symbol = uan || token.symbol || `#${token.typeHash.substring(token.typeHash.length - 4)}`
  const defaultName = t('udt.unknown_token')

  const isKnown = (Boolean(name || symbol) && token.published) || isOmigaInscriptionCollection(token)

  const fields: { name: string; value: ReactNode }[] = [
    isOmigaInscriptionCollection(token) && {
      name: t('udt.status'),
      value: t(`udt.mint_status_${token.mintStatus}`),
    },
    {
      name: t('udt.transactions'),
      value: localeNumberString(token.h24CkbTransactionsCount),
    },
    {
      name: t('udt.address_count'),
      value: localeNumberString(token.addressesCount),
    },
    isOmigaInscriptionCollection(token) && {
      name: t('udt.created_time'),
      value: parseDateNoTime(Number(token.createdAt) / 1000, false, '-'),
    },
  ].filter(BooleanT())

  return (
    <div key={token.typeHash} className={styles.tokenInfo}>
      <span>
        {isOmigaInscriptionCollection(token) && !token.published && (
          <Tooltip placement="topLeft" title={t('udt.repeat_inscription_symbol')} arrowPointAtCenter>
            <WarningOutlined style={{ fontSize: '16px', color: '#FFB21E' }} />
          </Tooltip>
        )}
        <img className={styles.icon} src={token.iconFile ? token.iconFile : SUDTTokenIcon} alt="token icon" />
      </span>
      <span className={styles.symbol}>
        {isKnown ? (
          <Link
            className={styles.link}
            to={isOmigaInscriptionCollection(token) ? `/inscription/${token.infoTypeHash}` : `/sudt/${token.typeHash}`}
          >
            {symbol}
          </Link>
        ) : (
          symbol
        )}
      </span>

      {isOmigaInscriptionCollection(token) ? (
        <TokenProgress token={token} />
      ) : (
        <>
          <div className={styles.name}>
            {isKnown ? (
              name
            ) : (
              <>
                {defaultName}
                <Tooltip placement="bottom" title={t('udt.unknown_token_description')}>
                  <img className={styles.helpIcon} src={HelpIcon} alt="token icon" />
                </Tooltip>
              </>
            )}
          </div>

          {token.description && <div className={styles.description}>{token.description}</div>}
        </>
      )}

      {fields.map(field => (
        <Fragment key={field.name}>
          <span className={styles.fieldName}>{field.name}:</span>
          <span className={styles.fieldValue}>{field.value}</span>
        </Fragment>
      ))}
    </div>
  )
}

export function TokensCard({
  isInscription,
  query,
  sortParam,
}: {
  isInscription?: boolean
  query: UseQueryResult<
    {
      tokens: UDT[]
      total: number
      pageSize: number
    },
    unknown
  >
  sortParam?: ReturnType<typeof useSortParam<SortField>>
}) {
  const { t } = useTranslation()

  return (
    <>
      <Card className={styles.filterSortCard} shadow={false}>
        <FilterSortContainerOnMobile>
          {isInscription && (
            <span className={styles.sortOption}>
              {t('udt.status')}
              <SortButton field="mint_status" sortParam={sortParam} />
            </span>
          )}
          <span className={styles.sortOption}>
            {t('udt.transactions')}
            <SortButton field="transactions" sortParam={sortParam} />
          </span>
          <span className={styles.sortOption}>
            {t('udt.address_count')}
            <SortButton field="addresses_count" sortParam={sortParam} />
          </span>
          <span className={styles.sortOption}>
            {t('udt.created_time')}
            <SortButton field="created_time" sortParam={sortParam} />
          </span>
        </FilterSortContainerOnMobile>
      </Card>

      <QueryResult
        query={query}
        errorRender={() => <TokensContentEmpty>{t('udt.tokens_empty')}</TokensContentEmpty>}
        loadingRender={() => (
          <TokensLoadingPanel>
            <SmallLoading />
          </TokensLoadingPanel>
        )}
      >
        {data => (
          <Card className={styles.tokensCard}>
            {data?.tokens.map(token => (
              <TokenInfo key={token.typeHash} token={token} />
            ))}
          </Card>
        )}
      </QueryResult>
    </>
  )
}

const TokenTable: FC<{
  isInscription?: boolean
  query: UseQueryResult<
    {
      tokens: UDT[]
      total: number
      pageSize: number
    },
    unknown
  >
  sortParam?: ReturnType<typeof useSortParam<SortField>>
}> = ({ isInscription, query, sortParam }) => {
  const { t } = useTranslation()

  const nullableColumns: (
    | ColumnGroupType<UDT | OmigaInscriptionCollection>
    | ColumnType<UDT | OmigaInscriptionCollection>
    | false
    | undefined
  )[] = [
    {
      title: t('udt.uan_name'),
      className: styles.colName,
      render: (_, token) => {
        const { displayName, fullName, uan } = token
        const name = displayName || fullName
        const symbol = uan || token.symbol || `#${token.typeHash.substring(token.typeHash.length - 4)}`
        const defaultName = t('udt.unknown_token')
        const isKnown = (Boolean(name) && token.published) || isOmigaInscriptionCollection(token)
        return (
          <div className={styles.container}>
            <div className={styles.warningIcon}>
              {isOmigaInscriptionCollection(token) && !token.published && (
                <Tooltip title={t('udt.repeat_inscription_symbol')}>
                  <WarningOutlined style={{ fontSize: '16px', color: '#FFB21E' }} />
                </Tooltip>
              )}
            </div>

            <img className={styles.icon} src={token.iconFile ? token.iconFile : SUDTTokenIcon} alt="token icon" />
            <div className={styles.right}>
              <div className={styles.symbolAndName}>
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
                    {symbol}
                    <span className={styles.name}>{defaultName}</span>
                    <Tooltip placement="bottom" title={t('udt.unknown_token_description')}>
                      <img className={styles.helpIcon} src={HelpIcon} alt="token icon" />
                    </Tooltip>
                  </>
                )}
              </div>

              {token.description && <div className={styles.description}>{token.description}</div>}
            </div>
          </div>
        )
      },
    },
    isInscription && {
      title: (
        <>
          {t('udt.status')}
          <SortButton field="mint_status" sortParam={sortParam} />
        </>
      ),
      className: styles.colStatus,
      render: (_, token) => {
        if (!isOmigaInscriptionCollection(token)) return null

        return (
          <div className={styles.container}>
            <span className={styles.mintStatus}>{t(`udt.mint_status_${token.mintStatus}`)}</span>
            <TokenProgress token={token} />
          </div>
        )
      },
    },
    {
      title: (
        <>
          {t('udt.transactions')}
          <SortButton field="transactions" sortParam={sortParam} />
        </>
      ),
      className: styles.colTransactions,
      render: (_, token) => localeNumberString(token.h24CkbTransactionsCount),
    },
    {
      title: (
        <>
          {t('udt.address_count')}
          <SortButton field="addresses_count" sortParam={sortParam} />
        </>
      ),
      className: styles.colAddressCount,
      render: (_, token) => localeNumberString(token.addressesCount),
    },
    {
      title: (
        <>
          {t('udt.created_time')}
          <SortButton field="created_time" sortParam={sortParam} />
        </>
      ),
      className: styles.colCreatedTime,
      render: (_, token) => parseDateNoTime(Number(token.createdAt) / 1000, false, '-'),
    },
  ]
  const columns = nullableColumns.filter(BooleanT())

  return (
    <Table
      className={styles.tokensTable}
      columns={columns}
      dataSource={query.data?.tokens ?? []}
      pagination={false}
      loading={
        query.isLoading
          ? {
              indicator: <Loading className={styles.loading} show />,
            }
          : false
      }
    />
  )
}

const Tokens: FC<{ isInscription?: boolean }> = ({ isInscription }) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const [isSubmitTokenInfoModalOpen, setIsSubmitTokenInfoModalOpen] = useState<boolean>(false)
  const { currentPage, pageSize: _pageSize, setPage } = usePaginationParamsInPage()
  const sortParam = useSortParam<SortField>(undefined, 'transactions.desc')
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
    // {/* <> */}
    // {/*   <Content> */}
    // {/*     <TokensPanel className="container"> */}
    // {/*       <div className="tokensTitlePanel"> */}
    // {/*         <span>{isInscription ? t('udt.inscriptions') : t('udt.tokens')}</span> */}
    // {/*       </div> */}
    // {/*       <TokensTableTitle> */}
    // {/*         {!isMobile && <span>{t('udt.uan_name')}</span>} */}
    // {/*         {isInscription && ( */}
    // {/*           <span className={styles.colStatus}> */}
    // {/*             {t('udt.status')} */}
    // {/*             <SortButton field="mint_status" sortParam={sortParam} /> */}
    // {/*           </span> */}
    // {/*         )} */}
    // {/*         <span> */}
    // {/*           {t('udt.transactions')} */}
    // {/*           <SortButton field="transactions" sortParam={sortParam} /> */}
    // {/*         </span> */}
    // {/*         <span> */}
    // {/*           {t('udt.address_count')} */}
    // {/*           <SortButton field="addresses_count" sortParam={sortParam} /> */}
    // {/*         </span> */}
    // {/*         <span> */}
    // {/*           {t('udt.created_time')} */}
    // {/*           <SortButton field="created_time" sortParam={sortParam} /> */}
    // {/*         </span> */}
    // {/*       </TokensTableTitle> */}

    // {/*       <QueryResult */}
    // {/*         query={query} */}
    // {/*         errorRender={() => <TokensContentEmpty>{t('udt.tokens_empty')}</TokensContentEmpty>} */}
    // {/*         loadingRender={() => ( */}
    // {/*           <TokensLoadingPanel>{isMobile ? <SmallLoading /> : <Loading show />}</TokensLoadingPanel> */}
    // {/*         )} */}
    // {/*       > */}
    // {/*         {data => ( */}
    // {/*           <TokensTableContent> */}
    // {/*             {data && */}
    // {/*               data.tokens.map((token, index) => ( */}
    // {/*                 <TokenItem key={token.typeHash} token={token} isLast={index === data.tokens.length - 1} /> */}
    // {/*               ))} */}
    // {/*           </TokensTableContent> */}
    // {/*         )} */}
    // {/*       </QueryResult> */}

    // {/*       <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setPage} /> */}
    // {/*     </TokensPanel> */}
    // {/*   </Content> */}
    // {/* </> */}
    <>
      <Content>
        <TokensPanel className="container">
          <div className="tokensTitlePanel">
            <span>{isInscription ? t('udt.inscriptions') : t('udt.tokens')}</span>
            <button
              type="button"
              className={styles.submitTokenInfoBtn}
              onClick={() => setIsSubmitTokenInfoModalOpen(true)}
            >
              {t('udt.submit_token_info')}
            </button>
          </div>

          {isMobile ? (
            <TokensCard isInscription={isInscription} query={query} sortParam={sortParam} />
          ) : (
            <TokenTable isInscription={isInscription} query={query} sortParam={sortParam} />
          )}

          <Pagination
            className={styles.pagination}
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setPage}
          />
        </TokensPanel>
        {isSubmitTokenInfoModalOpen ? <SubmitTokenInfo onClose={() => setIsSubmitTokenInfoModalOpen(false)} /> : null}
      </Content>
    </>
  )
}

export default Tokens
