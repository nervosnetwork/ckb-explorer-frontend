import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import Content from '../../components/Content'
import { ListOnDesktop, ListOnMobile, isTxFilterType } from './List'
import Pagination from '../../components/Pagination'
import { getPrimaryColor } from '../../constants/common'
import { explorerService } from '../../services/ExplorerService'
import { udtSubmitEmail } from '../../utils/util'
import { useSearchParams } from '../../utils/hook'
import styles from './styles.module.scss'
import { useNFTCollectionsSortParam } from './util'

const primaryColor = getPrimaryColor()

const submitTokenInfoUrl = udtSubmitEmail()

const NftCollections = () => {
  const history = useHistory()
  const { t } = useTranslation()
  const { search } = useLocation()
  const { page = '1', type } = useSearchParams('page', 'type')
  const { sort } = useNFTCollectionsSortParam()

  const isValidFilter = isTxFilterType(type) && type !== 'all'

  const { isLoading, data } = useQuery(['nft-collections', page, sort, type], () =>
    explorerService.api.fetchNFTCollections(page, sort, isValidFilter ? type : undefined),
  )

  const list = data?.data ?? []

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
          <h5>{t('nft.nft_collection')}</h5>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={submitTokenInfoUrl}
            style={{
              color: primaryColor,
            }}
          >
            {t('udt.submit_token_info')}
          </a>
        </div>
        <div className={styles.list}>
          <ListOnDesktop isLoading={isLoading} list={list} />
          <ListOnMobile isLoading={isLoading} list={list} />
        </div>

        <Pagination
          currentPage={data?.pagination.page ?? 1}
          totalPages={data?.pagination.last ?? 1}
          onChange={handlePageChange}
        />
      </div>
    </Content>
  )
}

NftCollections.displayName = 'NftCollections'

export default NftCollections
