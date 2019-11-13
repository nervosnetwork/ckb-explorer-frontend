import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import HelpIcon from '../../../assets/qa_help.png'
import i18n from '../../../utils/i18n'
import { localeNumberString } from '../../../utils/number'
import { adaptMobileEllipsis, adaptPCEllipsis } from '../../../utils/string'
import { shannonToCkb } from '../../../utils/util'
import { CellbasePanel, TransactionCellPanel, TransactionCellCapacity } from './styled'
import { isMobile } from '../../../utils/screen'
import Tooltip from '../../Tooltip'
import { CellType } from '../../../utils/const'
import TransactionCellArrow from '../../../pages/Transaction/TransactionCellArrow'

const Cellbase = ({
  cell,
  cellType,
  targetBlockNumber,
}: {
  cell: State.Cell
  cellType: CellType
  targetBlockNumber?: number
}) => {
  const [show, setShow] = useState(false)
  if (!targetBlockNumber || targetBlockNumber <= 0) {
    return (
      <CellbasePanel>
        <div className="cellbase__content">Cellbase</div>
      </CellbasePanel>
    )
  }
  return (
    <CellbasePanel>
      {cellType === CellType.Input && <TransactionCellArrow cell={cell} cellType={cellType} />}
      <div className="cellbase__content">Cellbase for Block</div>
      <Link to={`/block/${targetBlockNumber}`}>{localeNumberString(targetBlockNumber)}</Link>
      <div
        id={`cellbase__help_${targetBlockNumber}`}
        className="cellbase__help"
        tabIndex={-1}
        onFocus={() => {}}
        onMouseOver={() => {
          setShow(true)
          const p = document.querySelector('.page') as HTMLElement
          if (p) {
            p.setAttribute('tabindex', '-1')
          }
        }}
        onMouseLeave={() => {
          setShow(false)
          const p = document.querySelector('.page') as HTMLElement
          if (p) {
            p.removeAttribute('tabindex')
          }
        }}
      >
        <img alt="cellbase help" src={HelpIcon} />
      </div>
      <Tooltip show={show} targetElementId={`cellbase__help_${targetBlockNumber}`}>
        {i18n.t('transaction.cellbase_help_tooltip')}
      </Tooltip>
    </CellbasePanel>
  )
}

const handleAddressText = (address: string) => {
  if (isMobile()) {
    return adaptMobileEllipsis(address, 13)
  }
  return adaptPCEllipsis(address, 5, 80)
}

const isDaoDepositCell = (cellType: string) => {
  return cellType === 'nervos_dao_deposit'
}

const isDaoWithdrawCell = (cellType: string) => {
  return cellType === 'nervos_dao_withdrawing'
}

const isDaoCell = (cellType: string) => {
  return isDaoDepositCell(cellType) || isDaoWithdrawCell(cellType)
}

const TransactionCell = ({ cell, address, cellType }: { cell: State.Cell; address?: string; cellType: CellType }) => {
  if (cell.fromCellbase) {
    return <Cellbase targetBlockNumber={cell.targetBlockNumber} cell={cell} cellType={cellType} />
  }

  let addressText = i18n.t('address.unable_decode_address')
  let highLight = false
  if (cell.addressHash) {
    addressText = handleAddressText(cell.addressHash)
    if (cell.addressHash !== address) {
      highLight = true
    } else if (isDaoCell(cell.cellType)) {
      highLight = true
    }
  }

  return (
    <TransactionCellPanel highLight={highLight}>
      <div className="transaction__cell_address">
        {!isMobile() && cellType === CellType.Input && <TransactionCellArrow cell={cell} cellType={cellType} />}
        {highLight ? (
          <Link to={isDaoCell(cell.cellType) ? '/nervosdao' : `/address/${cell.addressHash}`}>
            <>
              {isDaoCell(cell.cellType) && (
                <span className="transaction__cell_dao">{i18n.t('blockchain.nervos_dao')}</span>
              )}
              {!isDaoCell(cell.cellType) && <span className="address">{addressText}</span>}
            </>
          </Link>
        ) : (
          <span className="address">{addressText}</span>
        )}
      </div>
      <TransactionCellCapacity fullWidth={cellType === CellType.Output}>
        {isMobile() && cellType === CellType.Input && <TransactionCellArrow cell={cell} cellType={cellType} />}
        {`${localeNumberString(shannonToCkb(cell.capacity))} CKB`}
        {cellType === CellType.Output && <TransactionCellArrow cell={cell} cellType={cellType} />}
      </TransactionCellCapacity>
    </TransactionCellPanel>
  )
}

export default TransactionCell
