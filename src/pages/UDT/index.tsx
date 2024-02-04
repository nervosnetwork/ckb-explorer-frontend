import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import Content from '../../components/Content'
import { UDTContentPanel, UDTTransactionTitlePanel } from './styled'
import UDTComp, { UDTOverviewCard } from './UDTComp'
import { usePaginationParamsInPage, useSearchParams, useUpdateSearchParams } from '../../hooks'
import Filter from '../../components/Search/Filter'
import { localeNumberString } from '../../utils/number'
import { explorerService } from '../../services/ExplorerService'
import { deprecatedAddrToNewAddr } from '../../utils/util'
import { QueryResult } from '../../components/QueryResult'
import { defaultUDTInfo } from './state'
import styles from './styles.module.scss'
import { Cell } from '../../models/Cell'
import { assert } from '../../utils/error'

export const UDT: FC<{ isInscription?: boolean }> = ({ isInscription }) => {
  const { t } = useTranslation()
  // The typeHash here could be either udtTypeHash or omigaInscriptionInfoTypeHash.
  const { hash: typeHash } = useParams<{ hash: string }>()
  const { currentPage, pageSize: _pageSize, setPage } = usePaginationParamsInPage()

  const { filter, view } = useSearchParams('filter', 'view')
  const isViewOriginal = view === 'original'

  const updateSearchParams = useUpdateSearchParams<'filter' | 'page'>()

  const queryUDT = useQuery(['udt', isInscription, isViewOriginal], () =>
    isInscription
      ? explorerService.api.fetchOmigaInscription(typeHash, isViewOriginal)
      : explorerService.api.fetchSimpleUDT(typeHash),
  )
  const udt = queryUDT.data ?? defaultUDTInfo

  const udtTypeHash = isInscription ? queryUDT.data?.typeHash : typeHash
  const querySimpleUDTTransactions = useQuery(
    ['simple-udt-transactions', udtTypeHash, currentPage, _pageSize, filter],
    async () => {
      assert(udtTypeHash)
      const {
        data: transactions,
        total,
        pageSize: resPageSize,
      } = await explorerService.api.fetchUDTTransactions({
        typeHash: udtTypeHash,
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
      enabled: udtTypeHash != null,
    },
  )
  const total = querySimpleUDTTransactions.data?.total ?? 0
  const filterNoResult = !!filter && querySimpleUDTTransactions.isError
  const pageSize: number = querySimpleUDTTransactions.data?.pageSize ?? _pageSize

  return (
    <Content>
      <UDTContentPanel className="container">
        <UDTOverviewCard typeHash={typeHash} udt={udt} refetchUDT={queryUDT.refetch} />

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
              id={typeHash}
              isInscription={isInscription}
              isViewOriginal={isViewOriginal}
            />
          )}
        </QueryResult>
      </UDTContentPanel>
    </Content>
  )
}

export default UDT
