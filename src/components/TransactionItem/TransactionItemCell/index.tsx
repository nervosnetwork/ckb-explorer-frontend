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
import LeftArrow from '../../../assets/left_arrow.png'
import RightHighlightArrow from '../../../assets/right_green_arrow.png'
import RightNormalArrow from '../../../assets/right_grey_arrow.png'

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

const TransactionCell = ({
  cell,
  address,
  isInput = true,
}: {
  cell: State.Cell
  address?: string
  isInput?: boolean
}) => {
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
        {isInput && cell.generatedTxHash && (
          <Link to={`/transaction/${cell.generatedTxHash}`}>
            <img className="transaction__cell_left_arrow" src={LeftArrow} alt="left arrow" />
          </Link>
        )}
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
        {!isInput &&
          (cell.status === 'dead' ? (
            <Link to={`/transaction/${cell.consumedTxHash}`}>
              <img className="transaction__cell_right_arrow" src={RightHighlightArrow} alt="right arrow" />
            </Link>
          ) : (
            <img className="transaction__cell_right_arrow" src={RightNormalArrow} alt="right arrow" />
          ))}
      </div>
    </TransactionCellPanel>
  )
}

export default TransactionCell
