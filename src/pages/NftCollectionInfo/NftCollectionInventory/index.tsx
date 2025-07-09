import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from '../../../components/Link'
import styles from './styles.module.scss'
import { getPrimaryColor } from '../../../constants/common'
import { type NFTItem, explorerService } from '../../../services/ExplorerService'
import { formatNftDisplayId } from '../../../utils/util'
import Cover from '../ItemCover'

const primaryColor = getPrimaryColor()

const NftCollectionInventory: React.FC<{
  list: NFTItem[]
  collection: string
  isLoading: boolean
}> = ({ list, collection, isLoading }) => {
  const { t } = useTranslation()
  const { data: info } = useQuery(['collection-info', collection], () =>
    explorerService.api.fetchNFTCollection(collection),
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
        {isLoading ? t('nft.loading') : t(`nft.no_record`)}
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {list.map(item => {
        const itemId = formatNftDisplayId(item.token_id, item.standard)
        const itemLink = `/${item.standard === 'spore' ? 'dob' : 'nft'}-info/${collection}/${itemId}`
        return (
          <div key={item.id} className={styles.item}>
            <Link to={itemLink}>
              <Cover item={item} info={info} />
            </Link>
            <div className={styles.tokenId}>
              <span>Token ID</span>
              <Link
                to={itemLink}
                style={{
                  color: primaryColor,
                }}
              >
                {itemId}
              </Link>
            </div>
            <div className={styles.owner}>
              <span>{t(`nft.owner`)}</span>
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
