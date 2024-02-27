import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { parseSporeCellData } from '../../../utils/spore'
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

    if (standard === 'spore' && cell && cell.data) {
      const sporeData = parseSporeCellData(cell.data)
      if (sporeData.contentType.slice(0, 5) === 'image') {
        const base64data = hexToBase64(sporeData.content)

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
        const itemLink = `/nft-info/${collection}/${item.token_id}`
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
                {formatNftDisplayId(item.token_id, item.standard)}
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
