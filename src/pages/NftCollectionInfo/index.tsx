import type { AxiosResponse } from 'axios'
import { Link, useParams, useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Popover } from 'antd'
import Content from '../../components/Content'
import Pagination from '../../components/Pagination'
import NftHolderList from '../../components/NftHolderList'
import NftCollectionOverview from '../../components/NftCollectionOverview'
import NftCollectionTransfers from '../../components/NftCollectionTransfers'
import NftCollectionInventory from '../../components/NftCollectionInventory'
import Filter from '../../components/Search/Filter'
import { ReactComponent as FilterIcon } from '../../assets/filter_icon.svg'
import { ReactComponent as SelectedCheckIcon } from '../../assets/selected_check_icon.svg'
import { explorerService } from '../../services/ExplorerService'
import i18n from '../../utils/i18n'
import { useSearchParams, useIsMobile } from '../../utils/hook'
import styles from './styles.module.scss'
import { CsvExport } from '../../components/CsvExport'
import PaginationWithRear from '../../components/PaginationWithRear'

export interface InventoryRes {
  data: Array<{
    id: number
    collection_id: number
    icon_url: string | null
    owner_id: number
    token_id: string
    standard: string
    cell: {
      cell_index: number
      data: string
      status: string
      tx_hash: string
    } | null
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
    standard: string | null
    cell: {
      cell_index: number
      data: string
      status: string
      tx_hash: string
    } | null
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
const filterList: Array<Record<'title' | 'value', string>> = [
  {
    value: 'mint',
    title: i18n.t('udt.view-mint-txns'),
  },
  {
    value: 'normal',
    title: i18n.t('udt.view-transfer-txns'),
  },
  {
    value: 'destruction',
    title: i18n.t('udt.view-burn-txns'),
  },
]
const PAGE_SIZE = 50

const NftCollectionInfo = () => {
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const { tab = tabs[0], page = '1' } = useSearchParams('tab', 'page', 'tx_type')
  const { type, filter, sort } = useSearchParams('type', 'filter', 'sort')
  const isMobile = useIsMobile()

  const isFilteredByType = filterList.some(f => f.value === type)

  const { isLoading: isTransferListLoading, data: transferListRes } = useQuery<AxiosResponse<TransferListRes>>(
    ['nft-collection-transfer-list', id, page, filter, type],
    () =>
      explorerService.api.requesterV2(`/nft/transfers`, {
        params: {
          page,
          collection_id: id,
          transfer_action: isFilteredByType ? type : null,
          address_hash: filter?.startsWith('0x') ? null : filter,
          tx_hash: filter?.startsWith('0x') ? filter : null,
        },
      }),
    {
      enabled: tab === tabs[0],
    },
  )
  const { isLoading: isHolderListLoading, data: rawHolderList } = useQuery<AxiosResponse<HolderListRes>>(
    ['nft-collection-holder-list', id, page, sort, filter],
    () =>
      explorerService.api.requesterV2(`/nft/collections/${id}/holders`, {
        params: {
          page,
          sort,
          address_hash: filter || null,
        },
      }),
    {
      enabled: tab === tabs[1],
    },
  )

  const { isLoading: isInventoryLoading, data: inventoryList } = useQuery<AxiosResponse<InventoryRes>>(
    ['nft-collection-inventory', id, page],
    () =>
      explorerService.api.requesterV2(`/nft/collections/${id}/items`, {
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
    const query = Object.fromEntries(new URLSearchParams(history.location.search))
    history.push(`/nft-collections/${id}?${new URLSearchParams({ ...query, page: pageNo.toString() }).toString()}`)
  }

  const holderList = rawHolderList
    ? Object.keys(rawHolderList.data.data)
        .map(addr => ({
          addr,
          quantity: rawHolderList.data.data[addr],
        }))
        .sort((h1, h2) => {
          if (sort === 'quantity.asc') {
            return h1.quantity - h2.quantity
          }
          return h2.quantity - h1.quantity
        })
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

  return (
    <Content>
      <NftCollectionOverview id={id} />
      <div className={styles.container}>
        <div className={styles.navigation}>
          <div className={styles.tabs}>
            <Link to={`/nft-collections/${id}?tab=${tabs[0]}`} data-is-active={tab === tabs[0]}>
              {i18n.t(`nft.activity`)}
            </Link>
            <Link to={`/nft-collections/${id}?tab=${tabs[1]}`} data-is-active={tab === tabs[1]}>
              {i18n.t(`nft.holder-list`)}
            </Link>
            <Link to={`/nft-collections/${id}?tab=${tabs[2]}`} data-is-active={tab === tabs[2]}>
              {i18n.t(`nft.inventory`)}
            </Link>
          </div>

          <div className={styles.filters}>
            {tabs.slice(0, 2).includes(tab) ? (
              <Filter
                defaultValue={filter}
                showReset={!!filter}
                placeholder={i18n.t(tab === tabs[0] ? 'udt.address-or-hash' : 'udt.address')}
                onFilter={filter => {
                  history.push(`/nft-collections/${id}?${new URLSearchParams({ tab, filter })}`)
                }}
                onReset={() => {
                  history.push(`/nft-collections/${id}?${new URLSearchParams({ tab })}`)
                }}
              />
            ) : null}
            {tab === tabs[0] && (
              <div className={styles.typeFilter} data-is-active={isFilteredByType}>
                <Popover
                  placement="bottomRight"
                  trigger={isMobile ? 'click' : 'hover'}
                  overlayClassName={styles.antPopover}
                  content={
                    <div className={styles.filterItems}>
                      {filterList.map(f => (
                        <Link
                          key={f.value}
                          to={`/nft-collections/${id}?${new URLSearchParams({ type: f.value })}`}
                          data-is-active={f.value === type}
                        >
                          {f.title}
                          <SelectedCheckIcon />
                        </Link>
                      ))}
                    </div>
                  }
                >
                  <FilterIcon />
                </Popover>
              </div>
            )}
          </div>
        </div>
        {tab === tabs[0] ? (
          <>
            <NftCollectionTransfers
              list={transferListRes?.data.data ?? []}
              isLoading={isTransferListLoading}
              collection={id}
            />
            <PaginationWithRear
              currentPage={transferListRes?.data.pagination.page ?? 1}
              totalPages={transferListRes?.data.pagination.last ?? 1}
              onChange={handlePageChange}
              rear={<CsvExport type="nft" id={id} />}
            />
          </>
        ) : null}
        {tab === tabs[1] ? (
          <>
            <NftHolderList
              list={holderList?.slice((+page - 1) * PAGE_SIZE, +page * PAGE_SIZE) ?? []}
              isLoading={isHolderListLoading}
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
