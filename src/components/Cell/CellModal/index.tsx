import { CellInfoProps } from '../CellInfo/types'
import CellInfo from '../CellInfo'
import styles from './styles.module.scss'

const CellModal = ({ cell, onClose }: CellInfoProps) => {
  return (
    <div className={styles.transactionCellDetailModal}>
      <CellInfo cell={cell} onClose={onClose} />
    </div>
  )
}

export default CellModal
