import React, { ReactNode } from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import { Tooltip } from 'antd'
import { useAppState } from '../../contexts/providers'
import {
  DaoOverviewPanel,
  DaoOverviewLeftPanel,
  DaoOverviewRightPanel,
  DaoOverviewItemPanel,
  NervosDaoPieItemPanel,
} from './styled'
import DaoUpIcon from '../../assets/dao_up.png'
import DaoDownIcon from '../../assets/dao_down.png'
import DaoBalanceIcon from '../../assets/dao_balance.png'
import DotIcon1 from '../../assets/dot_icon1.png'
import DotIcon2 from '../../assets/dot_icon2.png'
import DotIcon3 from '../../assets/dot_icon3.png'
import i18n from '../../utils/i18n'
import { handleBigNumber, handleBigNumberFloor } from '../../utils/string'
import { localeNumberString } from '../../utils/number'
import { shannonToCkbDecimal, shannonToCkb } from '../../utils/util'
import DecimalCapacity from '../../components/DecimalCapacity'
import { isMobile } from '../../utils/screen'

interface NervosDaoItemContent {
  title: string
  titleTooltip?: string
  change?: string
  changeSymbol?: 'positive' | 'negative' | 'zero'
  content: string
  tooltip?: string
}

interface NervosDaoPieItemContent {
  title: string
  content: ReactNode
  img: any
}

const colors = ['#049ECD', '#69C7D4', '#74808E']

const numberSymbol = (num: number) => {
  if (num > 0) {
    return 'positive'
  }
  if (num === 0) {
    return 'zero'
  }
  return 'negative'
}

const daoIcon = (symbol: 'positive' | 'negative' | 'zero' | undefined) => {
  switch (symbol) {
    case 'negative':
      return DaoDownIcon
    case 'zero':
      return DaoBalanceIcon
    default:
      return DaoUpIcon
  }
}

const NervosDaoItem = ({ item }: { item: NervosDaoItemContent }) => {
  return (
    <DaoOverviewItemPanel hasChange={!!item.change} symbol={item.changeSymbol} hasTitleTooltip={!!item.titleTooltip}>
      <div className="dao__overview__item_top">
        {item.titleTooltip && (
          <Tooltip placement="top" title={item.titleTooltip}>
            <span className="dao__overview__item_title">{item.title}</span>
          </Tooltip>
        )}
        {!item.titleTooltip && <span className="dao__overview__item_title">{item.title}</span>}
        {item.change && (
          <>
            <img src={daoIcon(item.changeSymbol)} alt="nervos dao change icon" />
            <Tooltip placement="top" title={item.tooltip}>
              <span className="dao__overview__item_change">{item.change}</span>
            </Tooltip>
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
      change: handleBigNumberFloor(shannonToCkbDecimal(nervosDao.depositChanges, 2), 2),
      changeSymbol: numberSymbol(Number(nervosDao.depositChanges)),
      content: localeNumberString(shannonToCkbDecimal(nervosDao.totalDeposit, 2)),
      tooltip: i18n.t('nervos_dao.today_update'),
    },
    {
      title: i18n.t('nervos_dao.addresses'),
      titleTooltip: i18n.t('nervos_dao.deposit_address_tooltip'),
      change: localeNumberString(nervosDao.depositorChanges),
      changeSymbol: numberSymbol(Number(nervosDao.depositorChanges)),
      content: localeNumberString(nervosDao.depositorsCount),
      tooltip: i18n.t('nervos_dao.today_update'),
    },
    {
      title: i18n.t('nervos_dao.unclaimed_compensation'),
      change: handleBigNumberFloor(shannonToCkbDecimal(nervosDao.unclaimedCompensationChanges, 2), 2),
      changeSymbol: numberSymbol(Number(nervosDao.unclaimedCompensationChanges)),
      content: localeNumberString(shannonToCkbDecimal(nervosDao.unclaimedCompensation, 2)),
      tooltip: i18n.t('nervos_dao.today_update'),
    },
    {
      title: i18n.t('nervos_dao.claimed_compensation'),
      change: handleBigNumberFloor(shannonToCkbDecimal(nervosDao.claimedCompensationChanges, 2), 2),
      changeSymbol: numberSymbol(Number(nervosDao.claimedCompensationChanges)),
      content: localeNumberString(shannonToCkbDecimal(nervosDao.claimedCompensation, 2)),
      tooltip: i18n.t('nervos_dao.today_update'),
    },
    {
      title: i18n.t('nervos_dao.average_deposit_time'),
      content: `${handleBigNumber(nervosDao.averageDepositTime, 1)} ${i18n.t('nervos_dao.days')}`,
    },
    {
      title: i18n.t('nervos_dao.estimated_apc'),
      content: `${Number(nervosDao.estimatedApc).toFixed(2)}%`,
    },
  ]
}

const getOption = (nervosDao: State.NervosDao): echarts.EChartOption => {
  const sum =
    shannonToCkbDecimal(nervosDao.miningReward) +
    shannonToCkbDecimal(nervosDao.depositCompensation) +
    shannonToCkbDecimal(nervosDao.treasuryAmount)
  const names = [
    `${((shannonToCkbDecimal(nervosDao.miningReward) / sum) * 100).toFixed(1)}%`,
    `${((shannonToCkbDecimal(nervosDao.depositCompensation) / sum) * 100).toFixed(1)}%`,
    `${((shannonToCkbDecimal(nervosDao.treasuryAmount) / sum) * 100).toFixed(1)}%`,
  ]
  const seriesData = [
    {
      name: names[0],
      value: shannonToCkbDecimal(nervosDao.miningReward),
      title: i18n.t('nervos_dao.mining_reward'),
    },
    {
      name: names[1],
      value: shannonToCkbDecimal(nervosDao.depositCompensation),
      title: i18n.t('nervos_dao.deposit_compensation'),
    },
    {
      name: names[2],
      value: shannonToCkbDecimal(nervosDao.treasuryAmount),
      title: i18n.t('nervos_dao.burnt'),
    },
  ]
  const selectedData: any = {
    first: true,
  }
  selectedData[names[0]] = true
  selectedData[names[1]] = true
  selectedData[names[2]] = true

  return {
    color: colors,
    tooltip: {
      trigger: 'item',
      formatter: (value: any) => {
        return `${value.data.title}: ${localeNumberString(value.data.value)} ${i18n.t('common.ckb_unit')} (${
          value.data.name
        })`
      },
    },
    series: [
      {
        name: i18n.t('nervos_dao.secondary_issuance'),
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: seriesData,
        label: {
          normal: {
            position: 'outside',
            align: 'center',
          },
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
}

const nervosDaoPieItemContents = (nervosDao: State.NervosDao): NervosDaoPieItemContent[] => {
  return [
    {
      title: i18n.t('nervos_dao.mining_reward'),
      content: (
        <DecimalCapacity
          value={localeNumberString(shannonToCkb(Number(nervosDao.miningReward).toFixed()))}
          fontSize={isMobile() ? '9px' : '12px'}
          marginBottom="2px"
          hideUnit
        />
      ),
      img: DotIcon1,
    },
    {
      title: i18n.t('nervos_dao.deposit_compensation'),
      content: (
        <DecimalCapacity
          value={localeNumberString(shannonToCkb(Number(nervosDao.depositCompensation).toFixed()))}
          fontSize={isMobile() ? '9px' : '12px'}
          marginBottom="2px"
          hideUnit
        />
      ),
      img: DotIcon2,
    },
    {
      title: i18n.t('nervos_dao.burnt'),
      content: (
        <DecimalCapacity
          value={localeNumberString(shannonToCkb(Number(nervosDao.treasuryAmount).toFixed()))}
          fontSize={isMobile() ? '9px' : '12px'}
          marginBottom="2px"
          hideUnit
        />
      ),
      img: DotIcon3,
    },
  ]
}

const NervosDaoPieItem = ({ item }: { item: NervosDaoPieItemContent }) => {
  return (
    <NervosDaoPieItemPanel>
      <img src={item.img} alt="nervos dao dot" />
      <div>
        <span>{item.title}</span>
        <div>{item.content}</div>
      </div>
    </NervosDaoPieItemPanel>
  )
}

const NervosDaoLeftMobile = ({ nervosDao }: { nervosDao: State.NervosDao }) => {
  return (
    <DaoOverviewLeftPanel>
      <div>
        <NervosDaoItem item={nervosDaoItemContents(nervosDao)[0]} />
        <span className="dao__overview__left_column_separate" />
        <NervosDaoItem item={nervosDaoItemContents(nervosDao)[1]} />
      </div>
      <span className="dao__overview__left_separate" />
      <div>
        <NervosDaoItem item={nervosDaoItemContents(nervosDao)[2]} />
        <span className="dao__overview__left_column_separate" />
        <NervosDaoItem item={nervosDaoItemContents(nervosDao)[3]} />
      </div>
      <span className="dao__overview__left_separate" />
      <div>
        <NervosDaoItem item={nervosDaoItemContents(nervosDao)[4]} />
        <span className="dao__overview__left_column_separate" />
        <NervosDaoItem item={nervosDaoItemContents(nervosDao)[5]} />
      </div>
    </DaoOverviewLeftPanel>
  )
}

export default () => {
  const {
    nervosDaoState: { nervosDao },
  } = useAppState()

  return (
    <DaoOverviewPanel>
      {isMobile() ? (
        <NervosDaoLeftMobile nervosDao={nervosDao} />
      ) : (
        <DaoOverviewLeftPanel>
          <div>
            {nervosDaoItemContents(nervosDao)
              .slice(0, 3)
              .map(item => (
                <NervosDaoItem item={item} key={item.title} />
              ))}
          </div>
          <span className="dao__overview__left_separate" />
          <div>
            {nervosDaoItemContents(nervosDao)
              .slice(3)
              .map(item => (
                <NervosDaoItem item={item} key={item.title} />
              ))}
          </div>
        </DaoOverviewLeftPanel>
      )}
      <span className="dao__overview__separate" />
      <DaoOverviewRightPanel>
        <div className="nervos__dao__overview_pie_chart">
          <ReactEchartsCore
            echarts={echarts}
            option={getOption(nervosDao)}
            notMerge
            lazyUpdate
            style={{
              height: '80%',
              width: '100%',
            }}
          />
          <span className="nervos__dao__overview_pie_title">{i18n.t('nervos_dao.secondary_issuance')}</span>
        </div>

        <div className="nervos__dao__overview_pie_panel">
          {nervosDaoPieItemContents(nervosDao).map(item => (
            <NervosDaoPieItem item={item} key={item.title} />
          ))}
        </div>
      </DaoOverviewRightPanel>
    </DaoOverviewPanel>
  )
}
