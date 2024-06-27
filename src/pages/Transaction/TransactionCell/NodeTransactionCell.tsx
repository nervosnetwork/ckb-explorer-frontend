import { useState, ReactNode } from 'react'
import { Tooltip } from 'antd'
import type { Cell } from '@ckb-lumos/base'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Link } from '../../../components/Link'
import { IOType } from '../../../constants/common'
import { parseUDTAmount } from '../../../utils/number'
import { shannonToCkb, shannonToCkbDecimal } from '../../../utils/util'
import {
  TransactionCellContentPanel,
  TransactionCellDetailPanel,
  TransactionCellHashPanel,
  TransactionCellPanel,
  TransactionCellDetailModal,
  TransactionCellCardPanel,
  TransactionCellCardSeparate,
  TransactionCellAddressPanel,
  TransactionCellInfoPanel,
  TransactionCellMobileItem,
} from './styled'
import { LeftArrow } from '../../../components/Transaction/TransactionCellArrow'
import Capacity from '../../../components/Capacity'
import NervosDAODepositIcon from '../../../assets/nervos_dao_cell.png'
import NervosDAOWithdrawingIcon from '../../../assets/nervos_dao_withdrawing.png'
import UDTTokenIcon from '../../../assets/udt_token.png'
import NFTIssuerIcon from './m_nft_issuer.svg'
import NFTClassIcon from './m_nft_class.svg'
import NFTTokenIcon from './m_nft.svg'
import CoTACellIcon from './cota_cell.svg'
import CoTARegCellIcon from './cota_reg_cell.svg'
import SporeCellIcon from './spore.svg'
import { CellInfoModal } from '../TransactionCellScript'
import SimpleModal from '../../../components/Modal'
import SimpleButton from '../../../components/SimpleButton'
import { useIsMobile } from '../../../hooks'
import { explorerService } from '../../../services/ExplorerService'
import { UDT_CELL_TYPES, getCellType, calculateScriptHash, getUDTAmountByData } from '../../../utils/cell'
import { encodeNewAddress, encodeDeprecatedAddress } from '../../../utils/address'
import { Addr } from './index'

const TransactionCellIndexAddress = ({
  cell,
  ioType,
  index,
  isAddrNew,
}: {
  cell: Cell
  ioType: IOType
  index: number
  isAddrNew: boolean
}) => {
  const deprecatedAddr = encodeDeprecatedAddress(cell.cellOutput.lock)
  const newAddr = encodeNewAddress(cell.cellOutput.lock)
  const address = isAddrNew ? newAddr : deprecatedAddr

  return (
    <TransactionCellAddressPanel>
      <div className="transactionCellIndex">
        <div>{`#${index}`}</div>
      </div>
      <TransactionCellHashPanel highLight>
        {ioType === IOType.Input && cell.outPoint && (
          <Link to={`/transaction/${cell.outPoint.txHash}`}>
            <LeftArrow />
          </Link>
        )}
        <Addr address={address ?? ''} isCellBase={false} />
      </TransactionCellHashPanel>
    </TransactionCellAddressPanel>
  )
}

export const TransactionCellDetail = ({ cell }: { cell: Cell }) => {
  const { t } = useTranslation()
  const cellType = getCellType(cell)
  let detailTitle = t('transaction.ckb_capacity')
  let detailIcon
  let tooltip: string | ReactNode = ''
  switch (cellType) {
    case 'nervos_dao_deposit':
      detailTitle = t('transaction.nervos_dao_deposit')
      detailIcon = NervosDAODepositIcon
      break
    case 'nervos_dao_withdrawing':
      detailTitle = t('transaction.nervos_dao_withdraw')
      detailIcon = NervosDAOWithdrawingIcon
      break
    case 'udt':
      detailTitle = t('transaction.udt_cell')
      detailIcon = UDTTokenIcon
      tooltip = `Capacity: ${shannonToCkbDecimal(cell.cellOutput.capacity, 8)} CKB`
      break
    case 'm_nft_issuer':
      detailTitle = t('transaction.m_nft_issuer')
      detailIcon = NFTIssuerIcon
      break
    case 'm_nft_class':
      detailTitle = t('transaction.m_nft_class')
      detailIcon = NFTClassIcon
      break
    case 'm_nft_token':
      detailTitle = t('transaction.m_nft_token')
      detailIcon = NFTTokenIcon
      break
    case 'nrc_721_token':
      detailTitle = t('transaction.nrc_721_token')
      detailIcon = NFTTokenIcon
      break
    case 'cota_registry': {
      detailTitle = t('transaction.cota_registry')
      detailIcon = CoTARegCellIcon
      tooltip = detailTitle
      break
    }
    case 'cota_regular': {
      detailTitle = t('transaction.cota')
      detailIcon = CoTACellIcon
      tooltip = detailTitle
      break
    }
    case 'spore_cluster': {
      detailTitle = t('nft.dob')
      detailIcon = SporeCellIcon
      tooltip = t('transaction.spore_cluster')
      break
    }
    case 'did_cell':
    case 'spore_cell': {
      detailTitle = t('nft.dob')
      detailIcon = SporeCellIcon
      tooltip = t('transaction.spore')
      break
    }
    case 'omiga_inscription': {
      detailTitle = 'xUDT'
      detailIcon = UDTTokenIcon
      tooltip = detailTitle
      break
    }
    case 'xudt': {
      detailTitle = 'xUDT'
      detailIcon = UDTTokenIcon
      tooltip = detailTitle
      break
    }
    default:
      break
  }

  return (
    <TransactionCellDetailPanel isWithdraw={cellType === 'nervos_dao_withdrawing'}>
      <div className="transactionCellDetailPanel">
        {tooltip ? (
          <Tooltip placement="top" title={tooltip}>
            <img src={detailIcon} alt="cell detail" />
          </Tooltip>
        ) : (
          detailIcon && <img src={detailIcon} alt="cell detail" />
        )}
        <div>{detailTitle}</div>
      </div>
    </TransactionCellDetailPanel>
  )
}

const TransactionCellInfo = ({
  cell,
  children,
  isDefaultStyle = true,
}: {
  cell: Cell
  children: string | ReactNode
  isDefaultStyle?: boolean
}) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <TransactionCellInfoPanel>
      <SimpleButton
        className={isDefaultStyle ? 'transactionCellInfoContent' : ''}
        onClick={() => {
          setShowModal(true)
        }}
      >
        <div>{children}</div>
        <div className="transactionCellInfoSeparate" />
      </SimpleButton>

      <SimpleModal isShow={showModal} setIsShow={setShowModal}>
        <TransactionCellDetailModal>
          <CellInfoModal cell={cell} onClose={() => setShowModal(false)} />
        </TransactionCellDetailModal>
      </SimpleModal>
    </TransactionCellInfoPanel>
  )
}

const TransactionCellCapacityAmount = ({ cell }: { cell: Cell }) => {
  const { t } = useTranslation()
  const cellType = getCellType(cell)
  const isUDTCell = UDT_CELL_TYPES.findIndex(type => type === cellType) !== -1
  const udtTypeHash = isUDTCell ? calculateScriptHash(cell.cellOutput.type!) : undefined
  const udtInfo = useQuery(
    ['udt', udtTypeHash],
    () => {
      if (!udtTypeHash) return undefined
      return explorerService.api.fetchSimpleUDT(udtTypeHash)
    },
    {
      enabled: isUDTCell,
      staleTime: Infinity,
    },
  )

  if (isUDTCell && udtTypeHash && udtInfo.data) {
    const amount = getUDTAmountByData(cell.data)
    if (cellType === 'udt' && udtInfo.data.published) {
      return <span>{`${parseUDTAmount(amount, udtInfo.data.decimal)} ${udtInfo.data.symbol}`}</span>
    }

    if (cellType === 'xudt' && udtInfo.data.decimal && udtInfo.data.symbol) {
      return <span>{`${parseUDTAmount(amount, udtInfo.data.decimal)} ${udtInfo.data.symbol}`}</span>
    }

    return <span>{`${t('udt.unknown_token')} #${udtTypeHash.substring(udtTypeHash.length - 4)}`}</span>
  }

  return <Capacity capacity={shannonToCkb(cell.cellOutput.capacity)} layout="responsive" />
}

export default ({
  cell,
  index,
  ioType,
  isAddrNew,
}: {
  cell: Cell
  index: number
  ioType: IOType
  isAddrNew: boolean
}) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()

  if (isMobile) {
    return (
      <TransactionCellCardPanel>
        <TransactionCellCardSeparate />
        <TransactionCellMobileItem
          title={<TransactionCellIndexAddress cell={cell} ioType={ioType} index={index} isAddrNew={isAddrNew} />}
        />
        <TransactionCellMobileItem
          title={t('transaction.detail')}
          value={
            <TransactionCellInfo cell={cell}>
              <TransactionCellDetail cell={cell} />
            </TransactionCellInfo>
          }
        />
        <TransactionCellMobileItem
          title={t('transaction.capacity')}
          value={<TransactionCellCapacityAmount cell={cell} />}
        />
      </TransactionCellCardPanel>
    )
  }

  return (
    <TransactionCellPanel>
      <TransactionCellContentPanel isCellbase={false}>
        <div className="transactionCellAddress">
          <TransactionCellIndexAddress cell={cell} ioType={ioType} index={index} isAddrNew={isAddrNew} />
        </div>

        <div className="transactionCellDetail">
          <TransactionCellDetail cell={cell} />
        </div>

        <div className="transactionCellCapacity">
          <TransactionCellCapacityAmount cell={cell} />
        </div>

        <div className="transactionDetailCellInfo">
          <TransactionCellInfo cell={cell}>Cell Info</TransactionCellInfo>
        </div>
      </TransactionCellContentPanel>
    </TransactionCellPanel>
  )
}
