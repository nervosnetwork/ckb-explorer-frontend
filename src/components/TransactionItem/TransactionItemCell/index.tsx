import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Popover, Tooltip } from 'antd'
import NervosDAOCellIcon from '../../../assets/nervos_dao_cell.png'
import NervosDAOWithdrawingIcon from '../../../assets/nervos_dao_withdrawing.png'
import UDTTokenIcon from '../../../assets/udt_token.png'
import i18n from '../../../utils/i18n'
import { localeNumberString, parseUDTAmount } from '../../../utils/number'
import { adaptMobileEllipsis, adaptPCEllipsis } from '../../../utils/string'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'
import {
  TransactionCellPanel,
  TransactionCellCapacityPanel,
  WithdrawInfoPanel,
  WithdrawItemPanel,
  TransactionCellWithdraw,
  TransactionCellUDTPanel,
} from './styled'
import { isMobile, isScreenSmallerThan1440, isScreenSmallerThan1200 } from '../../../utils/screen'
import { CellType } from '../../../constants/common'
import TransactionCellArrow from '../../Transaction/TransactionCellArrow'
import DecimalCapacity from '../../DecimalCapacity'
import CopyTooltipText from '../../Text/CopyTooltipText'
import { useAppState } from '../../../contexts/providers'
import { parseDiffDate } from '../../../utils/date'
import Cellbase from '../../Transaction/Cellbase'

const handleAddressText = (address: string) => {
  if (isMobile()) {
    return adaptMobileEllipsis(address, 10)
  }
  if (!isScreenSmallerThan1200() && isScreenSmallerThan1440()) {
    return adaptPCEllipsis(address, 1, 100)
  }
  return adaptPCEllipsis(address, 7, 100)
}

const isDaoDepositCell = (cellType: State.CellTypes) => cellType === 'nervos_dao_deposit'

const isDaoWithdrawCell = (cellType: State.CellTypes) => cellType === 'nervos_dao_withdrawing'

const isDaoCell = (cellType: State.CellTypes) => isDaoDepositCell(cellType) || isDaoWithdrawCell(cellType)

const AddressLink = ({ cell, address, highLight }: { cell: State.Cell; address: string; highLight: boolean }) => {
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

const udtAmount = (udt: State.UDTInfo) =>
  udt.published
    ? `${parseUDTAmount(udt.amount, udt.decimal)} ${udt.symbol}`
    : `${i18n.t('udt.unknown_token')} #${udt.typeHash.substring(udt.typeHash.length - 4)}`

const WithdrawPopoverItem = ({
  width,
  title,
  content,
}: {
  width: string
  title: string
  content: ReactNode | string
}) => (
  <WithdrawItemPanel width={width}>
    <div className="withdraw__info_title">{title}</div>
    <div className="withdraw__info_content">{content}</div>
  </WithdrawItemPanel>
)

const WithdrawPopoverInfo = ({ cell }: { cell: State.Cell }) => {
  const { app } = useAppState()
  let width = 'short'
  if (app.language === 'en') {
    width = isDaoDepositCell(cell.cellType) ? 'long' : 'medium'
  }
  return (
    <WithdrawInfoPanel>
      <p>
        {isDaoWithdrawCell(cell.cellType)
          ? i18n.t('nervos_dao.withdraw_tooltip')
          : i18n.t('nervos_dao.withdraw_request_tooltip')}
      </p>
      <WithdrawPopoverItem
        width={width}
        title={`${i18n.t('nervos_dao.deposit_capacity')}: `}
        content={
          <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} fontSize={isMobile() ? '8px' : ''} />
        }
      />
      <WithdrawPopoverItem
        width={width}
        title={`${i18n.t(
          isDaoWithdrawCell(cell.cellType) ? 'nervos_dao.compensation' : 'nervos_dao.unissued_compensation',
        )}: `}
        content={
          <DecimalCapacity value={localeNumberString(shannonToCkb(cell.interest))} fontSize={isMobile() ? '8px' : ''} />
        }
      />
      <WithdrawPopoverItem
        width={width}
        title={`${i18n.t('nervos_dao.compensation_period')}: `}
        content={
          <>
            <span>{`${i18n.t('block.block')} `}</span>
            <Link to={`/block/${cell.compensationStartedBlockNumber}`}>
              <span>{localeNumberString(cell.compensationStartedBlockNumber)}</span>
            </Link>
            <span> - </span>
            <Link to={`/block/${cell.compensationStartedBlockNumber}`}>
              <span>{localeNumberString(cell.compensationEndedBlockNumber)}</span>
            </Link>
          </>
        }
      />
      <WithdrawPopoverItem
        width={width}
        title={`${i18n.t('nervos_dao.compensation_time')}: `}
        content={parseDiffDate(cell.compensationStartedTimestamp, cell.compensationEndedTimestamp)}
      />
      {isDaoWithdrawCell(cell.cellType) && (
        <>
          <WithdrawPopoverItem
            width={width}
            title={`${i18n.t('nervos_dao.locked_period')}: `}
            content={
              <>
                <span>{`${i18n.t('block.block')} `}</span>
                <Link to={`/block/${cell.compensationStartedBlockNumber}`}>
                  <span>{localeNumberString(cell.compensationStartedBlockNumber)}</span>
                </Link>
                <span> - </span>
                <Link to={`/block/${cell.lockedUntilBlockNumber}`}>
                  <span>{localeNumberString(cell.lockedUntilBlockNumber)}</span>
                </Link>
              </>
            }
          />
          <WithdrawPopoverItem
            width={width}
            title={`${i18n.t('nervos_dao.locked_time')}: `}
            content={parseDiffDate(cell.compensationStartedTimestamp, cell.lockedUntilBlockTimestamp)}
          />
        </>
      )}
    </WithdrawInfoPanel>
  )
}

const TransactionCellNervosDao = ({ cell, cellType }: { cell: State.Cell; cellType: CellType }) => (
  <TransactionCellWithdraw>
    <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} />
    {cellType === CellType.Input ? (
      <Popover placement="right" title="" content={<WithdrawPopoverInfo cell={cell} />} trigger="click">
        <img src={isDaoWithdrawCell(cell.cellType) ? NervosDAOWithdrawingIcon : NervosDAOCellIcon} alt="withdraw" />
      </Popover>
    ) : (
      <Tooltip
        placement={isMobile() ? 'topRight' : 'top'}
        title={i18n.t(
          isDaoDepositCell(cell.cellType) ? 'nervos_dao.deposit_tooltip' : 'nervos_dao.calculation_tooltip',
        )}
        arrowPointAtCenter
        overlayStyle={{
          fontSize: '14px',
        }}
      >
        <img src={isDaoWithdrawCell(cell.cellType) ? NervosDAOWithdrawingIcon : NervosDAOCellIcon} alt="withdraw" />
      </Tooltip>
    )}
  </TransactionCellWithdraw>
)

const TransactionCellUDT = ({ cell }: { cell: State.Cell }) => (
  <TransactionCellUDTPanel>
    <span>{udtAmount(cell.udtInfo)}</span>
    <Tooltip
      placement={isMobile() ? 'topRight' : 'top'}
      title={`Capacity: ${localeNumberString(shannonToCkbDecimal(cell.capacity, 8))} CKB`}
      arrowPointAtCenter
      overlayStyle={{
        fontSize: '14px',
      }}
    >
      <img src={UDTTokenIcon} className="transaction__cell__udt__icon" alt="udt token" />
    </Tooltip>
  </TransactionCellUDTPanel>
)

const TransactionCellCapacity = ({ cell, cellType }: { cell: State.Cell; cellType: CellType }) => {
  if (isDaoCell(cell.cellType)) {
    return <TransactionCellNervosDao cell={cell} cellType={cellType} />
  }
  if (cell.udtInfo && cell.udtInfo.typeHash) {
    return <TransactionCellUDT cell={cell} />
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
    highLight = cell.addressHash !== address
  }

  return (
    <TransactionCellPanel highLight={highLight}>
      <div className="transaction__cell_address">
        {cellType === CellType.Input && <TransactionCellArrow cell={cell} cellType={cellType} />}
        <AddressLink cell={cell} address={addressText} highLight={highLight} />
        {cellType === CellType.Output && <TransactionCellArrow cell={cell} cellType={cellType} />}
      </div>
      <TransactionCellCapacityPanel>
        <TransactionCellCapacity cell={cell} cellType={cellType} />
      </TransactionCellCapacityPanel>
    </TransactionCellPanel>
  )
}

export default TransactionCell
