import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from '../../Link'
import { IOType } from '../../../constants/common'
import RightGreenArrow from './right_green_arrow.png'
import RightBlueArrow from './right_blue_arrow.png'
import LiveCellIcon from './live_cell.png'
import LiveCellBlueIcon from './live_cell_blue.png'
import { isMainnet } from '../../../utils/chain'
import { RightArrowImage, LeftArrowImage } from './styled'
import { Cell } from '../../../models/Cell'

export const RightArrow = ({ status = 'live' }: { status?: Cell['status'] }) => {
  if (status === 'live') {
    return <RightArrowImage src={isMainnet() ? LiveCellIcon : LiveCellBlueIcon} alt="right arrow" />
  }

  return <RightArrowImage src={isMainnet() ? RightGreenArrow : RightBlueArrow} alt="right arrow" />
}

export const LeftArrow = () => (
  <LeftArrowImage
    className="transactionCellLeftArrow"
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

export const CellOutputIcon = ({ cell }: { cell: Pick<Cell, 'status' | 'consumedTxHash'> }) => {
  const { t } = useTranslation()

  if (cell.status === 'dead') {
    return (
      <Link to={`/transaction/${cell.consumedTxHash}`}>
        <RightArrow status="dead" />
      </Link>
    )
  }
  return (
    <Tooltip placement="topRight" title={t('transaction.unspent_output')} arrowPointAtCenter>
      <RightArrow status="live" />
    </Tooltip>
  )
}

export default ({ cell, ioType }: { cell: Cell; ioType: IOType }) =>
  ioType === IOType.Input ? <CellInputIcon cell={cell} /> : <CellOutputIcon cell={cell} />
