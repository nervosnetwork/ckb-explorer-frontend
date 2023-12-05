import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Content from '../../components/Content'
import { TransactionDiv as TransactionPanel } from './TransactionComp/styled'
import { explorerService } from '../../services/ExplorerService'
import { QueryResult } from '../../components/QueryResult'
import { defaultTransactionInfo } from './state'
import { useSearchParams } from '../../hooks'
import { LayoutLiteProfessional } from '../../constants/common'
import { TransactionCompLite } from './TransactionComp/TransactionLite/TransactionLite'
import { TransactionComp } from './TransactionComp/TransactionComp'
import { TransactionOverviewCard } from './TransactionComp/TransactionOverview'

export default () => {
  const { Professional, Lite } = LayoutLiteProfessional
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
  const searchParams = useSearchParams('layout')
  const layout = searchParams.layout === Lite ? Lite : Professional

  return (
    <Content>
      <TransactionPanel className="container">
        <TransactionOverviewCard txHash={txHash} transaction={transaction} layout={layout} />

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
