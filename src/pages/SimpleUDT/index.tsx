import queryString from 'query-string'
import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Loading from '../../components/Loading'
import SimpleUDTHashCard from '../../components/Card/HashCard'
import Error from '../../components/Error'
import Content from '../../components/Content'
import { useAppState, useDispatch } from '../../contexts/providers/index'
import { PageActions, AppActions } from '../../contexts/actions'
import { getTipBlockNumber } from '../../service/app/address'
import { PageParams, LOADING_WAITING_TIME } from '../../utils/const'
import i18n from '../../utils/i18n'
import { parsePageNumber } from '../../utils/string'
import { SimpleUDTContentPanel, UDTTransactionTitlePanel, TypeScriptController } from './styled'
import SimpleUDTComp, { SimpleUDTOverview } from './SimpleUDTComp'
import browserHistory from '../../routes/history'
import { useTimeoutWithUnmount } from '../../utils/hook'
import { getSimpleUDT, getSimpleUDTTransactions } from '../../service/app/udt'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import ArrowUpIcon from '../../assets/arrow_up.png'
import ArrowDownIcon from '../../assets/arrow_down.png'
import ArrowUpBlueIcon from '../../assets/arrow_up_blue.png'
import ArrowDownBlueIcon from '../../assets/arrow_down_blue.png'
import { isMainnet } from '../../utils/chain'
import Filter, { FilterType } from '../../components/Search/Filter'
import { localeNumberString } from '../../utils/number'
import Script from '../../components/Script'

const typeScriptIcon = (show: boolean) => {
  if (show) {
    return isMainnet() ? ArrowUpIcon : ArrowUpBlueIcon
  }
  return isMainnet() ? ArrowDownIcon : ArrowDownBlueIcon
}

const UDTTitleSearchComp = ({ typeHash, total }: { typeHash: string; total: number }) => {
  return (
    <UDTTransactionTitlePanel>
      <div className="udt__transaction__container">
        <div className="udt__transaction__title">{`${i18n.t('transaction.transactions')} (${localeNumberString(
          total,
        )})`}</div>
        <Filter typeHash={typeHash} filterType={FilterType.UDT} />
      </div>
    </UDTTransactionTitlePanel>
  )
}

const SimpleUDTCompState = ({
  currentPage,
  pageSize,
  typeHash,
}: {
  currentPage: number
  pageSize: number
  typeHash: string
}) => {
  const {
    udtState: { status },
    app,
  } = useAppState()
  switch (status) {
    case 'Error':
      return <Error />
    case 'OK':
      return <SimpleUDTComp currentPage={currentPage} pageSize={pageSize} typeHash={typeHash} />
    case 'InProgress':
    case 'None':
    default:
      return <Loading show={app.secondLoading} />
  }
}

export const SimpleUDT = () => {
  const dispatch = useDispatch()
  const [showType, setShowType] = useState(false)
  const { search } = useLocation()
  const { hash: typeHash } = useParams<{ hash: string }>()
  const parsed = queryString.parse(search)
  const {
    udtState: {
      total,
      udt: { iconFile, typeScript },
      status,
    },
  } = useAppState()

  const currentPage = parsePageNumber(parsed.page, PageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, PageParams.PageSize)

  useEffect(() => {
    getTipBlockNumber(dispatch)
  }, [dispatch])

  useEffect(() => {
    if (pageSize > PageParams.MaxPageSize) {
      browserHistory.replace(`/sudt/${typeHash}?page=${currentPage}&size=${PageParams.MaxPageSize}`)
    }
    getSimpleUDT(typeHash, dispatch)
    getSimpleUDTTransactions(typeHash, currentPage, pageSize, dispatch)
  }, [typeHash, currentPage, pageSize, dispatch])

  useTimeoutWithUnmount(
    () => {
      dispatch({
        type: AppActions.UpdateLoading,
        payload: {
          loading: status === 'None' || status === 'InProgress',
        },
      })
    },
    () => {
      dispatch({
        type: PageActions.UpdateUDTStatus,
        payload: {
          status: 'None',
        },
      })
    },
    LOADING_WAITING_TIME,
  )

  return (
    <Content>
      <SimpleUDTContentPanel className="container">
        <SimpleUDTHashCard title={i18n.t('udt.sudt')} hash={typeHash} iconUri={iconFile ? iconFile : SUDTTokenIcon}>
          <SimpleUDTOverview>
            <TypeScriptController onClick={() => setShowType(!showType)}>
              <div>{i18n.t('udt.type_script')}</div>
              <img alt="type script" src={typeScriptIcon(showType)} />
            </TypeScriptController>
            {showType && typeScript && <Script script={typeScript} />}
          </SimpleUDTOverview>
        </SimpleUDTHashCard>
        <UDTTitleSearchComp typeHash={typeHash} total={total} />
        <SimpleUDTCompState currentPage={currentPage} pageSize={pageSize} typeHash={typeHash} />
      </SimpleUDTContentPanel>
    </Content>
  )
}

export default SimpleUDT
