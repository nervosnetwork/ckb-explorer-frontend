import React, { useContext, useEffect, useState } from 'react'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'
import Content from '../../components/Content'
import HashCard from '../../components/Card/HashCard'
import i18n from '../../utils/i18n'
import { DaoContentPanel, DaoTabBarPanel } from './styled'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { getNervosDao, getNervosDaoTransactions, getNervosDaoDepositors } from '../../service/app/nervosDao'
import { shannonToCkb } from '../../utils/util'
import DaoTransactions from './DaoTransactions'
import DaoSearch from '../../components/Search/DaoSearch'
import DepositorRank from './DepositorRank'

enum DaoTab {
  Transactions,
  Depositor,
}

const DervosDaoOverview = ({ nervosDao }: { nervosDao: State.NervosDao }) => {
  const overviewItems: OverviewItemData[] = [
    {
      title: i18n.t('nervos_dao.total_deposit'),
      content: `${localeNumberString(shannonToCkb(nervosDao.totalDeposit))} CKB`,
    },
    {
      title: i18n.t('nervos_dao.deposit_transactions_count'),
      content: localeNumberString(nervosDao.depositTransactionsCount),
    },
    {
      title: i18n.t('nervos_dao.subsidy_granted'),
      content: `${localeNumberString(shannonToCkb(nervosDao.subsidyGranted))} CKB`,
    },
    {
      title: i18n.t('nervos_dao.withdraw_transactions_count'),
      content: localeNumberString(nervosDao.withdrawTransactionsCount),
    },
    {
      title: i18n.t('nervos_dao.current_depositors'),
      content: localeNumberString(nervosDao.depositorsCount),
    },
    {
      title: i18n.t('nervos_dao.total_depositors'),
      content: `${localeNumberString(nervosDao.totalDepositorsCount)}`,
    },
  ]

  if (isMobile()) {
    const newItems: OverviewItemData[] = []
    overviewItems.forEach((item, index) => (index % 2 === 0 ? newItems.push(item) : null))
    overviewItems.forEach((item, index) => (index % 2 !== 0 ? newItems.push(item) : null))
  }

  return <OverviewCard items={overviewItems} />
}

export const NervosDao = ({ dispatch }: React.PropsWithoutRef<StateWithDispatch>) => {
  const { nervosDaoState } = useContext(AppContext)
  const [daoTab, setDaoTab] = useState(DaoTab.Transactions)

  useEffect(() => {
    getNervosDao(dispatch)
    getNervosDaoTransactions(dispatch)
    getNervosDaoDepositors(dispatch)
  }, [dispatch])

  return (
    <Content>
      <DaoContentPanel className="container">
        <HashCard
          title={i18n.t('nervos_dao.nervos_dao')}
          hash={nervosDaoState.nervosDao.daoTypeHash}
          dispatch={dispatch}
        />
        <DervosDaoOverview nervosDao={nervosDaoState.nervosDao} />

        <DaoTabBarPanel>
          <div className="nervos_dao_tab_bar">
            <div
              role="button"
              tabIndex={-1}
              onKeyDown={() => {}}
              className={daoTab === DaoTab.Transactions ? 'tab_bar_selected' : 'tab_bar_normal'}
              onClick={() => setDaoTab(DaoTab.Transactions)}
            >
              {i18n.t('nervos_dao.dao_tab_transactions')}
            </div>
            <div
              role="button"
              tabIndex={-1}
              onKeyDown={() => {}}
              className={daoTab === DaoTab.Depositor ? 'tab_bar_selected' : 'tab_bar_normal'}
              onClick={() => setDaoTab(DaoTab.Depositor)}
            >
              {i18n.t('nervos_dao.dao_tab_depositors')}
            </div>
          </div>
          {daoTab === DaoTab.Transactions && <DaoSearch dispatch={dispatch} />}
        </DaoTabBarPanel>

        {daoTab === DaoTab.Transactions ? <DaoTransactions /> : <DepositorRank />}
      </DaoContentPanel>
    </Content>
  )
}

export default NervosDao
