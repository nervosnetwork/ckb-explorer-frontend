import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useAppState, useDispatch } from '../../contexts/providers'
import Content from '../../components/Content'
import i18n from '../../utils/i18n'
import { DaoContentPanel, DaoTabBarPanel } from './styled'
import {
  getNervosDao,
  getNervosDaoTransactions,
  getNervosDaoDepositors,
  handleNervosDAOStatus,
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
  const { push } = useHistory()

  const { currentPage, pageSize } = usePaginationParamsInPage()
  const params = useSearchParams('tab')
  const tab = params.tab as 'transactions' | 'depositors'
  const daoTab = tab || 'transactions'

  useEffect(() => {
    getNervosDao(dispatch)
    getNervosDaoDepositors(dispatch)
  }, [dispatch])

  useEffect(() => {
    getNervosDaoTransactions(dispatch, currentPage, pageSize)
  }, [dispatch, currentPage, pageSize])

  useEffect(() => {
    return () => handleNervosDAOStatus(dispatch, 'None')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
              {i18n.t('nervos_dao.dao_tab_transactions')}
            </SimpleButton>
            <SimpleButton
              className={daoTab === 'depositors' ? 'tab_bar_selected' : 'tab_bar_normal'}
              onClick={() => push('/nervosdao?tab=depositors')}
            >
              {i18n.t('nervos_dao.dao_tab_depositors')}
            </SimpleButton>
          </div>
          {daoTab === 'transactions' && <Filter />}
        </DaoTabBarPanel>

        <NervosDAOStateComp daoTab={daoTab} currentPage={currentPage} pageSize={pageSize} />
      </DaoContentPanel>
    </Content>
  )
}

export default NervosDao
