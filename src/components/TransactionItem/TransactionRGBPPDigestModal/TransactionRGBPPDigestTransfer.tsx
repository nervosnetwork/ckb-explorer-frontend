import styles from './styles.module.scss'
import { parseBTCAddress } from '../../../utils/bitcoin'
import { TransactionRGBPPDigestTransferAsset } from './TransactionRGBPPDigestTransferAsset'
import { TransactionRecord } from '../../../services/ExplorerService'
import AddressText from '../../AddressText'

export const TransactionRGBPPDigestTransfer = ({ transfer }: { transfer: TransactionRecord }) => {
  const address = parseBTCAddress(transfer.address)

  let addressType = ''
  if (address) {
    addressType = address.isBech32 ? `Bech32 (${address.type})` : `Base58 (${address.type})`
  }

  return (
    <div className={styles.script}>
      <div className={styles.addressInfo}>
        <AddressText className={styles.address}>{transfer.address}</AddressText>
        <span className={styles.addressType}>{addressType}</span>
      </div>
      <div>
        {transfer.transfers.map(transfer => (
          <TransactionRGBPPDigestTransferAsset transfer={transfer} />
        ))}
      </div>
    </div>
  )
}
