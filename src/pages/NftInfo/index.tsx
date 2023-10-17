import type { AxiosResponse } from 'axios'
import { Link, useParams, useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Tooltip } from 'antd'
import { Base64 } from 'js-base64'
import { hexToBytes } from '@nervosnetwork/ckb-sdk-utils'
import { useTranslation } from 'react-i18next'
import NftItemTransfers, { TransferListRes } from '../../components/NftItemTransfers'
import Pagination from '../../components/Pagination'
import { ReactComponent as Cover } from '../../assets/nft_cover.svg'
import { explorerService } from '../../services/ExplorerService'
import { getPrimaryColor } from '../../constants/common'
import styles from './styles.module.scss'
import { patchMibaoImg, handleNftImgError } from '../../utils/util'
import { parseSporeCellData } from '../../utils/spore'
import { useSearchParams } from '../../utils/hook'

const primaryColor = getPrimaryColor()

const NftInfo = () => {
  const { id, collection } = useParams<Record<'collection' | 'id', string>>()
  const history = useHistory()
  const { t } = useTranslation()
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
      standard: string | null
      cell: {
        status: string
        tx_hash: string
        cell_index: number
        data: string | null
      } | null
      collection: {
        id: number
        standard: string
        name: string
        creator: string
        icon_url: string
      }
    }>
  >(['nft-item-info', collection, id], () =>
    explorerService.api.requesterV2(`nft/collections/${collection}/items/${id}`),
  )

  const { isLoading: isTransferListLoading, data: transferListRes } = useQuery<AxiosResponse<TransferListRes>>(
    ['nft-item-transfer-list', collection, id, page],
    () =>
      explorerService.api.requesterV2(`/nft/transfers`, {
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

  const renderCover = () => {
    const cell = data?.data.cell
    const standard = data?.data.standard

    if (standard === 'spore' && cell && cell.data) {
      const sporeData = parseSporeCellData(cell.data)
      if (sporeData.contentType.slice(0, 5) === 'image') {
        const base64data = Base64.fromUint8Array(hexToBytes(`0x${sporeData.content}`))

        return (
          <img
            src={`data:${sporeData.contentType};base64,${base64data}`}
            alt="cover"
            loading="lazy"
            className={styles.cover}
          />
        )
      }
    }

    if (coverUrl) {
      return (
        <img
          src={`${patchMibaoImg(coverUrl)}?size=medium&tid=${data?.data.token_id}`}
          alt="cover"
          loading="lazy"
          className={styles.cover}
          onError={handleNftImgError}
        />
      )
    }

    return <Cover className={styles.cover} />
  }

  return (
    <div className={styles.container}>
      <div className={styles.overview}>
        {renderCover()}
        <div className={styles.info}>
          <div className={styles.name}>{data ? `${data.data.collection.name} #${data.data.token_id}` : '-'}</div>
          <div className={styles.items}>
            <dl>
              <dt>{t('nft.owner')}</dt>
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
              <dt>{t('nft.minter_address')}</dt>
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
              <dt>{t('nft.standard')}</dt>
              <dd>{data ? t(`nft.${data.data.collection.standard}`) : '-'}</dd>
            </dl>
          </div>
        </div>
      </div>
      <div>
        <div className={styles.tab}>{t(`nft.activity`)}</div>
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
