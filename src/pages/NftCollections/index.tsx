import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Content from '../../components/Content'
import { ListOnDesktop, ListOnMobile, isTxFilterType } from './List'
import Pagination from '../../components/Pagination'
import { getPrimaryColor } from '../../constants/common'
import { explorerService } from '../../services/ExplorerService'
import { udtSubmitEmail } from '../../utils/util'
import { useIsMobile, useSearchParams } from '../../hooks'
import styles from './styles.module.scss'
import { useNFTCollectionsSortParam } from './util'

const primaryColor = getPrimaryColor()

const submitTokenInfoUrl = udtSubmitEmail()

const NftCollections = () => {
  const history = useHistory()
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const { search } = useLocation()
  const { page = '1', type, tags } = useSearchParams('page', 'type', 'tags')
  const { sort } = useNFTCollectionsSortParam()
  const isMobile = useIsMobile()

  const isValidFilter = isTxFilterType(type) && type !== 'all'

  const { isLoading, data } = useQuery(['nft-collections', page, sort, type, tags, 'true'], () =>
    explorerService.api.fetchNFTCollections(page, sort, isValidFilter ? type : undefined, tags, 'true'),
  )

  const list = data?.data ?? []

  const handlePageChange = (pageNo: number) => {
    if (pageNo === +page) {
      return
    }
    const query = new URLSearchParams(search)
    history.push(
      `/${language}/nft-collections?${new URLSearchParams({ ...Object.fromEntries(query), page: pageNo.toString() })}`,
    )
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
          {isMobile ? (
            <ListOnMobile isLoading={isLoading} list={list} />
          ) : (
            <ListOnDesktop isLoading={isLoading} list={list} />
          )}
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
