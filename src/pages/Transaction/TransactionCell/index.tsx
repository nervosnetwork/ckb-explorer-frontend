import { useState, ReactNode, FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { Link } from '../../../components/Link'
import { IOType, IS_MAINNET, DEFAULT_SPORE_IMAGE } from '../../../constants/common'
import {
  MainnetContractHashTags,
  TestnetContractHashTags,
  SCRIPT_TAGS,
  ZERO_LOCK_CODE_HASH,
  TIMELOCK_KEYWORDS,
} from '../../../constants/scripts'
import { parseUDTAmount } from '../../../utils/number'
import { dayjs } from '../../../utils/date'
import { sliceNftName } from '../../../utils/string'
import {
  shannonToCkb,
  shannonToCkbDecimal,
  formatNftDisplayId,
  handleNftImgError,
  getContractHashTag,
} from '../../../utils/util'
import { UDT_CELL_TYPES } from '../../../utils/cell'
import TransactionCellArrow from '../../../components/Transaction/TransactionCellArrow'
import Capacity from '../../../components/Capacity'
import NervosDAODepositIcon from '../../../assets/nervos_dao_cell.png'
import NervosDAOWithdrawingIcon from '../../../assets/nervos_dao_withdrawing.png'
import UDTTokenIcon from '../../../assets/udt_token.png'
import NFTIssuerIcon from './m_nft_issuer.svg'
import NFTClassIcon from './m_nft_class.svg'
import NFTTokenIcon from './m_nft.svg'
import MoreIcon from './more.svg'
import DobIcon from './dob.svg'
import OwnerlessIcon from './ownerless.svg'
import CoTACellIcon from './cota_cell.svg'
import FiberIcon from './fiber.svg'
import CoTARegCellIcon from './cota_reg_cell.svg'
import SporeCellIcon from './spore.svg'
import MultisigIcon from './multisig.svg'
import DeploymentIcon from './deployment.svg'
import TimelockIcon from '../../../components/LockIcons/Timelock.svg'
import { ReactComponent as BitAccountIcon } from '../../../assets/bit_account.svg'
import SimpleButton from '../../../components/SimpleButton'
import TransactionReward from '../TransactionReward'
import Cellbase from '../../../components/Transaction/Cellbase'
import CopyTooltipText from '../../../components/Text/CopyTooltipText'
import { useDeprecatedAddr, useIsMobile, useNewAddr } from '../../../hooks'
import { useDASAccount } from '../../../hooks/useDASAccount'
import styles from './styles.module.scss'
import AddressText from '../../../components/AddressText'
import { Cell, Cell$Spore, UDTInfo } from '../../../models/Cell'
import CellModal from '../../../components/Cell/CellModal'
import { CellBasicInfo } from '../../../utils/transformer'
import { getSporeImg } from '../../../utils/spore'
import { explorerService } from '../../../services/ExplorerService'
import Skeleton from '../../../components/ui/Skeleton'
import Tooltip from '../../../components/Tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/Popover'
import { scripts } from '../../ScriptList'
import { getTimelock } from '../../../utils/timelock'

const scriptDataList = IS_MAINNET ? MainnetContractHashTags : TestnetContractHashTags
const scriptDataMap = scriptDataList.reduce((acc, item) => {
  acc[item.tag] = item
  return acc
}, {} as Record<string, (typeof scriptDataList)[number]>)

export const Addr: FC<{ address: string; isCellBase: boolean }> = ({ address, isCellBase }) => {
  const alias = useDASAccount(address)
  const { t } = useTranslation()

  if (alias && address) {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip trigger=".bit Name">
          <BitAccountIcon className={styles.icon} />
        </Tooltip>

        <Tooltip placement="top" trigger={<CopyTooltipText content={address} />}>
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
  const deprecatedAddr = useDeprecatedAddr(cell.addressHash)!
  const newAddr = useNewAddr(cell.addressHash)
  const address = isAddrNew ? newAddr : deprecatedAddr

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
      </div>
    </div>
  )
}

const DOBInfo: FC<{ cell: Cell$Spore }> = ({ cell }) => {
  const { collection: { typeHash } = {} } = cell.extraInfo
  const { data: dobInfo, isLoading } = useDOBInfo(cell)

  const tokenIdStr = `${dobInfo.nftInfo?.standard === 'spore' ? '' : '#'}${formatNftDisplayId(
    dobInfo.nftInfo?.token_id ?? '',
    dobInfo.nftInfo?.standard ?? null,
  )}`

  const textSkeleton = <Skeleton style={{ height: 16, width: 150 }} />

  return (
    <div className={styles.dodInfo}>
      {dobInfo.cover ? (
        <img src={dobInfo.cover} alt="nft" className={styles.dodInfoImage} onError={handleNftImgError} />
      ) : (
        <Skeleton shape="square" style={{ width: 72, height: 72 }} />
      )}
      <div className={styles.dodInfoDetails}>
        <div className={styles.dodInfoItem}>
          <div className={styles.dodInfoLabel}>Name</div>
          <div className={styles.dodInfoValue}>
            {isLoading ? (
              textSkeleton
            ) : (
              <Link to={`/nft-info/${typeHash}/${dobInfo.nftInfo?.token_id}`} className={styles.dodInfoValue}>
                <span className="monospace">
                  {dobInfo.nftInfo?.collection.name ?? 'Unique Item'}{' '}
                  {tokenIdStr.length > 10 ? `${tokenIdStr.slice(0, 6)}...${tokenIdStr.slice(-6)}` : tokenIdStr}
                </span>
              </Link>
            )}
          </div>
        </div>
        <div className={styles.dodInfoRow}>
          <div className={styles.dodInfoItem}>
            <div className={styles.dodInfoLabel}>Collection</div>
            <div className={styles.dodInfoValue}>
              {isLoading ? (
                textSkeleton
              ) : (
                <Link to={`/nft-collections/${typeHash}`} className={styles.collection}>
                  {dobInfo.nftInfo?.collection.name ?? 'Unique Item'}
                </Link>
              )}
            </div>
          </div>
          <div className={styles.dodInfoItem}>
            <div className={styles.dodInfoLabel}>Token ID</div>
            <div className={`${styles.dodInfoValue}`}>
              {isLoading ? (
                textSkeleton
              ) : (
                <Link to={`/nft-info/${typeHash}/${dobInfo.nftInfo?.token_id}`} className="monospace">
                  {tokenIdStr.length > 10 ? `${tokenIdStr.slice(0, 6)}...${tokenIdStr.slice(-6)}` : tokenIdStr}
                </Link>
              )}
            </div>
          </div>
          <div className={styles.dodInfoItem}>
            <div className={styles.dodInfoLabel}>Created At</div>
            <div>{isLoading ? textSkeleton : dayjs(dobInfo.nftInfo?.created_at).format('YYYY/MM/DD HH:mm:ss')}</div>
          </div>
          <div className={styles.dodInfoItem}>
            <div className={styles.dodInfoLabel}>Creator</div>
            {isLoading ? (
              textSkeleton
            ) : (
              <div>
                {dobInfo.nftInfo?.collection.creator ? (
                  <Link to={`/address/${dobInfo.nftInfo.collection.creator}`} className={styles.dodInfoValue}>
                    <span className="monospace">{`${dobInfo.nftInfo.collection.creator.slice(
                      0,
                      6,
                    )}...${dobInfo.nftInfo.collection.creator.slice(-6)}`}</span>
                  </Link>
                ) : (
                  '-'
                )}
              </div>
            )}
          </div>
        </div>
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

  if (cell.cellType === 'spore_cell' || cell.cellType === 'did_cell') {
    return <DOBInfo cell={cell as Cell$Spore} />
  }
}

const useDOBInfo = (cell: Cell) => {
  const { typeHash, tokenId } = (() => {
    if (cell.cellType !== 'spore_cell' && cell.cellType !== 'did_cell') {
      return { typeHash: undefined, tokenId: undefined }
    }

    if (!cell.extraInfo || !('collection' in cell.extraInfo)) {
      return { typeHash: undefined, tokenId: undefined }
    }

    return {
      typeHash: cell.extraInfo.collection?.typeHash,
      tokenId: cell.extraInfo.tokenId,
    }
  })()

  const { data: nftInfo } = useQuery(
    ['nft-item-info', typeHash, tokenId],
    () => explorerService.api.fetchNFTCollectionItem(typeHash!, tokenId!),
    {
      enabled: !!typeHash && !!tokenId && (cell.cellType === 'spore_cell' || cell.cellType === 'did_cell'),
    },
  )

  const dobRenderParams =
    nftInfo?.cell?.data && nftInfo?.type_script?.args
      ? {
          data: nftInfo?.cell?.data,
          id: nftInfo?.type_script.args,
        }
      : null

  const { data: cover = DEFAULT_SPORE_IMAGE, isLoading } = useQuery(
    ['dob-cover', dobRenderParams],
    () => (dobRenderParams ? getSporeImg(dobRenderParams) : DEFAULT_SPORE_IMAGE),
    {
      enabled: !!dobRenderParams,
    },
  )

  return {
    data: {
      cover,
      nftInfo,
    },
    isLoading,
  }
}

const HoverablePopover = ({ children, content }: { children: ReactNode; content: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setOpen(true)
  }

  const handleMouseLeave = () => {
    if (!isClicked) {
      timeoutRef.current = setTimeout(() => {
        setOpen(false)
      }, 300)
    }
  }

  const handleClick = () => {
    setIsClicked(true)
    setOpen(prev => !prev)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setIsClicked(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
        {children}
      </PopoverTrigger>
      <PopoverContent onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {content}
      </PopoverContent>
    </Popover>
  )
}

export const TransactionCellDetail = ({ cell }: { cell: Cell }) => {
  const { t } = useTranslation()
  let detailTitle: JSX.Element | string = <span>{t('transaction.ckb_capacity')}</span>
  let detailIcon
  let tooltip: string | ReactNode = ''
  const nftInfo = useParseNftInfo(cell)
  const { data: dobInfo } = useDOBInfo(cell)

  const lockScript = addressToScript(cell.addressHash)

  const isMultisig = (cell.tags ?? []).find(tag => tag === 'multisig') !== undefined
  const isFiber = (cell.tags ?? []).find(tag => tag === 'fiber') !== undefined
  const isDeployment = (cell.tags ?? []).find(tag => tag === 'deployment') !== undefined
  const isDob = cell.cellType === 'spore_cell' || cell.cellType === 'did_cell'
  const isZeroLock = lockScript.codeHash === ZERO_LOCK_CODE_HASH
  const hashTag = getContractHashTag(lockScript)
  const isTimelock = TIMELOCK_KEYWORDS.some(kw => hashTag?.tag?.toLowerCase()?.includes(kw))
  const since = getTimelock(cell.since)

  let etaOfTimelock
  if (hashTag?.tag === SCRIPT_TAGS.SECP_MULTISIG_LOCKTIME) {
    const sinceInLock = `0x${lockScript.args.slice(42).match(/\w{2}/g)?.reverse().join('')}` // 42 is the normal size of secp256k1 args
    etaOfTimelock = getTimelock({ raw: sinceInLock })
  }

  const tokenIdStr = `${dobInfo.nftInfo?.standard === 'spore' ? '' : '#'}${formatNftDisplayId(
    dobInfo.nftInfo?.token_id ?? '',
    dobInfo.nftInfo?.standard ?? null,
  )}`

  const multisig = scripts.get(SCRIPT_TAGS.SECP_MULTISIG)!

  const taglists = [
    {
      key: 'Dob',
      tag: 'Dob Protocol',
      description: t('transaction.tags.dob.description'),
      display: isDob,
      link: `/script/${scriptDataMap.Spore.codeHashes[0]}/${scriptDataMap.Spore.hashType}`,
      icon: DobIcon,
      iconColor: '#FFFEC1',
      type: 'badge',
    },
    {
      key: 'Deployment',
      tag: 'Deployment',
      description: t('transaction.tags.deployment.description'),
      display: isDeployment,
      link: '/scripts',
      icon: DeploymentIcon,
      iconColor: '#ECD7FF',
      type: 'badge',
    },
    {
      key: 'Multisig',
      tag: (
        <div>
          Multisig <span className="text-primary pl-1">(@{lockScript.codeHash.slice(2, 10)})</span>
        </div>
      ),
      description: multisig.description,
      display: isMultisig,
      link: `/script/${lockScript.codeHash}/${lockScript.hashType}`,
      icon: MultisigIcon,
      type: 'shield',
    },
    {
      key: 'Timelock',
      tag: 'Timelock',
      description: etaOfTimelock
        ? t(`transaction.tags.timelock.eta`, {
            time: t(`transaction.since.${etaOfTimelock.base}.${etaOfTimelock.type}`, { since: etaOfTimelock.value }),
          })
        : t('transaction.tags.timelock.description'),
      display: isTimelock,
      link: `/script/${lockScript.codeHash}/${lockScript.hashType}`,
      icon: TimelockIcon,
      type: 'shield',
    },
    {
      key: 'SinceLocked',
      tag: 'Restricted by Since',
      description: since
        ? t('transaction.tags.since_locked.description', {
            time: t(`transaction.since.${since.base}.${since.type}`, { since: since.value }),
          })
        : '',
      display: !!since,
      link: `https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0017-tx-valid-since/0017-tx-valid-since.md`,
      icon: TimelockIcon,
      type: 'shield',
    },
    {
      key: 'Fiber',
      tag: 'Fiber Network',
      description: t('transaction.tags.fiber.description'),
      display: isFiber,
      link: cell.fiberGraphChannelInfo ? `/fiber/graph/node/${cell.fiberGraphChannelInfo.node1}` : '/fiber/graph/nodes',
      icon: FiberIcon,
      iconColor: '#D7FFFC',
      type: 'badge',
    },
    {
      key: 'Ownerless',
      tag: 'Ownerless Cell',
      description: t('transaction.tags.ownerless.description'),
      display: isZeroLock,
      link: '/script/0x0000000000000000000000000000000000000000000000000000000000000000/data',
      icon: OwnerlessIcon,
      type: 'shield',
    },
  ]
  const isDisplayTagList = taglists.filter(tag => tag.display).length > 0

  const CellTag = ({
    tag,
    description,
    link,
    icon,
    iconColor,
    type,
  }: {
    tag: string | ReactNode
    description: string
    link: string
    icon: string
    iconColor?: string
    type: string
  }) => {
    return (
      <Link to={link}>
        <div className={styles.transactionCellTag}>
          <div className={styles.tagHeader}>
            <img
              src={icon}
              className={styles.tagIcon}
              style={{ backgroundColor: iconColor }}
              alt={`${tag} tag icon`}
              data-type={type}
            />
            <span>{tag}</span>
            <img src={MoreIcon} style={{ marginLeft: 'auto' }} width={20} height={20} alt="more" />
          </div>
          <div className={styles.tagDescription}>{description}</div>
        </div>
      </Link>
    )
  }

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
      detailTitle = `${dobInfo.nftInfo?.collection.name ?? 'Unique Item'} ${
        tokenIdStr.length > 10 ? `${tokenIdStr.slice(0, 3)}...${tokenIdStr.slice(-3)}` : tokenIdStr
      }`
      detailIcon = dobInfo.cover
      tooltip = nftInfo
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
        <Tooltip
          placement="top"
          trigger={<img src={detailIcon} alt="cell detail" />}
          contentStyle={{ maxWidth: 'unset', width: 'max-content' }}
        >
          {tooltip}
        </Tooltip>
      ) : (
        detailIcon && <img src={detailIcon} alt="cell detail" />
      )}
      <div className="max-w-[140px] md:max-w-[200px] line-clamp-2">{detailTitle}</div>

      {isDisplayTagList ? (
        <HoverablePopover
          content={
            <div className={styles.transactionCellTagList}>
              {taglists
                .filter(tag => tag.display)
                .map(tag => (
                  <CellTag
                    key={tag.key}
                    tag={tag.tag}
                    description={tag.description}
                    link={tag.link}
                    icon={tag.icon}
                    iconColor={tag.iconColor}
                    type={tag.type}
                  />
                ))}
            </div>
          }
        >
          <div className={styles.transactionCellTags}>
            {taglists
              .filter(tag => tag.display)
              .map(tag => (
                <img
                  key={tag.key}
                  src={tag.icon}
                  className={styles.tagIcon}
                  style={{ backgroundColor: tag.iconColor }}
                  alt={`${tag.tag} icon`}
                  data-type={tag.type}
                />
              ))}
          </div>
        </HoverablePopover>
      ) : null}
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
  return (
    <div className={styles.transactionCellInfoPanel}>
      <CellModal cell={cell}>
        <SimpleButton className={isDefaultStyle ? styles.transactionCellInfoContent : ''}>
          <div>{children}</div>
          <div className={styles.transactionCellInfoSeparate} />
        </SimpleButton>
      </CellModal>
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
