import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Tooltip } from 'antd'
import { CellType } from '../../../utils/const'
import RightGreenArrow from '../../../assets/right_green_arrow.png'
import RightBlueArrow from '../../../assets/right_blue_arrow.png'
import LiveCellIcon from '../../../assets/live_cell.png'
import NervosDAOCellIcon from '../../../assets/nervos_dao_cell.png'
import { isMainnet } from '../../../utils/chain'
import i18n from '../../../utils/i18n'

const LeftArrowImage = styled.img`
  width: 16px;
  height: auto;
  margin: 0px 7px 0 0;

  @media (max-width: 700px) {
    width: 12px;
    margin: 0 10px 0 0;
  }
`

const RightArrowImage = styled.img`
  width: 16px;
  height: auto;
  margin: 0px 0 1px 7px;

  @media (max-width: 700px) {
    width: 12px;
    margin: 0 5px 0 7px;
  }
`

const isDaoDepositCell = (cellType: string) => {
  return cellType === 'nervos_dao_deposit'
}

const CellOutputIcon = ({ cell }: { cell: State.Cell }) => {
  if (cell.status === 'dead') {
    return (
      <Link to={`/transaction/${cell.consumedTxHash}`}>
        <RightArrowImage
          className="transaction__cell_right_arrow"
          src={isMainnet() ? RightGreenArrow : RightBlueArrow}
          alt="right arrow"
        />
      </Link>
    )
  }
  if (isDaoDepositCell(cell.cellType)) {
    return <RightArrowImage className="transaction__cell_right_arrow" src={NervosDAOCellIcon} alt="right arrow" />
  }
  return (
    <Tooltip placement="topRight" title={i18n.t('transaction.unspent_output')} arrowPointAtCenter>
      <RightArrowImage className="transaction__cell_right_arrow" src={LiveCellIcon} alt="right arrow" />
    </Tooltip>
  )
}

export default ({ cell, cellType }: { cell: State.Cell; cellType: CellType }) => {
  if (cellType === CellType.Input) {
    return cell.generatedTxHash ? (
      <Link to={`/transaction/${cell.generatedTxHash}`}>
        <LeftArrowImage
          className="transaction__cell_left_arrow"
          src={isMainnet() ? RightGreenArrow : RightBlueArrow}
          alt="left arrow"
        />
      </Link>
    ) : null
  }
  return <CellOutputIcon cell={cell} />
}
