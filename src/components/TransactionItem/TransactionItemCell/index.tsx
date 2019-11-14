import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Popover } from 'antd'
import 'antd/dist/antd.css'
import HelpIcon from '../../../assets/qa_help.png'
import DetailIcon from '../../../assets/detail.png'
import i18n from '../../../utils/i18n'
import { localeNumberString } from '../../../utils/number'
import { adaptMobileEllipsis, adaptPCEllipsis } from '../../../utils/string'
import { shannonToCkb } from '../../../utils/util'
import { CellbasePanel, TransactionCellPanel, TransactionCellCapacity, WithdrawInfoPanel } from './styled'
import { isMobile } from '../../../utils/screen'
import Tooltip from '../../Tooltip'
import { CellType } from '../../../utils/const'
import TransactionCellArrow from '../../../pages/Transaction/TransactionCellArrow'
import { AppContext } from '../../../contexts/providers'

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
    return adaptMobileEllipsis(address, 12)
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

const NervosDAOAddress = ({ cell, address }: { cell: State.Cell; address: string }) => {
  const { app } = useContext(AppContext)
  const WithdrawInfo = (
    <WithdrawInfoPanel longTitle={app.language === 'en'}>
      <div>
        <div className="withdraw__info_title">{`${i18n.t('nervos_dao.deposit_capacity')}: `}</div>
        <div className="withdraw__info_content">
          <span>{localeNumberString(shannonToCkb(cell.capacity))}</span>
          <span>{` ${i18n.t('common.ckb_unit')}`}</span>
        </div>
      </div>
      <div>
        <div className="withdraw__info_title">{`${i18n.t('nervos_dao.compensation')}: `}</div>
        <div className="withdraw__info_content">
          <span>{localeNumberString(shannonToCkb(cell.interest))}</span>
          <span>{` ${i18n.t('common.ckb_unit')}`}</span>
        </div>
      </div>
      <div>
        <div className="withdraw__info_title">{`${i18n.t('nervos_dao.deposit_period')}: `}</div>
        <div className="withdraw__info_content">
          <span>{`${i18n.t('block.block')}`}</span>
          <Link to={`/block/${cell.startedBlockNumber}`}>
            <span>{localeNumberString(cell.startedBlockNumber)}</span>
          </Link>
          <span> - </span>
          <span>{localeNumberString(cell.endedBlockNumber)}</span>
        </div>
      </div>
    </WithdrawInfoPanel>
  )

  if (isDaoCell(cell.cellType)) {
    if (isDaoWithdrawCell(cell.cellType)) {
      return (
        <div className="transaction__cell_withdraw">
          <Link to="/nervosdao">
            <span className="transaction__cell_dao">{i18n.t('blockchain.nervos_dao')}</span>
          </Link>
          <Popover placement="right" title="" content={WithdrawInfo} trigger="click">
            <img src={DetailIcon} className="nervos__dao__withdraw_help" alt="nervos dao withdraw" />
          </Popover>
        </div>
      )
    }
    return (
      <Link to="/nervosdao">
        <span className="transaction__cell_dao">{i18n.t('blockchain.nervos_dao')}</span>
      </Link>
    )
  }
  return (
    <Link to={`/address/${cell.addressHash}`}>
      <span className="address">{address}</span>
    </Link>
  )
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
          <NervosDAOAddress cell={cell} address={addressText} />
        ) : (
          <span className="address">{addressText}</span>
        )}
      </div>
      <TransactionCellCapacity fullWidth={cellType === CellType.Output}>
        {isMobile() && cellType === CellType.Input && <TransactionCellArrow cell={cell} cellType={cellType} />}
        {`${localeNumberString(shannonToCkb(cell.capacity))} ${i18n.t('common.ckb_unit')}`}
        {cellType === CellType.Output && <TransactionCellArrow cell={cell} cellType={cellType} />}
      </TransactionCellCapacity>
    </TransactionCellPanel>
  )
}

export default TransactionCell
