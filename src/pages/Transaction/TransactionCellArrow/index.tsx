import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Tooltip } from 'antd'
import { CellType } from '../../../utils/const'
import RightGreenArrow from '../../../assets/right_green_arrow.png'
import RightBlueArrow from '../../../assets/right_blue_arrow.png'
import LiveCellIcon from '../../../assets/live_cell.png'
import NervosDAOCellIcon from '../../../assets/nervos_dao_cell.png'
import NervosDAOWithdrawingIcon from '../../../assets/nervos_dao_withdrawing.png'
import { isMainnet } from '../../../utils/chain'
import i18n from '../../../utils/i18n'

const LeftArrowImage = styled.img`
  width: 16px;
  height: auto;
  margin: 0px 5px 3px 0;

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

const isDaoWithdrawCell = (cellType: string) => {
  return cellType === 'nervos_dao_withdrawing'
}

const CellInputIcon = ({ cell }: { cell: State.Cell }) => {
  if (isDaoDepositCell(cell.cellType)) {
    return (
      <Tooltip placement="topRight" title={i18n.t('nervos_dao.withdraw_request_tooltip')} arrowPointAtCenter>
        <LeftArrowImage className="transaction__cell_left_arrow" src={NervosDAOCellIcon} alt="left arrow" />
      </Tooltip>
    )
  }
  if (isDaoWithdrawCell(cell.cellType)) {
    return (
      <Tooltip placement="topRight" title={i18n.t('nervos_dao.withdraw_tooltip')} arrowPointAtCenter>
        <LeftArrowImage className="transaction__cell_left_arrow" src={NervosDAOWithdrawingIcon} alt="left arrow" />
      </Tooltip>
    )
  }
  return cell.generatedTxHash ? (
    <Link to={`/transaction/${cell.generatedTxHash}#${cell.cellIndex}`}>
      <LeftArrowImage
        className="transaction__cell_left_arrow"
        src={isMainnet() ? RightGreenArrow : RightBlueArrow}
        alt="left arrow"
      />
    </Link>
  ) : null
}

const CellOutputIcon = ({ cell }: { cell: State.Cell }) => {
  if (isDaoDepositCell(cell.cellType)) {
    return (
      <Tooltip placement="topRight" title={i18n.t('nervos_dao.deposit_tooltip')} arrowPointAtCenter>
        <RightArrowImage className="transaction__cell_right_arrow" src={NervosDAOCellIcon} alt="right arrow" />
      </Tooltip>
    )
  }
  if (isDaoWithdrawCell(cell.cellType)) {
    return (
      <Tooltip
        placement="topRight"
        title={i18n.t('nervos_dao.calculation_tooltip')}
        arrowPointAtCenter
        overlayStyle={{
          fontSize: '12px',
        }}
      >
        <RightArrowImage className="transaction__cell_right_arrow" src={NervosDAOWithdrawingIcon} alt="right arrow" />
      </Tooltip>
    )
  }
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
  return (
    <Tooltip placement="topRight" title={i18n.t('transaction.unspent_output')} arrowPointAtCenter>
      <RightArrowImage className="transaction__cell_right_arrow" src={LiveCellIcon} alt="right arrow" />
    </Tooltip>
  )
}

export default ({ cell, cellType }: { cell: State.Cell; cellType: CellType }) => {
  return cellType === CellType.Input ? <CellInputIcon cell={cell} /> : <CellOutputIcon cell={cell} />
}
