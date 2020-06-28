import React from 'react'
import { CellbasePanel } from './styled'
import { CellType } from '../../../utils/const'
import TransactionCellArrow from '../TransactionCellArrow'
import { localeNumberString } from '../../../utils/number'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import HelpIcon from '../../../assets/qa_help.png'
import i18n from '../../../utils/i18n'

const Cellbase = ({ cell, cellType, isDetail }: { cell: State.Cell; cellType: CellType; isDetail?: boolean }) => {
  if (!cell.targetBlockNumber || cell.targetBlockNumber <= 0) {
    return (
      <CellbasePanel>
        <div className="cellbase__content">Cellbase</div>
      </CellbasePanel>
    )
  }
  return (
    <CellbasePanel isDetail={isDetail}>
      {cellType === CellType.Input && <TransactionCellArrow cell={cell} cellType={cellType} />}
      <div className="cellbase__content">Cellbase for Block</div>
      <Link to={`/block/${cell.targetBlockNumber}`}>{localeNumberString(cell.targetBlockNumber)}</Link>
      <Tooltip placement="top" title={i18n.t('transaction.cellbase_help_tooltip')}>
        <img className="cellbase__help__icon" alt="cellbase help" src={HelpIcon} />
      </Tooltip>
    </CellbasePanel>
  )
}

export default Cellbase
