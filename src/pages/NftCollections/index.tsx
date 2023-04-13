import type { AxiosResponse } from 'axios'
import { useHistory, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import { Popover, Tooltip } from 'antd'
import classNames from 'classnames'
import Content from '../../components/Content'
import Pagination from '../../components/Pagination'
import { v2AxiosIns } from '../../service/http/fetcher'
import i18n from '../../utils/i18n'
import styles from './styles.module.scss'
import { handleNftImgError, patchMibaoImg, udtSubmitEmail } from '../../utils/util'
import { getPrimaryColor } from '../../constants/common'
import { useIsMobile, useSearchParams, useSortParam, useUpdateSearchParams } from '../../utils/hook'
import { omit } from '../../utils/object'
import { ReactComponent as SelectedCheckIcon } from '../../assets/selected_check_icon.svg'

const primaryColor = getPrimaryColor()

type TxTypeType = 'all' | 'mnft' | 'nrc721' | 'cota' | undefined

function isTxFilterType(s?: string): s is TxTypeType {
  return s ? ['all', 'mnft', 'nrc721', 'cota'].includes(s) : false
}

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
  const isMobile = useIsMobile()
  const history = useHistory()
  const { page = '1', tx_type: txTypeFilterParam } = useSearchParams('page', 'tx_type')

  const txTypeFilter = isTxFilterType(txTypeFilterParam) ? txTypeFilterParam : undefined

  const filterList: { value: TxTypeType; title: string }[] = [
    {
      value: 'all',
      title: i18n.t('nft.all_type'),
    },
    {
      value: 'mnft',
      title: i18n.t('nft.m_nft'),
    },
    {
      value: 'nrc721',
      title: i18n.t('nft.nrc_721'),
    },
    {
      value: 'cota',
      title: i18n.t('nft.cota'),
    },
  ]

  const updateSearchParams = useUpdateSearchParams<'sort' | 'page' | 'tx_type'>()
  const { sortBy = 'holder', sort = 'holder' } = useSortParam<NftSortByType>(s => s === 'holder' || s === 'minted')

  const { isLoading, data } = useQuery<AxiosResponse<Res>>(['nft-collections', page, sort], () =>
    v2AxiosIns('nft/collections', {
      params: {
        page,
        sort,
      },
    }),
  )

  const handleSortClick = (sortRule: NftSortByType) => {
    updateSearchParams(params => omit({ ...params, sort: sortRule }, ['page', 'tx_type']))
  }

  const handlePageChange = (pageNo: number) => {
    if (pageNo === +page) {
      return
    }
    history.push(`/nft-collections?page=${pageNo}`)
  }

  const handleFilterClick = (filterType: TxTypeType) => {
    updateSearchParams(
      params =>
        filterType === txTypeFilter
          ? omit(params, ['sort', 'tx_type'])
          : omit({ ...params, tx_type: filterType }, ['sort']),
      true,
    )
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
                <th>
                  <div className={classNames({ [styles.activeIcon]: txTypeFilter }, styles.buttonIcon)}>
                    <Popover
                      placement={isMobile ? 'bottomRight' : 'bottomLeft'}
                      trigger={isMobile ? 'click' : 'hover'}
                      overlayClassName={styles.filterPop}
                      content={
                        <div>
                          {filterList.map(f => (
                            <button type="button" onClick={() => handleFilterClick(f.value)}>
                              <div>{f.title}</div>
                              <div>{f.value === txTypeFilter && <SelectedCheckIcon />}</div>
                            </button>
                          ))}
                        </div>
                      }
                    >
                      {i18n.t('nft.standard')}
                    </Popover>
                  </div>
                </th>
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
