import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import SimpleUDTHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import { useDispatch } from '../../contexts/providers/index'
import { getTipBlockNumber } from '../../service/app/address'
import i18n from '../../utils/i18n'
import { SimpleUDTContentPanel, UDTTransactionTitlePanel, TypeScriptController } from './styled'
import SimpleUDTComp, { SimpleUDTOverview } from './SimpleUDTComp'
import { usePaginationParamsInPage } from '../../utils/hook'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import ArrowUpIcon from '../../assets/arrow_up.png'
import ArrowDownIcon from '../../assets/arrow_down.png'
import ArrowUpBlueIcon from '../../assets/arrow_up_blue.png'
import ArrowDownBlueIcon from '../../assets/arrow_down_blue.png'
import { isMainnet } from '../../utils/chain'
import Filter from '../../components/Search/Filter'
import { localeNumberString } from '../../utils/number'
import Script from '../../components/Script'
import { containSpecialChar } from '../../utils/string'
import {
  fetchSimpleUDT,
  fetchSimpleUDTTransactions,
  fetchSimpleUDTTransactionsWithAddress,
} from '../../service/http/fetcher'
import { deprecatedAddrToNewAddr } from '../../utils/util'
import { QueryResult } from '../../components/QueryResult'
import { PageParams } from '../../constants/common'
import { defaultUDTInfo } from './state'

const FILTER_COUNT = 100

const typeScriptIcon = (show: boolean) => {
  if (show) {
    return isMainnet() ? ArrowUpIcon : ArrowUpBlueIcon
  }
  return isMainnet() ? ArrowDownIcon : ArrowDownBlueIcon
}

export const SimpleUDT = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const [showType, setShowType] = useState(false)
  const { hash: typeHash } = useParams<{ hash: string }>()
  const { currentPage, pageSize: _pageSize, setPage, setPageSize } = usePaginationParamsInPage()

  useEffect(() => {
    getTipBlockNumber(dispatch)
  }, [dispatch])

  const querySimpleUDT = useQuery(['simple-udt'], async () => {
    const wrapper = await fetchSimpleUDT(typeHash)
    const udt = wrapper.attributes
    return udt
  })
  const udt = querySimpleUDT.data ?? defaultUDTInfo
  const { iconFile, typeScript, symbol, uan } = udt

  const [filterText, setFilterText] = useState<string>()
  const filtering = filterText != null
  const isInvalidFilter = filtering && containSpecialChar(filterText)

  const querySimpleUDTTransactions = useQuery(
    ['simple-udt-transactions', typeHash, currentPage, _pageSize, filterText, isInvalidFilter],
    async () => {
      if (filterText != null) {
        if (isInvalidFilter) {
          return { transactions: [], total: 0 }
        }

        const { data, meta } = await fetchSimpleUDTTransactionsWithAddress(filterText, typeHash, currentPage, pageSize)
        return {
          transactions: data.map(wrapper => wrapper.attributes),
          total: meta?.total ?? 0,
          pageSize: meta?.pageSize,
        }
      }

      const { data, meta } = await fetchSimpleUDTTransactions(typeHash, currentPage, pageSize)
      return {
        transactions:
          data.map(wrapper => ({
            ...wrapper.attributes,
            displayInputs: wrapper.attributes.displayInputs.map(input => ({
              ...input,
              addressHash: deprecatedAddrToNewAddr(input.addressHash),
            })),
            displayOutputs: wrapper.attributes.displayOutputs.map(output => ({
              ...output,
              addressHash: deprecatedAddrToNewAddr(output.addressHash),
            })),
          })) || [],
        total: meta?.total ?? 0,
      }
    },
  )
  const total = querySimpleUDTTransactions.data?.total ?? 0
  const filterNoResult = filtering && (isInvalidFilter || querySimpleUDTTransactions.isError)
  const pageSize: number = querySimpleUDTTransactions.data?.pageSize ?? _pageSize

  return (
    <Content>
      <SimpleUDTContentPanel className="container">
        <SimpleUDTHashCard
          title={(uan || symbol) ?? i18n.t('udt.sudt')}
          hash={typeHash}
          iconUri={iconFile || SUDTTokenIcon}
        >
          <SimpleUDTOverview udt={udt}>
            <TypeScriptController onClick={() => setShowType(!showType)}>
              <div>{i18n.t('udt.type_script')}</div>
              <img alt="type script" src={typeScriptIcon(showType)} />
            </TypeScriptController>
            {showType && typeScript && <Script script={typeScript} />}
          </SimpleUDTOverview>
        </SimpleUDTHashCard>

        <UDTTransactionTitlePanel>
          <div className="udt__transaction__container">
            <div className="udt__transaction__title">
              {`${t('transaction.transactions')} (${localeNumberString(total)})`}
            </div>
            <Filter
              showReset={filtering}
              placeholder={t('udt.search_placeholder')}
              onFilter={query => {
                setPage(1)
                setPageSize(FILTER_COUNT)
                setFilterText(query)
              }}
              onReset={() => {
                setPage(1)
                setPageSize(PageParams.PageSize)
                setFilterText(undefined)
              }}
            />
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
