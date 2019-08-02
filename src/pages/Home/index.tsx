import React, { useEffect, useContext } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  HomeHeaderPanel,
  HomeHeaderItemPanel,
  BlockPanel,
  ContentTable,
  TableMorePanel,
  HighLightValue,
} from './styled'
import Content from '../../components/Content'
import {
  TableTitleRow,
  TableTitleItem,
  TableContentRow,
  TableContentItem,
  TableMinerContentItem,
} from '../../components/Table'
import { shannonToCkb } from '../../utils/util'
import { parseTime, parseSimpleDate } from '../../utils/date'
import { BLOCK_POLLING_TIME } from '../../utils/const'
import { localeNumberString } from '../../utils/number'
import { startEndEllipsis } from '../../utils/string'
import { isMobile } from '../../utils/screen'
import browserHistory from '../../routes/history'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'
import { getLatestBlocks } from '../../service/app/block'
import getStatistics from '../../service/app/statistics'
import i18n from '../../utils/i18n'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'

const BlockchainItem = ({ blockchain }: { blockchain: BlockchainData }) => {
  return (
    <HomeHeaderItemPanel
      clickable={!!blockchain.clickable}
      onKeyPress={() => {}}
      onClick={() => {
        if (blockchain.clickable) browserHistory.push('./charts')
      }}
    >
      <div className="blockchain__item__value">{blockchain.value}</div>
      <div className="blockchain__item__name">{blockchain.name}</div>
      {blockchain.tip && <div className="blockchain__item__tip__content">{blockchain.tip}</div>}
    </HomeHeaderItemPanel>
  )
}

const BlockValueItem = ({ value, to }: { value: string; to: string }) => {
  return (
    <HighLightValue>
      <Link to={to}>
        <code>{value}</code>
      </Link>
    </HighLightValue>
  )
}

interface TableTitleData {
  title: string
  width: string
}

interface TableContentData {
  width: string
  to?: any
  content: string
}

interface BlockchainData {
  name: string
  value: string
  tip: string
  clickable?: boolean
}

const parseHashRate = (hashRate: string | undefined) => {
  return hashRate ? `${localeNumberString((Number(hashRate) * 1000).toFixed(), 10)} gps` : '- -'
}

const TableTitleDatas: TableTitleData[] = [
  {
    title: i18n.t('home.height'),
    width: '14%',
  },
  {
    title: i18n.t('home.transactions'),
    width: '14%',
  },
  {
    title: i18n.t('home.block_reward'),
    width: '20%',
  },
  {
    title: i18n.t('block.miner'),
    width: '37%',
  },
  {
    title: i18n.t('home.time'),
    width: '15%',
  },
]

const getTableContentDatas = (block: State.Block) => {
  return [
    {
      width: '14%',
      to: `/block/${block.number}`,
      content: localeNumberString(block.number),
    },
    {
      width: '14%',
      content: `${block.transactions_count}`,
    },
    {
      width: '20%',
      content: localeNumberString(shannonToCkb(block.reward)),
    },
    {
      width: '37%',
      content: block.miner_hash,
    },
    {
      width: '15%',
      content: parseSimpleDate(block.timestamp),
    },
  ] as TableContentData[]
}

const parseBlockTime = (blockTime: string | undefined) => {
  return blockTime ? parseTime(Number(blockTime)) : '- -'
}

const blockchainDatas = (statistics: State.Statistics) => {
  return [
    {
      name: i18n.t('blockchain.best_block'),
      value: localeNumberString(statistics.tip_block_number),
      tip: i18n.t('blockchain.best_block_tooltip'),
    },
    {
      name: i18n.t('block.difficulty'),
      value: localeNumberString(statistics.current_epoch_difficulty, 10),
      tip: i18n.t('blockchain.difficulty_tooltip'),
      clickable: true,
    },
    {
      name: i18n.t('blockchain.hash_rate'),
      value: parseHashRate(statistics.hash_rate),
      tip: i18n.t('blockchain.hash_rate_tooltip'),
      clickable: true,
    },
    {
      name: i18n.t('blockchain.average_block_time'),
      value: parseBlockTime(statistics.current_epoch_average_block_time),
      tip: i18n.t('blockchain.average_block_time_tooltip'),
    },
  ]
}

const blockCardItems = (block: State.Block) => {
  return [
    {
      title: i18n.t('home.height'),
      content: <BlockValueItem value={localeNumberString(block.number)} to={`/block/${block.number}`} />,
    },
    {
      title: i18n.t('home.transactions'),
      content: localeNumberString(block.transactions_count),
    },
    {
      title: i18n.t('home.block_reward'),
      content: localeNumberString(shannonToCkb(block.reward)),
    },
    {
      title: i18n.t('block.miner'),
      content: <BlockValueItem value={startEndEllipsis(block.miner_hash, 13)} to={`/address/${block.miner_hash}`} />,
    },
    {
      title: i18n.t('home.time'),
      content: parseSimpleDate(block.timestamp),
    },
  ] as OverviewItemData[]
}

export default ({ dispatch }: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps>) => {
  const { homeBlocks, statistics } = useContext(AppContext)
  const [t] = useTranslation()

  useEffect(() => {
    getLatestBlocks(dispatch)
    getStatistics(dispatch)
    const listener = setInterval(() => {
      getLatestBlocks(dispatch)
      getStatistics(dispatch)
    }, BLOCK_POLLING_TIME)
    return () => {
      if (listener) {
        clearInterval(listener)
      }
    }
  }, [dispatch])

  return (
    <Content>
      <HomeHeaderPanel>
        <div className="blockchain__item__container">
          {blockchainDatas(statistics).map((data: BlockchainData) => {
            return <BlockchainItem blockchain={data} key={data.name} />
          })}
        </div>
      </HomeHeaderPanel>
      <BlockPanel className="container">
        {isMobile() ? (
          <ContentTable>
            <div className="block__green__background" />
            <div className="block__panel">
              {homeBlocks &&
                homeBlocks.map((block: State.Block) => {
                  return <OverviewCard key={block.number} items={blockCardItems(block)} />
                })}
            </div>
          </ContentTable>
        ) : (
          <ContentTable>
            <TableTitleRow>
              {TableTitleDatas.map((data: TableTitleData) => {
                return <TableTitleItem width={data.width} title={data.title} key={data.title} />
              })}
            </TableTitleRow>
            {homeBlocks &&
              homeBlocks.map((block: State.Block) => {
                return (
                  block && (
                    <TableContentRow key={block.number}>
                      {getTableContentDatas(block).map((data: TableContentData, index: number) => {
                        const key = index
                        return (
                          <React.Fragment key={key}>
                            {data.content === block.miner_hash ? (
                              <TableMinerContentItem width={data.width} content={data.content} />
                            ) : (
                              <TableContentItem width={data.width} content={data.content} to={data.to} />
                            )}
                          </React.Fragment>
                        )
                      })}
                    </TableContentRow>
                  )
                )
              })}
          </ContentTable>
        )}
        <TableMorePanel>
          <div>
            <Link to="/block/list">
              <div className="table__more">{t('home.more')}</div>
            </Link>
          </div>
        </TableMorePanel>
      </BlockPanel>
    </Content>
  )
}
