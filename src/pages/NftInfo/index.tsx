import type { AxiosResponse } from 'axios'
import { Link, useParams, useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Tooltip } from 'antd'
import i18n from '../../utils/i18n'
import NftItemTransfers, { TransferListRes } from '../../components/NftItemTransfers'
import Pagination from '../../components/Pagination'
import { ReactComponent as Cover } from '../../assets/nft_cover.svg'
import { v2AxiosIns } from '../../service/http/fetcher'
import { getPrimaryColor } from '../../constants/common'
import styles from './styles.module.scss'
import { patchMibaoImg, handleNftImgError } from '../../utils/util'
import { useSearchParams } from '../../utils/hook'

const primaryColor = getPrimaryColor()

const NftInfo = () => {
  const { id, collection } = useParams<Record<'collection' | 'id', string>>()
  const history = useHistory()
  const { page = '1' } = useSearchParams('page')
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
        icon_url: string
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
  const coverUrl = data?.data.icon_url || data?.data.collection.icon_url

  return (
    <div className={styles.container}>
      <div className={styles.overview}>
        {coverUrl ? (
          <img
            src={`${patchMibaoImg(coverUrl)}?size=medium&tid=${data?.data.token_id}`}
            alt="cover"
            loading="lazy"
            className={styles.cover}
            onError={handleNftImgError}
          />
        ) : (
          <Cover className={styles.cover} />
        )}
        <div className={styles.info}>
          <div className={styles.name}>{data ? `${data.data.collection.name} #${data.data.token_id}` : '-'}</div>
          <div className={styles.items}>
            <dl>
              <dt>{i18n.t('nft.owner')}</dt>
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
                      <span className="monospace">{`${data.data.owner.slice(0, 12)}...${data.data.owner.slice(
                        -12,
                      )}`}</span>
                    </Tooltip>
                  </Link>
                ) : (
                  '-'
                )}
              </dd>
            </dl>
            <dl>
              <dt>{i18n.t('nft.minter_address')}</dt>
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
                        12,
                      )}...${data.data.collection.creator.slice(-12)}`}</span>
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
              <dt>{i18n.t('nft.standard')}</dt>
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
