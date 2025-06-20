import { FC, ReactNode, useState } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Link } from '../../Link'
import NervosDAOCellIcon from '../../../assets/nervos_dao_cell.png'
import { ReactComponent as CellInfoIcon } from '../../../assets/cell_info.svg'
import NervosDAOWithdrawingIcon from '../../../assets/nervos_dao_withdrawing.png'
import CurrentAddressIcon from '../../../assets/current_address.svg'
import UDTTokenIcon from '../../../assets/udt_token.png'
import { useCurrentLanguage } from '../../../utils/i18n'
import { localeNumberString, parseUDTAmount } from '../../../utils/number'
import { isDaoCell, isDaoDepositCell, isDaoWithdrawCell, shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'
import { IOType } from '../../../constants/common'
import { CellInputIcon, CellOutputIcon } from '../../Transaction/TransactionCellArrow'
import Capacity from '../../Capacity'
import { parseDiffDate } from '../../../utils/date'
import Cellbase from '../../Transaction/Cellbase'
import styles from './index.module.scss'
import { useDASAccount } from '../../../hooks/useDASAccount'
import { ReactComponent as BitAccountIcon } from '../../../assets/bit_account.svg'
import { useBoolean, useIsMobile } from '../../../hooks'
import CopyTooltipText from '../../Text/CopyTooltipText'
import EllipsisMiddle from '../../EllipsisMiddle'
import { Cell, Cell$UDT, UDTInfo } from '../../../models/Cell'
import SimpleModal from '../../Modal'
import CellModal from '../../Cell/CellModal'
import Tooltip from '../../Tooltip'
import Popover from '../../Popover'

const AddressTextWithAlias: FC<{
  address: string
  to?: string
}> = ({ address, to }) => {
  const alias = useDASAccount(address)

  const [truncated, truncatedCtl] = useBoolean(false)

  const content = (
    <Tooltip
      disabled={!truncated && !alias}
      trigger={
        <EllipsisMiddle className={classNames('monospace', styles.text)} onTruncateStateChange={truncatedCtl.toggle}>
          {alias ?? address}
        </EllipsisMiddle>
      }
      placement="top"
    >
      <CopyTooltipText content={address} />
    </Tooltip>
  )

  return (
    <div className={classNames(styles.addressTextWithAlias, styles.addressWidthModify)}>
      {alias && (
        <Tooltip trigger={<BitAccountIcon className={styles.icon} />} placement="top">
          .bit Name
        </Tooltip>
      )}

      {to ? (
        <Link className={styles.link} to={to}>
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  )
}

const useUdtAmount = (udt: UDTInfo) => {
  const { t } = useTranslation()
  return udt.published
    ? `${parseUDTAmount(udt.amount, udt.decimal)} ${udt.symbol}`
    : `${t('udt.unknown_token')} #${udt.typeHash.substring(udt.typeHash.length - 4)}`
}

const WithdrawPopoverItem = ({
  width,
  title,
  content,
}: {
  width: string
  title: string
  content: ReactNode | string
}) => (
  <div className={classNames(styles.withdrawItemPanel)}>
    <div className={classNames('withdrawInfoTitle', width)}>{title}</div>
    <div className="withdrawInfoContent">{content}</div>
  </div>
)

const WithdrawPopoverInfo = ({ cell }: { cell: Cell }) => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  let width = 'short'
  if (currentLanguage === 'en') {
    width = isDaoDepositCell(cell.cellType) ? 'long' : 'medium'
  }
  return (
    <div className={styles.withdrawInfoPanel}>
      <p>
        {isDaoWithdrawCell(cell.cellType) ? t('nervos_dao.withdraw_tooltip') : t('nervos_dao.withdraw_request_tooltip')}
      </p>
      <WithdrawPopoverItem
        width={width}
        title={`${t('nervos_dao.deposit_capacity')}: `}
        content={<Capacity capacity={shannonToCkb(cell.capacity)} />}
      />
      <WithdrawPopoverItem
        width={width}
        title={`${t(
          isDaoWithdrawCell(cell.cellType) ? 'nervos_dao.compensation' : 'nervos_dao.unissued_compensation',
        )}: `}
        content={<Capacity capacity={shannonToCkb(cell.interest)} />}
      />
      <WithdrawPopoverItem
        width={width}
        title={`${t('nervos_dao.compensation_period')}: `}
        content={
          <>
            <span>{`${t('block.block')} `}</span>
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
        title={`${t('nervos_dao.compensation_time')}: `}
        content={parseDiffDate(cell.compensationStartedTimestamp, cell.compensationEndedTimestamp)}
      />
      {isDaoWithdrawCell(cell.cellType) && (
        <>
          <WithdrawPopoverItem
            width={width}
            title={`${t('nervos_dao.locked_period')}: `}
            content={
              <>
                <span>{`${t('block.block')} `}</span>
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
            title={`${t('nervos_dao.locked_time')}: `}
            content={parseDiffDate(cell.compensationStartedTimestamp, cell.lockedUntilBlockTimestamp)}
          />
        </>
      )}
    </div>
  )
}

const TransactionCellNervosDao = ({ cell, ioType }: { cell: Cell; ioType: IOType }) => {
  const { t } = useTranslation()
  return (
    <div className={styles.transactionCellWithdraw}>
      <Capacity capacity={shannonToCkb(cell.capacity)} />
      {ioType === IOType.Input ? (
        <Popover
          placement="right"
          trigger={
            <img src={isDaoWithdrawCell(cell.cellType) ? NervosDAOWithdrawingIcon : NervosDAOCellIcon} alt="withdraw" />
          }
        >
          <WithdrawPopoverInfo cell={cell} />
        </Popover>
      ) : (
        <Tooltip
          trigger={
            <img src={isDaoWithdrawCell(cell.cellType) ? NervosDAOWithdrawingIcon : NervosDAOCellIcon} alt="withdraw" />
          }
        >
          {t(isDaoDepositCell(cell.cellType) ? 'nervos_dao.deposit_tooltip' : 'nervos_dao.calculation_tooltip')}
        </Tooltip>
      )}
    </div>
  )
}

const TransactionCellUDT = ({ cell }: { cell: Cell$UDT }) => {
  const { extraInfo } = cell

  return (
    <div className={styles.transactionCellUDTPanel}>
      <span>{useUdtAmount(extraInfo)}</span>
      <Tooltip trigger={<img src={UDTTokenIcon} className="transactionCellUdtIcon" alt="udt token" />}>
        {`Capacity: ${localeNumberString(shannonToCkbDecimal(cell.capacity, 8))} CKB`}
      </Tooltip>
    </div>
  )
}

const TransactionCellCapacity = ({ cell, ioType }: { cell: Cell; ioType: IOType }) => {
  if (isDaoCell(cell.cellType)) {
    return <TransactionCellNervosDao cell={cell} ioType={ioType} />
  }

  if (cell.cellType === 'udt') {
    return <TransactionCellUDT cell={cell} />
  }

  if (cell.cellType === 'xudt' || cell.cellType === 'xudt_compatible') {
    const info = cell.extraInfo
    if (info?.amount !== undefined && info.decimal && info.symbol) {
      return (
        <div className="transactionCellWithoutIcon">
          <Capacity
            capacity={parseUDTAmount(info.amount, info.decimal).replace(/,/g, '')}
            unit={info.symbol}
            display="short"
          />
        </div>
      )
    }
  }

  if (cell.cellType === 'omiga_inscription') {
    const info = cell.extraInfo
    if (info?.amount !== undefined && info.decimal && info.symbol) {
      return (
        <div className="transactionCellWithoutIcon">
          <Capacity
            capacity={parseUDTAmount(info.amount, info.decimal).replace(/,/g, '')}
            unit={info.symbol}
            display="short"
          />
        </div>
      )
    }
  }

  return (
    <div className="transactionCellWithoutIcon">
      <Capacity capacity={shannonToCkb(cell.capacity)} />
    </div>
  )
}

const TransactionCell = ({ cell, address, ioType }: { cell: Cell; address?: string; ioType: IOType }) => {
  const [showModal, setShowModal] = useState(false)
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  if (cell.fromCellbase) {
    return <Cellbase cell={cell} />
  }

  let addressText = t('address.unable_decode_address')
  let highLight = false
  if (cell.rgbInfo?.address) {
    addressText = cell.rgbInfo.address
  } else if (cell.addressHash) {
    addressText = cell.addressHash
  }
  highLight = addressText !== address

  return (
    <div className={classNames(styles.transactionCellPanel, highLight && styles.highLight)}>
      <div className="transactionCellAddress">
        {ioType === IOType.Input && <CellInputIcon cell={cell} />}
        <AddressTextWithAlias
          address={addressText}
          to={highLight ? `/address/${cell.rgbInfo?.address || cell.addressHash}` : undefined}
        />
        {ioType === IOType.Output && <CellOutputIcon cell={cell} />}
        {!highLight && !isMobile && (
          <Tooltip
            trigger={<img className={styles.currentAddressIcon} src={CurrentAddressIcon} alt="current Address" />}
            placement="top"
          >
            {`${t('address.current-address')} `}
          </Tooltip>
        )}
      </div>
      <div className={styles.transactionCellCapacityPanel}>
        {!highLight && isMobile && (
          <Tooltip
            trigger={<img className={styles.currentAddressIcon} src={CurrentAddressIcon} alt="current Address" />}
            placement="top"
          >
            {`${t('address.current-address')} `}
          </Tooltip>
        )}
        <TransactionCellCapacity cell={cell} ioType={ioType} />
        <Tooltip
          trigger={<CellInfoIcon className={styles.hoverIconButton} onClick={() => setShowModal(true)} />}
          placement="top"
        >
          {`${t('transaction.ckb-cell-info')} `}
        </Tooltip>
        <SimpleModal isShow={showModal} setIsShow={setShowModal}>
          <CellModal cell={cell} onClose={() => setShowModal(false)} />
        </SimpleModal>
      </div>
    </div>
  )
}

export default TransactionCell
