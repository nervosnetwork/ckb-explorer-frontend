import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import Content from '../../components/Content'
import { UDTContentPanel, UDTTransactionTitlePanel } from './styled'
import UDTComp, { UDTOverviewCard } from './UDTComp'
import { usePaginationParamsInPage, useSearchParams, useUpdateSearchParams } from '../../hooks'
import Filter from '../../components/Filter'
import { localeNumberString } from '../../utils/number'
import { explorerService } from '../../services/ExplorerService'
import { deprecatedAddrToNewAddr } from '../../utils/util'
import { QueryResult } from '../../components/QueryResult'
import styles from './styles.module.scss'
import { Cell } from '../../models/Cell'
import { assert } from '../../utils/error'

export const Xudt = () => {
  const { t } = useTranslation()
  // The typeHash here could be either udtTypeHash or omigaInscriptionInfoTypeHash.
  const { hash: typeHash } = useParams<{ hash: string }>()
  const { currentPage, pageSize: _pageSize, setPage } = usePaginationParamsInPage()

  const { filter } = useSearchParams('filter')

  const updateSearchParams = useUpdateSearchParams<'filter' | 'page'>()
  const queryUDT = useQuery(['udt', typeHash], () => explorerService.api.fetchSimpleUDT(typeHash))

  const queryXudt = useQuery(['xudt', typeHash], () => explorerService.api.fetchXudt(typeHash))
  const xudt = queryXudt.data

  const querySimpleUDTTransactions = useQuery(
    ['xudt-transactions', typeHash, currentPage, _pageSize, filter],
    async () => {
      assert(typeHash)
      const {
        transactions,
        total,
        pageSize: resPageSize,
      } = await explorerService.api.fetchUDTTransactions({
        typeHash,
        page: currentPage,
        size: pageSize,
        filter,
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
    {
      enabled: typeHash != null,
    },
  )
  const total = querySimpleUDTTransactions.data?.total ?? 0
  const filterNoResult = !!filter && querySimpleUDTTransactions.isError
  const pageSize: number = querySimpleUDTTransactions.data?.pageSize ?? _pageSize

  return (
    <Content>
      <UDTContentPanel className="container">
        <UDTOverviewCard typeHash={typeHash} xudt={xudt} refetchUDT={queryUDT.refetch} />

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
                onFilter={filter => updateSearchParams(params => ({ ...params, filter }))}
                onReset={() => updateSearchParams(params => ({ ...params, filter: null }))}
              />
            </div>
          </div>
        </UDTTransactionTitlePanel>

        <QueryResult query={querySimpleUDTTransactions} delayLoading>
          {data => (
            <UDTComp
              currentPage={currentPage}
              pageSize={pageSize}
              transactions={data?.transactions ?? []}
              total={data?.total ?? 0}
              onPageChange={setPage}
              filterNoResult={filterNoResult}
              xudt={xudt}
            />
          )}
        </QueryResult>
      </UDTContentPanel>
    </Content>
  )
}

export default Xudt
