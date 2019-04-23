import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HomeHeaderPanel,
  HomeHeader,
  LogoPanel,
  BlockPanel,
  ContentTitle,
  ContentTable,
  TableMorePanel,
} from './styled'
import { parseDate } from '../../utils/date'
import Content from '../../components/Content'
import {
  TableTitleRow,
  TableTitleItem,
  TableContentRow,
  TableContentItem,
  TableMinerContentItem,
} from '../../components/Table'
import HomeLogo from '../../asserts/logo_home.png'
import Search from '../../components/Search'
import BlockHeightIcon from '../../asserts/block_height.png'
import TransactionIcon from '../../asserts/transactions.png'
import CellConsumedIcon from '../../asserts/cell_consumed.png'
import MinerIcon from '../../asserts/miner.png'
import TimestampIcon from '../../asserts/timestamp.png'
import MoreLeftIcon from '../../asserts/more_left.png'
import MoreRightIcon from '../../asserts/more_right.png'
import { fetchBlocks } from '../../http/fetcher'
import { BlockWrapper } from '../../http/response/Block'
import { Response } from '../../http/response/Response'

export default () => {
  const initBlockWrappers: BlockWrapper[] = []
  const [blocksWrappers, setBlocksWrappers] = useState(initBlockWrappers)
  useEffect(() => {
    fetchBlocks().then(json => {
      const { data } = json as Response<BlockWrapper[]>
      setBlocksWrappers(data)
    })
  }, [])

  return (
    <Content>
      <HomeHeaderPanel width={window.innerWidth}>
        <HomeHeader>
          <LogoPanel>
            <img src={HomeLogo} alt="home logo" />
            <div>CKB Testnet Explorer</div>
          </LogoPanel>
          <Search />
        </HomeHeader>
      </HomeHeaderPanel>

      <BlockPanel className="container" width={window.innerWidth}>
        <ContentTitle>
          <div>Latest Blocks</div>
          <span />
        </ContentTitle>

        <ContentTable>
          <TableTitleRow>
            <TableTitleItem image={BlockHeightIcon} title="Height" />
            <TableTitleItem image={TransactionIcon} title="Transactions" />
            <TableTitleItem image={CellConsumedIcon} title="Cell Consumed(B)" />
            <TableTitleItem image={MinerIcon} title="Miner" />
            <TableTitleItem image={TimestampIcon} title="Time" />
          </TableTitleRow>
          {blocksWrappers &&
            blocksWrappers.map((block: any) => {
              return (
                <TableContentRow key={block.attributes.block_hash}>
                  <TableContentItem content={block.attributes.number} to={`block/${block.attributes.number}`} />
                  <TableContentItem content={block.attributes.transactions_count} />
                  <TableContentItem content={block.attributes.cell_consumed} />
                  <TableMinerContentItem content={block.attributes.miner_hash} />
                  <TableContentItem content={parseDate(block.attributes.timestamp)} />
                </TableContentRow>
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
