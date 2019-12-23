import React, { useContext } from 'react'
import { AppContext } from '../../contexts/providers'
import { DaoOverviewPanel, DaoOverviewLeftPanel, DaoOverviewRightPanel, DaoOverviewItemPanel } from './styled'
import DaoUpIcon from '../../assets/dao_up.png'
import DaoDownIcon from '../../assets/dao_down.png'
import DaoBalanceIcon from '../../assets/dao_balance.png'
import i18n from '../../utils/i18n'
import { handleBigNumber, handleBigNumberFloor } from '../../utils/string'
import { localeNumberString } from '../../utils/number'
import { shannonToCkbDecimal } from '../../utils/util'

interface NervosDaoItemContent {
  title: string
  change?: string
  content: string
}

const NervosDaoItem = ({ item }: { item: NervosDaoItemContent }) => {
  let daoIcon = DaoUpIcon
  if (item.change) {
    if (Number(item.change) < 0) {
      daoIcon = DaoDownIcon
    } else if (Number(item.change) === 0) {
      daoIcon = DaoBalanceIcon
    }
  }
  return (
    <DaoOverviewItemPanel>
      <div className="dao__overview__item_top">
        <span className="dao__overview__item_title">{item.title}</span>
        {item.change && (
          <>
            <img src={daoIcon} alt="nervos dao change icon" />
            <span className="dao__overview__item_change">{item.change}</span>
          </>
        )}
      </div>
      <div className="dao__overview__item_content">{item.content}</div>
    </DaoOverviewItemPanel>
  )
}

const nervosDaoItemContents = (nervosDao: State.NervosDao): NervosDaoItemContent[] => {
  return [
    {
      title: i18n.t('nervos_dao.deposit'),
      change: handleBigNumberFloor(shannonToCkbDecimal(nervosDao.depositChanges), 2),
      content: localeNumberString(shannonToCkbDecimal(nervosDao.totalDeposit, 2)),
    },
    {
      title: i18n.t('nervos_dao.addresses'),
      change: localeNumberString(nervosDao.depositorChanges),
      content: localeNumberString(nervosDao.depositorsCount),
    },
    {
      title: i18n.t('nervos_dao.unclaimed_compensation'),
      change: handleBigNumberFloor(shannonToCkbDecimal(nervosDao.unclaimedCompensationChanges), 2),
      content: localeNumberString(shannonToCkbDecimal(nervosDao.unclaimedCompensation, 2)),
    },
    {
      title: i18n.t('nervos_dao.claimed_compensation'),
      change: handleBigNumber(shannonToCkbDecimal(nervosDao.claimedCompensationChanges), 2),
      content: localeNumberString(shannonToCkbDecimal(nervosDao.claimedCompensation, 2)),
    },
    {
      title: i18n.t('nervos_dao.average_deposit_time'),
      content: `${handleBigNumber(nervosDao.averageDepositTime, 1)} days+`,
    },
    {
      title: i18n.t('nervos_dao.estimated_apc'),
      content: `${Number(nervosDao.estimatedApc).toFixed(2)}%`,
    },
  ]
}

export default () => {
  const { nervosDaoState } = useContext(AppContext)
  const { nervosDao } = nervosDaoState

  return (
    <DaoOverviewPanel>
      <DaoOverviewLeftPanel>
        <div>
          {nervosDaoItemContents(nervosDao)
            .slice(0, 3)
            .map(item => (
              <NervosDaoItem item={item} />
            ))}
        </div>
        <span className="dao__overview__left_separate" />
        <div>
          {nervosDaoItemContents(nervosDao)
            .slice(3)
            .map(item => (
              <NervosDaoItem item={item} />
            ))}
        </div>
      </DaoOverviewLeftPanel>
      <span className="dao__overview__separate" />
      <DaoOverviewRightPanel />
    </DaoOverviewPanel>
  )
}
