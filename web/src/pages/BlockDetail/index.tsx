import React, { useState } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import {
  BlockDetailPanel,
  BlockDetailTitlePanel,
  BlockOverviewPanel,
  BlockCommonContent,
  BlockPreviousNextPanel,
  BlockHightLabel,
  BlockTransactionsPanel,
  BlockTransactionsPagition,
} from './index.css'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import Transaction from '../../components/Transaction'
import SimpleLabel from '../../components/Label'
import CellConsumedLabel from '../../components/Label/CellConsumedLabel'
import CopyIcon from '../../asserts/copy.png'
import BlockHeightIcon from '../../asserts/block_height_green.png'
import BlockTransactionIcon from '../../asserts/transactions_green.png'
import ProposalTransactionsIcon from '../../asserts/proposal_transactions.png'
import CellConsumedIcon from '../../asserts/address_cell_consumed.png'
import TimestampIcon from '../../asserts/timestamp_green.png'
import VersionIcon from '../../asserts/version.png'
import UncleCountIcon from '../../asserts/uncle_count.png'
import MinerIcon from '../../asserts/miner_green.png'
import BlockRewardIcon from '../../asserts/block_reward.png'
import TransactionFeeIcon from '../../asserts/transaction_fee.png'
import DifficultyIcon from '../../asserts/difficulty.png'
import NonceIcon from '../../asserts/nonce.png'
import ProofIcon from '../../asserts/proof.png'
import PreviousBlockIcon from '../../asserts/left_arrow.png'
import NextBlockIcon from '../../asserts/right_arrow.png'
import MouseIcon from '../../asserts/block_mouse.png'
import { BlockData, TransactionsData } from '../../http/mock/block'
import { parseSimpleDate } from '../../utils/date'

const BlockDetailTitle = ({ hash }: { hash: string }) => {
  return (
    <BlockDetailTitlePanel>
      <div className="address__title">Block</div>
      <div className="address__content">
        <div>{hash}</div>
        <img src={CopyIcon} alt="copy" />
      </div>
    </BlockDetailTitlePanel>
  )
}

const BlockOverview = ({ value }: { value: string }) => {
  return <BlockOverviewPanel>{value}</BlockOverviewPanel>
}

const BlockPreviousNext = () => {
  return (
    <BlockPreviousNextPanel>
      <img className="block__arrow" src={PreviousBlockIcon} alt="previous block" />
      <img className="block__mouse" src={MouseIcon} alt="mouse" />
      <img className="block__arrow" src={NextBlockIcon} alt="next block" />
    </BlockPreviousNextPanel>
  )
}

interface BlockItem {
  image: any
  label: string
  value: string
}

export default (props: React.PropsWithoutRef<RouteComponentProps<{ hash: string }>>) => {
  const { match } = props
  const { params } = match
  const { hash } = params

  const PageSize = 3
  const [currentPageNo, setCurrentPageNo] = useState(1)

  // TODO: fetch transaction data from server
  const getTransactionOfAddress = (pageNo: number, pageSize: number) => {
    return TransactionsData.data.slice((pageNo - 1) * pageSize, pageNo * pageSize)
  }

  const onChange = (current: number, pageSize: number) => {
    setCurrentPageNo(current)
    getTransactionOfAddress(current, pageSize)
  }

  const BlockLeftSeparateIndex = 3

  const BlockLeftItems: BlockItem[] = [
    {
      image: BlockHeightIcon,
      label: 'Block Height:',
      value: `${BlockData.data.number}`,
    },
    {
      image: BlockTransactionIcon,
      label: 'Transactions:',
      value: `${BlockData.data.transactions_count}`,
    },
    {
      image: ProposalTransactionsIcon,
      label: 'Proposal Transactions:',
      value: `${BlockData.data.proposal_transactions_count}`,
    },
    {
      image: TimestampIcon,
      label: 'Timestamp:',
      value: `${parseSimpleDate(BlockData.data.timestamp)}`,
    },
    {
      image: VersionIcon,
      label: 'Version:',
      value: `${BlockData.data.version}`,
    },
    {
      image: UncleCountIcon,
      label: 'Uncle Count:',
      value: `${BlockData.data.uncles_count}`,
    },
  ]

  const BlockRightItems: BlockItem[] = [
    {
      image: MinerIcon,
      label: 'Miner:',
      value: `${BlockData.data.miner_hash}`,
    },
    {
      image: BlockRewardIcon,
      label: 'Block Reward:',
      value: `${BlockData.data.reward}`,
    },
    {
      image: TransactionFeeIcon,
      label: 'Transaction Fee:',
      value: `${BlockData.data.total_transaction_fee}`,
    },
    {
      image: DifficultyIcon,
      label: 'Difficulty:',
      value: `${BlockData.data.difficulty}`,
    },
    {
      image: NonceIcon,
      label: 'Nonce:',
      value: `${BlockData.data.nonce}`,
    },
    {
      image: ProofIcon,
      label: 'Proof:',
      value: `${BlockData.data.proof}`,
    },
  ]

  return (
    <Page>
      <Header />
      <Content>
        <BlockDetailPanel width={window.innerWidth}>
          <BlockDetailTitle hash={hash} />
          <BlockOverview value="Overview" />
          <BlockCommonContent>
            <div>
              {BlockLeftItems.slice(0, BlockLeftSeparateIndex).map(item => {
                return <SimpleLabel image={item.image} label={item.label} value={item.value} />
              })}
              <CellConsumedLabel
                image={CellConsumedIcon}
                label="Cell Consumed"
                consumed={BlockData.data.cell_consumed}
                balance={BlockData.data.total_cell_capacity}
              />
              {BlockLeftItems.slice(BlockLeftSeparateIndex).map(item => {
                return <SimpleLabel image={item.image} label={item.label} value={item.value} />
              })}
            </div>
            <span className="block__content__separate" />
            <div>
              <Link
                to={{
                  pathname: `/address/${BlockRightItems[0].value}`,
                }}
              >
                <SimpleLabel
                  image={BlockRightItems[0].image}
                  label={BlockRightItems[0].label}
                  value={BlockRightItems[0].value}
                  highLight
                />
              </Link>
              {BlockRightItems.slice(1).map(item => {
                return <SimpleLabel image={item.image} label={item.label} value={item.value} />
              })}
            </div>
          </BlockCommonContent>
          <BlockPreviousNext />
          <BlockHightLabel>Block Height</BlockHightLabel>

          <BlockTransactionsPanel>
            <BlockOverview value="Transactions" />
            <div>
              {getTransactionOfAddress(currentPageNo, PageSize).map((transaction: any) => {
                return <Transaction transaction={transaction} key={transaction.transaction_hash} />
              })}
            </div>
            <BlockTransactionsPagition>
              <Pagination
                showQuickJumper
                showSizeChanger
                defaultPageSize={PageSize}
                defaultCurrent={currentPageNo}
                total={TransactionsData.data.length}
                onChange={onChange}
              />
            </BlockTransactionsPagition>
          </BlockTransactionsPanel>
        </BlockDetailPanel>
      </Content>
      <Footer />
    </Page>
  )
}
