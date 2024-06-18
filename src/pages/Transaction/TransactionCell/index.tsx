import { useState, ReactNode, FC } from 'react'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from '../../../components/Link'
import { CellType } from '../../../constants/common'
import { parseUDTAmount } from '../../../utils/number'
import { parseSimpleDate } from '../../../utils/date'
import { sliceNftName } from '../../../utils/string'
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
import { ReactComponent as LockTimeIcon } from './clock.svg'
import { ReactComponent as BitAccountIcon } from '../../../assets/bit_account.svg'
import TransactionCellScript from '../TransactionCellScript'
import SimpleModal from '../../../components/Modal'
import SimpleButton from '../../../components/SimpleButton'
import TransactionReward from '../TransactionReward'
import Cellbase from '../../../components/Transaction/Cellbase'
import CopyTooltipText from '../../../components/Text/CopyTooltipText'
import { useDeprecatedAddr, useIsMobile, useNewAddr } from '../../../hooks'
import { useDASAccount } from '../../../hooks/useDASAccount'
import styles from './styles.module.scss'
import AddressText from '../../../components/AddressText'
import { Cell } from '../../../models/Cell'
import { CellBasicInfo } from '../../../utils/transformer'

export const Addr: FC<{ address: string; isCellBase: boolean }> = ({ address, isCellBase }) => {
  const alias = useDASAccount(address)
  const { t } = useTranslation()

  if (alias && address) {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title=".bit Name">
          <BitAccountIcon className={styles.icon} />
        </Tooltip>

        <Tooltip placement="top" title={<CopyTooltipText content={address} />}>
          <Link to={`/address/${address}`} className="monospace">
            {alias}
          </Link>
        </Tooltip>
      </div>
    )
  }

  if (address) {
    return (
      <AddressText
        linkProps={{
          className: 'transactionCellAddressLink',
          to: `/address/${address}`,
        }}
      >
        {address}
      </AddressText>
    )
  }
  return (
    <span className="transactionCellAddressNoLink">{isCellBase ? 'Cellbase' : t('address.unable_decode_address')}</span>
  )
}

const TransactionCellIndexAddress = ({
  cell,
  cellType,
  index,
  isAddrNew,
}: {
  cell: Cell
  cellType: CellType
  index: number
  isAddrNew: boolean
}) => {
  const { t } = useTranslation()
  const deprecatedAddr = useDeprecatedAddr(cell.addressHash)!
  const newAddr = useNewAddr(cell.addressHash)
  const address = !isAddrNew ? deprecatedAddr : newAddr

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
      <div className="transactionCellIndex">
        <div>{`#${index}`}</div>
      </div>
      <TransactionCellHashPanel highLight={cell.addressHash !== null}>
        {!cell.fromCellbase && cellType === CellType.Input && (
          <span>
            <TransactionCellArrow cell={cell} cellType={cellType} />
          </span>
        )}
        <Addr address={cell.rgbInfo?.address ?? address} isCellBase={cell.fromCellbase} />
        {cellType === CellType.Output && <TransactionCellArrow cell={cell} cellType={cellType} />}
        {since ? (
          <Tooltip
            placement="top"
            title={t(`transaction.since.${since.base}.${since.type}`, {
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

const useParseNftInfo = (cell: Cell) => {
  const { t } = useTranslation()
  if (cell.cellType === 'nrc_721_token') {
    const nftInfo = cell.extraInfo
    return <TransactionCellNftInfo>{`${nftInfo.symbol} #${nftInfo.amount}`}</TransactionCellNftInfo>
  }

  if (cell.cellType === 'm_nft_issuer') {
    const nftInfo = cell.extraInfo
    if (nftInfo.issuerName) {
      return sliceNftName(nftInfo.issuerName)
    }
    return t('transaction.unknown_nft')
  }

  if (cell.cellType === 'm_nft_class') {
    const nftInfo = cell.extraInfo
    const className = nftInfo.className ? sliceNftName(nftInfo.className) : t('transaction.unknown_nft')
    const limit = nftInfo.total === '0' ? t('transaction.nft_unlimited') : t('transaction.nft_limited')
    const total = nftInfo.total === '0' ? '' : nftInfo.total
    return <TransactionCellNftInfo>{`${className}\n${limit} ${total}`}</TransactionCellNftInfo>
  }

  if (cell.cellType === 'm_nft_token') {
    const nftInfo = cell.extraInfo
    const className = nftInfo.className ? sliceNftName(nftInfo.className) : t('transaction.unknown_nft')
    const total = nftInfo.total === '0' ? '' : ` / ${nftInfo.total}`
    return <TransactionCellNftInfo>{`${className}\n#${parseInt(nftInfo.tokenId, 16)}${total}`}</TransactionCellNftInfo>
  }
}

export const TransactionCellDetail = ({ cell }: { cell: Cell }) => {
  const { t } = useTranslation()
  let detailTitle = t('transaction.ckb_capacity')
  let detailIcon
  let tooltip: string | ReactNode = ''
  const nftInfo = useParseNftInfo(cell)
  switch (cell.cellType) {
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
      tooltip = `Capacity: ${shannonToCkbDecimal(cell.capacity, 8)} CKB`
      break
    case 'm_nft_issuer':
      detailTitle = t('transaction.m_nft_issuer')
      detailIcon = NFTIssuerIcon
      tooltip = nftInfo
      break
    case 'm_nft_class':
      detailTitle = t('transaction.m_nft_class')
      detailIcon = NFTClassIcon
      tooltip = nftInfo
      break
    case 'm_nft_token':
      detailTitle = t('transaction.m_nft_token')
      detailIcon = NFTTokenIcon
      tooltip = nftInfo
      break
    case 'nrc_721_token':
      detailTitle = t('transaction.nrc_721_token')
      detailIcon = NFTTokenIcon
      tooltip = nftInfo
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
    case 'xudt_compatible': {
      detailTitle = 'xUDT-compatible'
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
    <TransactionCellDetailPanel isWithdraw={cell.cellType === 'nervos_dao_withdrawing'}>
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

export const TransactionCellInfo = ({
  cell,
  children,
  isDefaultStyle = true,
}: {
  cell: CellBasicInfo
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
          <TransactionCellScript cell={cell} onClose={() => setShowModal(false)} />
        </TransactionCellDetailModal>
      </SimpleModal>
    </TransactionCellInfoPanel>
  )
}

const TransactionCellCapacityAmount = ({ cell }: { cell: Cell }) => {
  const { t } = useTranslation()
  if (cell.cellType === 'udt') {
    const udtInfo = cell.extraInfo
    if (udtInfo.published) {
      return <span>{`${parseUDTAmount(udtInfo.amount, udtInfo.decimal)} ${udtInfo.symbol}`}</span>
    }
    return <span>{`${t('udt.unknown_token')} #${udtInfo.typeHash.substring(udtInfo.typeHash.length - 4)}`}</span>
  }

  if (cell.cellType === 'xudt' || cell.cellType === 'xudt_compatible') {
    const info = cell.extraInfo
    if (info?.decimal && info?.amount && info?.symbol) {
      return <span>{`${parseUDTAmount(info.amount, info.decimal)} ${info.symbol}`}</span>
    }
  }

  if (cell.cellType === 'omiga_inscription') {
    const info = cell.extraInfo
    if (info?.decimal && info?.amount && info?.symbol) {
      return <span>{`${parseUDTAmount(info.amount, info.decimal)} ${info.symbol}`}</span>
    }
  }
  return <Capacity capacity={shannonToCkb(cell.capacity)} layout="responsive" />
}

const TransactionCellMobileItem = ({ title, value = null }: { title: string | ReactNode; value?: ReactNode }) => (
  <TransactionCellCardContent>
    <div className="transactionCellCardTitle">{title}</div>
    <div className="transactionCellCardValue">{value}</div>
  </TransactionCellCardContent>
)

export default ({
  cell,
  cellType,
  index,
  txHash,
  showReward,
  isAddrNew,
}: {
  cell: Cell
  cellType: CellType
  index: number
  txHash?: string
  showReward?: boolean
  isAddrNew: boolean
}) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()

  if (isMobile) {
    return (
      <TransactionCellCardPanel>
        <div className="transactionCellCardSeparate" />
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
              title={t('transaction.detail')}
              value={
                <TransactionCellInfo cell={cell}>
                  {!cell.fromCellbase && <TransactionCellDetail cell={cell} />}
                </TransactionCellInfo>
              }
            />
            <TransactionCellMobileItem
              title={t('transaction.capacity')}
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
        <div className="transactionCellAddress">
          {cell.fromCellbase && cellType === CellType.Input ? (
            <Cellbase cell={cell} cellType={cellType} isDetail />
          ) : (
            <TransactionCellIndexAddress cell={cell} cellType={cellType} index={index} isAddrNew={isAddrNew} />
          )}
        </div>

        <div className="transactionCellDetail">
          {cell.fromCellbase && cellType === CellType.Input ? (
            <TransactionReward showReward={showReward} cell={cell} />
          ) : (
            <TransactionCellDetail cell={cell} />
          )}
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
