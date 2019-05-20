import React, { useEffect, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HomeHeaderPanel,
  HomeHeader,
  LogoPanel,
  BlockPanel,
  SearchPanel,
  ContentTitle,
  ContentTable,
  TableMorePanel,
} from './styled'
import { parseDate } from '../../utils/date'
import Content from '../../components/Content'
import AppContext from '../../contexts/App'
import {
  TableTitleRow,
  TableTitleItem,
  TableContentRow,
  TableContentItem,
  TableMinerContentItem,
} from '../../components/Table'
import Search from '../../components/Search'
import browserHistory from '../../routes/history'
import BlockHeightIcon from '../../asserts/block_height.png'
import TransactionIcon from '../../asserts/transactions.png'
import BlockRewardIcon from '../../asserts/block_reward.png'
import MinerIcon from '../../asserts/miner.png'
import TimestampIcon from '../../asserts/timestamp.png'
import MoreLeftIcon from '../../asserts/more_left.png'
import MoreRightIcon from '../../asserts/more_right.png'
import { fetchBlocks } from '../../http/fetcher'
import { BlockWrapper } from '../../http/response/Block'
import { Response } from '../../http/response/Response'
import { shannonToCkb } from '../../utils/util'

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
        browserHistory.push('/search/fail')
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

  return (
    <Content>
      <HomeHeaderPanel width={window.innerWidth}>
        <HomeHeader>
          <LogoPanel width={window.innerWidth}>
            <div>CKB Testnet Explorer</div>
          </LogoPanel>
          <SearchPanel width={window.innerWidth}>
            <Search />
          </SearchPanel>
        </HomeHeader>
      </HomeHeaderPanel>

      <BlockPanel className="container" width={window.innerWidth}>
        <ContentTitle>
          <div>Blocks</div>
          <span />
        </ContentTitle>

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
                    <TableContentItem content={parseDate(block.attributes.timestamp)} />
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
