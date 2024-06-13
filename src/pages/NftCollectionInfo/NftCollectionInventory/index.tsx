import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from '../../../components/Link'
import { getImgFromSporeCell } from '../../../utils/spore'
import { ReactComponent as Cover } from '../../../assets/nft_cover.svg'
import styles from './styles.module.scss'
import { getPrimaryColor } from '../../../constants/common'
import { explorerService } from '../../../services/ExplorerService'
import { formatNftDisplayId, handleNftImgError, hexToBase64, patchMibaoImg } from '../../../utils/util'
import type { NFTItem } from '../../../services/ExplorerService/fetcher'

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

  const renderCover = (item: NFTItem) => {
    const coverUrl = item.icon_url ?? info?.icon_url
    const cell = item?.cell
    const standard = item?.standard
    if (item.dob) {
      const { dob } = item

      const src = dob.asset?.startsWith('0x')
        ? `data:${dob.media_type};base64,${hexToBase64(dob.asset.slice(2))}`
        : dob.asset

      return (
        <img
          src={src}
          alt="cover"
          loading="lazy"
          className={styles.cover}
          style={{
            background: dob['prev.bgcolor'] ?? 'transparent',
          }}
        />
      )
    }

    if (standard === 'spore' && cell && cell.data) {
      const img = getImgFromSporeCell(cell.data)
      return <img src={img} alt="cover" loading="lazy" className={styles.cover} />
    }

    if (coverUrl) {
      return (
        <img
          src={`${patchMibaoImg(coverUrl)}?size=small&tid=${item.token_id}`}
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
    <div className={styles.list}>
      {list.map(item => {
        const itemId = formatNftDisplayId(item.token_id, item.standard)
        const itemLink = `/nft-info/${collection}/${itemId}`
        return (
          <div key={item.id} className={styles.item}>
            <Link to={itemLink}>{renderCover(item)}</Link>
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
