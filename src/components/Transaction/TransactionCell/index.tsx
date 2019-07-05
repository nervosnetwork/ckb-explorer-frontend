import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import HelpIcon from '../../../assets/qa_help.png'
import { InputOutput } from '../../../http/response/Transaction'
import i18n from '../../../utils/i18n'
import { localeNumberString } from '../../../utils/number'
import { startEndEllipsis } from '../../../utils/string'
import { shannonToCkb } from '../../../utils/util'
import Tooltip, { TargetSize } from '../../Tooltip/index'
import { CellbasePanel, CellHash, CellHashHighLight, TransactionCellPanel } from './styled'

const Cellbase = ({ targetBlockNumber }: { targetBlockNumber?: number }) => {
  const [show, setShow] = useState(false)
  const targetSize: TargetSize = {
    width: 20,
    height: 30,
  }

  return targetBlockNumber && targetBlockNumber > 0 ? (
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
  ) : (
    <CellbasePanel>
      <div className="cellbase__content">Cellbase</div>
    </CellbasePanel>
  )
}
const CellbaseAddress = ({ cell, address }: { cell: InputOutput; address?: string }) => {
  return address === cell.address_hash || cell.from_cellbase ? (
    <div className="transaction__cell">
      <CellHash>
        {cell.address_hash ? (
          startEndEllipsis(cell.address_hash)
        ) : (
          <Cellbase targetBlockNumber={cell.target_block_number} />
        )}
      </CellHash>
    </div>
  ) : (
    <Link className="transaction__cell__link" to={`/address/${cell.address_hash}`}>
      <CellHashHighLight>{startEndEllipsis(cell.address_hash)}</CellHashHighLight>
    </Link>
  )
}
const TransactionCell = ({ cell, address }: { cell: InputOutput; address?: string }) => {
  return (
    <TransactionCellPanel>
      {cell.address_hash ? (
        <CellbaseAddress cell={cell} address={address} />
      ) : (
        <div className="transaction__cell">
          <CellHash>
            {cell.from_cellbase ? (
              <Cellbase targetBlockNumber={cell.target_block_number} />
            ) : (
              'Unable to decode address'
            )}
          </CellHash>
        </div>
      )}
      {!cell.from_cellbase && (
        <div className="transaction__cell__capacity">{`${localeNumberString(shannonToCkb(cell.capacity))} CKB`}</div>
      )}
    </TransactionCellPanel>
  )
}

export default TransactionCell
