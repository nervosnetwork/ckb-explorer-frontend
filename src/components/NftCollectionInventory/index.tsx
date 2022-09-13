import type { AxiosResponse } from 'axios'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { ReactComponent as Cover } from '../../assets/nft_cover.svg'
import i18n from '../../utils/i18n'
import styles from './styles.module.scss'
import { getPrimaryColor } from '../../constants/common'
import { v2AxiosIns } from '../../service/http/fetcher'
import { handleNftImgError, patchMibaoImg } from '../../utils/util'

const primaryColor = getPrimaryColor()

const NftCollectionInventory: React.FC<{
  list: Array<{
    icon_url: string | null
    id: number
    token_id: string
    owner?: string
  }>
  collection: string
  isLoading: boolean
}> = ({ list, collection, isLoading }) => {
  const { data: info } = useQuery<AxiosResponse<{ icon_url: string | null }>>(['collection-info', collection], () =>
    v2AxiosIns(`nft/collections/${collection}`),
  )

  if (!list.length) {
    return (
      <div
        className={styles.list}
        style={{
          textAlign: 'center',
          padding: '30px',
          marginBottom: '4px',
          gridTemplateColumns: 'auto',
        }}
      >
        {isLoading ? i18n.t('nft.loading') : i18n.t(`nft.no_record`)}
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {list.map(item => {
        const itemLink = `/nft-info/${collection}/${item.token_id}`
        const coverUrl = item.icon_url ?? info?.data.icon_url
        return (
          <div key={item.id} className={styles.item}>
            <Link to={itemLink}>
              {coverUrl ? (
                <img
                  src={`${patchMibaoImg(coverUrl)}?size=small&tid=${item.token_id}`}
                  alt="cover"
                  loading="lazy"
                  className={styles.cover}
                  onError={handleNftImgError}
                />
              ) : (
                <Cover className={styles.cover} />
              )}
            </Link>
            <div className={styles.tokenId}>
              <span>Token ID</span>
              <Link
                to={itemLink}
                style={{
                  color: primaryColor,
                }}
              >
                {item.token_id}
              </Link>
            </div>
            <div className={styles.owner}>
              <span>{i18n.t(`nft.owner`)}</span>
              {item.owner ? (
                <Link
                  to={`/address/${item.owner}`}
                  style={{
                    color: primaryColor,
                    fontWeight: 700,
                  }}
                  title={item.owner}
                >
                  <span className="monospace">{item.owner}</span>
                </Link>
              ) : (
                '-'
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

NftCollectionInventory.displayName = 'NftCollectionInventory'

export default NftCollectionInventory
