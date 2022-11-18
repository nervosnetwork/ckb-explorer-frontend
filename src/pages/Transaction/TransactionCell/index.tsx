import { useState, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { CellType } from '../../../constants/common'
import i18n from '../../../utils/i18n'
import { localeNumberString, parseUDTAmount } from '../../../utils/number'
import { parseSimpleDate } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { adaptPCEllipsis, adaptMobileEllipsis, sliceNftName } from '../../../utils/string'
import { shannonToCkb, shannonToCkbDecimal, parseSince } from '../../../utils/util'
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
  TransactionCellNftInfo,
} from './styled'
import TransactionCellArrow from '../../../components/Transaction/TransactionCellArrow'
import DecimalCapacity from '../../../components/DecimalCapacity'
import CopyTooltipText from '../../../components/Text/CopyTooltipText'
import NervosDAODepositIcon from '../../../assets/nervos_dao_cell.png'
import NervosDAOWithdrawingIcon from '../../../assets/nervos_dao_withdrawing.png'
import UDTTokenIcon from '../../../assets/udt_token.png'
import NFTIssuerIcon from '../../../assets/m_nft_issuer.svg'
import NFTClassIcon from '../../../assets/m_nft_class.svg'
import NFTTokenIcon from '../../../assets/m_nft.svg'
import CoTACellIcon from '../../../assets/cota_cell.svg'
import CoTARegCellIcon from '../../../assets/cota_reg_cell.svg'
import { ReactComponent as LockTimeIcon } from '../../../assets/clock.svg'
import TransactionCellScript from '../TransactionCellScript'
import SimpleModal from '../../../components/Modal'
import SimpleButton from '../../../components/SimpleButton'
import TransactionReward from '../TransactionReward'
import Cellbase from '../../../components/Transaction/Cellbase'
import { useDeprecatedAddr, useNewAddr } from '../../../utils/hook'
import styles from './styles.module.scss'

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

const TransactionCellIndexAddress = ({
  cell,
  cellType,
  index,
  isAddrNew,
}: {
  cell: State.Cell
  cellType: CellType
  index: number
  isAddrNew: boolean
}) => {
  const deprecatedAddr = useDeprecatedAddr(cell.addressHash)!
  const newAddr = useNewAddr(cell.addressHash)
  let since
  try {
    if (cell.since) {
      since = parseSince(cell.since.raw)
      if (since && since.type === 'timestamp') {
        if (since.base === 'relative') {
          since.value = `${+since.value / 3600} Hrs`
        } else {
          since.value = parseSimpleDate(+since.value * 1000)
        }
      }
    }
  } catch {
    // ignore
  }
  return (
    <TransactionCellAddressPanel>
      <div className="transaction__cell_index">
        <div>{`#${index}`}</div>
      </div>
      <TransactionCellHashPanel highLight={cell.addressHash !== null}>
        {!cell.fromCellbase && cellType === CellType.Input && (
          <span>
            <TransactionCellArrow cell={cell} cellType={cellType} />
          </span>
        )}
        {cell.addressHash ? (
          <AddressText address={!isAddrNew ? deprecatedAddr : newAddr} />
        ) : (
          <span className="transaction__cell_address_no_link">
            {cell.fromCellbase ? 'Cellbase' : i18n.t('address.unable_decode_address')}
          </span>
        )}
        {cellType === CellType.Output && <TransactionCellArrow cell={cell} cellType={cellType} />}
        {since ? (
          <Tooltip
            placement="top"
            title={i18n.t(`transaction.since.${since.base}.${since.type}`, {
              since: since.value,
            })}
          >
            <LockTimeIcon className={styles.locktime} />
          </Tooltip>
        ) : null}
      </TransactionCellHashPanel>
    </TransactionCellAddressPanel>
  )
}

const isUdt = (cell: State.Cell) => cell.udtInfo && cell.udtInfo.typeHash

const parseNftInfo = (cell: State.Cell) => {
  if (cell.cellType === 'nrc_721_token') {
    const nftInfo = cell.nrc721TokenInfo
    return <TransactionCellNftInfo>{`${nftInfo.symbol} #${nftInfo.amount}`}</TransactionCellNftInfo>
  }

  if (cell.cellType === 'm_nft_issuer') {
    const nftInfo = cell.mNftInfo as State.NftIssuer
    if (nftInfo.issuerName) {
      return sliceNftName(nftInfo.issuerName)
    }
    return i18n.t('transaction.unknown_nft')
  }

  if (cell.cellType === 'm_nft_class') {
    const nftInfo = cell.mNftInfo as State.NftClass
    const className = nftInfo.className ? sliceNftName(nftInfo.className) : i18n.t('transaction.unknown_nft')
    const limit = nftInfo.total === '0' ? i18n.t('transaction.nft_unlimited') : i18n.t('transaction.nft_limited')
    const total = nftInfo.total === '0' ? '' : nftInfo.total
    return <TransactionCellNftInfo>{`${className}\n${limit} ${total}`}</TransactionCellNftInfo>
  }
  const nftInfo = cell.mNftInfo as State.NftToken
  const className = nftInfo.className ? sliceNftName(nftInfo.className) : i18n.t('transaction.unknown_nft')
  const total = nftInfo.total === '0' ? '' : ` / ${nftInfo.total}`
  return <TransactionCellNftInfo>{`${className}\n#${parseInt(nftInfo.tokenId, 16)}${total}`}</TransactionCellNftInfo>
}

const TransactionCellDetail = ({ cell }: { cell: State.Cell }) => {
  let detailTitle = i18n.t('transaction.ckb_capacity')
  let detailIcon
  let tooltip: string | ReactNode = ''
  switch (cell.cellType) {
    case 'nervos_dao_deposit':
      detailTitle = i18n.t('transaction.nervos_dao_deposit')
      detailIcon = NervosDAODepositIcon
      break
    case 'nervos_dao_withdrawing':
      detailTitle = i18n.t('transaction.nervos_dao_withdraw')
      detailIcon = NervosDAOWithdrawingIcon
      break
    case 'udt':
      detailTitle = i18n.t('transaction.udt_cell')
      detailIcon = UDTTokenIcon
      if (isUdt(cell)) {
        tooltip = `Capacity: ${shannonToCkbDecimal(cell.capacity, 8)} CKB`
      }
      break
    case 'm_nft_issuer':
      detailTitle = i18n.t('transaction.m_nft_issuer')
      detailIcon = NFTIssuerIcon
      tooltip = parseNftInfo(cell)
      break
    case 'm_nft_class':
      detailTitle = i18n.t('transaction.m_nft_class')
      detailIcon = NFTClassIcon
      tooltip = parseNftInfo(cell)
      break
    case 'm_nft_token':
      detailTitle = i18n.t('transaction.m_nft_token')
      detailIcon = NFTTokenIcon
      tooltip = parseNftInfo(cell)
      break
    case 'nrc_721_token':
      detailTitle = i18n.t('transaction.nrc_721_token')
      detailIcon = NFTTokenIcon
      tooltip = parseNftInfo(cell)
      break
    case 'cota_registry': {
      detailTitle = i18n.t('transaction.cota_registry')
      detailIcon = CoTARegCellIcon
      tooltip = detailTitle
      break
    }
    case 'cota_regular': {
      detailTitle = i18n.t('transaction.cota')
      detailIcon = CoTACellIcon
      tooltip = detailTitle
      break
    }
    default:
      break
  }
  return (
    <TransactionCellDetailPanel isWithdraw={cell.cellType === 'nervos_dao_withdrawing'}>
      <div className="transaction__cell__detail__panel">
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
  txStatus,
}: {
  cell: State.Cell
  children: string | ReactNode
  txStatus: string
}) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <TransactionCellInfoPanel>
      <SimpleButton
        className="transaction__cell__info__content"
        onClick={() => {
          setShowModal(true)
        }}
      >
        <div>{children}</div>
        <div className="transaction__cell__info__separate" />
      </SimpleButton>
      <SimpleModal isShow={showModal} setIsShow={setShowModal}>
        <TransactionCellDetailModal>
          <TransactionCellScript cell={cell} onClose={() => setShowModal(false)} txStatus={txStatus} />
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
        ? `${parseUDTAmount(udtInfo.amount, udtInfo.decimal)} ${udtInfo.uan || udtInfo.symbol}`
        : `${i18n.t('udt.unknown_token')} #${udtInfo.typeHash.substring(udtInfo.typeHash.length - 4)}`}
    </span>
  ) : (
    <DecimalCapacity value={localeNumberString(shannonToCkb(cell.capacity))} />
  )
}

const TransactionCellMobileItem = ({ title, value = null }: { title: string | ReactNode; value?: ReactNode }) => (
  <TransactionCellCardContent>
    <div className="transaction__cell__card__title">{title}</div>
    <div className="transaction__cell__card__value">{value}</div>
  </TransactionCellCardContent>
)

export default ({
  cell,
  cellType,
  index,
  txHash,
  showReward,
  txStatus,
  isAddrNew,
}: {
  cell: State.Cell
  cellType: CellType
  index: number
  txHash?: string
  showReward?: boolean
  txStatus: string
  isAddrNew: boolean
}) => {
  if (isMobile()) {
    return (
      <TransactionCellCardPanel>
        <div className="transaction__cell__card__separate" />
        <TransactionCellMobileItem
          title={
            cell.fromCellbase && cellType === CellType.Input ? (
              <Cellbase cell={cell} cellType={cellType} isDetail />
            ) : (
              <TransactionCellIndexAddress cell={cell} cellType={cellType} index={index} isAddrNew={isAddrNew} />
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
                <TransactionCellInfo cell={cell} txStatus={txStatus}>
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
            <TransactionCellIndexAddress cell={cell} cellType={cellType} index={index} isAddrNew={isAddrNew} />
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
          <TransactionCellInfo cell={cell} txStatus={txStatus}>
            Cell Info
          </TransactionCellInfo>
        </div>
      </TransactionCellContentPanel>
    </TransactionCellPanel>
  )
}
