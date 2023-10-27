import { useState } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Popover } from 'antd'
import SimpleUDTHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import { SimpleUDTContentPanel, UDTTransactionTitlePanel, TypeScriptController } from './styled'
import SimpleUDTComp, { SimpleUDTOverview } from './SimpleUDTComp'
import { useIsMobile, usePaginationParamsInPage } from '../../utils/hook'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import ArrowUpIcon from '../../assets/arrow_up.png'
import ArrowDownIcon from '../../assets/arrow_down.png'
import ArrowUpBlueIcon from '../../assets/arrow_up_blue.png'
import ArrowDownBlueIcon from '../../assets/arrow_down_blue.png'
import { isMainnet } from '../../utils/chain'
import Filter from '../../components/Search/Filter'
import { localeNumberString } from '../../utils/number'
import Script from '../../components/Script'
import { explorerService } from '../../services/ExplorerService'
import { deprecatedAddrToNewAddr } from '../../utils/util'
import { QueryResult } from '../../components/QueryResult'
import { defaultUDTInfo } from './state'
import { ReactComponent as FilterIcon } from '../../assets/filter_icon.svg'
import { ReactComponent as SelectedCheckIcon } from '../../assets/selected_check_icon.svg'
import styles from './styles.module.scss'
import { Cell } from '../../models/Cell'

const typeScriptIcon = (show: boolean) => {
  if (show) {
    return isMainnet() ? ArrowUpIcon : ArrowUpBlueIcon
  }
  return isMainnet() ? ArrowDownIcon : ArrowDownBlueIcon
}

enum TransactionType {
  Mint = 'mint',
  Transfer = 'normal',
  Burn = 'destruction',
}

export const SimpleUDT = () => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { push } = useHistory()
  const { search } = useLocation()
  const [showType, setShowType] = useState(false)
  const { hash: typeHash } = useParams<{ hash: string }>()
  const { currentPage, pageSize: _pageSize, setPage } = usePaginationParamsInPage()

  const query = new URLSearchParams(search)
  const filter = query.get('filter')
  const type = query.get('type')

  const querySimpleUDT = useQuery(['simple-udt'], () => explorerService.api.fetchSimpleUDT(typeHash))
  const udt = querySimpleUDT.data ?? defaultUDTInfo
  const { iconFile, typeScript, symbol, uan } = udt

  const querySimpleUDTTransactions = useQuery(
    ['simple-udt-transactions', typeHash, currentPage, _pageSize, filter, type],
    async () => {
      const {
        data: transactions,
        total,
        pageSize: resPageSize,
      } = await explorerService.api.fetchSimpleUDTTransactions({
        typeHash,
        page: currentPage,
        size: pageSize,
        filter,
        type,
      })

      const ensureCellAddrIsNewFormat = (cell: Cell) => ({
        ...cell,
        addressHash: deprecatedAddrToNewAddr(cell.addressHash),
      })

      return {
        transactions: transactions.map(tx => ({
          ...tx,
          displayInputs: tx.displayInputs.map(ensureCellAddrIsNewFormat),
          displayOutputs: tx.displayOutputs.map(ensureCellAddrIsNewFormat),
        })),
        total,
        pageSize: resPageSize,
      }
    },
  )
  const total = querySimpleUDTTransactions.data?.total ?? 0
  const filterNoResult = !!filter && querySimpleUDTTransactions.isError
  const pageSize: number = querySimpleUDTTransactions.data?.pageSize ?? _pageSize

  const filterList: { value: TransactionType; title: string }[] = [
    {
      value: TransactionType.Mint,
      title: t('udt.view-mint-txns'),
    },
    {
      value: TransactionType.Transfer,
      title: t('udt.view-transfer-txns'),
    },
    {
      value: TransactionType.Burn,
      title: t('udt.view-burn-txns'),
    },
  ]

  const isFilteredByType = filterList.some(f => f.value === type)

  return (
    <Content>
      <SimpleUDTContentPanel className="container">
        <SimpleUDTHashCard title={(uan || symbol) ?? t('udt.sudt')} hash={typeHash} iconUri={iconFile || SUDTTokenIcon}>
          <SimpleUDTOverview udt={udt}>
            <TypeScriptController onClick={() => setShowType(!showType)}>
              <div>{t('udt.type_script')}</div>
              <img alt="type script" src={typeScriptIcon(showType)} />
            </TypeScriptController>
            {showType && typeScript && <Script script={typeScript} />}
          </SimpleUDTOverview>
        </SimpleUDTHashCard>

        <UDTTransactionTitlePanel>
          <div className="udtTransactionContainer">
            <div className="udtTransactionTitle">
              {`${t('transaction.transactions')} (${localeNumberString(total)})`}
            </div>
            <div className={styles.searchAndfilter}>
              <Filter
                defaultValue={filter ?? ''}
                showReset={!!filter}
                placeholder={t('udt.search_placeholder')}
                onFilter={filter => {
                  push(`/sudt/${typeHash}?${new URLSearchParams({ filter })}`)
                }}
                onReset={() => {
                  push(`/sudt/${typeHash}`)
                }}
              />
              <div className={styles.typeFilter} data-is-active={isFilteredByType}>
                <Popover
                  placement="bottomRight"
                  trigger={isMobile ? 'click' : 'hover'}
                  overlayClassName={styles.antPopover}
                  content={
                    <div className={styles.filterItems}>
                      {filterList.map(f => (
                        <Link
                          key={f.value}
                          to={`/sudt/${typeHash}?${new URLSearchParams({ type: f.value })}`}
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
            </div>
          </div>
        </UDTTransactionTitlePanel>

        <QueryResult query={querySimpleUDTTransactions} delayLoading>
          {data => (
            <SimpleUDTComp
              currentPage={currentPage}
              pageSize={pageSize}
              transactions={data.transactions}
              total={data.total}
              onPageChange={setPage}
              filterNoResult={filterNoResult}
              id={typeHash}
            />
          )}
        </QueryResult>
      </SimpleUDTContentPanel>
    </Content>
  )
}

export default SimpleUDT
