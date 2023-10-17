import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import TransactionHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import { TransactionDiv as TransactionPanel } from './styled'
import TransactionComp, { TransactionOverview } from './TransactionComp'
import { explorerService } from '../../services/ExplorerService'
import { QueryResult } from '../../components/QueryResult'
import { defaultTransactionInfo } from './state'

export default () => {
  const { t } = useTranslation()
  const { hash: txHash } = useParams<{ hash: string }>()

  const query = useQuery(['transaction', txHash], async () => {
    const wrapper = await explorerService.api.fetchTransactionByHash(txHash)
    const transaction = wrapper.attributes
    if (transaction.displayOutputs && transaction.displayOutputs.length > 0) {
      transaction.displayOutputs[0].isGenesisOutput = transaction.blockNumber === 0
    }
    return transaction
  })
  const transaction = query.data ?? defaultTransactionInfo
  const { blockTimestamp, txStatus } = transaction

  return (
    <Content>
      <TransactionPanel className="container">
        <TransactionHashCard title={t('transaction.transaction')} hash={txHash} loading={query.isLoading}>
          {txStatus !== 'committed' || blockTimestamp > 0 ? <TransactionOverview transaction={transaction} /> : null}
        </TransactionHashCard>
        <QueryResult query={query} delayLoading>
          {data => <TransactionComp transaction={data} />}
        </QueryResult>
      </TransactionPanel>
    </Content>
  )
}
