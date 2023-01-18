import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import TransactionHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import { getTipBlockNumber } from '../../service/app/address'
import i18n from '../../utils/i18n'
import { TransactionDiv as TransactionPanel } from './styled'
import TransactionComp, { TransactionOverview } from './TransactionComp'
import { useDispatch } from '../../contexts/providers'
import { fetchTransactionByHash } from '../../service/http/fetcher'
import { QueryResult } from '../../components/QueryResult'
import { defaultTransactionInfo } from './state'

export default () => {
  const dispatch = useDispatch()
  const { hash: txHash } = useParams<{ hash: string }>()

  const query = useQuery(['transaction', txHash], async () => {
    const wrapper = await fetchTransactionByHash(txHash)
    const transaction = wrapper.attributes
    if (transaction.displayOutputs && transaction.displayOutputs.length > 0) {
      transaction.displayOutputs[0].isGenesisOutput = transaction.blockNumber === 0
    }
    return transaction
  })
  const transaction = query.data ?? defaultTransactionInfo
  const { blockTimestamp, txStatus } = transaction

  useEffect(() => getTipBlockNumber(dispatch), [dispatch])

  return (
    <Content>
      <TransactionPanel className="container">
        <TransactionHashCard title={i18n.t('transaction.transaction')} hash={txHash} loading={query.isLoading}>
          {txStatus !== 'committed' || blockTimestamp > 0 ? <TransactionOverview transaction={transaction} /> : null}
        </TransactionHashCard>
        <QueryResult query={query} delayLoading>
          {data => <TransactionComp transaction={data} />}
        </QueryResult>
      </TransactionPanel>
    </Content>
  )
}
