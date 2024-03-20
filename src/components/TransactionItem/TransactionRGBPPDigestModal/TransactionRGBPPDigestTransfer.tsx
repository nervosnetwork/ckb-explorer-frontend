import styles from './styles.module.scss'
import { parseBTCAddress } from '../../../utils/bitcoin'
import { TransactionRGBPPDigestTransferAsset } from './TransactionRGBPPDigestTransferAsset'
import { TransactionRecord } from '../../../services/ExplorerService'
import AddressText from '../../AddressText'

export const TransactionRGBPPDigestTransfer = ({ transfer }: { transfer: TransactionRecord }) => {
  const address = parseBTCAddress(transfer.address)

  return address ? (
    <div className={styles.script}>
      <div className={styles.addressInfo}>
        <AddressText className={styles.address}>{transfer.address}</AddressText>
        <span className={styles.addressType}>{`${address.encodeType} (${address.type})`}</span>
      </div>
      <div>
        {transfer.transfers.map(transfer => (
          <TransactionRGBPPDigestTransferAsset transfer={transfer} />
        ))}
      </div>
    </div>
  ) : null
}
