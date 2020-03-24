import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import OverviewCard, { OverviewItemData } from '../../../components/Card/OverviewCard'
import { CellType, DaoType } from '../../../utils/const'
import i18n from '../../../utils/i18n'
import { localeNumberString } from '../../../utils/number'
import { isMobile } from '../../../utils/screen'
import { adaptPCEllipsis, adaptMobileEllipsis } from '../../../utils/string'
import { shannonToCkb } from '../../../utils/util'
import {
  TransactionCellContentPanel,
  TransactionCellDetailPanel,
  TransactionCellHashPanel,
  TransactionCellPanel,
  TransactionCellDetailModal,
} from './styled'
import TransactionCellArrow from '../TransactionCellArrow'
import DecimalCapacity from '../../../components/DecimalCapacity'
import CopyTooltipText from '../../../components/Text/CopyTooltipText'
import NervosDAODepositIcon from '../../../assets/nervos_dao_cell.png'
import NervosDAOWithdrawingIcon from '../../../assets/nervos_dao_withdrawing.png'
import CKBTransferIcon from '../../../assets/ckb_transfer.png'
import TransactionCellScript from '../TransactionCellScript'
import OutsideClickHandler from 'react-outside-click-handler'

const handleAddressHashText = (hash: string) => {
  if (isMobile()) {
    return adaptMobileEllipsis(hash, 11)
  }
  return adaptPCEllipsis(hash, 5, 80)
}

const AddressHash = ({ address }: { address: string }) => {
  const addressHash = handleAddressHashText(address)
  if (addressHash.includes('...')) {
    return (
      <Tooltip placement="top" title={<CopyTooltipText content={address} />}>
        <Link to={`/address/${address}`}>
          <span className="address">{addressHash}</span>
        </Link>
      </Tooltip>
    )
  }
  return (
    <Link to={`/address/${address}`}>
      <span className="address">{addressHash}</span>
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

const detailTitleIcons = (cellType: 'normal' | 'nervos_dao_deposit' | 'nervos_dao_withdrawing') => {
  let detailTitle = i18n.t('transaction.ckb_transfer')
  let detailIcon = CKBTransferIcon
  if (cellType === DaoType.Deposit) {
    detailTitle = i18n.t('transaction.nervos_dao_deposit')
    detailIcon = NervosDAODepositIcon
  } else if (cellType === DaoType.Withdraw) {
    detailTitle = i18n.t('transaction.nervos_dao_withdraw')
    detailIcon = NervosDAOWithdrawingIcon
  }
  return {
    detailTitle,
    detailIcon,
  }
}

const TransactionCellDetailContainer = ({ cell }: { cell: State.Cell }) => {
  const { detailTitle, detailIcon } = detailTitleIcons(cell.cellType)
  const [showModal, setShowModal] = useState(false)

  return (
    <TransactionCellDetailPanel isWithdraw={cell.cellType === DaoType.Withdraw}>
      <div className="transaction__cell__detail__panel">
        <img src={detailIcon} alt="cell detail icon" />
        <div>{detailTitle}</div>
      </div>
      <div className="transaction__detail__cell_info">
        <div
          className="transaction__cell__info__content"
          role="button"
          tabIndex={-1}
          onKeyDown={() => {}}
          onClick={() => {
            setShowModal(true)
          }}
        >
          Cell Info
        </div>
        <div className="transaction__cell__info__separate" />
        {showModal && (
          <TransactionCellDetailModal>
            <OutsideClickHandler
              onOutsideClick={() => {
                setShowModal(false)
              }}
            >
              <div className="transaction__detail__modal__content">
                <TransactionCellScript cell={cell} onClose={() => setShowModal(false)} />
              </div>
            </OutsideClickHandler>
          </TransactionCellDetailModal>
        )}
      </div>
    </TransactionCellDetailPanel>
  )
}

export default ({
  cell,
  cellType,
  index,
  txHash,
}: {
  cell: State.Cell
  cellType: CellType
  index: number
  txHash?: string
}) => {
  if (isMobile()) {
    const items: OverviewItemData[] = [
      {
        title: cellType === CellType.Input ? i18n.t('transaction.input') : i18n.t('transaction.output'),
        content: <TransactionCellHash cell={cell} cellType={cellType} />,
      },
    ]
    if (cell.capacity) {
      items.push({
        title: i18n.t('transaction.capacity'),
        content: <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} />,
      })
    }
    return (
      <OverviewCard items={items} outputIndex={cellType === CellType.Output ? `${index}_${txHash}` : undefined}>
        {!cell.fromCellbase && <TransactionCellDetailContainer cell={cell} />}
      </OverviewCard>
    )
  }

  return (
    <TransactionCellPanel id={cellType === CellType.Output ? `output_${index}_${txHash}` : ''}>
      <TransactionCellContentPanel>
        <div className="transaction__cell_hash">
          <div className="transaction__cell_index">
            {cellType && cellType === CellType.Output ? <div>{`#${index}`}</div> : ' '}
          </div>
          <TransactionCellHash cell={cell} cellType={cellType} />
        </div>

        <div className="transaction__cell_capacity">
          {cell.capacity && <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} />}
        </div>

        <div className="transaction__cell_detail">
          {cell.capacity && <TransactionCellDetailContainer cell={cell} />}
        </div>
      </TransactionCellContentPanel>
    </TransactionCellPanel>
  )
}
