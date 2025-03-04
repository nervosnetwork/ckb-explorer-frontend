import { useParams, useHistory } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from '../../components/Link'
import NftItemTransfers from './NftItemTransfers'
import Pagination from '../../components/Pagination'
import { explorerService } from '../../services/ExplorerService'
import { getPrimaryColor } from '../../constants/common'
import styles from './styles.module.scss'
import { useSearchParams } from '../../hooks'
import DobTraits from '../../components/DobTraits'
import { DEPRECATED_DOB_COLLECTION } from '../../constants/marks'
import Annotation from '../../components/Annotation'
import Cover from './Cover'
import { ReactComponent as NameMissing } from './NameMissing.svg'
import { formatNftDisplayId } from '../../utils/util'

const primaryColor = getPrimaryColor()
const UNIQUE_ITEM_LABEL = 'Unique Item'

const NftInfo = () => {
  const { id, collection } = useParams<Record<'collection' | 'id', string>>()
  const history = useHistory()
  const {
    t,
    i18n: { language },
  } = useTranslation()

  const { page = '1' } = useSearchParams('page')

  const { data } = useQuery(['nft-item-info', collection, id], () =>
    explorerService.api.fetchNFTCollectionItem(collection, id),
  )

  const { isLoading: isTransferListLoading, data: transferListRes } = useQuery(
    ['nft-item-transfer-list', collection, id, page],
    () => explorerService.api.fetchNFTCollectionTransferList(collection, page, id),
  )

  const handlePageChange = (pageNo: number) => {
    if (pageNo === +page) {
      return
    }
    history.push(`/${language}/nft-info/${collection}/${id}?page=${pageNo}`)
  }

  const annotation = DEPRECATED_DOB_COLLECTION.find(item => item.id === collection)

  return (
    <div className={styles.container}>
      <div className={styles.overview}>
        <Cover item={data ?? null} />
        <div className={styles.info}>
          <div className={styles.name}>
            {data
              ? `${data.collection.name ?? UNIQUE_ITEM_LABEL} ${
                  data.standard === 'spore' ? '' : '#'
                }${formatNftDisplayId(data.token_id, data.standard)}`
              : '-'}
          </div>
          <div className={styles.items}>
            <div className={styles.item}>
              <div>{t('nft.owner')}</div>
              <div>
                {data?.owner ? (
                  <Link
                    to={`/address/${data.owner}`}
                    style={{
                      fontWeight: 700,
                      color: primaryColor,
                    }}
                  >
                    <Tooltip title={data.owner}>
                      <span className="monospace">{`${data.owner.slice(0, 12)}...${data.owner.slice(-12)}`}</span>
                    </Tooltip>
                  </Link>
                ) : (
                  '-'
                )}
              </div>
            </div>
            <div className={styles.item}>
              <div>{t('nft.minter_address')}</div>
              <div>
                {data?.collection.creator ? (
                  <Link
                    to={`/address/${data.collection.creator}`}
                    style={{
                      fontWeight: 700,
                      color: primaryColor,
                    }}
                  >
                    <Tooltip title={data.collection.creator}>
                      <span className="monospace">{`${data.collection.creator.slice(
                        0,
                        12,
                      )}...${data.collection.creator.slice(-12)}`}</span>
                    </Tooltip>
                  </Link>
                ) : (
                  '-'
                )}
              </div>
            </div>
            <div className={styles.item}>
              <div>Collection</div>
              <div>
                <Link to={`/nft-collections/${collection}`} className={styles.collection}>
                  {data?.collection.name ?? <NameMissing />}
                </Link>
              </div>
            </div>
            <div className={styles.item}>
              <div>Token ID</div>
              <div>{`${data?.standard === 'spore' ? '' : '#'}${formatNftDisplayId(
                data?.token_id ?? '',
                data?.standard ?? null,
              )}`}</div>
            </div>
            <div className={styles.item}>
              <div>{t('nft.standard')}</div>
              <div>
                {data ? t(`nft.${data.collection.standard === 'spore' ? 'dob' : data.collection.standard}`) : '-'}
              </div>
            </div>
            {data?.dob ? (
              <div className={styles.item}>
                <div>{t('nft.traits')}</div>
                <DobTraits dob={data.dob} />
              </div>
            ) : null}
            {annotation ? (
              <div className={styles.item}>
                <div>{t(`common.extra`)}</div>
                <div className={styles.extra}>
                  <Annotation content={annotation.reason} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div>
        <div className={styles.tab}>{t(`nft.activity`)}</div>
        <NftItemTransfers list={transferListRes?.data ?? []} isLoading={isTransferListLoading} />
        <Pagination
          currentPage={transferListRes?.pagination.page ?? 1}
          totalPages={transferListRes?.pagination.last ?? 1}
          onChange={handlePageChange}
        />
      </div>
    </div>
  )
}

NftInfo.displayName = 'NftInfo'

export default NftInfo
