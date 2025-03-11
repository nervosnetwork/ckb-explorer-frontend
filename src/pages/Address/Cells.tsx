import { type FC, useState, useRef, useEffect } from 'react'
import { TFunction, useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Tooltip } from 'antd'
import { OpenInNewWindowIcon, SizeIcon, TimerIcon } from '@radix-ui/react-icons'
import { explorerService, LiveCell } from '../../services/ExplorerService'
import FtFallbackIcon from '../../assets/ft_fallback_icon.png'
import CKBTokenIcon from './ckb_token_icon.png'
import { ReactComponent as TypeHashIcon } from './type_script.svg'
import { ReactComponent as DataIcon } from './data.svg'
import { ReactComponent as SporeClusterIcon } from './spore_cluster.svg'
import { ReactComponent as SporeCellIcon } from './spore_cell.svg'
import { ReactComponent as SortIcon } from '../../assets/sort_icon.svg'
import { ReactComponent as TimeDownIcon } from '../../assets/time_down.svg'
import { ReactComponent as TimeUpIcon } from '../../assets/time_up.svg'
import { ReactComponent as ListIcon } from './list.svg'
import { ReactComponent as GridIcon } from './grid.svg'
import { ReactComponent as BlockIcon } from './block.svg'
import { ReactComponent as PinIcon } from './pin.svg'
import { parseUDTAmount } from '../../utils/number'
import { shannonToCkb } from '../../utils/util'
import { parseSimpleDateNoSecond } from '../../utils/date'
import styles from './cells.module.scss'
import SmallLoading from '../../components/Loading/SmallLoading'
import { TransactionCellInfo } from '../Transaction/TransactionCell'
import { CellBasicInfo } from '../../utils/transformer'
import { sliceNftName } from '../../utils/string'
import { Link } from '../../components/Link'
import { isTypeIdScript } from '../../utils/typeid'

enum Sort {
  TimeAsc = 'block_timestamp.asc',
  TimeDesc = 'block_timestamp.desc',
  CapacityAsc = 'capacity.asc',
  CapacityDesc = 'capacity.desc',
}

const fetchCells = async ({
  address,
  size = 10,
  sort = 'capacity.desc',
  page = 1,
}: {
  address: string
  size: number
  sort: string
  page: number
}) => {
  const boundStatus = address.startsWith('ckb') || address.startsWith('ckt') ? undefined : 'bound'
  const res = await explorerService.api.fetchAddressLiveCells(address, page, size, sort, boundStatus)
  return {
    data: res.data,
    nextPage: page + 1,
  }
}

const initialPageParams = { size: 10, sort: 'capacity.desc' }

const ATTRIBUTE_LENGTH = 18

const getCellDetails = (cell: LiveCell, t: TFunction) => {
  const ckb = new BigNumber(shannonToCkb(+cell.capacity)).toFormat()
  const assetType: string = cell.extraInfo?.type ?? cell.cellType
  let icon: string | React.ReactElement | null = null
  let assetName = null
  let attribute = null
  let detailInfo = null
  let assetTypeText = assetType
  let assetLink = null
  switch (assetType) {
    case 'ckb': {
      assetTypeText = 'CKB'
      if (cell.typeScript && isTypeIdScript(cell.typeScript)) {
        icon = <TypeHashIcon />
        assetName = 'Deployed Script'
        attribute = `TYPE HASH: ${cell.typeHash.slice(0, 10)}...`
        detailInfo = cell.typeHash
        break
      }
      if (cell.typeHash) {
        icon = <TypeHashIcon />
        assetName = 'UNKNOWN ASSET'
        attribute = `TYPE HASH: ${cell.typeHash.slice(0, 10)}...`
        detailInfo = cell.typeHash
        break
      }
      if (cell.data !== '0x') {
        // TODO: indicate this is a contentful cell
        icon = <DataIcon />
        assetName = 'DATA'
        if (cell.data.length > ATTRIBUTE_LENGTH) {
          attribute = `${cell.data.slice(0, ATTRIBUTE_LENGTH)}...`
        } else {
          attribute = cell.data
        }
        detailInfo = cell.data
        break
      }
      icon = CKBTokenIcon
      assetName = 'CKB'
      attribute = ckb
      detailInfo = BigNumber(cell.capacity).toFormat({ groupSeparator: '' })
      break
    }
    case 'nervos_dao_deposit':
    case 'nervos_dao_withdrawing': {
      icon = CKBTokenIcon
      assetName = assetType === 'nervos_dao_deposit' ? 'Nervos DAO' : 'Nervos DAO Withdrawing'
      attribute = ckb
      detailInfo = BigNumber(cell.capacity).toFormat({ groupSeparator: '' })
      break
    }
    case 'udt': {
      icon = FtFallbackIcon
      assetName = cell.extraInfo.symbol || 'UDT'
      assetTypeText = 'UDT'
      attribute = cell.extraInfo.decimal
        ? parseUDTAmount(cell.extraInfo.amount, cell.extraInfo.decimal)
        : 'Unknown UDT amount'
      detailInfo = cell.extraInfo.amount
      if (cell.extraInfo.published) {
        assetLink = `/sudt/${cell.typeHash}`
      }
      break
    }
    case 'xudt_compatible': {
      icon = FtFallbackIcon
      assetName = cell.extraInfo?.symbol || 'xUDT-compatible'
      attribute =
        cell.extraInfo?.decimal && cell.extraInfo?.amount
          ? parseUDTAmount(cell.extraInfo.amount, cell.extraInfo.decimal)
          : 'Unknown xUDT amount'
      detailInfo = cell.extraInfo?.amount
      if (cell.extraInfo.published) {
        assetLink = `/xudt/${cell.typeHash}`
      }
      break
    }
    case 'xudt': {
      icon = FtFallbackIcon
      assetName = cell.extraInfo?.symbol || 'xUDT'
      assetTypeText = 'xUDT'
      attribute =
        cell.extraInfo?.decimal && cell.extraInfo?.amount
          ? parseUDTAmount(cell.extraInfo.amount, cell.extraInfo.decimal)
          : 'Unknown xUDT amount'
      detailInfo = cell.extraInfo?.amount
      if (cell.extraInfo.published) {
        assetLink = `/xudt/${cell.typeHash}`
      }
      break
    }
    case 'omiga_inscription': {
      icon = FtFallbackIcon
      assetName = cell.extraInfo.symbol || t('udt.inscription')
      assetTypeText = 'xUDT'
      attribute = cell.extraInfo.decimal
        ? parseUDTAmount(cell.extraInfo.amount, cell.extraInfo.decimal)
        : 'Unknown amount'
      detailInfo = cell.extraInfo.amount
      assetLink = `/inscription/${cell.typeHash}`
      break
    }
    case 'did_cell':
    case 'dob':
    case 'spore_cell': {
      icon = <SporeCellIcon />
      assetName = 'DOB'
      assetTypeText = 'NFT'
      if (cell.data.length > ATTRIBUTE_LENGTH) {
        attribute = `${cell.data.slice(0, ATTRIBUTE_LENGTH)}...`
      } else {
        attribute = cell.data
      }
      detailInfo = cell.data
      if (cell.extraInfo.collection?.typeHash) {
        assetLink = `/nft-collections/${cell.extraInfo.collection?.typeHash}`
      } else if (cell.extraInfo.typeHash) {
        assetLink = `/nft-collections/${cell.extraInfo.typeHash}`
      }
      break
    }
    case 'spore_cluster': {
      icon = <SporeClusterIcon />
      assetName = 'Spore Cluster'
      assetTypeText = 'NFT'
      if (cell.data.length > ATTRIBUTE_LENGTH) {
        attribute = `${cell.data.slice(0, ATTRIBUTE_LENGTH)}...`
      } else {
        attribute = cell.data
      }
      detailInfo = cell.data
      if (cell.extraInfo.collection?.typeHash) {
        assetLink = `/nft-collections/${cell.extraInfo.collection?.typeHash}`
      } else if (cell.extraInfo.typeHash) {
        assetLink = `/nft-collections/${cell.extraInfo.typeHash}`
      }
      break
    }
    case 'nrc_721': {
      icon = FtFallbackIcon
      assetTypeText = 'NFT'
      assetName = !cell.extraInfo.symbol
        ? '?'
        : sliceNftName(`${cell.extraInfo.symbol} #${cell.extraInfo.typeHash.slice(0, 3)}`)
      if (cell.extraInfo.amount.length > ATTRIBUTE_LENGTH) {
        attribute = `${cell.extraInfo.amount.slice(0, ATTRIBUTE_LENGTH)}...`
      } else {
        attribute = cell.extraInfo.amount
      }
      if (cell.extraInfo.collection?.typeHash) {
        assetLink = `/nft-collections/${cell.extraInfo.collection?.typeHash}`
      } else if (cell.extraInfo.typeHash) {
        assetLink = `/nft-collections/${cell.extraInfo.typeHash}`
      }
      break
    }
    case 'm_nft': {
      icon = FtFallbackIcon
      assetTypeText = 'NFT'
      assetName = cell.extraInfo.className
      attribute = cell.extraInfo.tokenId ? `#${parseInt(cell.extraInfo.tokenId, 16)}` : '/'
      if (cell.extraInfo.collection?.typeHash) {
        assetLink = `/nft-collections/${cell.extraInfo.collection?.typeHash}`
      } else if (cell.extraInfo.typeHash) {
        assetLink = `/nft-collections/${cell.extraInfo.typeHash}`
      }
      break
    }
    default: {
      icon = FtFallbackIcon
      assetTypeText = 'Unknown Cell'
      assetName = 'UNKNOWN'
      attribute = '-'
    }
  }

  const outPointStr = `${cell.txHash.slice(0, 8)}...${cell.txHash.slice(-8)}#${cell.cellIndex}`
  const parsedBlockCreateAt = parseSimpleDateNoSecond(cell.blockTimestamp)
  const title = `${cell.blockNumber}: ${ckb} `
  const cellInfo = {
    ...cell,
    id: Number(cell.cellId),
    isGenesisOutput: Number(cell.blockNumber) === 0,
    generatedTxHash: cell.txHash,
    cellIndex: cell.cellIndex.toString(16),
    status: 'live',
    consumedTxHash: '',
  } as CellBasicInfo

  return {
    assetLink,
    ckb,
    outPointStr,
    icon,
    assetName,
    attribute,
    detailInfo,
    title,
    parsedBlockCreateAt,
    cellInfo,
    assetTypeText,
  }
}

const HeaderTooltip: FC<{ cell: LiveCell }> = ({ cell }) => {
  const [t] = useTranslation()

  const ckb = new BigNumber(shannonToCkb(+cell.capacity)).toFormat()
  const time = parseSimpleDateNoSecond(cell.blockTimestamp)
  return (
    <div className={styles.cellHeader}>
      <dl>
        <dt>
          <BlockIcon className={styles.blockIcon} /> {t(`cell.in_block`)}
        </dt>
        <dd>
          {cell.blockNumber}
          <a href={`/block/${cell.blockNumber}`} target="_blank" rel="noopener noreferrer" title={t('cell.in_block')}>
            <OpenInNewWindowIcon />
          </a>
        </dd>
      </dl>
      <dl>
        <dt>
          <PinIcon /> {t('cell.out_point')}
        </dt>
        <dd>
          {`${cell.txHash.slice(0, 4)}...${cell.txHash.slice(-4)}#${cell.cellIndex}`}
          <a
            href={`/transaction/${cell.txHash}#${cell.cellIndex}`}
            target="_blank"
            rel="noopener noreferrer"
            title={t('cell.out_point')}
          >
            <OpenInNewWindowIcon />
          </a>
        </dd>
      </dl>
      <dl>
        <dt>
          <SizeIcon />
          {t('cell.capacity')}
        </dt>
        <dd>{`${ckb} CKB`}</dd>
      </dl>
      <dl>
        <dt>
          <TimerIcon /> {t('cell.time')}
        </dt>
        <dd>{time}</dd>
      </dl>
    </div>
  )
}

const Cell: FC<{ cell: LiveCell }> = ({ cell }) => {
  const { t } = useTranslation()

  const { title, parsedBlockCreateAt, icon, assetName, attribute, detailInfo, cellInfo, assetLink } = getCellDetails(
    cell,
    t,
  )

  return (
    <li key={cell.txHash + cell.cellIndex} className={styles.card}>
      <TransactionCellInfo cell={cellInfo} isDefaultStyle={false}>
        <Tooltip placement="top" title={<HeaderTooltip cell={cell} />}>
          <h5 className={styles.cellTitle}>
            <span>{title}</span>
            <span> CKB ({parsedBlockCreateAt})</span>
          </h5>
        </Tooltip>

        <div className={styles.cellContent}>
          {typeof icon === 'string' ? <img src={icon} alt={assetName ?? 'sudt'} width="40" height="40" /> : null}
          {icon && typeof icon !== 'string' ? icon : null}
          <div className={styles.fields}>
            {assetLink ? (
              <Link to={assetLink} className={styles.assetName}>
                {assetName}
              </Link>
            ) : (
              <div className={styles.assetName}>{assetName}</div>
            )}

            <div className={styles.attribute} title={detailInfo ?? attribute}>
              {attribute}
            </div>
          </div>
        </div>
      </TransactionCellInfo>
    </li>
  )
}

const CellTable: FC<{ cells: LiveCell[] }> = ({ cells }) => {
  const { t } = useTranslation()
  const headers = getTableHeaders(t)

  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header.key}>{header.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cells.map((cell, index) => {
            const { ckb, outPointStr, assetName, attribute, cellInfo, assetTypeText } = getCellDetails(cell, t)

            return (
              <tr key={cell.txHash + cell.cellIndex}>
                <td>{index + 1}</td>
                <td>{cell.blockNumber}</td>
                <td>{outPointStr}</td>
                <td>{ckb}</td>
                <td>{assetTypeText}</td>
                <td>
                  {attribute} {attribute === 'Unknown amount' ? '' : assetName}
                </td>
                <td>
                  <TransactionCellInfo cell={cellInfo} isDefaultStyle={false}>
                    <span className={styles.detail}>{t('address.detail')}</span>
                  </TransactionCellInfo>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const Cells: FC<{ address: string; count: number }> = ({ address, count }) => {
  const { t } = useTranslation()
  const [params, setParams] = useState(initialPageParams)
  const [isDisplayedAsList, setIsDisplayedAsList] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['address live cells', address, params.size, params.sort],
    ({ pageParam = 1 }) => fetchCells({ ...params, address, page: pageParam }),
    {
      getNextPageParam: lastPage => {
        if (lastPage.data.length < params.size) return false
        return lastPage.nextPage
      },
    },
  )

  const handleSortChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const { sort } = e.currentTarget.dataset
    if (!sort) return
    setParams(p => ({ ...p, sort }))
  }

  const isListDisplayed = count && data

  useEffect(() => {
    const trigger = loadMoreRef.current

    if (!isListDisplayed) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchNextPage()
        }
      },
      { threshold: 0.5 },
    )
    if (trigger) {
      observer.observe(trigger)
    }
    return () => {
      if (trigger) {
        observer.unobserve(trigger)
      }
    }
  }, [isListDisplayed, fetchNextPage])

  const cells = data?.pages.map(page => page.data).flat() ?? []

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div>UTXO: {count.toLocaleString('en')}</div>
        <div className={styles.filters}>
          <Tooltip placement="top" title={t('sort.time')}>
            <button
              type="button"
              data-sort={params.sort === Sort.TimeAsc ? Sort.TimeDesc : Sort.TimeAsc}
              onClick={handleSortChange}
              data-is-active={params.sort === Sort.TimeAsc || params.sort === Sort.TimeDesc}
            >
              {params.sort === Sort.TimeAsc ? <TimeUpIcon /> : <TimeDownIcon />}
            </button>
          </Tooltip>
          <Tooltip placement="top" title={t('sort.capacity')}>
            <button
              type="button"
              data-sort={params.sort === Sort.CapacityAsc ? Sort.CapacityDesc : Sort.CapacityAsc}
              onClick={handleSortChange}
              title={t('sort.capacity')}
            >
              <SortIcon data-current-sort={params.sort} className={styles.capacitySortIcon} />
            </button>
          </Tooltip>
          <Tooltip placement="top" title={isDisplayedAsList ? t('sort.card') : t('sort.list')}>
            <button type="button" onClick={() => setIsDisplayedAsList(i => !i)}>
              {isDisplayedAsList ? <GridIcon /> : <ListIcon />}
            </button>
          </Tooltip>
        </div>
      </div>

      <div className={styles.content}>
        {isDisplayedAsList ? (
          <CellTable cells={cells} />
        ) : (
          <ul>
            {cells.map(cell => (
              <Cell cell={cell} key={`${cell.txHash}-${cell.cellIndex}`} />
            ))}
          </ul>
        )}

        {isFetchingNextPage ? (
          <span className={styles.loading}>
            <SmallLoading />
          </span>
        ) : null}
        {!hasNextPage || isFetchingNextPage ? null : (
          <div className={styles.loadMore} ref={loadMoreRef}>
            <button type="button" onClick={() => fetchNextPage()}>
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
export default Cells

const getTableHeaders = (t: TFunction): TableHeader[] => {
  return [
    { title: '#', key: 'index' },
    { title: t('address.block-height'), key: 'block-number' },
    { title: t('address.out-point'), key: 'out-point' },
    { title: t('address.capacity'), key: 'capacity' },
    { title: t('address.type'), key: 'type' },
    { title: t('address.amount'), key: 'amount' },
    { title: '', key: 'action' },
  ]
}

interface TableHeader {
  title: string
  key: string
}
