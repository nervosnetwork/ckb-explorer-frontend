import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { Select } from 'antd'
import OverviewCard, { OverviewItemData } from '../../../components/Card/OverviewCard'
import { CellState, CellType } from '../../../utils/const'
import i18n from '../../../utils/i18n'
import { localeNumberString } from '../../../utils/number'
import { isMobile, isScreen750to1440 } from '../../../utils/screen'
import { adaptPCEllipsis, adaptMobileEllipsis } from '../../../utils/string'
import { shannonToCkb } from '../../../utils/util'
import TransactionCellDetail from '../TransactionCellScript'
import {
  TransactionCellContentPanel,
  TransactionCellDetailPanel,
  TransactionCellHashPanel,
  TransactionCellPanel,
} from './styled'
import TransactionCellArrow from '../TransactionCellArrow'
import DecimalCapacity from '../../../components/DecimalCapacity'
import CopyTooltipText from '../../../components/Text/CopyTooltipText'
import NervosDAODepositIcon from '../../../assets/nervos_dao_cell.png'
import NervosDAOWithdrawingIcon from '../../../assets/nervos_dao_withdrawing.png'
import CKBTransferIcon from '../../../assets/ckb_transfer.png'
import SelectDropdownIcon from '../../../assets/select_dropdown.png'
import SelectDropdownUpIcon from '../../../assets/select_dropdown_up.png'

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

const { Option } = Select
const DropdownIcon = ({ isOpen }: { isOpen: boolean }) => {
  return <img className="dropdown__icon" src={isOpen ? SelectDropdownUpIcon : SelectDropdownIcon} alt="dropdown icon" />
}
const selectWidth = () => {
  if (isMobile()) {
    return 100
  } else if (isScreen750to1440()) {
    return 130
  }
  return 150
}

const detailTitleIcons = (cellType: string) => {
  let detailTitle = i18n.t('transaction.ckb_transfer')
  let detailIcon = CKBTransferIcon
  if (cellType === 'nervos_dao_deposit') {
    detailTitle = i18n.t('transaction.nervos_dao_deposit')
    detailIcon = NervosDAODepositIcon
  } else if (cellType === 'nervos_dao_withdrawing') {
    detailTitle = i18n.t('transaction.nervos_dao_withdraw')
    detailIcon = NervosDAOWithdrawingIcon
  }
  return {
    detailTitle,
    detailIcon,
  }
}

const TransactionCellDetailContainer = ({
  cellType,
  onChange,
}: {
  cellType: string
  onChange: (type: CellState) => void
}) => {
  const [state, setState] = useState(CellState.NONE as CellState)
  const [isOpen, setIsOpen] = useState(false)
  const changeType = (newState: CellState) => {
    setState(state !== newState ? newState : CellState.NONE)
    onChange(state !== newState ? newState : CellState.NONE)
  }
  const { detailTitle, detailIcon } = detailTitleIcons(cellType)

  return (
    <TransactionCellDetailPanel isWithdraw={cellType === 'nervos_dao_withdrawing'}>
      <img src={detailIcon} alt="cell detail icon" />
      <div>{detailTitle}</div>
      <Select
        defaultValue={CellState.NONE}
        suffixIcon={<DropdownIcon isOpen={isOpen} />}
        onDropdownVisibleChange={() => setIsOpen(!isOpen)}
        style={{ width: selectWidth() }}
        onChange={changeType}
      >
        <Option value={CellState.NONE} className="ant-select-dropdown-menu-custom">
          Cell Info
        </Option>
        <Option value={CellState.LOCK} className="ant-select-dropdown-menu-custom">
          Lock Script
        </Option>
        <Option value={CellState.TYPE} className="ant-select-dropdown-menu-custom">
          Type Script
        </Option>
        <Option value={CellState.DATA} className="ant-select-dropdown-menu-custom">
          Data
        </Option>
      </Select>
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
  const [state, setState] = useState(CellState.NONE as CellState)

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
        {!cell.fromCellbase && (
          <TransactionCellDetailContainer cellType={cell.cellType} onChange={newState => setState(newState)} />
        )}
        {state !== CellState.NONE && <TransactionCellDetail cell={cell} state={state} setState={setState} />}
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
          {cell.capacity && (
            <TransactionCellDetailContainer cellType={cell.cellType} onChange={newState => setState(newState)} />
          )}
        </div>
      </TransactionCellContentPanel>
      {state !== CellState.NONE && <TransactionCellDetail cell={cell} state={state} setState={setState} />}
    </TransactionCellPanel>
  )
}
