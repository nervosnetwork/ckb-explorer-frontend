import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../../components/Loading'
import SimpleUDTHashCard from '../../components/Card/HashCard'
import Error from '../../components/Error'
import Content from '../../components/Content'
import { useAppState, useDispatch } from '../../contexts/providers/index'
import { getTipBlockNumber } from '../../service/app/address'
import { LOADING_WAITING_TIME } from '../../constants/common'
import i18n from '../../utils/i18n'
import { SimpleUDTContentPanel, UDTTransactionTitlePanel, TypeScriptController } from './styled'
import SimpleUDTComp, { SimpleUDTOverview } from './SimpleUDTComp'
import { useDelayLoading, usePaginationParamsInPage } from '../../utils/hook'
import { getSimpleUDT, getSimpleUDTTransactions, handleUDTStatus } from '../../service/app/udt'
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

const UDTTitleSearchComp = ({ typeHash, total }: { typeHash: string; total: number }) => (
  <UDTTransactionTitlePanel>
    <div className="udt__transaction__container">
      <div className="udt__transaction__title">
        {`${i18n.t('transaction.transactions')} (${localeNumberString(total)})`}
      </div>
      <Filter typeHash={typeHash} filterType={FilterType.UDT} />
    </div>
  </UDTTransactionTitlePanel>
)

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
  } = useAppState()
  const loading = useDelayLoading(LOADING_WAITING_TIME, status === 'None' || status === 'InProgress')

  switch (status) {
    case 'Error':
      return <Error />
    case 'OK':
      return <SimpleUDTComp currentPage={currentPage} pageSize={pageSize} typeHash={typeHash} />
    case 'InProgress':
    case 'None':
    default:
      return <Loading show={loading} />
  }
}

export const SimpleUDT = () => {
  const dispatch = useDispatch()
  const [showType, setShowType] = useState(false)
  const { hash: typeHash } = useParams<{ hash: string }>()
  const { currentPage, pageSize } = usePaginationParamsInPage()
  const {
    udtState: {
      total,
      udt: { iconFile, typeScript, symbol, uan },
    },
  } = useAppState()

  useEffect(() => {
    getTipBlockNumber(dispatch)
  }, [dispatch])

  useEffect(() => {
    getSimpleUDT(typeHash, dispatch)
    getSimpleUDTTransactions(typeHash, currentPage, pageSize, dispatch)
  }, [typeHash, currentPage, pageSize, dispatch])

  useEffect(() => {
    return () => handleUDTStatus(dispatch, 'None')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Content>
      <SimpleUDTContentPanel className="container">
        <SimpleUDTHashCard
          title={(uan || symbol) ?? i18n.t('udt.sudt')}
          hash={typeHash}
          iconUri={iconFile || SUDTTokenIcon}
        >
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
