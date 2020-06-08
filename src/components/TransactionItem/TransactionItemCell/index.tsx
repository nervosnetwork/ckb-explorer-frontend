import React from 'react'
import { Link } from 'react-router-dom'
import { Popover, Tooltip } from 'antd'
import 'antd/dist/antd.css'
import HelpIcon from '../../../assets/qa_help.png'
import NervosDAOCellIcon from '../../../assets/nervos_dao_cell.png'
import NervosDAOWithdrawingIcon from '../../../assets/nervos_dao_withdrawing.png'
import UDTTokenIcon from '../../../assets/udt_token.png'
import i18n from '../../../utils/i18n'
import { localeNumberString, parseUDTAmount } from '../../../utils/number'
import { adaptMobileEllipsis, adaptPCEllipsis } from '../../../utils/string'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'
import { CellbasePanel, TransactionCellPanel, TransactionCellCapacity, WithdrawInfoPanel } from './styled'
import { isMobile, isScreenSmallerThan1440 } from '../../../utils/screen'
import { CellType, DaoType } from '../../../utils/const'
import TransactionCellArrow from '../../../pages/Transaction/TransactionCellArrow'
import DecimalCapacity from '../../DecimalCapacity'
import CopyTooltipText from '../../Text/CopyTooltipText'
import { useAppState } from '../../../contexts/providers'
import { parseDiffDate } from '../../../utils/date'

const Cellbase = ({ cell, cellType }: { cell: State.Cell; cellType: CellType }) => {
  if (!cell.targetBlockNumber || cell.targetBlockNumber <= 0) {
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
      <Link to={`/block/${cell.targetBlockNumber}`}>{localeNumberString(cell.targetBlockNumber)}</Link>
      <Tooltip placement="top" title={i18n.t('transaction.cellbase_help_tooltip')}>
        <img className="cellbase__help__icon" alt="cellbase help" src={HelpIcon} />
      </Tooltip>
    </CellbasePanel>
  )
}

const handleAddressText = (address: string) => {
  if (isMobile()) {
    return adaptMobileEllipsis(address, 10)
  }
  return adaptPCEllipsis(address, isScreenSmallerThan1440() ? 2 : 9, 100)
}

const isDaoDepositCell = (cellType: string) => {
  return cellType === DaoType.Deposit
}

const isDaoWithdrawCell = (cellType: string) => {
  return cellType === DaoType.Withdraw
}

const isDaoCell = (cellType: string) => {
  return isDaoDepositCell(cellType) || isDaoWithdrawCell(cellType)
}

const AddressLinkComp = ({ cell, address, highLight }: { cell: State.Cell; address: string; highLight: boolean }) => {
  if (address.includes('...')) {
    return (
      <Tooltip placement="top" title={<CopyTooltipText content={cell.addressHash} />}>
        {highLight ? (
          <Link to={`/address/${cell.addressHash}`} className="monospace">
            {address}
          </Link>
        ) : (
          <span className="monospace">{address}</span>
        )}
      </Tooltip>
    )
  }
  return highLight ? (
    <Link to={`/address/${cell.addressHash}`} className="monospace">
      {address}
    </Link>
  ) : (
    <span className="monospace">{address}</span>
  )
}

const udtAmount = (udt: State.UDTInfo) => {
  return udt.published
    ? `${parseUDTAmount(udt.amount, udt.decimal)} ${udt.symbol}`
    : `${i18n.t('udt.unknown_token')} #<${udt.typeHash.substring(udt.typeHash.length - 4)}>`
}

const TransactionCapacityAction = ({ cell, cellType }: { cell: State.Cell; cellType: CellType }) => {
  const { app } = useAppState()
  let width = 'short'
  if (app.language === 'en') {
    width = isDaoDepositCell(cell.cellType) ? 'long' : 'medium'
  }
  const WithdrawInfo = (
    <WithdrawInfoPanel width={width}>
      <p>
        {isDaoWithdrawCell(cell.cellType)
          ? i18n.t('nervos_dao.withdraw_tooltip')
          : i18n.t('nervos_dao.withdraw_request_tooltip')}
      </p>
      <div>
        <div className="withdraw__info_title">{`${i18n.t('nervos_dao.deposit_capacity')}: `}</div>
        <div className="withdraw__info_content">
          <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} fontSize={isMobile() ? '8px' : ''} />
        </div>
      </div>
      <div>
        <div className="withdraw__info_title">
          {`${i18n.t(
            isDaoWithdrawCell(cell.cellType) ? 'nervos_dao.compensation' : 'nervos_dao.unissued_compensation',
          )}: `}
        </div>
        <div className="withdraw__info_content">
          <DecimalCapacity value={localeNumberString(shannonToCkb(cell.interest))} fontSize={isMobile() ? '8px' : ''} />
        </div>
      </div>
      <div>
        <div className="withdraw__info_title">{`${i18n.t('nervos_dao.compensation_period')}: `}</div>
        <div className="withdraw__info_content">
          <span>{`${i18n.t('block.block')} `}</span>
          <Link to={`/block/${cell.compensationStartedBlockNumber}`}>
            <span>{localeNumberString(cell.compensationStartedBlockNumber)}</span>
          </Link>
          <span> - </span>
          <Link to={`/block/${cell.compensationStartedBlockNumber}`}>
            <span>{localeNumberString(cell.compensationEndedBlockNumber)}</span>
          </Link>
        </div>
      </div>
      <div>
        <div className="withdraw__info_title">{`${i18n.t('nervos_dao.compensation_time')}: `}</div>
        <div className="withdraw__info_content">
          <span>{parseDiffDate(cell.compensationStartedTimestamp, cell.compensationEndedTimestamp)}</span>
        </div>
      </div>
      {isDaoWithdrawCell(cell.cellType) && (
        <>
          <div>
            <div className="withdraw__info_title">{`${i18n.t('nervos_dao.locked_period')}: `}</div>
            <div className="withdraw__info_content">
              <span>{`${i18n.t('block.block')} `}</span>
              <Link to={`/block/${cell.compensationStartedBlockNumber}`}>
                <span>{localeNumberString(cell.compensationStartedBlockNumber)}</span>
              </Link>
              <span> - </span>
              <Link to={`/block/${cell.lockedUntilBlockNumber}`}>
                <span>{localeNumberString(cell.lockedUntilBlockNumber)}</span>
              </Link>
            </div>
          </div>
          <div>
            <div className="withdraw__info_title">{`${i18n.t('nervos_dao.locked_time')}: `}</div>
            <div className="withdraw__info_content">
              <span>{parseDiffDate(cell.compensationStartedTimestamp, cell.lockedUntilBlockTimestamp)}</span>
            </div>
          </div>
        </>
      )}
    </WithdrawInfoPanel>
  )

  if (isDaoCell(cell.cellType)) {
    return (
      <div className="transaction__cell_withdraw">
        <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} />
        {cellType === CellType.Input ? (
          <Popover placement="right" title="" content={WithdrawInfo} trigger="click">
            <img
              src={isDaoWithdrawCell(cell.cellType) ? NervosDAOWithdrawingIcon : NervosDAOCellIcon}
              className="nervos__dao__withdraw_icon"
              alt="nervos dao withdraw"
            />
          </Popover>
        ) : (
          <Tooltip
            placement={isMobile() ? 'topRight' : 'top'}
            title={i18n.t(
              isDaoDepositCell(cell.cellType) ? 'nervos_dao.deposit_tooltip' : 'nervos_dao.calculation_tooltip',
            )}
            arrowPointAtCenter
            overlayStyle={{ fontSize: '12px' }}
          >
            <img
              src={isDaoWithdrawCell(cell.cellType) ? NervosDAOWithdrawingIcon : NervosDAOCellIcon}
              className="nervos__dao__withdraw_icon"
              alt="right arrow"
            />
          </Tooltip>
        )}
      </div>
    )
  }
  if (cell.udtInfo && cell.udtInfo.symbol) {
    return (
      <>
        <span>{udtAmount(cell.udtInfo)}</span>
        <Tooltip
          placement={isMobile() ? 'topRight' : 'top'}
          title={`Capacity: ${localeNumberString(shannonToCkbDecimal(cell.capacity, 8))} CKB`}
          arrowPointAtCenter
          overlayStyle={{ fontSize: '14px' }}
        >
          <img src={UDTTokenIcon} className="nervos__dao__withdraw_icon" alt="right arrow" />
        </Tooltip>
      </>
    )
  }
  return (
    <div className="transaction__cell__without__icon">
      <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} />
    </div>
  )
}

const TransactionCell = ({ cell, address, cellType }: { cell: State.Cell; address?: string; cellType: CellType }) => {
  if (cell.fromCellbase) {
    return <Cellbase cell={cell} cellType={cellType} />
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
        <AddressLinkComp cell={cell} address={addressText} highLight={highLight} />
        {cellType === CellType.Output && <TransactionCellArrow cell={cell} cellType={cellType} />}
      </div>
      <TransactionCellCapacity>
        <TransactionCapacityAction cell={cell} cellType={cellType} />
      </TransactionCellCapacity>
    </TransactionCellPanel>
  )
}

export default TransactionCell
