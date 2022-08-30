import type { AxiosResponse } from 'axios'
import { useLocation, useHistory, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import Content from '../../components/Content'
import Pagination from '../../components/Pagination'
import { v2AxiosIns } from '../../service/http/fetcher'
import i18n from '../../utils/i18n'
import styles from './styles.module.scss'
import { udtSubmitEmail } from '../../utils/util'
import { getPrimaryColor } from '../../constants/common'

const primaryColor = getPrimaryColor()

interface Res {
  data: Array<{
    id: number
    standard: string
    name: string
    description: string
    creator_id: string | null
    icon_url: string | null
    items_count: number | null
    holders_count: number | null
  }>
  pagination: {
    count: number
    page: number
    next: number | null
    prev: number | null
    last: number
  }
}

const submitTokenInfoUrl = udtSubmitEmail()

const NftCollections = () => {
  const { search } = useLocation()
  const history = useHistory()
  const q = new URLSearchParams(search)
  const page = q.get('page') ?? '1'

  const { isLoading, data } = useQuery<AxiosResponse<Res>>(['nft-collections', page], () =>
    v2AxiosIns('nft/collections', {
      params: {
        page,
      },
    }),
  )

  const handlePageChange = (pageNo: number) => {
    if (pageNo === +page) {
      return
    }
    history.push(`/nft-collections?page=${pageNo}`)
  }

  return (
    <Content>
      <div className={styles.container}>
        <div className={styles.header}>
          <h5>{i18n.t('nft.nft_collection')}</h5>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={submitTokenInfoUrl}
            style={{
              color: primaryColor,
            }}
          >
            {i18n.t('udt.submit_token_info')}
          </a>
        </div>
        <div className={styles.list}>
          <table>
            <thead>
              <tr>
                <th>{i18n.t('nft.collection_name')}</th>
                <th>{i18n.t('nft.standard')}</th>
                <th>{i18n.t('nft.holder_and_mint_count')}</th>
                <th>{i18n.t('nft.minter_address')}</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.data.length ? (
                data?.data.data.map(item => {
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className={styles.name}>
                          {item.icon_url ? (
                            <img src={item.icon_url} alt="cover" loading="lazy" className={styles.icon} />
                          ) : (
                            <div className={styles.defaultIcon}>{item.name?.slice(0, 1)}</div>
                          )}
                          <Link
                            to={`/nft-collections/${item.id}`}
                            title={item.name}
                            style={{
                              color: primaryColor,
                            }}
                          >
                            {item.name}
                          </Link>
                        </div>
                      </td>
                      <td>{i18n.t(`nft.${item.standard}`)}</td>
                      <td>{`${(item.holders_count ?? 0).toLocaleString('en')}/${(item.items_count ?? 0).toLocaleString(
                        'en',
                      )}`}</td>
                      <td>
                        <div>
                          {item.creator_id ? (
                            <a href={`/address/${item.creator_id}`} title={item.creator_id}>{`${item.creator_id.slice(
                              0,
                              8,
                            )}...${item.creator_id.slice(-8)}`}</a>
                          ) : (
                            '-'
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className={styles.noRecord}>
                    {isLoading ? 'loading' : i18n.t(`nft.no_record`)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={data?.data.pagination.page ?? 1}
          totalPages={data?.data.pagination.last ?? 0}
          onChange={handlePageChange}
        />
      </div>
    </Content>
  )
}

NftCollections.displayName = 'NftCollections'

export default NftCollections
