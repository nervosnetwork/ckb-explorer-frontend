import { type FC, useState, useRef, useEffect } from 'react'
import { TFunction, useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Tooltip } from 'antd'
import { explorerService, LiveCell } from '../../services/ExplorerService'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import CKBTokenIcon from './ckb_token_icon.png'
import { ReactComponent as TypeHashIcon } from './type_script.svg'
import { ReactComponent as DataIcon } from './data.svg'
import { ReactComponent as SporeCluterIcon } from './spore_cluster.svg'
import { ReactComponent as SporeCellIcon } from './spore_cell.svg'
import { ReactComponent as SortIcon } from '../../assets/sort_icon.svg'
import { ReactComponent as TimeDownIcon } from '../../assets/time_down.svg'
import { ReactComponent as TimeUpIcon } from '../../assets/time_up.svg'
import { ReactComponent as ListIcon } from './list.svg'
import { ReactComponent as GridIcon } from './grid.svg'
import { parseUDTAmount } from '../../utils/number'
import { shannonToCkb } from '../../utils/util'
import { parseSimpleDateNoSecond } from '../../utils/date'
import styles from './cells.module.scss'
import SmallLoading from '../../components/Loading/SmallLoading'
import { TransactionCellInfo } from '../Transaction/TransactionCell'
import { CellBasicInfo } from '../../utils/transformer'
import { sliceNftName } from '../../utils/string'

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
  const res = await explorerService.api.fetchAddressLiveCells(address, page, size, sort)
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
  switch (assetType) {
    case 'ckb': {
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
      icon = SUDTTokenIcon
      assetName = cell.extraInfo.symbol || 'UDT'
      attribute = cell.extraInfo.decimal
        ? parseUDTAmount(cell.extraInfo.amount, cell.extraInfo.decimal)
        : 'Unknown UDT amount'
      detailInfo = cell.extraInfo.amount
      break
    }
    case 'xudt_compatible': {
      icon = SUDTTokenIcon
      assetName = cell.extraInfo?.symbol || 'xUDT-compatible'
      attribute =
        cell.extraInfo?.decimal && cell.extraInfo?.amount
          ? parseUDTAmount(cell.extraInfo.amount, cell.extraInfo.decimal)
          : 'Unknown xUDT amount'
      detailInfo = cell.extraInfo?.amount
      break
    }
    case 'xudt': {
      icon = SUDTTokenIcon
      assetName = cell.extraInfo?.symbol || 'xUDT'
      attribute =
        cell.extraInfo?.decimal && cell.extraInfo?.amount
          ? parseUDTAmount(cell.extraInfo.amount, cell.extraInfo.decimal)
          : 'Unknown xUDT amount'
      detailInfo = cell.extraInfo?.amount
      break
    }
    case 'omiga_inscription': {
      icon = SUDTTokenIcon
      assetName = cell.extraInfo.symbol || t('udt.inscription')
      attribute = cell.extraInfo.decimal
        ? parseUDTAmount(cell.extraInfo.amount, cell.extraInfo.decimal)
        : 'Unknown amount'
      detailInfo = cell.extraInfo.amount
      break
    }
    case 'spore_cell': {
      icon = <SporeCellIcon />
      assetName = 'DOB'
      if (cell.data.length > ATTRIBUTE_LENGTH) {
        attribute = `${cell.data.slice(0, ATTRIBUTE_LENGTH)}...`
      } else {
        attribute = cell.data
      }
      detailInfo = cell.data
      break
    }
    case 'spore_cluster': {
      icon = <SporeCluterIcon />
      assetName = 'Spore Cluster'
      if (cell.data.length > ATTRIBUTE_LENGTH) {
        attribute = `${cell.data.slice(0, ATTRIBUTE_LENGTH)}...`
      } else {
        attribute = cell.data
      }
      detailInfo = cell.data
      break
    }
    case 'nrc_721': {
      icon = SUDTTokenIcon
      assetName = !cell.extraInfo.symbol
        ? '?'
        : sliceNftName(`${cell.extraInfo.symbol} #${cell.extraInfo.typeHash.slice(0, 3)}`)
      attribute = cell.extraInfo.amount
      break
    }
    case 'm_nft': {
      icon = SUDTTokenIcon
      assetName = cell.extraInfo.className
      attribute = `#${parseInt(cell.extraInfo.tokenId, 16)}`
      break
    }
    default: {
      icon = SUDTTokenIcon
      assetName = 'UNKNOWN'
      attribute = '-'
    }
  }

  const outPointStr = `${cell.txHash.slice(0, 8)}...${cell.txHash.slice(-8)}#${cell.cellIndex}`
  const parsedBlockCreateAt = parseSimpleDateNoSecond(cell.blockTimestamp)
  const title = `${cell.cellId}: ${ckb} `
  const cellInfo = {
    ...cell,
    id: Number(cell.cellId),
    isGenesisOutput: Number(cell.blockNumber) === 0,
  } as CellBasicInfo

  return {
    ckb,
    outPointStr,
    icon,
    assetName,
    attribute,
    detailInfo,
    title,
    parsedBlockCreateAt,
    cellInfo,
  }
}

const Cell: FC<{ cell: LiveCell }> = ({ cell }) => {
  const { t } = useTranslation()

  const { title, parsedBlockCreateAt, icon, assetName, attribute, detailInfo, cellInfo } = getCellDetails(cell, t)

  return (
    <li key={cell.txHash + cell.cellIndex} className={styles.card}>
      <TransactionCellInfo cell={cellInfo} isDefaultStyle={false}>
        <Tooltip placement="top" title={`${title} CKB (${parsedBlockCreateAt})`}>
          <h5>
            <span>{title}</span>
            <span> CKB ({parsedBlockCreateAt})</span>
          </h5>
        </Tooltip>

        <div className={styles.cellContent}>
          {typeof icon === 'string' ? <img src={icon} alt={assetName ?? 'sudt'} width="40" height="40" /> : null}
          {icon && typeof icon !== 'string' ? icon : null}
          <div className={styles.fields}>
            <div className={styles.assetName}>{assetName}</div>
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
            const { ckb, outPointStr, assetName, attribute, cellInfo } = getCellDetails(cell, t)

            return (
              <tr key={cell.txHash + cell.cellIndex}>
                <td>{index + 1}</td>
                <td>{cell.blockNumber}</td>
                <td>{outPointStr}</td>
                <td>{ckb}</td>
                <td>{cell.extraInfo?.type}</td>
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
