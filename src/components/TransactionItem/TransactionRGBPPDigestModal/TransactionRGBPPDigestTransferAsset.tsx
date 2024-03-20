import styles from './styles.module.scss'
import { parseCKBAmount } from '../../../utils/number'
import { Amount } from './Amount'
import { LiteTransfer } from '../../../services/ExplorerService'
import { getTransfer } from '../../../utils/transfer'

export const TransactionRGBPPDigestTransferAsset = ({ transfer }: { transfer: LiteTransfer.Transfer }) => {
  const decrease = transfer.capacity.startsWith('-')
  const capacity = parseCKBAmount(decrease ? transfer.capacity.slice(1) : transfer.capacity)

  const record = getTransfer(transfer)

  return (
    <div className={styles.asset}>
      <span>CKB</span>
      <div style={{ display: 'flex' }}>
        {record.asset && (
          <Amount
            diffStatus={record.asset.diffStatus}
            amount={`${record.diffStatus === 'negative' ? '' : '+'}${record.asset.amount}`}
          />
        )}
        <Amount
          diffStatus={record.diffStatus}
          brackets={transfer.cellType !== 'normal'}
          amount={`${decrease ? '-' : '+'}${capacity}`}
        />
      </div>
    </div>
  )
}
