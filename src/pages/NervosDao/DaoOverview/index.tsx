import { ReactNode, useRef, useCallback } from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import { Tooltip } from 'antd'
import { useAppState } from '../../../contexts/providers'
import {
  DaoOverviewPanel,
  DaoOverviewLeftPanel,
  DaoOverviewLeftItemPanel,
  DaoOverviewRightPanel,
  NervosDaoPieItemPanel,
  NervosDaoPieCapacityPanel,
  DaoOverviewPieChartPanel,
  DaoOverviewPieItemsPanel,
} from './styled'
import DaoUpIcon from '../../../assets/dao_up.png'
import DaoDownIcon from '../../../assets/dao_down.png'
import DaoBalanceIcon from '../../../assets/dao_balance.png'
import DotIcon1 from '../../../assets/dot_icon1.png'
import DotIcon2 from '../../../assets/dot_icon2.png'
import DotIcon3 from '../../../assets/dot_icon3.png'
import i18n from '../../../utils/i18n'
import { handleBigNumber, handleBigNumberFloor } from '../../../utils/string'
import { localeNumberString } from '../../../utils/number'
import { shannonToCkbDecimal, shannonToCkb } from '../../../utils/util'
import DecimalCapacity from '../../../components/DecimalCapacity'
import { isMobile, isScreenSmallerThan1200 } from '../../../utils/screen'

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

const numberSymbol = (num: number, isCapacity = true) => {
  const value = isCapacity ? shannonToCkbDecimal(num) : num
  if (value >= 0.01) {
    return 'positive'
  }
  if (value < -0.01) {
    return 'negative'
  }
  return 'zero'
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

const nervosDaoItemContents = (nervosDao: State.NervosDao): NervosDaoItemContent[] => [
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
    changeSymbol: numberSymbol(Number(nervosDao.depositorChanges), false),
    content: localeNumberString(nervosDao.depositorsCount),
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
  {
    title: i18n.t('nervos_dao.unclaimed_compensation'),
    change: handleBigNumberFloor(shannonToCkbDecimal(nervosDao.unclaimedCompensationChanges, 2), 2),
    changeSymbol: numberSymbol(Number(nervosDao.unclaimedCompensationChanges)),
    content: localeNumberString(shannonToCkbDecimal(nervosDao.unclaimedCompensation, 2)),
    tooltip: i18n.t('nervos_dao.today_update'),
  },
]

const NervosDaoLeftItem = ({ item, firstLine }: { item: NervosDaoItemContent; firstLine?: boolean }) => (
  <DaoOverviewLeftItemPanel hasChange={!!item.change} symbol={item.changeSymbol} hasTooltip={!!item.titleTooltip}>
    <div className="dao__overview__item__container">
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
      {firstLine && <span className="dao__overview__bottom__line" />}
    </div>
  </DaoOverviewLeftItemPanel>
)

const NervosDaoOverviewLeftComp = () => {
  const {
    nervosDaoState: { nervosDao },
  } = useAppState()

  const leftItems = nervosDaoItemContents(nervosDao)

  if (isMobile()) {
    return (
      <DaoOverviewLeftPanel>
        <div>
          <NervosDaoLeftItem item={leftItems[0]} />
          <span className="dao__overview__left_column_separate" />
          <NervosDaoLeftItem item={leftItems[1]} />
        </div>
        <span className="dao__overview__middle__separate" />
        <div>
          <NervosDaoLeftItem item={leftItems[3]} />
          <span className="dao__overview__left_column_separate" />
          <NervosDaoLeftItem item={leftItems[4]} />
        </div>
        <span className="dao__overview__middle__separate" />
        <div>
          <NervosDaoLeftItem item={leftItems[2]} />
          <span className="dao__overview__left_column_separate" />
          <NervosDaoLeftItem item={leftItems[5]} />
        </div>
      </DaoOverviewLeftPanel>
    )
  }
  return (
    <DaoOverviewLeftPanel>
      <div>
        {leftItems.slice(0, 2).map((item, index) => (
          <NervosDaoLeftItem item={item} key={item.title} firstLine={index === 0} />
        ))}
      </div>
      <span className="dao__overview__middle__separate" />
      <div>
        {leftItems.slice(2, 4).map((item, index) => (
          <NervosDaoLeftItem item={item} key={item.title} firstLine={index === 0} />
        ))}
      </div>
      <span className="dao__overview__middle__separate" />
      <div>
        {leftItems.slice(4).map((item, index) => (
          <NervosDaoLeftItem item={item} key={item.title} firstLine={index === 0} />
        ))}
      </div>
    </DaoOverviewLeftPanel>
  )
}

const getOption = (nervosDao: State.NervosDao): echarts.EChartOption => {
  const { miningReward, depositCompensation, treasuryAmount } = nervosDao
  const sum =
    shannonToCkbDecimal(miningReward) + shannonToCkbDecimal(depositCompensation) + shannonToCkbDecimal(treasuryAmount)
  const names = [
    `${((shannonToCkbDecimal(miningReward) / sum) * 100).toFixed(1)}%`,
    `${((shannonToCkbDecimal(depositCompensation) / sum) * 100).toFixed(1)}%`,
    `${((shannonToCkbDecimal(treasuryAmount) / sum) * 100).toFixed(1)}%`,
  ]
  const seriesData = [
    {
      name: names[0],
      value: shannonToCkbDecimal(miningReward),
      title: i18n.t('nervos_dao.mining_reward'),
    },
    {
      name: names[1],
      value: shannonToCkbDecimal(depositCompensation),
      title: i18n.t('nervos_dao.deposit_compensation'),
    },
    {
      name: names[2],
      value: shannonToCkbDecimal(treasuryAmount),
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
      formatter: (value: any) =>
        `${value.data.title}: ${localeNumberString(value.data.value)} ${i18n.t('common.ckb_unit')} (${
          value.data.name
        })`,
      position: ['10%', '50%'],
    },
    series: [
      {
        name: i18n.t('nervos_dao.secondary_issuance'),
        type: 'pie',
        radius: '75%',
        center: ['50%', '50%'],
        data: seriesData,
        label: {
          normal: {
            position: 'outside',
            align: 'center',
          },
        },
        labelLine: {
          length: 4,
          length2: isMobile() ? 4 : 12,
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

const NervosDaoRightCapacity = ({ reward }: { reward: string }) => (
  <NervosDaoPieCapacityPanel>
    <DecimalCapacity
      value={localeNumberString(shannonToCkb(Number(reward).toFixed()))}
      fontSize={isMobile() ? '10px' : '12px'}
      marginBottom="2px"
      hideUnit
    />
  </NervosDaoPieCapacityPanel>
)

const nervosDaoPieItemContents = (nervosDao: State.NervosDao): NervosDaoPieItemContent[] => [
  {
    title: i18n.t('nervos_dao.mining_reward'),
    content: <NervosDaoRightCapacity reward={nervosDao.miningReward} />,
    img: DotIcon1,
  },
  {
    title: i18n.t('nervos_dao.deposit_compensation'),
    content: <NervosDaoRightCapacity reward={nervosDao.depositCompensation} />,
    img: DotIcon2,
  },
  {
    title: i18n.t('nervos_dao.burnt'),
    content: <NervosDaoRightCapacity reward={nervosDao.treasuryAmount} />,
    img: DotIcon3,
  },
]

const NervosDaoPieItem = ({ item }: { item: NervosDaoPieItemContent }) => (
  <NervosDaoPieItemPanel>
    <img src={item.img} alt="nervos dao dot" />
    <div>
      <span>{item.title}</span>
      <div>{item.content}</div>
    </div>
  </NervosDaoPieItemPanel>
)

export default () => {
  const {
    nervosDaoState: { nervosDao },
  } = useAppState()

  const screenWidth = useRef<number>(window.innerWidth)
  const widthDiff = window.innerWidth > 750 && Math.abs(screenWidth.current - window.innerWidth)

  const clickEvent = useCallback(() => {
    if (widthDiff) {
      screenWidth.current = window.innerWidth
    }
  }, [widthDiff])

  return (
    <DaoOverviewPanel>
      <NervosDaoOverviewLeftComp />
      <span className="dao__overview__separate" />
      <DaoOverviewRightPanel>
        <DaoOverviewPieChartPanel>
          <span className="nervos__dao__overview_pie_title">{i18n.t('nervos_dao.secondary_issuance')}</span>
          <ReactEchartsCore
            echarts={echarts}
            option={getOption(nervosDao)}
            notMerge
            lazyUpdate
            style={{
              height: isMobile() ? '65%' : '90%',
              width: !isMobile() && isScreenSmallerThan1200() ? '70%' : '100%',
            }}
            onEvents={{
              click: clickEvent,
            }}
          />
        </DaoOverviewPieChartPanel>
        <DaoOverviewPieItemsPanel>
          <div>
            {nervosDaoPieItemContents(nervosDao).map(item => (
              <NervosDaoPieItem item={item} key={item.title} />
            ))}
          </div>
        </DaoOverviewPieItemsPanel>
      </DaoOverviewRightPanel>
    </DaoOverviewPanel>
  )
}
