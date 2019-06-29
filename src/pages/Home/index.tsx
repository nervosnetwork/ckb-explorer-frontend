import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HomeHeaderPanel,
  HomeHeaderItemPanel,
  HomeHeaderItemMobilePanel,
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
import BestBlockImage from '../../assets/best_block_background.png'
import BlockTimeImage from '../../assets/block_time_background.png'
import DifficultyImage from '../../assets/difficulty_background.png'
import HashRateImage from '../../assets/hash_rate_background.png'

import { fetchBlocks, fetchStatistics } from '../../http/fetcher'
import { BlockWrapper } from '../../http/response/Block'
import { StatisticsWrapper, Statistics } from '../../http/response/Statistics'
import { Response } from '../../http/response/Response'
import { shannonToCkb } from '../../utils/util'
import { parseTime, parseSimpleDate } from '../../utils/date'
import { BLOCK_POLLING_TIME, CachedKeys } from '../../utils/const'
import { storeCachedData, fetchCachedData } from '../../utils/cached'
import { localeNumberString } from '../../utils/number'

const BlockchainItem = ({ name, value, image, tip }: { name: string; value: string; image: any; tip?: string }) => {
  return (
    <HomeHeaderItemPanel image={image}>
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

const BlockchainItemMobile = ({ name, value, image }: { name: string; value: string; image: any }) => {
  return (
    <HomeHeaderItemMobilePanel image={image}>
      <div className="blockchain__item__value">{value}</div>
      <div className="blockchain__item__name">{name}</div>
    </HomeHeaderItemMobilePanel>
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
  image: any
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
      name: 'Best Block',
      value: localeNumberString(statistics.tip_block_number),
      image: BestBlockImage,
      tip: 'The latest block of the best chain',
    },
    {
      name: 'Difficulty',
      value: `${parseInt(`${statistics.current_epoch_difficulty}`, 10).toLocaleString()}`,
      image: DifficultyImage,
      tip: 'Difficulty of the lastest Epoch',
    },
    {
      name: 'Hash Rate',
      value: `${parseInt((Number(statistics.hash_rate) * 1000).toFixed(), 10).toLocaleString()} gps`,
      image: HashRateImage,
      tip: 'Average Hash Rate of the last 500 blocks',
    },
    {
      name: 'Average Block Time',
      value: parseTime(Number(statistics.average_block_time)),
      image: BlockTimeImage,
      tip: 'Average Block Time of the last 24 hours',
    },
  ]

  return (
    <Content>
      <HomeHeaderPanel>
        {BlockchainDatas.map((data: BlockchainData) => {
          return (
            <BlockchainItem name={data.name} value={data.value} image={data.image} tip={data.tip} key={data.name} />
          )
        })}
        {BlockchainDatas.map((data: BlockchainData) => {
          return <BlockchainItemMobile name={data.name} value={data.value} image={data.image} key={data.name} />
        })}
      </HomeHeaderPanel>
      <BlockPanel className="container">
        <BlockListPC>
          <ContentTable>
            <TableTitleRow>
              <TableTitleItem image={BlockHeightIcon} title="Height" />
              <TableTitleItem image={TransactionIcon} title="Transactions" />
              <TableTitleItem image={BlockRewardIcon} title="Block Reward (CKB)" />
              <TableTitleItem image={MinerIcon} title="Miner" />
              <TableTitleItem image={TimestampIcon} title="Time" />
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
              <div className="table__more">More</div>
            </Link>
            <img src={MoreRightIcon} alt="more right" />
          </div>
        </TableMorePanel>
      </BlockPanel>
    </Content>
  )
}
