import { TriangleAlert, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { FC, Fragment, ReactNode, useState } from 'react'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { Link } from '../../components/Link'
import Content from '../../components/Content'
import Pagination from '../../components/Pagination'
import SortButton from '../../components/SortButton'
import HelpIcon from '../../assets/qa_help.png'
import { localeNumberString } from '../../utils/number'
import FtFallbackIcon from '../../assets/ft_fallback_icon.png'
import SmallLoading from '../../components/Loading/SmallLoading'
import styles from './styles.module.scss'
import { useIsMobile, usePaginationParamsInPage, useSortParam } from '../../hooks'
import { explorerService } from '../../services/ExplorerService'
import { QueryResult } from '../../components/QueryResult'
import { SubmitTokenInfo } from '../../components/SubmitTokenInfo'
import { OmigaInscriptionCollection, UDT, isOmigaInscriptionCollection } from '../../models/UDT'
import { Card } from '../../components/Card'
import { scripts } from '../ScriptList'
import { ReactComponent as OpenSourceIcon } from '../../assets/open-source.svg'
import { BooleanT } from '../../utils/array'
import Tooltip from '../../components/Tooltip'
import Loading from '../../components/Loading'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'

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
  const { fullName } = token
  const { t } = useTranslation()

  const name = fullName
  const symbol = token.symbol || `#${token.typeHash.substring(token.typeHash.length - 4)}`
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
      value: dayjs(+token.createdAt).format('YYYY-MM-DD'),
    },
  ].filter(BooleanT())

  return (
    <div key={token.typeHash} className={styles.tokenInfo}>
      <span className="flex items-center gap-1">
        {isOmigaInscriptionCollection(token) && (token.isRepeatedSymbol ?? !token.published) && (
          <Tooltip trigger={<TriangleAlert className="text-[#FFB21E]" size={16} />} placement="top">
            {t('udt.repeat_inscription_symbol')}
          </Tooltip>
        )}
        <img className={styles.icon} src={token.iconFile ? token.iconFile : FtFallbackIcon} alt="token icon" />
      </span>
      <span className={styles.symbol}>
        {isKnown ? (
          <Link
            className={styles.link}
            title={symbol}
            to={isOmigaInscriptionCollection(token) ? `/inscription/${token.infoTypeHash}` : `/sudt/${token.typeHash}`}
          >
            <div className={styles.symbolWithEllipsis}>{symbol}</div>
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
                <Tooltip
                  trigger={<img className={styles.helpIcon} src={HelpIcon} alt="token icon" />}
                  placement="bottom"
                >
                  {t('udt.unknown_token_description')}
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
  const sortParamByQuery = useSortParam<SortField>(undefined, 'transactions.desc')
  const { sortBy, orderBy, handleSortClick, updateOrderBy } = sortParam ?? sortParamByQuery

  return (
    <>
      <Card className={styles.filterSortCard} shadow={false}>
        <div>
          <Select value={sortBy} onValueChange={value => handleSortClick(value as SortField)}>
            <SelectTrigger style={{ borderWidth: 1, padding: '0.5rem 0.75rem', width: '180px' }}>
              <SelectValue placeholder="sorting" />
            </SelectTrigger>
            <SelectContent>
              {isInscription && <SelectItem value="mint_status">{t('udt.status')}</SelectItem>}
              <SelectItem value="transactions">{t('udt.transactions')}</SelectItem>
              <SelectItem value="addresses_count">{t('udt.address_count')}</SelectItem>
              <SelectItem value="created_time">{t('udt.created_time')}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            style={{ borderWidth: 1 }}
            onClick={() => updateOrderBy(orderBy === 'desc' ? 'asc' : 'desc')}
          >
            {orderBy === 'desc' ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />}
          </Button>
        </div>
      </Card>

      <QueryResult
        query={query}
        errorRender={() => <div className={styles.tokensContentEmpty}>{t('udt.tokens_empty')}</div>}
        loadingRender={() => (
          <div className={styles.tokensLoadingPanel}>
            <SmallLoading />
          </div>
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

  const nullableColumns = [
    {
      title: t('udt.name'),
      className: styles.colName,
      key: 'name',
      render: (token: UDT) => {
        const { fullName } = token
        const name = fullName
        const symbol = token.symbol || `#${token.typeHash.substring(token.typeHash.length - 4)}`
        const defaultName = t('udt.unknown_token')
        const isKnown = (Boolean(name) && token.published) || isOmigaInscriptionCollection(token)
        return (
          <div className={styles.container}>
            <div className={styles.warningIcon}>
              {isOmigaInscriptionCollection(token) && (token.isRepeatedSymbol ?? !token.published) && (
                <Tooltip trigger={<TriangleAlert className="text-[#FFB21E]" size={16} />}>
                  {t('udt.repeat_inscription_symbol')}
                </Tooltip>
              )}
            </div>

            <img className={styles.icon} src={token.iconFile ? token.iconFile : FtFallbackIcon} alt="token icon" />
            <div className={styles.right}>
              <div className={styles.symbolAndName}>
                {isKnown ? (
                  <Link
                    className={styles.link}
                    title={symbol}
                    to={
                      isOmigaInscriptionCollection(token)
                        ? `/inscription/${token.infoTypeHash}`
                        : `/sudt/${token.typeHash}`
                    }
                  >
                    <div className={styles.symbolWithEllipsis}>{symbol}</div>
                    {!isOmigaInscriptionCollection(token) && (
                      <Tooltip trigger={<span className={styles.name}>{name}</span>} placement="bottom">
                        {name}
                      </Tooltip>
                    )}
                  </Link>
                ) : (
                  <>
                    {symbol}
                    <span className={styles.name}>{defaultName}</span>
                    <Tooltip
                      trigger={<img className={styles.helpIcon} src={HelpIcon} alt="token icon" />}
                      placement="bottom"
                    >
                      {t('udt.unknown_token_description')}
                    </Tooltip>
                  </>
                )}
              </div>

              {token.description && (
                <Tooltip trigger={<div className={styles.description}>{token.description}</div>} placement="bottom">
                  {token.description}
                </Tooltip>
              )}
            </div>
          </div>
        )
      },
    },
    isInscription && {
      title: (
        <span>
          {t('udt.status')}
          <SortButton field="mint_status" sortParam={sortParam} />
        </span>
      ),
      className: styles.colStatus,
      key: 'status',
      render: (token: UDT) => {
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
        <span>
          {t('udt.transactions')}
          <SortButton field="transactions" sortParam={sortParam} />
        </span>
      ),
      className: styles.colTransactions,
      key: 'transactions',
      render: (token: UDT) => localeNumberString(token.h24CkbTransactionsCount),
    },
    {
      title: (
        <span>
          {t('udt.address_count')}
          <SortButton field="addresses_count" sortParam={sortParam} />
        </span>
      ),
      className: styles.colAddressCount,
      key: 'addresses_count',
      render: (token: UDT) => localeNumberString(token.addressesCount),
    },
    {
      title: (
        <span>
          {t('udt.created_time')}
          <SortButton field="created_time" sortParam={sortParam} />
        </span>
      ),
      className: styles.colCreatedTime,
      key: 'created_time',
      render: (token: UDT) => dayjs(+token.createdAt).format('YYYY-MM-DD'),
    },
  ]
  const columns = nullableColumns.filter(BooleanT())

  let content: ReactNode = null
  if (query.isLoading) {
    content = (
      <tr>
        <td colSpan={columns.length}>
          <Loading className={styles.loading} show />
        </td>
      </tr>
    )
  } else if (!query.data?.tokens.length) {
    content = (
      <tr>
        <td colSpan={columns.length}>
          <div className={styles.tokensContentEmpty}>{t('udt.tokens_empty')}</div>
        </td>
      </tr>
    )
  } else {
    content = (
      <>
        {query.data?.tokens.map(token => (
          <tr key={token.typeHash}>
            {columns.map(column => (
              <td key={column.key} className={column.className} style={{ width: `${100 / columns.length}%` }}>
                {column.render?.(token)}
              </td>
            ))}
          </tr>
        ))}
      </>
    )
  }

  return (
    <table className={styles.tokensTable}>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column.key} style={{ width: `${100 / columns.length}%` }}>
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{content}</tbody>
    </table>
  )
}

const sudtCodeUrl = scripts.get('sudt')?.code

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
    <Content>
      <div className={`${styles.tokensPanel} container`}>
        <div className="tokensTitlePanel">
          <div className={styles.title}>
            <span className={styles.titleText}>
              {isInscription ? t('udt.inscriptions') : t('udt.tokens')}
              {sudtCodeUrl ? (
                <Link to={sudtCodeUrl}>
                  {t('scripts.open_source_script')}
                  <OpenSourceIcon />
                </Link>
              ) : null}
            </span>
            <span className={styles.currentPath}>
              {t('udt.udts')} &gt;{' '}
              <span className={styles.currentPage}>{isInscription ? t('udt.inscriptions') : t('udt.tokens')}</span>
            </span>
          </div>
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
      </div>
      {isSubmitTokenInfoModalOpen ? (
        <SubmitTokenInfo tagFilters={['sudt']} onClose={() => setIsSubmitTokenInfoModalOpen(false)} />
      ) : null}
    </Content>
  )
}

export default Tokens
