import styles from './styles.module.scss'
import { parseBTCAddress } from '../../../utils/bitcoin'
import { TransactionRGBPPDigestTransferAsset } from './TransactionRGBPPDigestTransferAsset'
import { TransactionRecord } from '../../../services/ExplorerService'

export const TransactionRGBPPDigestTransfer = ({ transfer }: { transfer: TransactionRecord }) => {
  const address = parseBTCAddress(transfer.address)

  let addressType = ''
  if (address) {
    addressType = address.isBech32 ? `Bech32 (${address.type})` : `Base58 (${address.type})`
  }

  return (
    <div className={styles.script}>
      <div className={styles.addressInfo}>
        <span className={styles.address}>{transfer.address}</span>
        <span className={styles.addressType}>{addressType}</span>
      </div>
      {transfer.transfers.map(transfer => (
        <TransactionRGBPPDigestTransferAsset transfer={transfer} />
      ))}
    </div>
  )
}
