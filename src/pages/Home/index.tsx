import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HomeHeaderPanel, HomeHeaderItemPanel, BlockPanel, ContentTable, TableMorePanel } from './styled'
import Content from '../../components/Content'
import {
  TableTitleRow,
  TableTitleItem,
  TableContentRow,
  TableContentItem,
  TableMinerContentItem,
} from '../../components/Table'
import BlockCard from '../../components/Card/BlockCard'
import { fetchBlocks, fetchStatistics } from '../../service/http/fetcher'
import { shannonToCkb } from '../../utils/util'
import { parseTime, parseSimpleDate } from '../../utils/date'
import { BLOCK_POLLING_TIME, CachedKeys } from '../../utils/const'
import { storeCachedData, fetchCachedData } from '../../utils/cached'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import browserHistory from '../../routes/history'
import i18n from '../../utils/i18n'

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
      {blockchain.tip && (
        <div className="blockchain__item__tip">
          <div className="blockchain__item__tip__content">{blockchain.tip}</div>
        </div>
      )}
    </HomeHeaderItemPanel>
  )
}

const getLatestBlocks = (setBlocksWrappers: any) => {
  fetchBlocks().then(response => {
    const { data } = response as Response.Response<Response.Wrapper<State.Block>[]>
    setBlocksWrappers(data)
  })
}

const getStatistics = (setStatistics: any) => {
  fetchStatistics().then((wrapper: Response.Wrapper<State.Statistics>) => {
    if (wrapper) {
      setStatistics(wrapper.attributes)
    }
  })
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

const initStatistics: State.Statistics = {
  tip_block_number: '0',
  average_block_time: '0',
  current_epoch_difficulty: 0,
  hash_rate: '0',
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

const getTableContentDatas = (data: Response.Wrapper<State.Block>) => {
  const tableContentDatas: TableContentData[] = [
    {
      width: '14%',
      to: `/block/${data.attributes.number}`,
      content: localeNumberString(data.attributes.number),
    },
    {
      width: '14%',
      content: `${data.attributes.transactions_count}`,
    },
    {
      width: '20%',
      content: localeNumberString(shannonToCkb(data.attributes.reward)),
    },
    {
      width: '37%',
      content: data.attributes.miner_hash,
    },
    {
      width: '15%',
      content: parseSimpleDate(data.attributes.timestamp),
    },
  ]
  return tableContentDatas
}

export default () => {
  const initBlockWrappers: Response.Wrapper<State.Block>[] = []
  const [blocksWrappers, setBlocksWrappers] = useState(initBlockWrappers)
  const [statistics, setStatistics] = useState(initStatistics)
  const [t] = useTranslation()

  useEffect(() => {
    const cachedBlocks = fetchCachedData<Response.Wrapper<State.Block>[]>(CachedKeys.Blocks)
    if (cachedBlocks) {
      setBlocksWrappers(cachedBlocks)
    }
    const cachedStatistics = fetchCachedData<State.Statistics>(CachedKeys.Statistics)
    if (cachedStatistics) {
      setStatistics(cachedStatistics)
    }
  }, [setBlocksWrappers, setStatistics])

  useEffect(() => {
    storeCachedData(CachedKeys.Blocks, blocksWrappers)
    storeCachedData(CachedKeys.Statistics, statistics)
  }, [blocksWrappers, statistics])

  useEffect(() => {
    getLatestBlocks(setBlocksWrappers)
    getStatistics(setStatistics)
    const listener = setInterval(() => {
      getLatestBlocks(setBlocksWrappers)
      getStatistics(setStatistics)
    }, BLOCK_POLLING_TIME)
    return () => {
      if (listener) {
        clearInterval(listener)
      }
    }
  }, [setBlocksWrappers, setStatistics])

  const BlockchainDatas: BlockchainData[] = [
    {
      name: t('blockchain.best_block'),
      value: localeNumberString(statistics.tip_block_number),
      tip: t('blockchain.best_block_tooltip'),
    },
    {
      name: t('block.difficulty'),
      value: localeNumberString(statistics.current_epoch_difficulty, 10),
      tip: t('blockchain.difficulty_tooltip'),
      clickable: true,
    },
    {
      name: t('blockchain.hash_rate'),
      value: parseHashRate(statistics.hash_rate),
      tip: t('blockchain.hash_rate_tooltip'),
      clickable: true,
    },
    {
      name: t('blockchain.average_block_time'),
      value: statistics.average_block_time ? parseTime(Number(statistics.average_block_time)) : '- -',
      tip: t('blockchain.average_block_time_tooltip'),
    },
  ]

  return (
    <Content>
      <HomeHeaderPanel>
        <div className="blockchain__item__container">
          {BlockchainDatas.map((data: BlockchainData) => {
            return <BlockchainItem blockchain={data} key={data.name} />
          })}
        </div>
      </HomeHeaderPanel>
      <BlockPanel className="container">
        {isMobile() ? (
          <ContentTable>
            <div className="block__green__background" />
            <div className="block__panel">
              {blocksWrappers &&
                blocksWrappers.map((block: any, index: number) => {
                  const key = index
                  return block && <BlockCard key={key} block={block.attributes} />
                })}
            </div>
          </ContentTable>
        ) : (
          <ContentTable>
            <TableTitleRow>
              {TableTitleDatas.map((data: TableTitleData) => {
                return <TableTitleItem width={data.width} title={data.title} />
              })}
            </TableTitleRow>
            {blocksWrappers &&
              blocksWrappers.map((block: any, index: number) => {
                const key = index
                return (
                  block && (
                    <TableContentRow key={key}>
                      {getTableContentDatas(block).map((tableContentData: TableContentData) => {
                        if (tableContentData.content === block.attributes.miner_hash) {
                          return (
                            <TableMinerContentItem width={tableContentData.width} content={tableContentData.content} />
                          )
                        }
                        return (
                          <TableContentItem
                            width={tableContentData.width}
                            content={tableContentData.content}
                            to={tableContentData.to}
                          />
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
