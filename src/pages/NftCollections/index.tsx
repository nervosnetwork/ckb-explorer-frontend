import type { AxiosResponse } from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import Content from '../../components/Content'
import { NFTCollection, ListOnDesktop, ListOnMobile, isTxFilterType } from './List'
import Pagination from '../../components/Pagination'
import { getPrimaryColor } from '../../constants/common'
import { v2AxiosIns } from '../../service/http/fetcher'
import i18n from '../../utils/i18n'
import { udtSubmitEmail } from '../../utils/util'
import { useSearchParams, useSortParam } from '../../utils/hook'
import styles from './styles.module.scss'

const primaryColor = getPrimaryColor()

type NftSortByType = 'transactions' | 'holder' | 'minted'

interface Res {
  data: Array<NFTCollection>
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
  const { search } = useLocation()
  const { page = '1', type } = useSearchParams('page', 'type')

  const { sort = 'holder' } = useSortParam<NftSortByType>(s => s === 'transactions' || s === 'holder' || s === 'minted')

  const isValidFilter = isTxFilterType(type) && type !== 'all'

  const { isLoading, data } = useQuery<AxiosResponse<Res>>(['nft-collections', page, sort, type], () =>
    v2AxiosIns('nft/collections', {
      params: {
        page,
        sort,
        type: isValidFilter ? type : undefined,
      },
    }),
  )

  const list = data?.data.data ?? []

  const handlePageChange = (pageNo: number) => {
    if (pageNo === +page) {
      return
    }
    const query = new URLSearchParams(search)
    history.push(`/nft-collections?${new URLSearchParams({ ...Object.fromEntries(query), page: pageNo.toString() })}`)
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
          <ListOnDesktop isLoading={isLoading} list={list} />
          <ListOnMobile isLoading={isLoading} list={list} />
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
