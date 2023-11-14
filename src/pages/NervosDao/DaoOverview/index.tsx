import { ReactNode, useCallback, FC } from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
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
import DaoUpIcon from './dao_up.png'
import DaoDownIcon from './dao_down.png'
import DaoBalanceIcon from './dao_balance.png'
import { handleBigNumber, handleBigNumberFloor } from '../../../utils/string'
import { localeNumberString } from '../../../utils/number'
import { shannonToCkbDecimal, shannonToCkb } from '../../../utils/util'
import DecimalCapacity from '../../../components/DecimalCapacity'
import { useIsLGScreen, useIsMobile } from '../../../utils/hook'
import { ReactChartCore } from '../../StatisticsChart/common'
import { HelpTip } from '../../../components/HelpTip'
import { ChartColor } from '../../../constants/common'
import { assertNotArray } from '../../../utils/chart'
import { APIReturn } from '../../../services/ExplorerService'

type NervosDaoInfo = APIReturn<'fetchNervosDao'>

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
  color: string
}

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

const useNervosDaoItemContents = (nervosDao: NervosDaoInfo): NervosDaoItemContent[] => {
  const { t } = useTranslation()
  return [
    {
      title: t('nervos_dao.deposit'),
      change: handleBigNumberFloor(shannonToCkbDecimal(nervosDao.depositChanges, 2), 2),
      changeSymbol: numberSymbol(Number(nervosDao.depositChanges)),
      content: localeNumberString(shannonToCkbDecimal(nervosDao.totalDeposit, 2)),
      tooltip: t('nervos_dao.today_update'),
    },
    {
      title: t('nervos_dao.addresses'),
      titleTooltip: t('nervos_dao.deposit_address_tooltip'),
      change: localeNumberString(nervosDao.depositorChanges),
      changeSymbol: numberSymbol(Number(nervosDao.depositorChanges), false),
      content: localeNumberString(nervosDao.depositorsCount),
      tooltip: t('nervos_dao.today_update'),
    },

    {
      title: t('nervos_dao.claimed_compensation'),
      change: handleBigNumberFloor(shannonToCkbDecimal(nervosDao.claimedCompensationChanges, 2), 2),
      changeSymbol: numberSymbol(Number(nervosDao.claimedCompensationChanges)),
      content: localeNumberString(shannonToCkbDecimal(nervosDao.claimedCompensation, 2)),
      tooltip: t('nervos_dao.today_update'),
    },
    {
      title: t('nervos_dao.average_deposit_time'),
      content: `${handleBigNumber(nervosDao.averageDepositTime, 1)} ${t('nervos_dao.days')}`,
    },
    {
      title: t('nervos_dao.estimated_apc'),
      titleTooltip: t('glossary.estimated_apc'),
      content: `${Number(nervosDao.estimatedApc).toFixed(2)}%`,
    },
    {
      title: t('nervos_dao.unclaimed_compensation'),
      change: handleBigNumberFloor(shannonToCkbDecimal(nervosDao.unclaimedCompensationChanges, 2), 2),
      changeSymbol: numberSymbol(Number(nervosDao.unclaimedCompensationChanges)),
      content: localeNumberString(shannonToCkbDecimal(nervosDao.unclaimedCompensation, 2)),
      tooltip: t('nervos_dao.today_update'),
    },
  ]
}

const NervosDaoLeftItem = ({ item, firstLine }: { item: NervosDaoItemContent; firstLine?: boolean }) => (
  <DaoOverviewLeftItemPanel hasChange={!!item.change} symbol={item.changeSymbol} hasTooltip={!!item.titleTooltip}>
    <div className="daoOverviewItemContainer">
      <div className="daoOverviewItemTop">
        <span className="daoOverviewItemTitle">{item.title}</span>
        {item.titleTooltip && <HelpTip title={item.titleTooltip} />}
        {item.change && (
          <>
            <img className="daoOverviewItemChangeIcon" src={daoIcon(item.changeSymbol)} alt="nervos dao change icon" />
            <Tooltip placement="top" title={item.tooltip}>
              <span className="daoOverviewItemChange">{item.change}</span>
            </Tooltip>
          </>
        )}
      </div>
      <div className="daoOverviewItemContent">{item.content}</div>
      {firstLine && <span className="daoOverviewBottomLine" />}
    </div>
  </DaoOverviewLeftItemPanel>
)

const NervosDaoOverviewLeftComp: FC<{ nervosDao: NervosDaoInfo }> = ({ nervosDao }) => {
  const isMobile = useIsMobile()
  const leftItems = useNervosDaoItemContents(nervosDao)

  if (isMobile) {
    return (
      <DaoOverviewLeftPanel>
        <div>
          <NervosDaoLeftItem item={leftItems[0]} />
          <span className="daoOverviewLeftColumnSeparate" />
          <NervosDaoLeftItem item={leftItems[1]} />
        </div>
        <span className="daoOverviewMiddleSeparate" />
        <div>
          <NervosDaoLeftItem item={leftItems[3]} />
          <span className="daoOverviewLeftColumnSeparate" />
          <NervosDaoLeftItem item={leftItems[4]} />
        </div>
        <span className="daoOverviewMiddleSeparate" />
        <div>
          <NervosDaoLeftItem item={leftItems[2]} />
          <span className="daoOverviewLeftColumnSeparate" />
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
      <span className="daoOverviewMiddleSeparate" />
      <div>
        {leftItems.slice(2, 4).map((item, index) => (
          <NervosDaoLeftItem item={item} key={item.title} firstLine={index === 0} />
        ))}
      </div>
      <span className="daoOverviewMiddleSeparate" />
      <div>
        {leftItems.slice(4).map((item, index) => (
          <NervosDaoLeftItem item={item} key={item.title} firstLine={index === 0} />
        ))}
      </div>
    </DaoOverviewLeftPanel>
  )
}

const useOption = (nervosDao: NervosDaoInfo, colors: string[], isMobile: boolean): echarts.EChartOption => {
  const { t } = useTranslation()
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
      title: t('nervos_dao.mining_reward'),
    },
    {
      name: names[1],
      value: shannonToCkbDecimal(depositCompensation),
      title: t('nervos_dao.deposit_compensation'),
    },
    {
      name: names[2],
      value: shannonToCkbDecimal(treasuryAmount),
      title: t('nervos_dao.burnt'),
    },
  ]

  return {
    color: colors,
    tooltip: {
      trigger: 'item',
      formatter: value => {
        assertNotArray(value)
        return `${value.data.title}: ${localeNumberString(value.data.value)} ${t('common.ckb_unit')} (${
          value.data.name
        })`
      },
      position: ['10%', '50%'],
    },
    series: [
      {
        name: t('nervos_dao.secondary_issuance'),
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
          length2: isMobile ? 4 : 12,
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

const NervosDaoRightCapacity = ({ reward }: { reward: string }) => {
  const isMobile = useIsMobile()
  return (
    <NervosDaoPieCapacityPanel>
      <DecimalCapacity
        value={localeNumberString(shannonToCkb(Number(reward).toFixed()))}
        fontSize={isMobile ? '10px' : '12px'}
        marginBottom="2px"
        hideUnit
      />
    </NervosDaoPieCapacityPanel>
  )
}

const NervosDaoPieItem = ({ item }: { item: NervosDaoPieItemContent }) => (
  <NervosDaoPieItemPanel>
    <div
      className="nervosDaoOverviewPieIcon"
      style={{
        backgroundColor: item.color,
      }}
    />
    <div>
      <span>{item.title}</span>
      <div>{item.content}</div>
    </div>
  </NervosDaoPieItemPanel>
)

export default ({ nervosDao }: { nervosDao: NervosDaoInfo }) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const isExactLG = useIsLGScreen(true)

  const nervosDaoPieItemContents = useCallback(
    (nervosDao: NervosDaoInfo): NervosDaoPieItemContent[] => [
      {
        title: t('nervos_dao.mining_reward'),
        content: <NervosDaoRightCapacity reward={nervosDao.miningReward} />,
        color: ChartColor.daoColors[0],
      },
      {
        title: t('nervos_dao.deposit_compensation'),
        content: <NervosDaoRightCapacity reward={nervosDao.depositCompensation} />,
        color: ChartColor.daoColors[1],
      },
      {
        title: t('nervos_dao.burnt'),
        content: <NervosDaoRightCapacity reward={nervosDao.treasuryAmount} />,
        color: ChartColor.daoColors[2],
      },
    ],
    [t],
  )

  return (
    <DaoOverviewPanel>
      <NervosDaoOverviewLeftComp nervosDao={nervosDao} />
      <span className="daoOverviewSeparate" />
      <DaoOverviewRightPanel>
        <DaoOverviewPieChartPanel>
          <div className="nervosDaoOverviewPieTitle">
            <span>{t('nervos_dao.secondary_issuance')}</span>
            <HelpTip title={t('glossary.secondary_issuance')} />
          </div>
          <ReactChartCore
            option={useOption(nervosDao, ChartColor.daoColors, isMobile)}
            notMerge
            lazyUpdate
            style={{
              height: isMobile ? '65%' : '90%',
              width: isExactLG ? '70%' : '100%',
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
