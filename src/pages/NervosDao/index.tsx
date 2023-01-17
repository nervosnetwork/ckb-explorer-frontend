import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppState, useDispatch } from '../../contexts/providers'
import Content from '../../components/Content'
import { DaoContentPanel, DaoTabBarPanel } from './styled'
import {
  getNervosDao,
  getNervosDaoTransactions,
  getNervosDaoDepositors,
  handleNervosDAOStatus,
  searchNervosDaoTransactions,
} from '../../service/app/nervosDao'
import DaoTransactions from './DaoTransactions'
import Filter from '../../components/Search/Filter'
import DepositorRank from './DepositorRank'
import { LOADING_WAITING_TIME } from '../../constants/common'
import Error from '../../components/Error'
import Loading from '../../components/Loading'
import { useDelayLoading, usePaginationParamsInPage, useSearchParams } from '../../utils/hook'
import DaoOverview from './DaoOverview'
import SimpleButton from '../../components/SimpleButton'
import { ComponentActions } from '../../contexts/actions'
import { containSpecialChar } from '../../utils/string'

const NervosDAOStateComp = ({
  daoTab,
  currentPage,
  pageSize,
}: {
  daoTab: 'transactions' | 'depositors'
  currentPage: number
  pageSize: number
}) => {
  const {
    nervosDaoState: { status },
  } = useAppState()
  const loading = useDelayLoading(LOADING_WAITING_TIME, status === 'None' || status === 'InProgress')

  switch (status) {
    case 'Error':
      return <Error />
    case 'OK':
      return daoTab === 'transactions' ? (
        <DaoTransactions currentPage={currentPage} pageSize={pageSize} />
      ) : (
        <DepositorRank />
      )
    case 'InProgress':
    case 'None':
    default:
      return <Loading show={loading} />
  }
}

export const NervosDao = () => {
  const dispatch = useDispatch()
  const {
    nervosDaoState: { transactionsStatus },
  } = useAppState()
  const { push } = useHistory()
  const [t] = useTranslation()

  const { currentPage, pageSize, setPage } = usePaginationParamsInPage()
  const params = useSearchParams('tab')
  const tab = params.tab as 'transactions' | 'depositors'
  const daoTab = tab || 'transactions'

  useEffect(() => {
    getNervosDao(dispatch)
    getNervosDaoDepositors(dispatch)
  }, [dispatch])

  useEffect(() => {
    return () => handleNervosDAOStatus(dispatch, 'None')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [filterText, setFilterText] = useState<string>()

  useEffect(() => {
    if (filterText == null) {
      getNervosDaoTransactions(dispatch, currentPage, pageSize)
    } else {
      if (!filterText || containSpecialChar(filterText)) {
        dispatch({
          type: ComponentActions.UpdateFilterNoResult,
          payload: {
            filterNoResult: true,
          },
        })
        return
      }
      searchNervosDaoTransactions(filterText, dispatch, currentPage, pageSize)
    }
  }, [currentPage, dispatch, filterText, pageSize])

  useEffect(() => {
    if (transactionsStatus === 'Error') {
      dispatch({
        type: ComponentActions.UpdateFilterNoResult,
        payload: {
          filterNoResult: true,
        },
      })
    }
  }, [dispatch, transactionsStatus])

  const filtering = filterText != null
  const showReset = filtering && (transactionsStatus === 'OK' || transactionsStatus === 'Error')

  return (
    <Content>
      <DaoContentPanel className="container">
        <DaoOverview />
        <DaoTabBarPanel containSearchBar={daoTab === 'transactions'}>
          <div className="nervos_dao_tab_bar">
            <SimpleButton
              className={daoTab === 'transactions' ? 'tab_bar_selected' : 'tab_bar_normal'}
              onClick={() => push('/nervosdao?tab=transactions')}
            >
              {t('nervos_dao.dao_tab_transactions')}
            </SimpleButton>
            <SimpleButton
              className={daoTab === 'depositors' ? 'tab_bar_selected' : 'tab_bar_normal'}
              onClick={() => push('/nervosdao?tab=depositors')}
            >
              {t('nervos_dao.dao_tab_depositors')}
            </SimpleButton>
          </div>
          {daoTab === 'transactions' && (
            <Filter
              showReset={showReset}
              placeholder={t('nervos_dao.dao_search_placeholder')}
              onFilter={query => {
                setPage(1)
                setFilterText(query)
              }}
              onReset={() => {
                setPage(1)
                setFilterText(undefined)
              }}
            />
          )}
        </DaoTabBarPanel>

        <NervosDAOStateComp daoTab={daoTab} currentPage={currentPage} pageSize={pageSize} />
      </DaoContentPanel>
    </Content>
  )
}

export default NervosDao
