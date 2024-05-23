import { useParams, useHistory } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Popover } from 'antd'
import { TFunction, useTranslation } from 'react-i18next'
import { Link } from '../../components/Link'
import Content from '../../components/Content'
import NftCollectionOverview from './NftCollectionOverview'
import NftCollectionTransfers from './NftCollectionTransfers'
import NftCollectionInventory from './NftCollectionInventory'
import Filter from '../../components/Filter'
import { ReactComponent as FilterIcon } from '../../assets/filter_icon.svg'
import { ReactComponent as SelectedCheckIcon } from '../../assets/selected_check_icon.svg'
import { explorerService } from '../../services/ExplorerService'
import { useSearchParams, useIsMobile } from '../../hooks'
import styles from './styles.module.scss'
import { CsvExport } from '../../components/CsvExport'
import PaginationWithRear from '../../components/PaginationWithRear'
import NftHolderList from './NftHolderList'
import Pagination from '../../components/Pagination'

const tabs = ['transfers', 'holders', 'inventory']
function getFilterList(t: TFunction): Record<'title' | 'value', string>[] {
  return [
    {
      value: 'mint',
      title: t('udt.view-mint-txns'),
    },
    {
      value: 'normal',
      title: t('udt.view-transfer-txns'),
    },
    {
      value: 'destruction',
      title: t('udt.view-burn-txns'),
    },
  ]
}
const PAGE_SIZE = 50

const NftCollectionInfo = () => {
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const { tab = tabs[0], page = '1' } = useSearchParams('tab', 'page', 'tx_type')
  const { type, filter, sort } = useSearchParams('type', 'filter', 'sort')
  const isMobile = useIsMobile()

  const filteredList = getFilterList(t)
  const isFilteredByType = filteredList.some(f => f.value === type)

  const { isLoading: isTransferListLoading, data: transferListRes } = useQuery(
    ['nft-collection-transfer-list', id, page, filter, type],
    () =>
      explorerService.api.fetchNFTCollectionTransferList(
        id,
        page,
        null,
        isFilteredByType ? type : null,
        filter?.startsWith('0x') ? null : filter,
        filter?.startsWith('0x') ? filter : null,
      ),
    {
      enabled: tab === tabs[0],
    },
  )
  const { isLoading: isHoldersLoading, data: rawHolders } = useQuery(
    ['nft-collection-holder-list', id, page, sort, filter],
    () => explorerService.api.fetchNFTCollectionHolders(id, page, sort, filter || null),
    {
      enabled: tab === tabs[1],
    },
  )

  const { isLoading: isInventoryLoading, data: inventoryList } = useQuery(
    ['nft-collection-inventory', id, page],
    () => explorerService.api.fetchNFTCollectionItems(id, page),
    {
      enabled: tab === tabs[2],
    },
  )

  const handlePageChange = (pageNo: number) => {
    if (pageNo === +page) {
      return
    }
    const query = Object.fromEntries(new URLSearchParams(history.location.search))
    history.push(
      `/${language}/nft-collections/${id}?${new URLSearchParams({ ...query, page: pageNo.toString() }).toString()}`,
    )
  }

  const holderList = rawHolders
    ? Object.keys(rawHolders.data)
        .map(addr => ({
          addr,
          quantity: rawHolders.data[addr],
        }))
        .sort((h1, h2) => {
          if (sort === 'quantity.asc') {
            return h1.quantity - h2.quantity
          }
          return h2.quantity - h1.quantity
        })
    : []

  // TODO: enable pagination of holder list

  let pageSource:
    | {
        pagination: Record<'page' | 'last', number>
      }
    | undefined = {
    pagination: {
      page: 1,
      last: 1,
    },
  }

  if (tab === tabs[0]) {
    pageSource = transferListRes
  } else if (tab === tabs[2]) {
    pageSource = inventoryList
  }

  const pages = {
    currentPage: pageSource?.pagination.page ?? 1,
    totalPages: pageSource?.pagination.last ?? 1,
  }

  return (
    <Content>
      <NftCollectionOverview id={id} />
      <div className={styles.container}>
        <div className={styles.navigation}>
          <div className={styles.tabs}>
            <Link to={`/nft-collections/${id}?tab=${tabs[0]}`} data-is-active={tab === tabs[0]}>
              {t(`nft.activity`)}
            </Link>
            <Link to={`/nft-collections/${id}?tab=${tabs[1]}`} data-is-active={tab === tabs[1]}>
              {t(`nft.holder-list`)}
            </Link>
            <Link to={`/nft-collections/${id}?tab=${tabs[2]}`} data-is-active={tab === tabs[2]}>
              {t(`nft.inventory`)}
            </Link>
          </div>

          <div className={styles.filters}>
            {tabs.slice(0, 2).includes(tab) ? (
              <Filter
                defaultValue={filter}
                showReset={!!filter}
                placeholder={t(tab === tabs[0] ? 'udt.address-or-hash' : 'udt.address')}
                onFilter={filter => {
                  history.push(`/${language}/nft-collections/${id}?${new URLSearchParams({ tab, filter })}`)
                }}
                onReset={() => {
                  history.push(`/${language}/nft-collections/${id}?${new URLSearchParams({ tab })}`)
                }}
              />
            ) : null}
            {tab === tabs[0] && (
              <div className={styles.typeFilter} data-is-active={isFilteredByType}>
                <Popover
                  placement="bottomRight"
                  trigger={isMobile ? 'click' : 'hover'}
                  overlayClassName={styles.antPopover}
                  content={
                    <div className={styles.filterItems}>
                      {filteredList.map(f => (
                        <Link
                          key={f.value}
                          to={`/nft-collections/${id}?${new URLSearchParams({ type: f.value })}`}
                          data-is-active={f.value === type}
                        >
                          {f.title}
                          <SelectedCheckIcon />
                        </Link>
                      ))}
                    </div>
                  }
                >
                  <FilterIcon />
                </Popover>
              </div>
            )}
          </div>
        </div>
        {tab === tabs[0] ? (
          <>
            <NftCollectionTransfers
              list={transferListRes?.data ?? []}
              isLoading={isTransferListLoading}
              collection={id}
            />
            <PaginationWithRear
              currentPage={transferListRes?.pagination.page ?? 1}
              totalPages={transferListRes?.pagination.last ?? 1}
              onChange={handlePageChange}
              rear={<CsvExport link={`/export-transactions?type=nft&id=${id}`} />}
            />
          </>
        ) : null}
        {tab === tabs[1] ? (
          <>
            <NftHolderList
              list={holderList?.slice((+page - 1) * PAGE_SIZE, +page * PAGE_SIZE) ?? []}
              isLoading={isHoldersLoading}
            />
            <Pagination
              currentPage={+page}
              totalPages={Math.ceil((holderList?.length ?? 0) / PAGE_SIZE) ?? 1}
              onChange={handlePageChange}
            />
          </>
        ) : null}
        {tab === tabs[2] ? (
          <>
            <NftCollectionInventory collection={id} list={inventoryList?.data ?? []} isLoading={isInventoryLoading} />
            <Pagination {...pages} onChange={handlePageChange} />
          </>
        ) : null}
      </div>
    </Content>
  )
}

NftCollectionInfo.displayName = 'NftCollectionInfo'

export default NftCollectionInfo
