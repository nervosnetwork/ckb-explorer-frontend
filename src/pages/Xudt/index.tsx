import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import Content from '../../components/Content'
import UDTComp from './UDTComp'
import { UDTOverviewCard } from './UDTOverviewCard'
import { usePaginationParamsInPage, useSearchParams, useUpdateSearchParams } from '../../hooks'
import Filter from '../../components/Filter'
import { localeNumberString } from '../../utils/number'
import { explorerService } from '../../services/ExplorerService'
import { deprecatedAddrToNewAddr } from '../../utils/util'
import { QueryResult } from '../../components/QueryResult'
import styles from './styles.module.scss'
import { Cell } from '../../models/Cell'
import { assert } from '../../utils/error'
import ReadContract from './ReadContract'

export const Xudt = () => {
  const { t } = useTranslation()
  // The typeHash here could be either udtTypeHash or omigaInscriptionInfoTypeHash.
  const { hash: typeHash } = useParams<{ hash: string }>()
  const { currentPage, pageSize: _pageSize, setPage } = usePaginationParamsInPage()

  const { filter } = useSearchParams('filter')
  const updateSearchParams = useUpdateSearchParams<'filter' | 'page'>()

  const [currentTab, setCurrentTab] = useState<'transactions' | 'contract'>('transactions')

  const queryXudt = useQuery(['xudt', typeHash], () => explorerService.api.fetchXudt(typeHash))
  const xudt = queryXudt.data
  const queryXudtHolderAllocation = useQuery(['xudt-holder-allocation', typeHash], () =>
    explorerService.api.fetchXudtHolderAllocation(typeHash),
  )
  const holderAllocation = queryXudtHolderAllocation.data

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
      <div className={classNames(styles.container, 'container')}>
        <UDTOverviewCard
          typeHash={typeHash}
          xudt={xudt}
          holderAllocation={holderAllocation}
          refetchUDT={() => {
            queryXudt.refetch()
            queryXudtHolderAllocation.refetch()
          }}
        />
        <div className={styles.udtTransactionTitlePanel}>
          <div className={styles.udtTransactionContainer}>
            <div
              className={classNames(styles.udtTransactionTitle, {
                [styles.udtTransactionTitleActive]: currentTab === 'transactions',
              })}
              onClick={() => setCurrentTab('transactions')}
            >
              {`${t('transaction.transactions')} (${localeNumberString(total)})`}
            </div>
            {!!xudt?.ssriContractOutpoint?.txHash && (
              <div
                className={classNames(styles.udtTransactionTitle, {
                  [styles.udtTransactionTitleActive]: currentTab === 'contract',
                })}
                onClick={() => setCurrentTab('contract')}
              >
                {t('xudt.read_contract.title')}
              </div>
            )}
          </div>
          {currentTab === 'transactions' && (
            <div className={styles.searchAndfilter}>
              <Filter
                defaultValue={filter ?? ''}
                showReset={!!filter}
                placeholder={t('udt.search_placeholder')}
                onFilter={filter => updateSearchParams(params => ({ ...params, filter }))}
                onReset={() => updateSearchParams(params => ({ ...params, filter: null }))}
              />
            </div>
          )}
        </div>

        {currentTab === 'transactions' && (
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
        )}
        {currentTab === 'contract' && <ReadContract xudt={xudt} />}
      </div>
    </Content>
  )
}

export default Xudt
