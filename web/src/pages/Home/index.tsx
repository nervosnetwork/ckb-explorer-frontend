import React, { useEffect, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HomeHeaderPanel,
  HomeHeaderItemPanel,
  HomeHeaderItemMobilePanel,
  BlockPanel,
  ContentTable,
  TableMorePanel,
} from './styled'
import { parseSimpleDate } from '../../utils/date'
import Content from '../../components/Content'
import AppContext from '../../contexts/App'
import {
  TableTitleRow,
  TableTitleItem,
  TableContentRow,
  TableContentItem,
  TableMinerContentItem,
} from '../../components/Table'
import BlockHeightIcon from '../../asserts/block_height.png'
import TransactionIcon from '../../asserts/transactions.png'
import BlockRewardIcon from '../../asserts/block_reward_white.png'
import MinerIcon from '../../asserts/miner.png'
import TimestampIcon from '../../asserts/timestamp.png'
import MoreLeftIcon from '../../asserts/more_left.png'
import MoreRightIcon from '../../asserts/more_right.png'
import BestBlockImage from '../../asserts/best_block_background.png'
import BlockTimeImage from '../../asserts/block_time_background.png'
import DifficultyImage from '../../asserts/difficulty_background.png'
import HashRateImage from '../../asserts/hash_rate_background.png'
import { fetchBlocks } from '../../http/fetcher'
import { BlockWrapper } from '../../http/response/Block'
import { Response } from '../../http/response/Response'
import { shannonToCkb } from '../../utils/util'

const BlockchainItem = ({ name, value, image, tip }: { name: string; value: string; image: any; tip?: string }) => {
  return (
    <HomeHeaderItemPanel image={image}>
      <div className="blockchain__item__value">{value}</div>
      <div className="blockchain__item__name">{`${name} ${tip}`}</div>
    </HomeHeaderItemPanel>
  )
}

const BlockchainItemMobile = ({ name, value }: { name: string; value: string }) => {
  return (
    <HomeHeaderItemMobilePanel>
      <div className="blockchain__item__value">{value}</div>
      <div className="blockchain__item__name">{name}</div>
    </HomeHeaderItemMobilePanel>
  )
}

export default () => {
  const initBlockWrappers: BlockWrapper[] = []
  const [blocksWrappers, setBlocksWrappers] = useState(initBlockWrappers)

  const appContext = useContext(AppContext)
  const getLatestBlocks = () => {
    appContext.showLoading()
    fetchBlocks()
      .then(json => {
        const { data } = json as Response<BlockWrapper[]>
        setBlocksWrappers(data)
        appContext.hideLoading()
      })
      .catch(() => {
        appContext.hideLoading()
        appContext.toastMessage('Network exception, please try again later', 3000)
      })
  }

  const BLOCK_POLLING_TIME = 1000
  useEffect(() => {
    getLatestBlocks()
    const listener = setInterval(() => {
      fetchBlocks().then(json => {
        const { data } = json as Response<BlockWrapper[]>
        setBlocksWrappers(data)
      })
    }, BLOCK_POLLING_TIME)

    return () => {
      if (listener) {
        clearInterval(listener)
      }
    }
  }, [])

  interface BlockchainData {
    name: string
    value: string
    image: any
  }

  const BlockchainDatas: BlockchainData[] = [
    {
      name: 'Best Block',
      value: '10000',
      image: BestBlockImage,
    },
    {
      name: 'Difficulty',
      value: '1 874 086 735',
      image: DifficultyImage,
    },
    {
      name: 'Hash Rate',
      value: '1 KH/s',
      image: HashRateImage,
    },
    {
      name: 'Average Block Time',
      value: '5.3 s',
      image: BlockTimeImage,
    },
  ]

  return (
    <Content>
      <HomeHeaderPanel>
        {window.innerWidth > 700 &&
          BlockchainDatas.map((data: BlockchainData) => {
            return <BlockchainItem name={data.name} value={data.value} image={data.image} />
          })}
        {window.innerWidth <= 700 &&
          BlockchainDatas.map((data: BlockchainData) => {
            return <BlockchainItemMobile name={data.name} value={data.value} />
          })}
      </HomeHeaderPanel>
      <BlockPanel className="container" width={window.innerWidth}>
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
                    <TableContentItem content={block.attributes.number} to={`/block/${block.attributes.number}`} />
                    <TableContentItem content={block.attributes.transactions_count} />
                    <TableContentItem content={`${shannonToCkb(block.attributes.reward)}`} />
                    <TableMinerContentItem content={block.attributes.miner_hash} />
                    <TableContentItem content={parseSimpleDate(block.attributes.timestamp)} />
                  </TableContentRow>
                )
              )
            })}
        </ContentTable>
        <TableMorePanel>
          <div>
            <img src={MoreLeftIcon} alt="more left" />
            <div>
              <Link className="table__more" to="/block/list">
                {`More`}
              </Link>
            </div>
            <img src={MoreRightIcon} alt="more right" />
          </div>
        </TableMorePanel>
      </BlockPanel>
    </Content>
  )
}
