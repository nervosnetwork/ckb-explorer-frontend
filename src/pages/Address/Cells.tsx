import { type FC, useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from '@tanstack/react-query'
import { explorerService } from '../../services/ExplorerService'
import styles from './cells.module.scss'
import { shannonToCkb } from '../../utils/util'
import { parseUDTAmount } from '../../utils/number'
import { PAGE_SIZE } from '../../constants/common'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import CKBTokenIcon from './ckb_token_icon.png'

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

const Cells: FC<{ address: string; count: number }> = ({ address, count }) => {
  const [params] = useState(initialPageParams)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const { t } = useTranslation()

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

  if (!isListDisplayed) {
    return null
  }

  const cells = data.pages.map(page => page.data).flat()

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>UTXO: {count.toLocaleString('en')}</div>
      <ul>
        {cells.map(cell => {
          const ckb = Number(shannonToCkb(cell.capacity)).toLocaleString('en')
          const title = `${cell.txHash.slice(0, 8)}...${cell.txHash.slice(-8)}#${cell.cellIndex}`
          const link = `/transaction/${cell.txHash}?${new URLSearchParams({
            page_of_outputs: Math.ceil(+cell.cellIndex / PAGE_SIZE).toString(),
          })}`
          const assetType: string = cell.extraInfo?.type ?? cell.cellType
          let icon = null
          let assetName = null
          let assetAmount = null
          switch (assetType) {
            case 'ckb': {
              if (cell.data !== '0x') {
                // TODO: indicate this is a contentful cell
                icon = SUDTTokenIcon
                assetName = 'UNKNOWN'
                assetAmount = '-'
                break
              }
              icon = CKBTokenIcon
              assetName = 'CKB'
              assetAmount = ckb
              break
            }
            case 'udt':
            case 'omiga_inscription': {
              icon = SUDTTokenIcon
              assetName = cell.extraInfo.symbol || t('udt.inscription')
              assetAmount = cell.extraInfo.decimal
                ? parseUDTAmount(cell.extraInfo.amount, cell.extraInfo.decimal)
                : 'Unknown UDT amount'
              break
            }
            case 'spore_cell': {
              icon = SUDTTokenIcon
              assetName = 'Spore'
              assetAmount = '-'
              break
            }
            case 'nrc_721': {
              icon = SUDTTokenIcon
              assetName = 'NRC 721'
              assetAmount = '-'
              break
            }
            case 'm_nft': {
              icon = SUDTTokenIcon
              assetName = cell.extraInfo.className
              assetAmount = `#${parseInt(cell.extraInfo.tokenId, 16)}`
              break
            }
            default: {
              icon = SUDTTokenIcon
              assetName = 'UNKNOWN'
              assetAmount = '-'
              // ignore
            }
          }

          return (
            <li key={cell.txHash + cell.cellIndex} className={styles.card}>
              <h5>
                <a href={link}>{title}</a>
                <span>{`${ckb} CKB`}</span>
              </h5>
              <div className={styles.content}>
                {icon ? <img src={icon} alt={assetName ?? 'sudt'} width="40" height="40" /> : null}
                <div className={styles.fields}>
                  <div className={styles.assetName}>{assetName}</div>
                  <div>{assetAmount}</div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      {isFetchingNextPage ? <span className={styles.loading}>Loading...</span> : null}
      {!hasNextPage || isFetchingNextPage ? null : (
        <div className={styles.loadMore} ref={loadMoreRef}>
          <button type="button" onClick={() => fetchNextPage()}>
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
export default Cells
