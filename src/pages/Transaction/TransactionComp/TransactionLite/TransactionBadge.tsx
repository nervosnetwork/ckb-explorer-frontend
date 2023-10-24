import { Tooltip } from 'antd'
import styles from './TransactionBadge.module.scss'

type Props = {
  cellType: State.CellType
  capacity?: string
}
const cellTypeDisplayMap: Record<State.CellType, string> = {
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
