import React, { useState, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { CellType, DaoType } from '../../../utils/const'
import i18n from '../../../utils/i18n'
import { localeNumberString, parseUDTAmount } from '../../../utils/number'
import { isMobile } from '../../../utils/screen'
import { adaptPCEllipsis, adaptMobileEllipsis } from '../../../utils/string'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'
import {
  TransactionCellContentPanel,
  TransactionCellDetailPanel,
  TransactionCellHashPanel,
  TransactionCellPanel,
  TransactionCellDetailModal,
  TransactionCellCardPanel,
  TransactionCellAddressPanel,
  TransactionCellInfoPanel,
  TransactionCellCardContent,
} from './styled'
import TransactionCellArrow from '../../../components/Transaction/TransactionCellArrow'
import DecimalCapacity from '../../../components/DecimalCapacity'
import CopyTooltipText from '../../../components/Text/CopyTooltipText'
import NervosDAODepositIcon from '../../../assets/nervos_dao_cell.png'
import NervosDAOWithdrawingIcon from '../../../assets/nervos_dao_withdrawing.png'
import UDTTokenIcon from '../../../assets/udt_token.png'
import TransactionCellScript from '../TransactionCellScript'
import SimpleModal from '../../../components/Modal'
import SimpleButton from '../../../components/SimpleButton'
import TransactionReward from '../TransactionReward'
import Cellbase from '../../../components/Transaction/Cellbase'

const AddressText = ({ address }: { address: string }) => {
  const addressText = isMobile() ? adaptMobileEllipsis(address, 5) : adaptPCEllipsis(address, 4, 80)
  return addressText.includes('...') ? (
    <Tooltip placement="top" title={<CopyTooltipText content={address} />}>
      <Link to={`/address/${address}`} className="monospace">
        {addressText}
      </Link>
    </Tooltip>
  ) : (
    <Link to={`/address/${address}`} className="monospace">
      {addressText}
    </Link>
  )
}

const TransactionCellIndexAddress = ({ cell, cellType, index }: { cell: State.Cell; cellType: CellType; index: number }) => {
  return (
    <TransactionCellAddressPanel>
      <div className="transaction__cell_index">{cellType && cellType === CellType.Output ? <div>{`#${index}`}</div> : ' '}</div>
      <TransactionCellHashPanel highLight={cell.addressHash !== null}>
        {!cell.fromCellbase && cellType === CellType.Input && (
          <span>
            <TransactionCellArrow cell={cell} cellType={cellType} />
          </span>
        )}
        {cell.addressHash ? (
          <AddressText address={cell.addressHash} />
        ) : (
          <span className="transaction__cell_address_no_link">
            {cell.fromCellbase ? 'Cellbase' : i18n.t('address.unable_decode_address')}
          </span>
        )}
        {cellType === CellType.Output && <TransactionCellArrow cell={cell} cellType={cellType} />}
      </TransactionCellHashPanel>
    </TransactionCellAddressPanel>
  )
}

const TransactionCellDetail = ({ cell }: { cell: State.Cell }) => {
  let detailTitle = i18n.t('transaction.ckb_capacity')
  let detailIcon = undefined
  if (cell.cellType === DaoType.Deposit) {
    detailTitle = i18n.t('transaction.nervos_dao_deposit')
    detailIcon = NervosDAODepositIcon
  } else if (cell.cellType === DaoType.Withdraw) {
    detailTitle = i18n.t('transaction.nervos_dao_withdraw')
    detailIcon = NervosDAOWithdrawingIcon
  } else if (cell.cellType === DaoType.Udt) {
    detailTitle = i18n.t('transaction.udt_cell')
    detailIcon = UDTTokenIcon
  }
  return (
    <TransactionCellDetailPanel isWithdraw={cell.cellType === DaoType.Withdraw}>
      <div className="transaction__cell__detail__panel">
        {cell.udtInfo && cell.udtInfo.typeHash && (
          <Tooltip placement="top" title={`Capacity: ${shannonToCkbDecimal(cell.capacity, 8)} CKB`}>
            <img src={detailIcon} alt="cell detail icon" />
          </Tooltip>
        )}
        {!cell.udtInfo && detailIcon && <img src={detailIcon} alt="cell detail icon" />}
        <div>{detailTitle}</div>
      </div>
    </TransactionCellDetailPanel>
  )
}

const TransactionCellInfo = ({ cell, children }: { cell: State.Cell; children: string | ReactNode }) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <TransactionCellInfoPanel>
      <SimpleButton className="transaction__cell__info__content" onClick={() => setShowModal(true)} children={children} />
      <div className="transaction__cell__info__separate" />
      <SimpleModal isShow={showModal} setIsShow={setShowModal}>
        <TransactionCellDetailModal>
          <TransactionCellScript cell={cell} onClose={() => setShowModal(false)} />
        </TransactionCellDetailModal>
      </SimpleModal>
    </TransactionCellInfoPanel>
  )
}

const TransactionCellCapacityAmount = ({ cell }: { cell: State.Cell }) => {
  const { udtInfo } = cell
  return udtInfo && udtInfo.typeHash ? (
    <span>
      {udtInfo.published
        ? `${parseUDTAmount(udtInfo.amount, udtInfo.decimal)} ${udtInfo.symbol}`
        : `${i18n.t('udt.unknown_token')} #${udtInfo.typeHash.substring(udtInfo.typeHash.length - 4)}`}
    </span>
  ) : (
    <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} />
  )
}

const TransactionCellMobileItem = ({ title, value = null }: { title: string | ReactNode; value?: ReactNode }) => {
  return (
    <TransactionCellCardContent>
      <div className="transaction__cell__card__title">{title}</div>
      <div className="transaction__cell__card__value">{value}</div>
    </TransactionCellCardContent>
  )
}

export default ({
  cell,
  cellType,
  index,
  txHash,
  showReward,
}: {
  cell: State.Cell
  cellType: CellType
  index: number
  txHash?: string
  showReward?: boolean
}) => {
  if (isMobile()) {
    return (
      <TransactionCellCardPanel>
        <span className="transaction__cell__card__separate" />
        <TransactionCellMobileItem
          title={
            cell.fromCellbase && cellType === CellType.Input ? (
              <Cellbase cell={cell} cellType={cellType} isDetail />
            ) : (
              <TransactionCellIndexAddress cell={cell} cellType={cellType} index={index} />
            )
          }
        />
        {cell.fromCellbase && cellType === CellType.Input ? (
          <TransactionReward showReward={showReward} cell={cell} />
        ) : (
          <>
            <TransactionCellMobileItem
              title={i18n.t('transaction.detail')}
              value={
                <TransactionCellInfo cell={cell}>
                  {!cell.fromCellbase && <TransactionCellDetail cell={cell} />}
                </TransactionCellInfo>
              }
            />
            <TransactionCellMobileItem
              title={i18n.t('transaction.capacity')}
              value={<TransactionCellCapacityAmount cell={cell} />}
            />
          </>
        )}
      </TransactionCellCardPanel>
    )
  }

  return (
    <TransactionCellPanel id={cellType === CellType.Output ? `output_${index}_${txHash}` : ''}>
      <TransactionCellContentPanel isCellbase={cell.fromCellbase}>
        <div className="transaction__cell__address">
          {cell.fromCellbase && cellType === CellType.Input ? (
            <Cellbase cell={cell} cellType={cellType} isDetail />
          ) : (
            <TransactionCellIndexAddress cell={cell} cellType={cellType} index={index} />
          )}
        </div>

        <div className="transaction__cell_detail">
          {cell.fromCellbase && cellType === CellType.Input ? (
            <TransactionReward showReward={showReward} cell={cell} />
          ) : (
            <TransactionCellDetail cell={cell} />
          )}
        </div>

        <div className="transaction__cell_capacity">
          <TransactionCellCapacityAmount cell={cell} />
        </div>

        <div className="transaction__detail__cell_info">
          <TransactionCellInfo cell={cell} children={'Cell Info'} />
        </div>
      </TransactionCellContentPanel>
    </TransactionCellPanel>
  )
}
