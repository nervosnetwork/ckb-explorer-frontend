import type { AxiosResponse } from 'axios'
import { useParams, useLocation, useHistory, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import Content from '../../components/Content'
import Pagination from '../../components/Pagination'
import NftHolderList from '../../components/NftHolderList'
import NftCollectionOverview from '../../components/NftCollectionOverview'
import NftCollectionTransfers from '../../components/NftCollectionTransfers'
import { v2AxiosIns } from '../../service/http/fetcher'
import i18n from '../../utils/i18n'
import styles from './styles.module.scss'
import NftCollectionInventory from '../../components/NftCollectionInventory'

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

export interface TransferListRes {
  data: Array<{
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
  }>
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
const NftCollectionInfo = () => {
  const { id } = useParams<{ id: string }>()
  const { search } = useLocation()
  const history = useHistory()
  const q = new URLSearchParams(search)
  const page = q.get('page') ?? '1'
  const tab = q.get('tab') ?? tabs[0]

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
    ['nft-collection-holder-list', id],
    () => v2AxiosIns(`/nft/collections/${id}/holders`),
    {
      enabled: tab === tabs[1],
    },
  )
  const { isLoading: isInventoryLoading, data: inventoryList } = useQuery<AxiosResponse<InventoryRes>>(
    ['nft-collection-inventory', id],
    () => v2AxiosIns(`/nft/collections/${id}/items`),
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
        </div>
        {tab === tabs[0] ? (
          <>
            <NftCollectionTransfers list={transferListRes?.data.data ?? []} isLoading={isTransferListLoading} />
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
              list={holderList.slice((+page - 1) * PAGE_SIZE, +page * PAGE_SIZE)}
              isLoading={isHolderListLoading}
            />
            <Pagination
              currentPage={+page}
              totalPages={Math.ceil(holderList.length / PAGE_SIZE) ?? 1}
              onChange={handlePageChange}
            />
          </>
        ) : null}
        {tab === tabs[2] ? (
          <>
            <NftCollectionInventory hash={id} list={inventoryList?.data.data ?? []} isLoading={isInventoryLoading} />
            <Pagination
              currentPage={transferListRes?.data.pagination.page ?? 1}
              totalPages={transferListRes?.data.pagination.last ?? 1}
              onChange={handlePageChange}
            />
          </>
        ) : null}
      </div>
    </Content>
  )
}

NftCollectionInfo.displayName = 'NftCollectionInfo'

export default NftCollectionInfo
