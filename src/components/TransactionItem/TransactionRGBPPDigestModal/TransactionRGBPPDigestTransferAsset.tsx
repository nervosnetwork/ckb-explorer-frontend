import { TransferAsset } from './types'
import styles from './styles.module.scss'
import { parseCKBAmount } from '../../../utils/number'
import { Amount } from './Amount'

export const TransactionRGBPPDigestTransferAsset = ({ transfer }: { transfer: TransferAsset }) => {
  const decrease = transfer.capacity.startsWith('-')
  const capacity = parseCKBAmount(decrease ? transfer.capacity.slice(1) : transfer.capacity)
  return (
    <div className={styles.asset}>
      <span>{transfer.cellType === 'normal' ? 'CKB' : transfer.cellType}</span>
      <Amount amount={`${decrease ? '-' : '+'}${capacity}`} className={decrease ? styles.decrease : styles.increase} />
    </div>
  )
}
