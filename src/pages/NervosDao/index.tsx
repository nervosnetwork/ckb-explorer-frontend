import React, { useContext, useEffect } from 'react'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'
import Content from '../../components/Content'
import HashCard from '../../components/Card/HashCard'
import i18n from '../../utils/i18n'
import { DaoContentPanel } from './styled'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import getNervosDao from '../../service/app/nervosDao'
import { shannonToCkb } from '../../utils/util'

const DervosDaoOverview = ({ nervosDao }: { nervosDao: State.NervosDao }) => {
  const overviewItems: OverviewItemData[] = [
    {
      title: i18n.t('nervos_dao.total_deposit'),
      content: `${localeNumberString(shannonToCkb(nervosDao.totalDeposit))} CKB`,
    },
    {
      title: i18n.t('nervos_dao.transactions'),
      content: localeNumberString(nervosDao.depositTransactionsCount + nervosDao.withdrawTransactionsCount),
    },
    {
      title: i18n.t('nervos_dao.subsidy_granted'),
      content: `${localeNumberString(shannonToCkb(nervosDao.subsidyGranted))} CKB`,
    },
    {
      title: i18n.t('nervos_dao.depositor'),
      content: localeNumberString(nervosDao.depositorsCount),
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
  const { nervosDao } = useContext(AppContext)

  useEffect(() => {
    getNervosDao(dispatch)
  }, [dispatch])

  return (
    <Content>
      <DaoContentPanel className="container">
        <HashCard title={i18n.t('nervos_dao.nervos_dao')} hash={nervosDao.daoTypeHash} dispatch={dispatch} />
        <DervosDaoOverview nervosDao={nervosDao} />
      </DaoContentPanel>
    </Content>
  )
}

export default NervosDao
