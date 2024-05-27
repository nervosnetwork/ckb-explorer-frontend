import { type FC, useState, useRef, useEffect } from 'react'
import { TFunction, useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Tooltip } from 'antd'
import { ReactComponent as ListIcon } from './list.svg'
import { ReactComponent as GridIcon } from './grid.svg'
import { explorerService, LiveCell } from '../../services/ExplorerService'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import CKBTokenIcon from './ckb_token_icon.png'
import { ReactComponent as CopyIcon } from './copy.svg'
import { ReactComponent as TypeHashIcon } from './type_script.svg'
import { ReactComponent as DataIcon } from './data.svg'
import { ReactComponent as SporeCluterIcon } from './spore_cluster.svg'
import { ReactComponent as SporeCellIcon } from './spore_cell.svg'
import { ReactComponent as MergedAssetIcon } from './merged_assets.svg'
import { ReactComponent as AssetItemsIcon } from './asset_items.svg'
import SmallLoading from '../../components/Loading/SmallLoading'
import { TransactionCellInfo } from '../Transaction/TransactionCell'
import { parseUDTAmount } from '../../utils/number'
import { getContractHashTag, shannonToCkb } from '../../utils/util'
import { useSetToast } from '../../components/Toast'
import { PAGE_SIZE } from '../../constants/common'
import styles from './rgbppAssets.module.scss'
import MergedAssetList from './MergedAssetList'
import { UDTAccount } from '../../models/Address'
import { CellBasicInfo } from '../../utils/transformer'

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
  const link = `/transaction/${cell.txHash}?${new URLSearchParams({
    page_of_outputs: Math.ceil((+cell.cellIndex + 1) / PAGE_SIZE).toString(),
  })}`
  const assetType: string = cell.extraInfo?.type ?? cell.cellType
  let icon: string | React.ReactElement | null = null
  let assetName = null
  let attribute = null
  let detailInfo = null

  const utxo = `${cell.txHash.slice(0, 4)}...${cell.txHash.slice(-3)}:${cell.cellIndex}`

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
      assetName = 'NRC 721'
      attribute = '-'
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

  const cellInfo = {
    ...cell,
    id: Number(cell.cellId),
    isGenesisOutput: false,
  } as CellBasicInfo

  return {
    link,
    assetType,
    ckb,
    detailInfo,
    icon,
    assetName,
    attribute,
    cellInfo,
    utxo,
  }
}

const AssetItem: FC<{ cell: LiveCell }> = ({ cell }) => {
  const setToast = useSetToast()
  const { t } = useTranslation()

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const { detail } = e.currentTarget.dataset
    if (!detail) return
    navigator.clipboard.writeText(detail).then(() => {
      setToast({ message: t('common.copied') })
    })
  }

  const { link, assetType, ckb, detailInfo, icon, assetName, attribute } = getCellDetails(cell, t)

  return (
    <li key={cell.txHash + cell.cellIndex} className={styles.card}>
      <h5
        style={{
          background: `linear-gradient(90.24deg,#ffd176 .23%,#ffdb81 6.7%,#84ffcb 99.82%)`,
          color: '#333',
        }}
      >
        <a href={link}>{t(`transaction.${assetType}`)}</a>

        <span title={`${ckb} CKB`}>{`${ckb} CKB`}</span>
      </h5>
      <div className={styles.itemContent}>
        {typeof icon === 'string' ? <img src={icon} alt={assetName ?? 'sudt'} width="40" height="40" /> : null}
        {icon && typeof icon !== 'string' ? icon : null}
        <div className={styles.fields}>
          <div className={styles.assetName}>{assetName}</div>
          <div className={styles.attribute} title={detailInfo ?? attribute}>
            {attribute}
            {detailInfo ? (
              <button type="button" className={styles.copy} data-detail={detailInfo} onClick={handleCopy}>
                <CopyIcon />
              </button>
            ) : null}
          </div>
        </div>
      </div>
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
            const { utxo, link, assetType, ckb, assetName, attribute, cellInfo } = getCellDetails(cell, t)
            return (
              <tr key={cell.txHash + cell.cellIndex}>
                <td>{index + 1}</td>
                <td>
                  <a href={link}>{utxo}</a>
                </td>
                <td>{assetType}</td>
                <td>{assetName}</td>
                <td>
                  {attribute} {assetName}
                </td>
                <td>{ckb}</td>
                <td>
                  <TransactionCellInfo cell={cellInfo} isDefaultStyle={false}>
                    <span className={styles.cellInfo}>{t('address.cell-info')}</span>
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

const RgbAssetItems: FC<{ address: string; count: number; isDisplayedAsList: boolean }> = ({
  address,
  count,
  isDisplayedAsList,
}) => {
  const [params] = useState(initialPageParams)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['address live cells', address, params.size, params.sort],
    ({ pageParam = 1 }) => fetchCells({ ...params, address, page: pageParam }),
    {
      getNextPageParam: (lastPage: any) => {
        if (lastPage.data.length < params.size) return false
        return lastPage.nextPage
      },
    },
  )

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

  const cells =
    data?.pages
      .map(page => page.data)
      .flat()
      .filter(cell => {
        const info = getContractHashTag(cell.lockScript)
        return info?.tag === 'RGB++'
      })
      .reduce((acc, cur) => {
        // remove repeated cells
        if (acc.find(c => c.txHash === cur.txHash && c.cellIndex === cur.cellIndex)) {
          return acc
        }
        return [...acc, cur]
      }, [] as LiveCell[]) ?? []

  return (
    <>
      {isDisplayedAsList ? (
        <CellTable cells={cells} />
      ) : (
        <ul>
          {cells.map(cell => (
            <AssetItem cell={cell} key={`${cell.txHash}-${cell.cellIndex}`} />
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
    </>
  )
}

const RgbAssets: FC<{ address: string; count: number; udts: UDTAccount[]; inscriptions: UDTAccount[] }> = ({
  address,
  count,
  udts,
  inscriptions,
}) => {
  const [isMerged, setIsMerged] = useState(true)
  const { t } = useTranslation()
  const [isDisplayedAsList, setIsDisplayedAsList] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div>{t(`address.${isMerged ? 'view-as-merged-assets' : 'view-as-asset-items'}`)}</div>
        <div className={styles.filters}>
          <Tooltip placement="top" title={t(`address.${isMerged ? 'view-as-asset-items' : 'view-as-merged-assets'}`)}>
            <button
              type="button"
              onClick={() => {
                setIsMerged(i => !i)
                setIsDisplayedAsList(false)
              }}
            >
              {isMerged ? <AssetItemsIcon /> : <MergedAssetIcon />}
            </button>
          </Tooltip>
          <Tooltip placement="top" title={isDisplayedAsList ? t('sort.card') : t('sort.list')}>
            <button
              type="button"
              onClick={() => {
                setIsDisplayedAsList(i => !i)
                setIsMerged(false)
              }}
            >
              {isDisplayedAsList ? <GridIcon /> : <ListIcon />}
            </button>
          </Tooltip>
        </div>
      </div>

      <div className={styles.content}>
        {isDisplayedAsList ? (
          <RgbAssetItems address={address} count={count} isDisplayedAsList={isDisplayedAsList} />
        ) : (
          <>
            {isMerged ? (
              <MergedAssetList udts={udts} inscriptions={inscriptions} />
            ) : (
              <RgbAssetItems address={address} count={count} isDisplayedAsList={isDisplayedAsList} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default RgbAssets

const getTableHeaders = (t: TFunction): TableHeader[] => {
  return [
    { title: '#', key: 'index' },
    { title: 'UTXO', key: 'utxo' },
    { title: t('address.type'), key: 'type' },
    { title: t('address.asset'), key: 'asset' },
    { title: t('address.amount'), key: 'amount' },
    { title: t('address.capacity'), key: 'capacity' },
    { title: '', key: 'action' },
  ]
}

interface TableHeader {
  title: string
  key: string
}
