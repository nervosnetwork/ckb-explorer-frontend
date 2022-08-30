import { Link } from 'react-router-dom'
import { ReactComponent as Cover } from '../../assets/nft_cover.svg'
import i18n from '../../utils/i18n'
import styles from './styles.module.scss'
import { getPrimaryColor } from '../../constants/common'
import { handleNftImgError } from '../../utils/util'

const primaryColor = getPrimaryColor()

const NftCollectionInventory: React.FC<{
  list: Array<{
    icon_url: string | null
    id: number
    token_id: string
    owner?: string
  }>
  hash: string
  isLoading: boolean
}> = ({ list, hash, isLoading }) => {
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
        return (
          <div key={item.id} className={styles.item}>
            <div>
              {item.icon_url ? (
                <img
                  src={item.icon_url}
                  alt="cover"
                  loading="lazy"
                  className={styles.cover}
                  onError={handleNftImgError}
                />
              ) : (
                <Cover className={styles.cover} />
              )}
            </div>
            <div className={styles.tokenId}>
              <span>Token ID</span>
              <Link
                to={`/nft-info/${hash}/${item.token_id}`}
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
