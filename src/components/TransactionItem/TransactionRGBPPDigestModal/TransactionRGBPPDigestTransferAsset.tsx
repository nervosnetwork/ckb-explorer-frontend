import { useTranslation } from 'react-i18next'
import styles from './styles.module.scss'
import { parseCKBAmount } from '../../../utils/number'
import { Amount } from './Amount'
import { LiteTransfer } from '../../../services/ExplorerService'
import { getTransfer } from '../../../utils/transfer'

export const TransactionRGBPPDigestTransferAsset = ({ transfer }: { transfer: LiteTransfer.Transfer }) => {
  const { t } = useTranslation()
  const decrease = transfer.capacity.startsWith('-')
  const capacity = parseCKBAmount(decrease ? transfer.capacity.slice(1) : transfer.capacity)

  const record = getTransfer(transfer)

  let name = t('transaction.unknown_assets')
  switch (transfer.cellType) {
    case 'normal':
      name = 'CKB'
      break
    case 'udt':
      name =
        transfer.udtInfo.uan ||
        transfer.udtInfo.symbol ||
        `${t('udt.unknown_token')} #${transfer.udtInfo.typeHash.substring(transfer.udtInfo.typeHash.length - 4)}`
      break
    case 'xudt': {
      break
    }
    case 'omiga_inscription': {
      name = record.label
      break
    }
    case 'spore_cell':
    case 'm_nft_token':
    case 'nrc_721_token':
      name = transfer.name || `${t('udt.unknown_token')} #${transfer.tokenId.substring(transfer.tokenId.length - 4)}`
      break
    case 'cota_regular':
      if (transfer.cotaInfo.length > 0) {
        name = transfer.cotaInfo[0].name
      }
      break
    default:
  }

  return (
    <div className={styles.asset}>
      <span>{name}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {record.asset ? (
          <div className={styles.token} data-diff-status={record.asset.diffStatus}>
            <div>{`${record.asset.amount} ${record.asset.item}`}</div>
          </div>
        ) : null}
        <Amount
          diffStatus={record.diffStatus}
          brackets={transfer.cellType !== 'normal'}
          amount={`${decrease ? '-' : '+'}${capacity}`}
        />
      </div>
    </div>
  )
}
