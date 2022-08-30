import type { AxiosResponse } from 'axios'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Tooltip } from 'antd'
import { v2AxiosIns } from '../../service/http/fetcher'
import i18n from '../../utils/i18n'
import styles from './styles.module.scss'
import { handleNftImgError } from '../../utils/util'
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {data?.data.icon_url ? (
          <img src={data.data.icon_url} alt="logo" className={styles.logo} onError={handleNftImgError} />
        ) : (
          <img alt="logo" src="/images/nft_placeholder" />
        )}
        <span>{isLoading ? i18n.t(`nft.loading`) : data?.data.name}</span>
      </div>
      <div className={styles.desc}>{data?.data.description}</div>
      <dl>
        <dt>{i18n.t(`nft.standard`)}</dt>
        <dd>
          {isLoading ? i18n.t(`nft.loading`) : null}
          {!isLoading && data?.data.standard ? i18n.t(`nft.${data?.data.standard}`) : `-`}
        </dd>
      </dl>
      <dl>
        <dt>{i18n.t(`nft.holder_and_mint_count`)}</dt>
        <dd>
          {isLoading
            ? i18n.t(`nft.loading`)
            : `${(data?.data.holders_count ?? 0).toLocaleString('en')}/${(data?.data.items_count ?? 0).toLocaleString(
                'en',
              )}`}
        </dd>
      </dl>
      <dl>
        <dt>{i18n.t(`nft.minter_address`)}</dt>
        <dd>
          {isLoading ? i18n.t(`nft.loading`) : null}

          {!isLoading && data?.data.creator ? (
            <Tooltip title={data?.data.creator}>
              <Link
                to={`/address/${data?.data.creator}`}
                title={data?.data.creator}
                className="monospace"
                style={{
                  color: primaryColor,
                  fontWeight: 700,
                }}
              >{`${data?.data.creator.slice(0, 12)}...${data?.data.creator.slice(-12)}`}</Link>
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
