import styles from './TransactionRGBPPDigestTransfer.module.scss'
import { TransactionRGBPPDigestTransferAsset } from './TransactionRGBPPDigestTransferAsset'
import { LiteTransfer } from '../../../services/ExplorerService'
import AddressText from '../../AddressText'
import { parseBTCAddress } from '../../../utils/bitcoin'

export const TransactionRGBPPDigestTransfer = ({
  address,
  transfers,
}: {
  address: string
  transfers: LiteTransfer.Transfer[]
}) => {
  if (!address) return null

  const parsedAddr = parseBTCAddress(address)

  if (!parsedAddr) return null

  return address ? (
    <div className={styles.script}>
      <div className={styles.addressInfo}>
        <AddressText
          linkProps={{
            to: `/address/${address}`,
          }}
          className={styles.address}
        >
          {address}
        </AddressText>
        <span className={styles.addressType}>{`${parsedAddr.encodeType} (${parsedAddr.type})`}</span>
      </div>
      <div>
        {transfers.map(transfer => (
          <TransactionRGBPPDigestTransferAsset transfer={transfer} />
        ))}
      </div>
    </div>
  ) : null
}
