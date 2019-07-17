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
  DivideLine,
} from '../../components/Table'
import BlockCard from '../../components/Card/BlockCard'
import MoreLeftIcon from '../../assets/more_left.png'
import MoreRightIcon from '../../assets/more_right.png'
import { fetchBlocks, fetchStatistics } from '../../service/http/fetcher'
import { shannonToCkb } from '../../utils/util'
import { parseTime, parseSimpleDate } from '../../utils/date'
import { BLOCK_POLLING_TIME, CachedKeys } from '../../utils/const'
import { storeCachedData, fetchCachedData } from '../../utils/cached'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'

const BlockchainItem = ({ name, value, tip }: { name: string; value: string; tip?: string }) => {
  return (
    <HomeHeaderItemPanel>
      <div className="blockchain__item__value">{value}</div>
      <div className="blockchain__item__name">{`${name}`}</div>
      {tip && (
        <div className="blockchain__item__tip">
          <div className="blockchain__item__tip__content">{tip}</div>
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
  fetchStatistics().then(response => {
    const { data } = response as Response.Response<Response.Wrapper<State.Statistics>>
    setStatistics(data.attributes)
  })
}

interface BlockchainData {
  name: string
  value: string
  tip: string
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
    },
    {
      name: t('blockchain.hash_rate'),
      value: parseHashRate(statistics.hash_rate),
      tip: t('blockchain.hash_rate_tooltip'),
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
            return <BlockchainItem name={data.name} value={data.value} tip={data.tip} key={data.name} />
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
              <TableTitleItem width="14%" title={t('home.height')} />
              <TableTitleItem width="14%" title={t('home.transactions')} />
              <TableTitleItem width="20%" title={t('home.block_reward')} />
              <TableTitleItem width="37%" title={t('block.miner')} />
              <TableTitleItem width="15%" title={t('home.time')} />
            </TableTitleRow>
            {blocksWrappers &&
              blocksWrappers.map((block: any, index: number) => {
                const key = index
                return (
                  block && (
                    <>
                      <TableContentRow key={key}>
                        <TableContentItem
                          width="14%"
                          content={localeNumberString(block.attributes.number)}
                          to={`/block/${block.attributes.number}`}
                        />
                        <TableContentItem width="14%" content={block.attributes.transactions_count} />
                        <TableContentItem
                          width="20%"
                          content={localeNumberString(shannonToCkb(block.attributes.reward))}
                        />
                        <TableMinerContentItem width="37%" content={block.attributes.miner_hash} />
                        <TableContentItem width="15%" content={parseSimpleDate(block.attributes.timestamp)} />
                      </TableContentRow>
                      <DivideLine />
                    </>
                  )
                )
              })}
          </ContentTable>
        )}
        <TableMorePanel>
          <div>
            <img src={MoreLeftIcon} alt="more left" />
            <Link to="/block/list">
              <div className="table__more">{t('home.more')}</div>
            </Link>
            <img src={MoreRightIcon} alt="more right" />
          </div>
        </TableMorePanel>
      </BlockPanel>
    </Content>
  )
}
