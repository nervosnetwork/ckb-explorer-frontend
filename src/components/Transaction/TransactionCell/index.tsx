import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { InputOutput } from '../../../http/response/Transaction'
import { startEndEllipsis } from '../../../utils/string'
import { shannonToCkb } from '../../../utils/util'
import HelpIcon from '../../../assets/qa_help.png'
import { localeNumberString } from '../../../utils/number'
import i18n from '../../../utils/i18n'
import Tooltip, { TargetSize } from '../../Tooltip/index'

export const TransactionCellPanel = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
  justify-content: space-between;

  .transaction__cell {
    display: flex;
    align-items: center;
    justify-content: left;
    color: rgb(136, 136, 136);
  }

  .transaction__cell__capacity {
    font-size: 16px;
    color: rgb(136, 136, 136);
    margin-left: 15px;
  }
`

const CellHash = styled.code`
  font-size: 16px;
  color: rgb(136, 136, 136);
`

export const CellHashHighLight = styled(CellHash)`
  font-size: 16px;
  color: rgb(75, 188, 142);
`

export const CellbasePanel = styled.div`
  display: flex;

  .cellbase__content {
    color: #888888;
    font-size: 16px;
    margin-right: 10px;
  }

  .cellbase__help {
    margin-left: 10px;
    position: relative;

    > img {
      margin-top: -1px;
      width: 20px;
      height: 20px;
    }
  }
`

const Cellbase = ({ targetBlockNumber }: { targetBlockNumber?: number }) => {
  const [show, setShow] = useState(false)
  const targetSize: TargetSize = {
    width: 20,
    height: 30,
  }

  return targetBlockNumber && targetBlockNumber > 0 ? (
    <CellbasePanel>
      <div className="cellbase__content">Cellbase for Block</div>
      <Link to={`/block/${targetBlockNumber}`}>
        <CellHashHighLight>{localeNumberString(targetBlockNumber)}</CellHashHighLight>
      </Link>
      <div
        className="cellbase__help"
        tabIndex={-1}
        onFocus={() => {}}
        onMouseOver={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <img alt="cellbase help" src={HelpIcon} />
        <Tooltip message={i18n.t('transaction.cellbase_help_tooltip')} show={show} targetSize={targetSize} />
      </div>
    </CellbasePanel>
  ) : (
    <div>Cellbase</div>
  )
}

const TransactionCell = ({ cell, address }: { cell: InputOutput; address?: string }) => {
  const CellbaseAddress = () => {
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

  return (
    <TransactionCellPanel>
      {cell.address_hash ? (
        <CellbaseAddress />
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
