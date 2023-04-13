import type { AxiosResponse } from 'axios'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import classNames from 'classnames'
import { Popover } from 'antd'
import Content from '../../components/Content'
import Pagination from '../../components/Pagination'
import NftHolderList from '../../components/NftHolderList'
import NftCollectionOverview from '../../components/NftCollectionOverview'
import NftCollectionTransfers from '../../components/NftCollectionTransfers'
import { v2AxiosIns } from '../../service/http/fetcher'
import i18n from '../../utils/i18n'
import styles from './styles.module.scss'
import NftCollectionInventory from '../../components/NftCollectionInventory'
import { useIsMobile, useSearchParams, useSortParam, useUpdateSearchParams } from '../../utils/hook'
import { ReactComponent as SortIcon } from '../../assets/sort_icon.svg'
import { ReactComponent as FilterIcon } from '../../assets/filter_icon.svg'
import { ReactComponent as SelectedCheckIcon } from '../../assets/selected_check_icon.svg'
import { omit } from '../../utils/object'

export type NftHolderSortByType = 'quantity'

export interface InventoryRes {
  data: Array<{
    id: number
    collection_id: number
    icon_url: string | null
    owner_id: number
    token_id: string
  }>
  pagination: {
    count: number
    page: number
    next: number | null
    prev: number | null
    last: number
  }
}

export interface TransferRes {
  id: number
  from: string | null
  to: string | null
  action: 'mint' | 'transfer'
  item: {
    id: number
    token_id: string
    name: string | null
    icon_url: string | null
    owner_id: number
    metadata_url: string | null
    cell_id: number | null
    type_script: {
      script_hash: string
    }
  }
  transaction: {
    tx_hash: string
    block_number: number
    block_timestamp: number
  }
}

export interface TransferListRes {
  data: Array<TransferRes>
  pagination: {
    count: number
    page: number
    next: number | null
    prev: number | null
    last: number
  }
}
export interface HolderListRes {
  data: Record<string, number>
}

const tabs = ['transfers', 'holders', 'inventory']
const PAGE_SIZE = 50

export type TxTypeType = 'mint' | 'transfer' | 'burn' | undefined

function isTxFilterType(s?: string): s is TxTypeType {
  return s ? ['mint', 'transfer', 'burn'].includes(s) : false
}

const NftCollectionInfo = () => {
  const isMobile = useIsMobile()
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const { tab = tabs[0], page = '1', tx_type: txTypeFilterParam } = useSearchParams('tab', 'page', 'tx_type')

  const { sortBy, orderBy, sort, handleSortClick } = useSortParam<NftHolderSortByType>(s => s === 'quantity')

  const txTypeFilter = isTxFilterType(txTypeFilterParam) ? txTypeFilterParam : undefined

  const { isLoading: isTransferListLoading, data: transferListRes } = useQuery<AxiosResponse<TransferListRes>>(
    ['nft-collection-transfer-list', id, page],
    () =>
      v2AxiosIns(`/nft/transfers`, {
        params: {
          page,
          collection_id: id,
        },
      }),
    {
      enabled: tab === tabs[0],
    },
  )
  const { isLoading: isHolderListLoading, data: rawHolderList } = useQuery<AxiosResponse<HolderListRes>>(
    ['nft-collection-holder-list', id, page, sort],
    () =>
      v2AxiosIns(`/nft/collections/${id}/holders`, {
        params: {
          page,
          sort,
        },
      }),
    {
      enabled: tab === tabs[1],
    },
  )
  const { isLoading: isInventoryLoading, data: inventoryList } = useQuery<AxiosResponse<InventoryRes>>(
    ['nft-collection-inventory', id, page],
    () =>
      v2AxiosIns(`/nft/collections/${id}/items`, {
        params: {
          page,
        },
      }),
    {
      enabled: tab === tabs[2],
    },
  )

  const handlePageChange = (pageNo: number) => {
    if (pageNo === +page) {
      return
    }
    history.push(`/nft-collections/${id}?tab=${tab}&page=${pageNo}`)
  }

  const holderList = rawHolderList
    ? Object.keys(rawHolderList.data.data)
        .map(addr => ({
          addr,
          quantity: rawHolderList.data.data[addr],
        }))
        .sort((h1, h2) => h2.quantity - h1.quantity)
    : []

  // TODO: enable pagination of holder list

  let pageSource:
    | {
        data: {
          pagination: Record<'page' | 'last', number>
        }
      }
    | undefined = {
    data: {
      pagination: {
        page: 1,
        last: 1,
      },
    },
  }

  if (tab === tabs[0]) {
    pageSource = transferListRes
  } else if (tab === tabs[2]) {
    pageSource = inventoryList
  }

  const pages = {
    currentPage: pageSource?.data.pagination.page ?? 1,
    totalPages: pageSource?.data.pagination.last ?? 1,
  }

  const sortButton = (sortRule: NftHolderSortByType) => (
    <button
      type="button"
      className={classNames(styles.sortIcon, {
        [styles.sortAsc]: sortRule === sortBy && orderBy === 'asc',
        [styles.sortDesc]: sortRule === sortBy && orderBy === 'desc',
      })}
      onClick={() => handleSortClick(sortRule)}
    >
      <SortIcon />
    </button>
  )

  const filterList: { value: TxTypeType; title: string }[] = [
    {
      value: 'mint',
      title: i18n.t('udt.view_mint_txns'),
    },
    {
      value: 'transfer',
      title: i18n.t('udt.view_transfer_txns'),
    },
    {
      value: 'burn',
      title: i18n.t('udt.view_burn_txns'),
    },
  ]

  const updateSearchParams = useUpdateSearchParams<'tx_type'>()

  const handleFilterClick = (filterType: TxTypeType) => {
    updateSearchParams(
      params => (filterType === txTypeFilter ? omit(params, ['tx_type']) : { ...params, tx_type: filterType }),
      true,
    )
  }

  return (
    <Content>
      <NftCollectionOverview id={id} />
      <div className={styles.container}>
        <div className={styles.tabs}>
          <Link to={`/nft-collections/${id}?tab=${tabs[0]}`} data-active={tab === tabs[0]}>
            {i18n.t(`nft.activity`)}
          </Link>
          <Link to={`/nft-collections/${id}?tab=${tabs[1]}`} data-active={tab === tabs[1]}>
            {i18n.t(`nft.holder-list`)}
          </Link>
          <Link to={`/nft-collections/${id}?tab=${tabs[2]}`} data-active={tab === tabs[2]}>
            {i18n.t(`nft.inventory`)}
          </Link>
          {tab === tabs[0] && (
            <div className={classNames({ [styles.activeIcon]: txTypeFilter }, styles.buttonIcon)}>
              <Popover
                placement={isMobile ? 'bottomRight' : 'bottomLeft'}
                trigger={isMobile ? 'click' : 'hover'}
                overlayClassName={styles.filterPop}
                content={
                  <div>
                    {filterList.map(f => (
                      <button type="button" onClick={() => handleFilterClick(f.value)}>
                        <div>{f.title}</div>
                        <div>{f.value === txTypeFilter && <SelectedCheckIcon />}</div>
                      </button>
                    ))}
                  </div>
                }
              >
                <FilterIcon />
              </Popover>
            </div>
          )}
        </div>
        {tab === tabs[0] ? (
          <>
            <NftCollectionTransfers
              list={transferListRes?.data.data ?? []}
              isLoading={isTransferListLoading}
              collection={id}
            />
            <Pagination
              currentPage={transferListRes?.data.pagination.page ?? 1}
              totalPages={transferListRes?.data.pagination.last ?? 1}
              onChange={handlePageChange}
            />
          </>
        ) : null}
        {tab === tabs[1] ? (
          <>
            <NftHolderList
              list={holderList?.slice((+page - 1) * PAGE_SIZE, +page * PAGE_SIZE) ?? []}
              isLoading={isHolderListLoading}
              sortButton={sortButton}
            />
            <Pagination
              currentPage={+page}
              totalPages={Math.ceil((holderList?.length ?? 0) / PAGE_SIZE) ?? 1}
              onChange={handlePageChange}
            />
          </>
        ) : null}
        {tab === tabs[2] ? (
          <>
            <NftCollectionInventory
              collection={id}
              list={inventoryList?.data.data ?? []}
              isLoading={isInventoryLoading}
            />
            <Pagination {...pages} onChange={handlePageChange} />
          </>
        ) : null}
      </div>
    </Content>
  )
}

NftCollectionInfo.displayName = 'NftCollectionInfo'

export default NftCollectionInfo
