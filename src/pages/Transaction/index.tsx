import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import TransactionHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import { TransactionDiv as TransactionPanel } from './TransactionComp/styled'
import { explorerService } from '../../services/ExplorerService'
import { QueryResult } from '../../components/QueryResult'
import { defaultTransactionInfo } from './state'
import { useSearchParams } from '../../utils/hook'
import { LayoutLiteProfessional } from '../../constants/common'
import { TransactionCompLite } from './TransactionComp/TransactionLite/TransactionLite'
import { TransactionComp } from './TransactionComp/TransactionComp'
import { TransactionOverview } from './TransactionComp/TransactionOverview'

export default () => {
  const { Professional, Lite } = LayoutLiteProfessional
  const { t } = useTranslation()
  const { hash: txHash } = useParams<{ hash: string }>()

  const query = useQuery(['transaction', txHash], async () => {
    const transaction = await explorerService.api.fetchTransactionByHash(txHash)
    // TODO: When will displayOutputs be empty? Its type description indicates that it will not be empty.
    if (transaction.displayOutputs && transaction.displayOutputs.length > 0) {
      transaction.displayOutputs[0].isGenesisOutput = transaction.blockNumber === 0
    }
    return transaction
  })

  const transaction = query.data ?? defaultTransactionInfo
  const { blockTimestamp, txStatus } = transaction
  const searchParams = useSearchParams('layout')
  const layout = searchParams.layout === Lite ? Lite : Professional

  return (
    <Content>
      <TransactionPanel className="container">
        <TransactionHashCard title={t('transaction.transaction')} hash={txHash} loading={query.isLoading}>
          {txStatus !== 'committed' || blockTimestamp > 0 ? (
            <TransactionOverview transaction={transaction} layout={layout} />
          ) : null}
        </TransactionHashCard>
        {layout === Professional ? (
          <QueryResult query={query} delayLoading>
            {transaction => (transaction ? <TransactionComp transaction={transaction} /> : <div />)}
          </QueryResult>
        ) : (
          <QueryResult query={query} delayLoading>
            {transaction => <TransactionCompLite isCellbase={transaction?.isCellbase ?? false} />}
          </QueryResult>
        )}
      </TransactionPanel>
    </Content>
  )
}
