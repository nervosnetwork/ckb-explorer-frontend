import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from '../../../components/Link'
import { explorerService } from '../../../services/ExplorerService'
import styles from './styles.module.scss'
import { handleNftImgError, patchMibaoImg } from '../../../utils/util'
import { getPrimaryColor } from '../../../constants/common'
import NFTTag from '../../../components/NFTTag'
import { DEPRECATED_DOB_COLLECTION } from '../../../constants/marks'
import Annotation from '../../../components/Annotation'
import Tooltip from '../../../components/Tooltip'

const primaryColor = getPrimaryColor()

// TODO: add docs of this id
const UNIQUE_ITEMS_CLUSTER_ID = '0xcf9e0cdbd169550492b29d3d1181d27048ab80126b797840965d2864607a892d'

const NftCollectionOverview = ({ id }: { id: string }) => {
  const { t } = useTranslation()
  const { isLoading, data: info } = useQuery(['collection-info', id], () => explorerService.api.fetchNFTCollection(id))

  const standard = info?.standard === 'spore' ? 'dob' : info?.standard

  const desc = useMemo(() => {
    if (!info?.description) return '-'
    try {
      const parsed = JSON.parse(info.description)
      if ('description' in parsed)
        return typeof parsed.description === 'object' ? JSON.stringify(parsed.description) : parsed.description
      return info.description
    } catch {
      return info.description
    }
  }, [info?.description])

  const annotation = DEPRECATED_DOB_COLLECTION.find(item => item.id === id)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {info?.icon_url ? (
          <img
            src={`${patchMibaoImg(info.icon_url)}?size=small`}
            alt="logo"
            className={styles.logo}
            onError={handleNftImgError}
            loading="lazy"
          />
        ) : (
          <img
            alt="logo"
            src={info?.standard === 'spore' ? '/images/spore_placeholder.svg' : '/images/nft_placeholder.png'}
            loading="lazy"
          />
        )}
        <span>{isLoading ? t(`nft.loading`) : info?.name}</span>
      </div>
      <div className={styles.tags}>
        {annotation ? <Annotation content={annotation.reason} /> : null}
        {isLoading ? t('nft.loading') : info?.tags.map(tag => <NFTTag key={tag} tagName={tag} to="/nft-collections" />)}
      </div>
      <div className={styles.desc}>{desc}</div>
      <dl>
        <dt>{t(`nft.standard`)}</dt>
        <dd>
          {isLoading ? t(`nft.loading`) : null}
          {!isLoading && standard ? t(`nft.${standard}`) : `-`}
        </dd>
      </dl>
      <dl>
        <dt>
          {t('nft.holder')}/{t('nft.minted')}
        </dt>
        <dd>
          {isLoading
            ? t(`nft.loading`)
            : `${(info?.holders_count ?? 0).toLocaleString('en')}/${(info?.items_count ?? 0).toLocaleString('en')}`}
        </dd>
      </dl>
      {id === UNIQUE_ITEMS_CLUSTER_ID ? null : (
        <dl>
          <dt>{t(`nft.minter_address`)}</dt>
          <dd>
            {isLoading ? t(`nft.loading`) : null}

            {!isLoading && info?.creator ? (
              <Tooltip
                trigger={
                  <Link
                    to={`/address/${info.creator}`}
                    title={info.creator}
                    className="monospace"
                    style={{
                      color: primaryColor,
                      fontWeight: 700,
                    }}
                  >{`${info.creator.slice(0, 12)}...${info.creator.slice(-12)}`}</Link>
                }
              >
                {info.creator}
              </Tooltip>
            ) : (
              '-'
            )}
          </dd>
        </dl>
      )}
      {info?.standard === 'spore' && id !== UNIQUE_ITEMS_CLUSTER_ID ? (
        <dl>
          <dt>{t(`nft.cluster_id`)}</dt>
          <dd>
            {isLoading ? t(`nft.loading`) : null}

            {!isLoading && info?.type_script?.args ? (
              <Tooltip
                trigger={
                  <span title={info.type_script.args} className="monospace">{`${info.type_script.args.slice(
                    0,
                    12,
                  )}...${info.type_script.args.slice(-12)}`}</span>
                }
              >
                {info.type_script.args}
              </Tooltip>
            ) : (
              '-'
            )}
          </dd>
        </dl>
      ) : null}
    </div>
  )
}

NftCollectionOverview.displayName = 'NftCollectionOverview'

export default NftCollectionOverview
