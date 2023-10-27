import { Tooltip } from 'antd'
import styles from './TransactionBadge.module.scss'
import { Cell } from '../../../../models/Cell'

type Props = {
  cellType: Cell['cellType']
  capacity?: string
}
const cellTypeDisplayMap: Record<Cell['cellType'], string> = {
  normal: '',
  udt: '',
  nervos_dao_deposit: 'Nervos DAO Deposit',
  nervos_dao_withdrawing: 'Nervos DAO Withdraw',
  spore_cell: '',
  spore_cluster: '',
  cota_regular: '',
  cota_registry: '',
  m_nft_issuer: '',
  m_nft_class: '',
  m_nft_token: '',
  nrc_721_token: '',
  nrc_721_factory: '',
  nft_transfer: '',
  simple_transfer: '',
  nft_mint: '',
}

export const TransactionBadge = ({ cellType, capacity }: Props) => {
  const displayName = cellTypeDisplayMap[cellType]
  if (!displayName) return null

  return (
    <Tooltip
      title={
        <div className={styles.tootip}>
          <div>{displayName}</div>
          <div>{capacity} CKB</div>
        </div>
      }
    >
      <div className={styles.transactionBadge}>{displayName}</div>
    </Tooltip>
  )
}
