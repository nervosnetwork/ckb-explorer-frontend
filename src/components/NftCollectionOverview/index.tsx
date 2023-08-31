import type { AxiosResponse } from 'axios'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Tooltip } from 'antd'
import { v2AxiosIns } from '../../service/http/fetcher'
import i18n from '../../utils/i18n'
import styles from './styles.module.scss'
import { handleNftImgError, patchMibaoImg } from '../../utils/util'
import { getPrimaryColor } from '../../constants/common'

const primaryColor = getPrimaryColor()

interface InfoRes {
  id: number
  standard: string
  name: string
  description: string
  creator: string | null
  icon_url: string | null
  items_count: number | null
  holders_count: number | null
}

const NftCollectionOverview = ({ id }: { id: string }) => {
  const { isLoading, data } = useQuery<AxiosResponse<InfoRes>>(['collection-info', id], () =>
    v2AxiosIns(`nft/collections/${id}`),
  )
  const info = data?.data

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
        <span>{isLoading ? i18n.t(`nft.loading`) : info?.name}</span>
      </div>
      <div className={styles.desc}>{info?.description}</div>
      <dl>
        <dt>{i18n.t(`nft.standard`)}</dt>
        <dd>
          {isLoading ? i18n.t(`nft.loading`) : null}
          {!isLoading && info?.standard ? i18n.t(`nft.${info?.standard}`) : `-`}
        </dd>
      </dl>
      <dl>
        <dt>
          {i18n.t('nft.holder')}/{i18n.t('nft.minted')}
        </dt>
        <dd>
          {isLoading
            ? i18n.t(`nft.loading`)
            : `${(info?.holders_count ?? 0).toLocaleString('en')}/${(info?.items_count ?? 0).toLocaleString('en')}`}
        </dd>
      </dl>
      <dl>
        <dt>{i18n.t(`nft.minter_address`)}</dt>
        <dd>
          {isLoading ? i18n.t(`nft.loading`) : null}

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
