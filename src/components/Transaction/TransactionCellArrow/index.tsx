import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Link } from '../../Link'
import { IOType } from '../../../constants/common'
import RightGreenArrow from './right_green_arrow.png'
import RightBlueArrow from './right_blue_arrow.png'
import LiveCellIcon from './live_cell.png'
import LiveCellBlueIcon from './live_cell_blue.png'
import { isMainnet } from '../../../utils/chain'
import { Cell } from '../../../models/Cell'
import Tooltip from '../../Tooltip'
import styles from './index.module.scss'

export const RightArrow = ({ status = 'live' }: { status?: Cell['status'] }) => {
  if (status === 'live') {
    return (
      <img className={styles.rightArrowImage} src={isMainnet() ? LiveCellIcon : LiveCellBlueIcon} alt="right arrow" />
    )
  }

  return (
    <img className={styles.rightArrowImage} src={isMainnet() ? RightGreenArrow : RightBlueArrow} alt="right arrow" />
  )
}

export const LeftArrow = () => (
  <img
    className={classNames(styles.leftArrowImage, 'transactionCellLeftArrow')}
    src={isMainnet() ? RightGreenArrow : RightBlueArrow}
    alt="left arrow"
  />
)

export const CellInputIcon = ({ cell }: { cell: Partial<Pick<Cell, 'generatedTxHash' | 'cellIndex'>> }) =>
  cell.generatedTxHash ? (
    <Link to={`/transaction/${cell.generatedTxHash}#${cell.cellIndex}`}>
      <LeftArrow />
    </Link>
  ) : null

export const CellOutputIcon = ({ cell }: { cell: Partial<Pick<Cell, 'status' | 'consumedTxHash'>> }) => {
  const { t } = useTranslation()

  if (cell.status === 'dead' && cell.consumedTxHash) {
    return (
      <Link to={`/transaction/${cell.consumedTxHash}`}>
        <RightArrow status="dead" />
      </Link>
    )
  }

  if (cell.status === 'dead') {
    return <RightArrow status="dead" />
  }

  return (
    <Tooltip
      trigger={
        <span>
          <RightArrow status="live" />
        </span>
      }
      placement="top"
    >
      {t('transaction.unspent_output')}
    </Tooltip>
  )
}

export default ({ cell, ioType }: { cell: Cell; ioType: IOType }) =>
  ioType === IOType.Input ? <CellInputIcon cell={cell} /> : <CellOutputIcon cell={cell} />
