import type { AxiosResponse } from 'axios'
import { Link, useParams, useLocation, useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Tooltip } from 'antd'
import i18n from '../../utils/i18n'
import NftItemTransfers, { TransferListRes } from '../../components/NftItemTransfers'
import Pagination from '../../components/Pagination'
import { ReactComponent as Cover } from '../../assets/nft_cover.svg'
import { v2AxiosIns } from '../../service/http/fetcher'
import { getPrimaryColor } from '../../constants/common'
import styles from './styles.module.scss'

const primaryColor = getPrimaryColor()

const NftInfo = () => {
  const { id, collection } = useParams<Record<'collection' | 'id', string>>()
  const { search } = useLocation()
  const history = useHistory()
  const q = new URLSearchParams(search)
  const page = q.get('page') ?? '1'
  const { data } = useQuery<
    AxiosResponse<{
      id: number
      collection_id: number
      token_id: string
      name: string | null
      icon_url: string | null
      owner: string | null
      metadata_url: string | null
      collection: {
        id: number
        standard: string
        name: string
        creator: string
      }
    }>
  >(['nft-item-info', collection, id], () => v2AxiosIns(`nft/collections/${collection}/items/${id}`))

  const { isLoading: isTransferListLoading, data: transferListRes } = useQuery<AxiosResponse<TransferListRes>>(
    ['nft-item-transfer-list', collection, id, page],
    () =>
      v2AxiosIns(`/nft/transfers`, {
        params: {
          page,
          collection_id: collection,
          token_id: id,
        },
      }),
  )

  const handlePageChange = (pageNo: number) => {
    if (pageNo === +page) {
      return
    }
    history.push(`/nft-info/${collection}/${id}?page=${pageNo}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.overview}>
        <Cover className={styles.cover} />
        <div>
          <div className={styles.name}>{data ? `${data.data.collection.name} #${data.data.token_id}` : '-'}</div>
          <div className={styles.items}>
            <dl>
              <dt>Owner</dt>
              <dd>
                {data?.data.owner ? (
                  <Link
                    to={`/address/${data.data.owner}`}
                    style={{
                      fontWeight: 700,
                      color: primaryColor,
                    }}
                  >
                    <Tooltip title={data.data.owner}>
                      <span className="monospace">{`${data.data.owner.slice(0, 8)}...${data.data.owner.slice(
                        -8,
                      )}`}</span>
                    </Tooltip>
                  </Link>
                ) : (
                  '-'
                )}
              </dd>
            </dl>
            <dl>
              <dt>Creator</dt>
              <dd>
                {data?.data.collection.creator ? (
                  <Link
                    to={`/address/${data.data.collection.creator}`}
                    style={{
                      fontWeight: 700,
                      color: primaryColor,
                    }}
                  >
                    <Tooltip title={data.data.collection.creator}>
                      <span className="monospace">{`${data.data.collection.creator.slice(
                        0,
                        8,
                      )}...${data.data.collection.creator.slice(-8)}`}</span>
                    </Tooltip>
                  </Link>
                ) : (
                  '-'
                )}
              </dd>
            </dl>
            <dl>
              <dt>Token ID</dt>
              <dd>{`#${data?.data.token_id}`}</dd>
            </dl>
            <dl>
              <dt>Token Type</dt>
              <dd>{data ? i18n.t(`nft.${data.data.collection.standard}`) : '-'}</dd>
            </dl>
          </div>
        </div>
      </div>
      <div>
        <div className={styles.tab}>{i18n.t(`nft.activity`)}</div>
        <NftItemTransfers list={transferListRes?.data.data ?? []} isLoading={isTransferListLoading} />
        <Pagination
          currentPage={transferListRes?.data.pagination.page ?? 1}
          totalPages={transferListRes?.data.pagination.last ?? 1}
          onChange={handlePageChange}
        />
      </div>
    </div>
  )
}

NftInfo.displayName = 'NftInfo'

export default NftInfo
