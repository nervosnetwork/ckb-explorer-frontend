import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import HelpIcon from '../../../assets/qa_help.png'
import i18n from '../../../utils/i18n'
import { localeNumberString } from '../../../utils/number'
import { startEndEllipsis } from '../../../utils/string'
import { shannonToCkb } from '../../../utils/util'
import { CellbasePanel, TransactionCellPanel } from './styled'
import { isMediumMobile, isLargeMobile, isSmallMobile } from '../../../utils/screen'
import Tooltip from '../../Tooltip'
import { CellType } from '../../../utils/const'
import TransactionCellArrow from '../../../pages/Transaction/TransactionCellArrow'

const Cellbase = ({ targetBlockNumber }: { targetBlockNumber?: number }) => {
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
  if (isSmallMobile()) {
    return startEndEllipsis(address, 11)
  }
  if (isMediumMobile()) {
    return startEndEllipsis(address, 18)
  }
  if (isLargeMobile()) {
    return startEndEllipsis(address, 23)
  }
  return startEndEllipsis(address)
}

const TransactionCell = ({ cell, address, cellType }: { cell: State.Cell; address?: string; cellType: CellType }) => {
  if (cell.fromCellbase) {
    return <Cellbase targetBlockNumber={cell.targetBlockNumber} />
  }

  let addressText = i18n.t('address.unable_decode_address')
  let highLight = false
  if (cell.addressHash) {
    addressText = handleAddressText(cell.addressHash)
    if (cell.addressHash !== address) {
      highLight = true
    }
  }

  return (
    <TransactionCellPanel highLight={highLight}>
      <div className="transaction__cell_address">
        {cellType === CellType.Input && <TransactionCellArrow cell={cell} cellType={cellType} />}
        {highLight ? (
          <Link to={`/address/${cell.addressHash}`}>
            <code>{addressText}</code>
          </Link>
        ) : (
          <code>{addressText}</code>
        )}
      </div>
      <div className="transaction__cell_capacity">
        {`${localeNumberString(shannonToCkb(cell.capacity))} CKB`}
        {cellType === CellType.Output && <TransactionCellArrow cell={cell} cellType={cellType} />}
      </div>
    </TransactionCellPanel>
  )
}

export default TransactionCell
