import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import HelpIcon from '../../../assets/qa_help.png'
import i18n from '../../../utils/i18n'
import { localeNumberString } from '../../../utils/number'
import { startEndEllipsis } from '../../../utils/string'
import { shannonToCkb } from '../../../utils/util'
import Tooltip, { TargetSize } from '../../Tooltip/index'
import { CellbasePanel, TransactionCellPanel } from './styled'
import { isMediumMobile, isLargeMobile, isMobile, isSmallMobile } from '../../../utils/screen'

const Cellbase = ({ targetBlockNumber }: { targetBlockNumber?: number }) => {
  const [show, setShow] = useState(false)
  let targetSize: TargetSize = {
    width: 20,
    height: 30,
  }
  if (isMobile()) {
    targetSize = {
      width: 14,
      height: 30,
    }
  }
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
        <Tooltip message={i18n.t('transaction.cellbase_help_tooltip')} show={show} targetSize={targetSize} />
      </div>
    </CellbasePanel>
  )
}

const handleAddressText = (address: string) => {
  if (isSmallMobile()) {
    return startEndEllipsis(address, 12)
  }
  if (isMediumMobile()) {
    return startEndEllipsis(address, 19)
  }
  if (isLargeMobile()) {
    return startEndEllipsis(address, 24)
  }
  return address
}

const TransactionCell = ({ cell, address }: { cell: State.InputOutput; address?: string }) => {
  if (cell.from_cellbase) {
    return <Cellbase targetBlockNumber={cell.target_block_number} />
  }

  let addressText = i18n.t('address.unable_decode_address')
  let highLight = false
  if (cell.address_hash) {
    addressText = handleAddressText(cell.address_hash)
    if (cell.address_hash !== address) {
      highLight = true
    }
  }

  return (
    <TransactionCellPanel highLight={highLight}>
      <div className="transaction__cell_address">
        {highLight ? (
          <Link to={`/address/${cell.address_hash}`}>
            <code>{addressText}</code>
          </Link>
        ) : (
          <code>{addressText}</code>
        )}
      </div>
      <div className="transaction__cell_capacity">{`${localeNumberString(shannonToCkb(cell.capacity))} CKB`}</div>
    </TransactionCellPanel>
  )
}

export default TransactionCell
