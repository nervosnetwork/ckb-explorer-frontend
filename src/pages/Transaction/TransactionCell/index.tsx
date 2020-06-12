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
  CellbasePanel,
  TransactionCellAddressPanel,
  TransactionCellInfoPanel,
} from './styled'
import TransactionCellArrow from '../TransactionCellArrow'
import DecimalCapacity from '../../../components/DecimalCapacity'
import CopyTooltipText from '../../../components/Text/CopyTooltipText'
import NervosDAODepositIcon from '../../../assets/nervos_dao_cell.png'
import NervosDAOWithdrawingIcon from '../../../assets/nervos_dao_withdrawing.png'
import UDTTokenIcon from '../../../assets/udt_token.png'
import HelpIcon from '../../../assets/qa_help.png'
import TransactionCellScript from '../TransactionCellScript'
import SimpleModal from '../../../components/Modal'
import SimpleButton from '../../../components/SimpleButton'
import TransactionReward from '../TransactionReward'

const handleAddressHashText = (hash: string) => {
  if (isMobile()) {
    return adaptMobileEllipsis(hash, 5)
  }
  return adaptPCEllipsis(hash, 4, 80)
}

const AddressHash = ({ address }: { address: string }) => {
  const addressHash = handleAddressHashText(address)
  if (addressHash.includes('...')) {
    return (
      <Tooltip placement="top" title={<CopyTooltipText content={address} />}>
        <Link to={`/address/${address}`} className="monospace">
          {addressHash}
        </Link>
      </Tooltip>
    )
  }
  return (
    <Link to={`/address/${address}`} className="monospace">
      {addressHash}
    </Link>
  )
}

const TransactionCellHash = ({ cell, cellType }: { cell: State.Cell; cellType: CellType }) => {
  return (
    <TransactionCellHashPanel highLight={cell.addressHash !== null}>
      {!cell.fromCellbase && cellType === CellType.Input && (
        <span>
          <TransactionCellArrow cell={cell} cellType={cellType} />
        </span>
      )}

      {cell.addressHash ? (
        <AddressHash address={cell.addressHash} />
      ) : (
        <span className="transaction__cell_address_no_link">
          {cell.fromCellbase ? 'Cellbase' : i18n.t('address.unable_decode_address')}
        </span>
      )}
      {cellType === CellType.Output && <TransactionCellArrow cell={cell} cellType={cellType} />}
    </TransactionCellHashPanel>
  )
}

const detailTitleIcons = (cell: State.Cell) => {
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
  return {
    detailTitle,
    detailIcon,
  }
}

const udtAmount = (udt: State.UDTInfo) => {
  return udt.published
    ? `${parseUDTAmount(udt.amount, udt.decimal)} ${udt.symbol}`
    : `${i18n.t('udt.unknown_token')} #${udt.typeHash.substring(udt.typeHash.length - 4)}`
}

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

const TransactionCellDetail = ({ cell }: { cell: State.Cell }) => {
  const { detailTitle, detailIcon } = detailTitleIcons(cell)
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
      <SimpleButton
        className="transaction__cell__info__content"
        onClick={() => {
          setShowModal(true)
        }}
        children={children}
      />
      <div className="transaction__cell__info__separate" />
      <SimpleModal isShow={showModal}>
        <TransactionCellDetailModal>
          <TransactionCellScript cell={cell} onClose={() => setShowModal(false)} />
        </TransactionCellDetailModal>
      </SimpleModal>
    </TransactionCellInfoPanel>
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
  const TransactionCellAddress = () => {
    return (
      <TransactionCellAddressPanel>
        <div className="transaction__cell_index">
          {cellType && cellType === CellType.Output ? <div>{`#${index}`}</div> : ' '}
        </div>
        <TransactionCellHash cell={cell} cellType={cellType} />
      </TransactionCellAddressPanel>
    )
  }

  if (isMobile()) {
    return (
      <TransactionCellCardPanel>
        <div className="transaction__cell__card__separate" />
        <div className="transaction__cell__card__content">
          <div className="transaction__cell__card__value">
            {cell.fromCellbase && cellType === CellType.Input ? (
              <Cellbase cell={cell} cellType={cellType} />
            ) : (
              <TransactionCellAddress />
            )}
          </div>
        </div>
        {cell.fromCellbase && cellType === CellType.Input ? (
          <TransactionReward showReward={showReward} cell={cell} />
        ) : (
          <>
            <div className="transaction__cell__card__content">
              <div className="transaction__cell__card__title">{i18n.t('transaction.detail')}</div>
              <div className="transaction__cell__card__value">
                <TransactionCellInfo
                  cell={cell}
                  children={!cell.fromCellbase && <TransactionCellDetail cell={cell} />}
                />
              </div>
            </div>
            <div className="transaction__cell__card__content">
              <div className="transaction__cell__card__title">{i18n.t('transaction.capacity')}</div>
              <div className="transaction__cell__card__value">
                {cell.udtInfo && cell.udtInfo.typeHash ? (
                  udtAmount(cell.udtInfo)
                ) : (
                  <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} />
                )}
              </div>
            </div>
          </>
        )}
      </TransactionCellCardPanel>
    )
  }

  return (
    <TransactionCellPanel id={cellType === CellType.Output ? `output_${index}_${txHash}` : ''}>
      <TransactionCellContentPanel isCellbase={cell.fromCellbase}>
        <div className="transaction__cell_hash">
          {cell.fromCellbase && cellType === CellType.Input ? (
            <Cellbase cell={cell} cellType={cellType} />
          ) : (
            <TransactionCellAddress />
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
          {cell.udtInfo && cell.udtInfo.typeHash ? (
            udtAmount(cell.udtInfo)
          ) : (
            <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} />
          )}
        </div>

        <div className="transaction__detail__cell_info">
          <TransactionCellInfo cell={cell} children={'Cell Info'} />
        </div>
      </TransactionCellContentPanel>
    </TransactionCellPanel>
  )
}
