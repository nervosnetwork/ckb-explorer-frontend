import { useState, ReactNode, FC } from 'react'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from '../../../components/Link'
import { IOType } from '../../../constants/common'
import { parseUDTAmount } from '../../../utils/number'
import { parseSimpleDate } from '../../../utils/date'
import { sliceNftName } from '../../../utils/string'
import { shannonToCkb, shannonToCkbDecimal, parseSince } from '../../../utils/util'
import { UDT_CELL_TYPES } from '../../../utils/cell'
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
import SimpleModal from '../../../components/Modal'
import SimpleButton from '../../../components/SimpleButton'
import TransactionReward from '../TransactionReward'
import Cellbase from '../../../components/Transaction/Cellbase'
import CopyTooltipText from '../../../components/Text/CopyTooltipText'
import { useDeprecatedAddr, useIsMobile, useNewAddr } from '../../../hooks'
import { useDASAccount } from '../../../hooks/useDASAccount'
import styles from './styles.module.scss'
import AddressText from '../../../components/AddressText'
import { Cell, UDTInfo } from '../../../models/Cell'
import CellModal from '../../../components/Cell/CellModal'
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
          className: styles.transactionCellAddressLink,
          to: `/address/${address}`,
        }}
      >
        {address}
      </AddressText>
    )
  }
  return (
    <span className={styles.transactionCellAddressNoLink}>
      {isCellBase ? 'Cellbase' : t('address.unable_decode_address')}
    </span>
  )
}

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
  const { t } = useTranslation()
  const deprecatedAddr = useDeprecatedAddr(cell.addressHash)!
  const newAddr = useNewAddr(cell.addressHash)
  const address = isAddrNew ? newAddr : deprecatedAddr
  const isFiber = (cell.tags ?? []).find(tag => tag === 'fiber') !== undefined
  const isDeployment = (cell.tags ?? []).find(tag => tag === 'deployment') !== undefined

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
    <div className={styles.transactionCellAddressPanel}>
      <div className={styles.transactionCellIndex}>
        <div>{`#${index}`}</div>
      </div>
      <div className={styles.transactionCellHashPanel} data-is-highlight={cell.addressHash !== null}>
        {!cell.fromCellbase && ioType === IOType.Input && (
          <span>
            <TransactionCellArrow cell={cell} ioType={ioType} />
          </span>
        )}
        <Addr address={cell.rgbInfo?.address ?? address} isCellBase={cell.fromCellbase} />
        {ioType === IOType.Output && <TransactionCellArrow cell={cell} ioType={ioType} />}
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
        {isFiber ? (
          <Tooltip placement="top" title={t(`transaction.fiber_cell`)}>
            <span className={styles.fiberTag}>Fiber</span>
          </Tooltip>
        ) : null}
        {isDeployment ? <span className={styles.deploymentTag}>Deployment</span> : null}
      </div>
    </div>
  )
}

const useParseNftInfo = (cell: Cell) => {
  const { t } = useTranslation()
  if (cell.cellType === 'nrc_721_token') {
    const nftInfo = cell.extraInfo
    return <div className={styles.transactionCellNftInfo}>{`${nftInfo.symbol} #${nftInfo.amount}`}</div>
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
    return <div className={styles.transactionCellNftInfo}>{`${className}\n${limit} ${total}`}</div>
  }

  if (cell.cellType === 'm_nft_token') {
    const nftInfo = cell.extraInfo
    const className = nftInfo.className ? sliceNftName(nftInfo.className) : t('transaction.unknown_nft')
    const total = nftInfo.total === '0' ? '' : ` / ${nftInfo.total}`
    return (
      <div className={styles.transactionCellNftInfo}>{`${className}\n#${parseInt(nftInfo.tokenId, 16)}${total}`}</div>
    )
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
    <div className={styles.transactionCellDetailPanel} data-is-withdraw={cell.cellType === 'nervos_dao_withdrawing'}>
      {tooltip ? (
        <Tooltip placement="top" title={tooltip}>
          <img src={detailIcon} alt="cell detail" />
        </Tooltip>
      ) : (
        detailIcon && <img src={detailIcon} alt="cell detail" />
      )}
      <div>{detailTitle}</div>
    </div>
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
    <div className={styles.transactionCellInfoPanel}>
      <SimpleButton
        className={isDefaultStyle ? styles.transactionCellInfoContent : ''}
        onClick={() => {
          setShowModal(true)
        }}
      >
        <div>{children}</div>
        <div className={styles.transactionCellInfoSeparate} />
      </SimpleButton>

      <SimpleModal isShow={showModal} setIsShow={setShowModal}>
        <CellModal cell={cell} onClose={() => setShowModal(false)} />
      </SimpleModal>
    </div>
  )
}

const TransactionCellCapacityAmount = ({ cell }: { cell: Cell }) => {
  const { t } = useTranslation()
  const isUDTCell = UDT_CELL_TYPES.findIndex(type => type === cell.cellType) !== -1
  if (isUDTCell) {
    const udtInfo = cell.extraInfo as UDTInfo
    const { amount } = udtInfo

    if (udtInfo.decimal && udtInfo.symbol) {
      return <span>{`${parseUDTAmount(amount, udtInfo.decimal)} ${udtInfo.symbol}`}</span>
    }

    return (
      <span>{`${t('udt.unknown_token')} #${udtInfo.typeHash?.substring(udtInfo.typeHash.length - 4) ?? '?'}`}</span>
    )
  }

  return <Capacity capacity={shannonToCkb(cell.capacity)} layout="responsive" />
}

const TransactionCellMobileItem = ({ title, value = null }: { title: string | ReactNode; value?: ReactNode }) => (
  <div className={styles.transactionCellCardContent}>
    <div className={styles.transactionCellCardTitle}>{title}</div>
    <div className={styles.transactionCellCardValue}>{value}</div>
  </div>
)

export default ({
  cell,
  ioType,
  index,
  txHash,
  showReward,
  isAddrNew,
}: {
  cell: Cell
  ioType: IOType
  index: number
  txHash?: string
  showReward?: boolean
  isAddrNew: boolean
}) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()

  const cellbaseReward = (() => {
    if (!showReward) {
      return null
    }

    return <TransactionReward reward={cell} />
  })()

  if (isMobile) {
    return (
      <div className={styles.transactionCellCardPanel}>
        <div className={styles.transactionCellCardSeparate} />
        <TransactionCellMobileItem
          title={
            cell.fromCellbase && ioType === IOType.Input ? (
              <Cellbase cell={cell} isDetail />
            ) : (
              <TransactionCellIndexAddress cell={cell} ioType={ioType} index={index} isAddrNew={isAddrNew} />
            )
          }
        />
        {cell.fromCellbase && showReward && ioType === IOType.Input ? (
          cellbaseReward
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
      </div>
    )
  }

  return (
    <div className={styles.transactionCellPanel} id={ioType === IOType.Output ? `output_${index}_${txHash}` : ''}>
      <div className={styles.transactionCellContentPanel} data-is-cell-base={cell.fromCellbase ?? false}>
        <div className={styles.transactionCellAddress}>
          {cell.fromCellbase && ioType === IOType.Input ? (
            <Cellbase cell={cell} isDetail />
          ) : (
            <TransactionCellIndexAddress cell={cell} ioType={ioType} index={index} isAddrNew={isAddrNew} />
          )}
        </div>

        <div className={styles.transactionCellDetail}>
          {cell.fromCellbase && ioType === IOType.Input ? cellbaseReward : <TransactionCellDetail cell={cell} />}
        </div>

        <div className={styles.transactionCellCapacity}>
          <TransactionCellCapacityAmount cell={cell} />
        </div>

        <div className={styles.transactionDetailCellInfo}>
          <TransactionCellInfo cell={cell}>Cell Info</TransactionCellInfo>
        </div>
      </div>
    </div>
  )
}
