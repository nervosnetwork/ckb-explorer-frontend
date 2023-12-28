import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Popover } from 'antd'
import Content from '../../components/Content'
import { SimpleUDTContentPanel, UDTTransactionTitlePanel } from './styled'
import SimpleUDTComp, { SimpleUDTOverviewCard } from './SimpleUDTComp'
import { useIsMobile, usePaginationParamsInPage } from '../../hooks'
import Filter from '../../components/Search/Filter'
import { localeNumberString } from '../../utils/number'
import { explorerService } from '../../services/ExplorerService'
import { deprecatedAddrToNewAddr } from '../../utils/util'
import { QueryResult } from '../../components/QueryResult'
import { defaultUDTInfo } from './state'
import { ReactComponent as FilterIcon } from '../../assets/filter_icon.svg'
import { ReactComponent as SelectedCheckIcon } from '../../assets/selected_check_icon.svg'
import styles from './styles.module.scss'
import { Cell } from '../../models/Cell'

enum TransactionType {
  Mint = 'mint',
  Transfer = 'normal',
  Burn = 'destruction',
}

export const SimpleUDT = () => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { push } = useHistory()
  const { search } = useLocation()
  const { hash: typeHash } = useParams<{ hash: string }>()
  const { currentPage, pageSize: _pageSize, setPage } = usePaginationParamsInPage()

  const query = new URLSearchParams(search)
  const filter = query.get('filter')
  const type = query.get('type')

  const querySimpleUDT = useQuery(['simple-udt'], () => explorerService.api.fetchSimpleUDT(typeHash))
  const udt = querySimpleUDT.data ?? defaultUDTInfo

  const querySimpleUDTTransactions = useQuery(
    ['simple-udt-transactions', typeHash, currentPage, _pageSize, filter, type],
    async () => {
      const {
        data: transactions,
        total,
        pageSize: resPageSize,
      } = await explorerService.api.fetchSimpleUDTTransactions({
        typeHash,
        page: currentPage,
        size: pageSize,
        filter,
        type,
      })

      const ensureCellAddrIsNewFormat = (cell: Cell) => ({
        ...cell,
        addressHash: deprecatedAddrToNewAddr(cell.addressHash),
      })

      return {
        transactions: transactions.map(tx => ({
          ...tx,
          displayInputs: tx.displayInputs.map(ensureCellAddrIsNewFormat),
          displayOutputs: tx.displayOutputs.map(ensureCellAddrIsNewFormat),
        })),
        total,
        pageSize: resPageSize,
      }
    },
  )
  const total = querySimpleUDTTransactions.data?.total ?? 0
  const filterNoResult = !!filter && querySimpleUDTTransactions.isError
  const pageSize: number = querySimpleUDTTransactions.data?.pageSize ?? _pageSize

  const filterList: { value: TransactionType; title: string }[] = [
    {
      value: TransactionType.Mint,
      title: t('udt.view-mint-txns'),
    },
    {
      value: TransactionType.Transfer,
      title: t('udt.view-transfer-txns'),
    },
    {
      value: TransactionType.Burn,
      title: t('udt.view-burn-txns'),
    },
  ]

  const isFilteredByType = filterList.some(f => f.value === type)

  return (
    <Content>
      <SimpleUDTContentPanel className="container">
        <SimpleUDTOverviewCard typeHash={typeHash} udt={udt} />

        <UDTTransactionTitlePanel>
          <div className="udtTransactionContainer">
            <div className="udtTransactionTitle">
              {`${t('transaction.transactions')} (${localeNumberString(total)})`}
            </div>
            <div className={styles.searchAndfilter}>
              <Filter
                defaultValue={filter ?? ''}
                showReset={!!filter}
                placeholder={t('udt.search_placeholder')}
                onFilter={filter => {
                  push(`/sudt/${typeHash}?${new URLSearchParams({ filter })}`)
                }}
                onReset={() => {
                  push(`/sudt/${typeHash}`)
                }}
              />
              <div className={styles.typeFilter} data-is-active={isFilteredByType}>
                <Popover
                  placement="bottomRight"
                  trigger={isMobile ? 'click' : 'hover'}
                  overlayClassName={styles.antPopover}
                  content={
                    <div className={styles.filterItems}>
                      {filterList.map(f => (
                        <Link
                          key={f.value}
                          to={`/sudt/${typeHash}?${new URLSearchParams({ type: f.value })}`}
                          data-is-active={f.value === type}
                        >
                          {f.title}
                          <SelectedCheckIcon />
                        </Link>
                      ))}
                    </div>
                  }
                >
                  <FilterIcon />
                </Popover>
              </div>
            </div>
          </div>
        </UDTTransactionTitlePanel>

        <QueryResult query={querySimpleUDTTransactions} delayLoading>
          {data => (
            <SimpleUDTComp
              currentPage={currentPage}
              pageSize={pageSize}
              transactions={data?.transactions ?? []}
              total={data?.total ?? 0}
              onPageChange={setPage}
              filterNoResult={filterNoResult}
              id={typeHash}
            />
          )}
        </QueryResult>
      </SimpleUDTContentPanel>
    </Content>
  )
}

export default SimpleUDT
