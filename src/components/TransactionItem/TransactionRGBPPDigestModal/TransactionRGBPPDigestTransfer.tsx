import { Transfer } from './types'
import styles from './styles.module.scss'
import { parseBTCAddress } from '../../../utils/bitcoin'
import { TransactionRGBPPDigestTransferAsset } from './TransactionRGBPPDigestTransferAsset'

export const TransactionRGBPPDigestTransfer = ({ transfer }: { transfer: Transfer }) => {
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
