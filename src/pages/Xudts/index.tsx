import { Table } from 'antd'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useState } from 'react'
import { ColumnGroupType, ColumnType } from 'antd/lib/table'
import dayjs from 'dayjs'
import classNames from 'classnames'
import type { XUDT } from '../../models/Xudt'
import { Link } from '../../components/Link'
import Content from '../../components/Content'
import Pagination from '../../components/Pagination'
import SortButton from '../../components/SortButton'
import MultiFilterButton from '../../components/MultiFilterButton'
import { localeNumberString } from '../../utils/number'
import Loading from '../../components/Loading'
import SmallLoading from '../../components/Loading/SmallLoading'
import styles from './styles.module.scss'
import { usePaginationParamsInPage, useSearchParams, useSortParam } from '../../hooks'
import { explorerService } from '../../services/ExplorerService'
import { QueryResult } from '../../components/QueryResult'
import { FilterSortContainerOnMobile } from '../../components/FilterSortContainer'
import { Card } from '../../components/Card'
import { BooleanT } from '../../utils/array'
import XUDTTag from '../../components/XUDTTag'
import { SubmitTokenInfo } from '../../components/SubmitTokenInfo'
import XUDTTokenIcon from '../../assets/sudt_token.png'

type SortField = 'transactions' | 'addresses_count' | 'created_time' | 'mint_status'

const filterList = [
  // TODO: maybe removed in the future, hold on
  // {
  //   key: 'out-of-length-range',
  //   value: 'out-of-length-range',
  //   title: <XUDTTag tagName="out-of-length-range" />,
  //   to: '/xudts',
  // },
  {
    key: 'layer-1-asset',
    value: 'layer-1-asset',
    title: <XUDTTag tagName="layer-1-asset" />,
    to: '/xudts',
  },
  {
    key: 'layer-2-asset',
    value: 'layer-2-asset',
    title: <XUDTTag tagName="layer-2-asset" />,
    to: '/xudts',
  },
  {
    key: 'supply-limited',
    value: 'supply-limited',
    title: <XUDTTag tagName="supply-limited" />,
    to: '/xudts',
  },
]

const TokenInfo: FC<{ token: XUDT }> = ({ token }) => {
  const { t } = useTranslation()

  const symbol = token.symbol || `#${token.typeHash.substring(token.typeHash.length - 4)}`

  const fields: { name: string; value: ReactNode }[] = [
    {
      name: t('xudt.transactions'),
      value: localeNumberString(token.h24CkbTransactionsCount),
    },
    {
      name: t('xudt.unique_addresses'),
      value: localeNumberString(token.addressesCount),
    },
    {
      name: t('xudt.created_time'),
      value: token.createdAt ? dayjs(+token.createdAt).format('YYYY-MM-DD') : null,
    },
  ].filter(BooleanT())

  return (
    <Card key={token.typeHash} className={styles.tokensCard}>
      {token.published && (
        <dl className={styles.tokenInfo}>
          <dt className={styles.title}>Name</dt>
          <dd>
            <img className={styles.icon} src={token.iconFile ? token.iconFile : XUDTTokenIcon} alt="token icon" />
            <Link className={styles.link} to={`/xudt/${token.typeHash}`}>
              {symbol}
            </Link>
          </dd>
        </dl>
      )}
      {token.published && (
        <dl className={styles.tokenInfo}>
          <dt className={styles.title}>Symbol</dt>
          {token.fullName ? <dd className={styles.value}>{token.fullName}</dd> : null}
        </dl>
      )}
      {fields.map(field => (
        <dl className={styles.tokenInfo}>
          <dt className={styles.title}>{field.name}</dt>
          <dd className={styles.value}>{field.value}</dd>
        </dl>
      ))}
      <div className={styles.tokenInfo} style={{ flexDirection: 'row' }}>
        {token.xudtTags?.map(tag => (
          <XUDTTag tagName={tag} />
        ))}
      </div>
    </Card>
  )
}

export function TokensCard({
  query,
  sortParam,
  isEmpty,
}: {
  query: UseQueryResult<
    {
      tokens: XUDT[]
      total: number
      pageSize: number
    },
    unknown
  >
  sortParam?: ReturnType<typeof useSortParam<SortField>>
  isEmpty: boolean
}) {
  const { t } = useTranslation()

  return (
    <>
      <Card className={styles.filterSortCard} shadow={false}>
        <FilterSortContainerOnMobile>
          <span className={styles.sortOption}>
            {t('xudt.transactions')}
            <SortButton field="transactions" sortParam={sortParam} />
          </span>
          <span className={styles.sortOption}>
            {t('xudt.unique_addresses')}
            <SortButton field="addresses_count" sortParam={sortParam} />
          </span>
          <span className={styles.sortOption}>
            {t('xudt.created_time')}
            <SortButton field="created_time" sortParam={sortParam} />
          </span>
          <span className={styles.sortOption}>
            {t('xudt.title.tags')}
            <MultiFilterButton filterName="tags" key="" filterList={filterList} />
          </span>
        </FilterSortContainerOnMobile>
      </Card>

      {isEmpty ? (
        <div className={styles.tokensContentEmpty}>{t('xudt.tokens_empty')}</div>
      ) : (
        <QueryResult
          query={query}
          errorRender={() => <div className={styles.tokensContentEmpty}>{t('xudt.tokens_empty')}</div>}
          loadingRender={() => (
            <div className={styles.tokensLoadingPanel}>
              <SmallLoading />
            </div>
          )}
        >
          {data => (
            <div>
              {data?.tokens.map(token => (
                <TokenInfo key={token.typeHash} token={token} />
              ))}
            </div>
          )}
        </QueryResult>
      )}
    </>
  )
}

const TokenTable: FC<{
  query: UseQueryResult<
    {
      tokens: XUDT[]
      total: number
      pageSize: number
    },
    unknown
  >
  sortParam?: ReturnType<typeof useSortParam<SortField>>
  isEmpty: boolean
}> = ({ query, sortParam, isEmpty }) => {
  const { t } = useTranslation()

  const nullableColumns: (ColumnGroupType<XUDT> | ColumnType<XUDT> | false | undefined)[] = [
    {
      title: `${t('xudt.symbol')}&${t('xudt.name')}`,
      className: styles.colName,
      render: (_, token) => {
        const symbol = token.symbol || `#${token.typeHash.substring(token.typeHash.length - 4)}`
        return (
          <div className={styles.container}>
            <img className={styles.icon} src={token.iconFile ? token.iconFile : XUDTTokenIcon} alt="token icon" />
            <div className={styles.right}>
              <div className={styles.symbolAndName}>
                {token.published ? (
                  <>
                    <Link className={styles.link} to={`/xudt/${token.typeHash}`}>
                      {symbol}
                    </Link>
                    <span className={styles.name}>{token.fullName}</span>
                  </>
                ) : (
                  symbol
                )}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      title: (
        <>
          {t('xudt.title.tags')}
          <MultiFilterButton filterName="tags" key="" filterList={filterList} />
        </>
      ),
      className: styles.colTags,
      render: (_, token) => (
        <div className={styles.tags}>
          {token.xudtTags?.map(tag => (
            <XUDTTag tagName={tag} />
          ))}
        </div>
      ),
    },
    {
      title: (
        <>
          {t('xudt.transactions')}
          <SortButton field="transactions" sortParam={sortParam} />
        </>
      ),
      className: styles.colTransactions,
      render: (_, token) => localeNumberString(token.h24CkbTransactionsCount),
    },
    {
      title: (
        <>
          {t('xudt.unique_addresses')}
          <SortButton field="addresses_count" sortParam={sortParam} />
        </>
      ),
      className: styles.colAddressCount,
      render: (_, token) => localeNumberString(token.addressesCount),
    },
    {
      title: (
        <>
          {t('xudt.created_time')}
          <SortButton field="created_time" sortParam={sortParam} />
        </>
      ),
      className: styles.colCreatedTime,
      render: (_, token) => dayjs(+token.createdAt).format('YYYY-MM-DD'),
    },
  ]
  const columns = nullableColumns.filter(BooleanT())

  return (
    <Table
      className={styles.tokensTable}
      columns={columns}
      dataSource={isEmpty ? [] : query.data?.tokens ?? []}
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

const Xudts = () => {
  const { t } = useTranslation()
  const { tags } = useSearchParams('tags')
  const [isSubmitTokenInfoModalOpen, setIsSubmitTokenInfoModalOpen] = useState<boolean>(false)
  const { currentPage, pageSize: _pageSize, setPage } = usePaginationParamsInPage()
  const sortParam = useSortParam<SortField>(undefined, 'transactions.desc')
  const { sort } = sortParam

  const query = useQuery(['xudts', currentPage, _pageSize, sort, tags, 'true'], async () => {
    const {
      data: tokens,
      total,
      pageSize,
    } = await explorerService.api.fetchXudts(currentPage, _pageSize, sort ?? undefined, tags, 'true')
    if (tokens.length === 0) {
      throw new Error('Tokens empty')
    }
    return {
      tokens: tokens.map(token => ({
        ...token,
        // FIXME: data should be updated in the backend
        // issue: https://github.com/Magickbase/ckb-explorer-public-issues/issues/754
        xudtTags: token.xudtTags?.filter(tag => tag !== 'rgbpp-compatible'),
      })),
      total,
      pageSize,
    }
  })
  const total = query.data?.total ?? 0
  const pageSize = query.data?.pageSize ?? _pageSize
  const totalPages = Math.ceil(total / pageSize)

  const isEmpty = tags === ''

  return (
    <Content>
      <div className={classNames(styles.tokensPanel, 'container')}>
        <div className={styles.tokensTitlePanel}>
          <span>{t('xudt.xudts')}</span>

          <button
            type="button"
            className={styles.submitTokenInfoBtn}
            onClick={() => setIsSubmitTokenInfoModalOpen(true)}
          >
            {t('udt.submit_token_info')}
          </button>
        </div>

        <div className={styles.cards}>
          <TokensCard query={query} sortParam={sortParam} isEmpty={isEmpty} />
        </div>
        <div className={styles.table}>
          <TokenTable query={query} sortParam={sortParam} isEmpty={isEmpty} />
        </div>

        <Pagination
          className={styles.pagination}
          currentPage={currentPage}
          totalPages={isEmpty ? 0 : totalPages}
          onChange={setPage}
        />
      </div>
      {isSubmitTokenInfoModalOpen ? (
        <SubmitTokenInfo tagFilters={['xudt']} onClose={() => setIsSubmitTokenInfoModalOpen(false)} />
      ) : null}
    </Content>
  )
}

export default Xudts
