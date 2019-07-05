import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  HomeHeaderPanel,
  HomeHeaderItemPanel,
  BlockPanel,
  ContentTable,
  TableMorePanel,
  BlockListPC,
  BlockListMobile,
} from './styled'
import Content from '../../components/Content'
import {
  TableTitleRow,
  TableTitleItem,
  TableContentRow,
  TableContentItem,
  TableMinerContentItem,
} from '../../components/Table'
import BlockCard from '../../components/Card/BlockCard'
import BlockHeightIcon from '../../assets/block_height.png'
import TransactionIcon from '../../assets/transactions.png'
import BlockRewardIcon from '../../assets/block_reward_white.png'
import MinerIcon from '../../assets/miner.png'
import TimestampIcon from '../../assets/timestamp.png'
import MoreLeftIcon from '../../assets/more_left.png'
import MoreRightIcon from '../../assets/more_right.png'
import { fetchBlocks, fetchStatistics } from '../../http/fetcher'
import { BlockWrapper } from '../../http/response/Block'
import { StatisticsWrapper, Statistics } from '../../http/response/Statistics'
import { Response } from '../../http/response/Response'
import { shannonToCkb } from '../../utils/util'
import { parseTime, parseSimpleDate } from '../../utils/date'
import { BLOCK_POLLING_TIME, CachedKeys } from '../../utils/const'
import { storeCachedData, fetchCachedData } from '../../utils/cached'
import { localeNumberString } from '../../utils/number'

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
    const { data } = response as Response<BlockWrapper[]>
    setBlocksWrappers(data)
  })
}

const getStatistics = (setStatistics: any) => {
  fetchStatistics().then(response => {
    const { data } = response as Response<StatisticsWrapper>
    setStatistics(data.attributes)
  })
}

interface BlockchainData {
  name: string
  value: string
  tip: string
}

const initStatistics: Statistics = {
  tip_block_number: '0',
  average_block_time: '0',
  current_epoch_difficulty: 0,
  hash_rate: '0',
}

export default () => {
  const initBlockWrappers: BlockWrapper[] = []
  const [blocksWrappers, setBlocksWrappers] = useState(initBlockWrappers)
  const [statistics, setStatistics] = useState(initStatistics)
  const [t] = useTranslation()

  useEffect(() => {
    const cachedBlocks = fetchCachedData<BlockWrapper[]>(CachedKeys.Blocks)
    if (cachedBlocks) {
      setBlocksWrappers(cachedBlocks)
    }
    const cachedStatistics = fetchCachedData<Statistics>(CachedKeys.Statistics)
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
      value: `${parseInt(`${statistics.current_epoch_difficulty}`, 10).toLocaleString()}`,
      tip: t('blockchain.difficulty_tooltip'),
    },
    {
      name: t('blockchain.hash_rate'),
      value: `${parseInt((Number(statistics.hash_rate) * 1000).toFixed(), 10).toLocaleString()} gps`,
      tip: t('blockchain.hash_rate_tooltip'),
    },
    {
      name: t('blockchain.average_block_time'),
      value: parseTime(Number(statistics.average_block_time)),
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
        <BlockListPC>
          <ContentTable>
            <TableTitleRow>
              <TableTitleItem image={BlockHeightIcon} title={t('home.height')} />
              <TableTitleItem image={TransactionIcon} title={t('home.transactions')} />
              <TableTitleItem image={BlockRewardIcon} title={t('home.block_reward')} />
              <TableTitleItem image={MinerIcon} title={t('block.miner')} />
              <TableTitleItem image={TimestampIcon} title={t('home.time')} />
            </TableTitleRow>
            {blocksWrappers &&
              blocksWrappers.map((block: any, index: number) => {
                const key = index
                return (
                  block && (
                    <TableContentRow key={key}>
                      <TableContentItem
                        content={localeNumberString(block.attributes.number)}
                        to={`/block/${block.attributes.number}`}
                      />
                      <TableContentItem content={block.attributes.transactions_count} />
                      <TableContentItem content={localeNumberString(shannonToCkb(block.attributes.reward))} />
                      <TableMinerContentItem content={block.attributes.miner_hash} />
                      <TableContentItem content={parseSimpleDate(block.attributes.timestamp)} />
                    </TableContentRow>
                  )
                )
              })}
          </ContentTable>
        </BlockListPC>
        <BlockListMobile>
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
        </BlockListMobile>
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
