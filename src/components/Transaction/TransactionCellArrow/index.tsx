import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from '../../Link'
import { CellType } from '../../../constants/common'
import RightGreenArrow from './right_green_arrow.png'
import RightBlueArrow from './right_blue_arrow.png'
import LiveCellIcon from './live_cell.png'
import LiveCellBlueIcon from './live_cell_blue.png'
import { isMainnet } from '../../../utils/chain'
import { RightArrowImage, LeftArrowImage } from './styled'
import { Cell } from '../../../models/Cell'

const CellInputIcon = ({ cell }: { cell: Cell }) =>
  cell.generatedTxHash ? (
    <Link to={`/transaction/${cell.generatedTxHash}#${cell.cellIndex}`}>
      <LeftArrowImage
        className="transactionCellLeftArrow"
        src={isMainnet() ? RightGreenArrow : RightBlueArrow}
        alt="left arrow"
      />
    </Link>
  ) : null

const CellOutputIcon = ({ cell }: { cell: Cell }) => {
  const { t } = useTranslation()

  if (cell.status === 'dead') {
    return (
      <Link to={`/transaction/${cell.consumedTxHash}`}>
        <RightArrowImage src={isMainnet() ? RightGreenArrow : RightBlueArrow} alt="right arrow" />
      </Link>
    )
  }
  return (
    <Tooltip placement="topRight" title={t('transaction.unspent_output')} arrowPointAtCenter>
      <RightArrowImage src={isMainnet() ? LiveCellIcon : LiveCellBlueIcon} alt="right arrow" />
    </Tooltip>
  )
}

export default ({ cell, cellType }: { cell: Cell; cellType: CellType }) =>
  cellType === CellType.Input ? <CellInputIcon cell={cell} /> : <CellOutputIcon cell={cell} />
