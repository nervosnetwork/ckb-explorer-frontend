import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { explorerService } from '../../../services/ExplorerService'
import styles from './styles.module.scss'
import { handleNftImgError, patchMibaoImg } from '../../../utils/util'
import { getPrimaryColor } from '../../../constants/common'

const primaryColor = getPrimaryColor()

const NftCollectionOverview = ({ id }: { id: string }) => {
  const { t } = useTranslation()
  const { isLoading, data: info } = useQuery(['collection-info', id], () => explorerService.api.fetchNFTCollection(id))

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
          <img alt="logo" src="/images/nft_placeholder.png" loading="lazy" />
        )}
        <span>{isLoading ? t(`nft.loading`) : info?.name}</span>
      </div>
      <div className={styles.desc}>{info?.description}</div>
      <dl>
        <dt>{t(`nft.standard`)}</dt>
        <dd>
          {isLoading ? t(`nft.loading`) : null}
          {!isLoading && info?.standard ? t(`nft.${info?.standard}`) : `-`}
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
      <dl>
        <dt>{t(`nft.minter_address`)}</dt>
        <dd>
          {isLoading ? t(`nft.loading`) : null}

          {!isLoading && info?.creator ? (
            <Tooltip title={info.creator}>
              <Link
                to={`/address/${info.creator}`}
                title={info.creator}
                className="monospace"
                style={{
                  color: primaryColor,
                  fontWeight: 700,
                }}
              >{`${info.creator.slice(0, 12)}...${info.creator.slice(-12)}`}</Link>
            </Tooltip>
          ) : (
            '-'
          )}
        </dd>
      </dl>
    </div>
  )
}

NftCollectionOverview.displayName = 'NftCollectionOverview'

export default NftCollectionOverview
