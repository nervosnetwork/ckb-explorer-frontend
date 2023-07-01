import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Popover, Tooltip } from 'antd'
import classNames from 'classnames'
import NervosDAOCellIcon from '../../../assets/nervos_dao_cell.png'
import NervosDAOWithdrawingIcon from '../../../assets/nervos_dao_withdrawing.png'
import CurrentAddressIcon from '../../../assets/current_address.svg'
import UDTTokenIcon from '../../../assets/udt_token.png'
import i18n from '../../../utils/i18n'
import { localeNumberString, parseUDTAmount } from '../../../utils/number'
import { isDaoCell, isDaoDepositCell, isDaoWithdrawCell, shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'
import {
  TransactionCellPanel,
  TransactionCellCapacityPanel,
  WithdrawInfoPanel,
  WithdrawItemPanel,
  TransactionCellWithdraw,
  TransactionCellUDTPanel,
} from './styled'
import { CellType } from '../../../constants/common'
import TransactionCellArrow from '../../Transaction/TransactionCellArrow'
import DecimalCapacity from '../../DecimalCapacity'
import { useAppState } from '../../../contexts/providers'
import { parseDiffDate } from '../../../utils/date'
import Cellbase from '../../Transaction/Cellbase'
import styles from './index.module.scss'
import { useDASAccount } from '../../../contexts/providers/dasQuery'
import { ReactComponent as BitAccountIcon } from '../../../assets/bit_account.svg'
import { useBoolean, useIsMobile } from '../../../utils/hook'
import CopyTooltipText from '../../Text/CopyTooltipText'
import EllipsisMiddle from '../../EllipsisMiddle'

const AddressTextWithAlias: FC<{
  address: string
  to?: string
}> = ({ address, to }) => {
  const alias = useDASAccount(address)

  const [truncated, truncatedCtl] = useBoolean(false)

  const content = (
    <Tooltip trigger={truncated || alias ? 'hover' : []} placement="top" title={<CopyTooltipText content={address} />}>
      <EllipsisMiddle className={classNames('monospace', styles.text)} onTruncateStateChange={truncatedCtl.toggle}>
        {alias ?? address}
      </EllipsisMiddle>
    </Tooltip>
  )

  return (
    <div className={classNames(styles.addressTextWithAlias, styles.addressWidthModify)}>
      {alias && (
        <Tooltip title=".bit Name">
          <BitAccountIcon className={styles.icon} />
        </Tooltip>
      )}

      {to != null ? (
        <Link className={styles.link} to={to}>
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  )
}

const udtAmount = (udt: State.UDTInfo) =>
  udt.published
    ? `${parseUDTAmount(udt.amount, udt.decimal)} ${udt.uan || udt.symbol}`
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
  const isMobile = useIsMobile()
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
          <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} fontSize={isMobile ? '8px' : ''} />
        }
      />
      <WithdrawPopoverItem
        width={width}
        title={`${i18n.t(
          isDaoWithdrawCell(cell.cellType) ? 'nervos_dao.compensation' : 'nervos_dao.unissued_compensation',
        )}: `}
        content={
          <DecimalCapacity value={localeNumberString(shannonToCkb(cell.interest))} fontSize={isMobile ? '8px' : ''} />
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

const TransactionCellNervosDao = ({ cell, cellType }: { cell: State.Cell; cellType: CellType }) => {
  const isMobile = useIsMobile()
  return (
    <TransactionCellWithdraw>
      <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} />
      {cellType === CellType.Input ? (
        <Popover placement="right" title="" content={<WithdrawPopoverInfo cell={cell} />} trigger="click">
          <img src={isDaoWithdrawCell(cell.cellType) ? NervosDAOWithdrawingIcon : NervosDAOCellIcon} alt="withdraw" />
        </Popover>
      ) : (
        <Tooltip
          placement={isMobile ? 'topRight' : 'top'}
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
}

const TransactionCellUDT = ({ cell }: { cell: State.Cell$UDT }) => {
  const isMobile = useIsMobile()
  const { extraInfo } = cell

  return (
    <TransactionCellUDTPanel>
      <span>{udtAmount(extraInfo)}</span>
      <Tooltip
        placement={isMobile ? 'topRight' : 'top'}
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
}

const TransactionCellCapacity = ({ cell, cellType }: { cell: State.Cell; cellType: CellType }) => {
  if (isDaoCell(cell.cellType)) {
    return <TransactionCellNervosDao cell={cell} cellType={cellType} />
  }

  if (cell.cellType === 'udt') {
    return <TransactionCellUDT cell={cell} />
  }

  return (
    <div className="transaction__cell__without__icon">
      <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} />
    </div>
  )
}

const TransactionCell = ({ cell, address, cellType }: { cell: State.Cell; address?: string; cellType: CellType }) => {
  const isMobile = useIsMobile()
  if (cell.fromCellbase) {
    return <Cellbase cell={cell} cellType={cellType} />
  }

  let addressText = i18n.t('address.unable_decode_address')
  let highLight = false
  if (cell.addressHash) {
    addressText = cell.addressHash
    highLight = cell.addressHash !== address
  }

  return (
    <TransactionCellPanel highLight={highLight}>
      <div className="transaction__cell_address">
        {cellType === CellType.Input && <TransactionCellArrow cell={cell} cellType={cellType} />}
        <AddressTextWithAlias address={addressText} to={highLight ? `/address/${cell.addressHash}` : undefined} />
        {cellType === CellType.Output && <TransactionCellArrow cell={cell} cellType={cellType} />}
        {!highLight && !isMobile && (
          <Tooltip placement="top" title={`${i18n.t('address.currentAddress')} `}>
            <img className={styles.currentAddressIcon} src={CurrentAddressIcon} alt="current Address" />
          </Tooltip>
        )}
      </div>
      <TransactionCellCapacityPanel>
        {!highLight && isMobile && (
          <Tooltip placement="top" title={`${i18n.t('address.currentAddress')} `}>
            <img className={styles.currentAddressIcon} src={CurrentAddressIcon} alt="current Address" />
          </Tooltip>
        )}
        <TransactionCellCapacity cell={cell} cellType={cellType} />
      </TransactionCellCapacityPanel>
    </TransactionCellPanel>
  )
}

export default TransactionCell
