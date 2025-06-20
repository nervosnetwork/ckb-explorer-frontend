import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ResultFormatter } from '@ckb-lumos/rpc'
import Content from '../../components/Content'
import { explorerService } from '../../services/ExplorerService'
import { QueryResult } from '../../components/QueryResult'
import RgbppBanner from '../../components/RgbppBanner'
import { defaultTransactionInfo } from './state'
import { useSearchParams } from '../../hooks'
import { useCKBNode } from '../../hooks/useCKBNode'
import { LayoutLiteProfessional } from '../../constants/common'
import { TransactionCompLite } from './TransactionComp/TransactionLite/TransactionLite'
import { TransactionComp } from './TransactionComp/TransactionComp'
import { NodeTransactionComp } from './TransactionComp/NodeTransactionComp'
import { TransactionOverviewCard } from './TransactionComp/TransactionOverview'
import { NodeTransactionOverviewCard } from './TransactionComp/NodeTransactionOverview'
import { TransactionDetailsHeader } from './TransactionComp/TransactionDetailsHeader'
import { RGBDigestComp } from './TransactionComp/RGBDigestComp'
import styles from './index.module.scss'

export default () => {
  const { Professional, Lite } = LayoutLiteProfessional
  const { hash: txHash } = useParams<{ hash: string }>()
  const { nodeService, isActivated: nodeActivated } = useCKBNode()

  const query = useQuery(
    ['transaction', txHash],
    async () => {
      const transaction = await explorerService.api.fetchTransactionByHash(txHash)
      if (transaction.displayOutputs && transaction.displayOutputs.length > 0) {
        transaction.displayOutputs[0].isGenesisOutput = transaction.blockNumber === 0
      }
      return transaction
    },
    {
      enabled: !nodeActivated,
    },
  )

  const nodeTxQuery = useQuery(['node', 'transaction', txHash], () => nodeService.getTx(txHash), {
    enabled: nodeActivated,
  })

  const transaction = query.data ?? defaultTransactionInfo
  const searchParams = useSearchParams('layout')
  const layout = searchParams.layout === Lite ? Lite : Professional

  return (
    <Content>
      {transaction.isRgbTransaction ? <RgbppBanner path={`/transaction/${transaction.transactionHash}`} /> : null}
      <div className={`${styles.transactionDiv} container`}>
        {nodeActivated ? (
          <QueryResult query={nodeTxQuery} delayLoading>
            {nodeTx =>
              nodeTx ? (
                <NodeTransactionOverviewCard transactionWithStatus={nodeTx.result} />
              ) : (
                <div>{`Transaction ${txHash} not loaded`}</div>
              )
            }
          </QueryResult>
        ) : (
          <TransactionOverviewCard
            txHash={txHash}
            transaction={transaction}
            layout={layout}
            isRGB={transaction.isRgbTransaction}
          />
        )}

        {transaction.isRgbTransaction && <RGBDigestComp hash={txHash} txid={transaction.rgbTxid ?? undefined} />}

        <TransactionDetailsHeader showLayoutSwitcher={!nodeActivated} layout={layout} />

        {nodeActivated ? (
          <QueryResult query={nodeTxQuery}>
            {nodeTx =>
              nodeTx && nodeTx.result.transaction ? (
                <NodeTransactionComp
                  transaction={ResultFormatter.toTransaction(nodeTx.result.transaction)}
                  blockNumber={nodeTx.result.tx_status.block_number ?? undefined}
                />
              ) : (
                <div>{`Transaction ${txHash} not loaded`}</div>
              )
            }
          </QueryResult>
        ) : (
          <>
            {layout === Professional ? (
              <QueryResult query={query} delayLoading>
                {transaction => (transaction ? <TransactionComp transaction={transaction} /> : <div />)}
              </QueryResult>
            ) : (
              <QueryResult query={query} delayLoading>
                {transaction => <TransactionCompLite isCellbase={transaction?.isCellbase ?? false} />}
              </QueryResult>
            )}
          </>
        )}
      </div>
    </Content>
  )
}
