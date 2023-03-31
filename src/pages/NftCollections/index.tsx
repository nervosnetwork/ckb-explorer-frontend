import type { AxiosResponse } from 'axios'
import { useHistory, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import Content from '../../components/Content'
import Pagination from '../../components/Pagination'
import { v2AxiosIns } from '../../service/http/fetcher'
import i18n from '../../utils/i18n'
import styles from './styles.module.scss'
import { handleNftImgError, patchMibaoImg, udtSubmitEmail } from '../../utils/util'
import { getPrimaryColor } from '../../constants/common'
import { useSearchParams, useSortParam, useUpdateSearchParams } from '../../utils/hook'

const primaryColor = getPrimaryColor()

type NftSortByType = 'holder' | 'minted'

interface Res {
  data: Array<{
    id: number
    standard: string
    name: string
    description: string
    creator: string | null
    icon_url: string | null
    items_count: number | null
    holders_count: number | null
    type_script: { code_hash: string; hash_type: 'data' | 'type'; args: string } | null
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
  const history = useHistory()
  const { page = '1' } = useSearchParams('page')

  const updateSearchParams = useUpdateSearchParams<'sort'>()
  const { sortBy, sort } = useSortParam<NftSortByType>(s => s === 'holder' || s === 'minted')

  const { isLoading, data } = useQuery<AxiosResponse<Res>>(['nft-collections', page, sort], () =>
    v2AxiosIns('nft/collections', {
      params: {
        page,
        sort,
      },
    }),
  )

  const handleSortClick = (sortRule: NftSortByType) => {
    if (sortBy === sortRule) {
      updateSearchParams(params =>
        Object.fromEntries(Object.entries(params).filter(entry => entry[0] !== 'sort' && entry[0] !== 'page')),
      )
    } else {
      updateSearchParams(params =>
        Object.fromEntries(Object.entries({ ...params, sort: sortRule }).filter(entry => entry[0] !== 'page')),
      )
    }
  }

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
                <th className={styles.holder_and_minted_header}>
                  <span
                    className={classNames({
                      [styles.sortActive]: sortBy === 'holder',
                    })}
                    onClick={() => handleSortClick('holder')}
                    aria-hidden
                  >
                    {i18n.t('nft.holder')}
                  </span>
                  /
                  <span
                    className={classNames({
                      [styles.sortActive]: sortBy === 'minted',
                    })}
                    onClick={() => handleSortClick('minted')}
                    aria-hidden
                  >
                    {i18n.t('nft.minted')}
                  </span>
                </th>
                <th>{i18n.t('nft.minter_address')}</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.data.length ? (
                data?.data.data.map(item => {
                  let typeHash: string | null = null
                  try {
                    if (item.type_script) {
                      typeHash = scriptToHash({
                        codeHash: item.type_script.code_hash,
                        hashType: item.type_script.hash_type,
                        args: item.type_script.args,
                      })
                    }
                  } catch {
                    // ignore
                  }
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className={styles.name}>
                          {item.icon_url ? (
                            <img
                              src={`${patchMibaoImg(item.icon_url)}?size=small`}
                              alt="cover"
                              loading="lazy"
                              className={styles.icon}
                              onError={handleNftImgError}
                            />
                          ) : (
                            <img src="/images/nft_placeholder.png" alt="cover" loading="lazy" className={styles.icon} />
                          )}
                          <Link
                            to={`/nft-collections/${typeHash || item.id}`}
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
                          {item.creator ? (
                            <Tooltip title={item.creator}>
                              <Link
                                to={`/address/${item.creator}`}
                                className="monospace"
                                style={{
                                  color: primaryColor,
                                  fontWeight: 700,
                                }}
                              >{`${item.creator.slice(0, 8)}...${item.creator.slice(-8)}`}</Link>
                            </Tooltip>
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
          totalPages={data?.data.pagination.last ?? 1}
          onChange={handlePageChange}
        />
      </div>
    </Content>
  )
}

NftCollections.displayName = 'NftCollections'

export default NftCollections
