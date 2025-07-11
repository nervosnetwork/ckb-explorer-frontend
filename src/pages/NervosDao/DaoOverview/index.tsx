import { ReactNode, useCallback, FC } from 'react'
import BigNumber from 'bignumber.js'
import classNames from 'classnames'
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts/core'
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  LegendScrollComponent,
} from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useTranslation } from 'react-i18next'
import DaoUpIcon from './dao_up.png'
import DaoDownIcon from './dao_down.png'
import DaoBalanceIcon from './dao_balance.png'
import { handleBigNumber, handleBigNumberFloor } from '../../../utils/string'
import { localeNumberString } from '../../../utils/number'
import { shannonToCkbDecimal, shannonToCkb } from '../../../utils/util'
import { useIsExtraLarge, useIsMobile } from '../../../hooks'
import { ReactChartCore } from '../../StatisticsChart/common'
import { HelpTip } from '../../../components/HelpTip'
import { ChartColor } from '../../../constants/common'
import { assertNotArray } from '../../../utils/chart'
import { APIReturn } from '../../../services/ExplorerService'
import styles from './DaoOverview.module.scss'
import Tooltip from '../../../components/Tooltip'

echarts.use([
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  LegendScrollComponent,
  PieChart,
  CanvasRenderer,
  UniversalTransition,
])

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

const Capacity: FC<{ capacity: string }> = ({ capacity }) => {
  const [int, dec] = new BigNumber(capacity).toFormat(8).split('.')
  return (
    <div className={styles.capacity}>
      <span data-role="int">{int}</span>
      <span data-role="dec" className="monospace">
        {`.${dec}`}
      </span>
    </div>
  )
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
  <div className={styles.daoOverviewLeftItemPanel}>
    <div className="daoOverviewItemContainer">
      <div className="daoOverviewItemTop">
        <span
          className={classNames('daoOverviewItemTitle', {
            hasChange: !!item.change,
          })}
        >
          {item.title}
        </span>
        {item.titleTooltip && <HelpTip>{item.titleTooltip}</HelpTip>}
        {item.change && (
          <>
            <img
              className="daoOverviewItemChangeIcon"
              style={{
                width: item.changeSymbol === 'zero' ? '10px' : '7px',
                height: item.changeSymbol === 'zero' ? '7px' : '10px',
              }}
              src={daoIcon(item.changeSymbol)}
              alt="nervos dao change icon"
            />
            <Tooltip
              trigger={
                <span
                  className="daoOverviewItemChange"
                  style={{
                    color: item.changeSymbol === 'negative' ? '#FF464F' : 'var(--primary-color)',
                  }}
                >
                  {item.change}
                </span>
              }
              placement="top"
            >
              {item.tooltip}
            </Tooltip>
          </>
        )}
      </div>
      <div className="daoOverviewItemContent">{item.content}</div>
      {firstLine && <span className="daoOverviewBottomLine" />}
    </div>
  </div>
)

const NervosDaoOverviewLeftComp: FC<{ nervosDao: NervosDaoInfo }> = ({ nervosDao }) => {
  const isMobile = useIsMobile()
  const leftItems = useNervosDaoItemContents(nervosDao)

  if (isMobile) {
    return (
      <div className={styles.daoOverviewLeftPanel}>
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
      </div>
    )
  }
  return (
    <div className={styles.daoOverviewLeftPanel}>
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
    </div>
  )
}

const useOption = (nervosDao: NervosDaoInfo, colors: string[], isMobile: boolean): EChartsOption => {
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
      formatter: (value: any) => {
        assertNotArray(value)
        return `${value.data?.title}: ${localeNumberString(value.data.value)} ${t('common.ckb_unit')} (${
          value.data.name
        })`
      },
      backgroundColor: 'rgba(50, 50, 50, 0.7)',
      borderWidth: 0,
      textStyle: {
        color: '#fff',
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
          position: 'outside',
          align: 'center',
        },
        labelLine: {
          length: 4,
          length2: isMobile ? 4 : 12,
        },
        emphasis: {
          itemStyle: {
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
  return (
    <div className={styles.nervosDaoPieCapacityPanel}>
      <Capacity capacity={shannonToCkb(Number(reward).toFixed())} />
    </div>
  )
}

const NervosDaoPieItem = ({ item }: { item: NervosDaoPieItemContent }) => (
  <div className={styles.nervosDaoPieItemPanel}>
    <div
      className={styles.nervosDaoOverviewPieIcon}
      style={{
        backgroundColor: item.color,
      }}
    />
    <div>
      <span>{item.title}</span>
      <div>{item.content}</div>
    </div>
  </div>
)

export default ({ nervosDao }: { nervosDao: NervosDaoInfo }) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const isExactXL = useIsExtraLarge(true)

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
    <div className={styles.daoOverviewPanel}>
      <NervosDaoOverviewLeftComp nervosDao={nervosDao} />
      <span className="daoOverviewSeparate" />
      <div className={styles.daoOverviewRightPanel}>
        <div className={styles.daoOverviewPieChartPanel}>
          <div className={styles.nervosDaoOverviewPieTitle}>
            <span>{t('nervos_dao.secondary_issuance')}</span>
            <HelpTip>{t('glossary.secondary_issuance')}</HelpTip>
          </div>
          <ReactChartCore
            option={useOption(nervosDao, ChartColor.daoColors, isMobile)}
            notMerge
            lazyUpdate
            style={{
              height: isMobile ? '65%' : '90%',
              width: isExactXL ? '70%' : '100%',
            }}
          />
        </div>
        <div className={styles.daoOverviewPieItemsPanel}>
          <div>
            {nervosDaoPieItemContents(nervosDao).map(item => (
              <NervosDaoPieItem item={item} key={item.title} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
