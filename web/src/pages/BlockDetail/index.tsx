import React, { useState, useEffect, useContext } from 'react'
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
} from './styled'
import AppContext from '../../contexts/App'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import TransactionComponent from '../../components/Transaction'
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
import { Block } from '../../http/response/Block'
import { parseSimpleDate } from '../../utils/date'
import { Response } from '../../http/response/Response'
import { TransactionWrapper } from '../../http/response/Transaction'
import { fetchBlockByHash, fetchTransactionsByBlockHash } from '../../http/fetcher'
import copyDivValue from '../../utils/util'

const BlockDetailTitle = ({ hash }: { hash: string }) => {
  const appContext = useContext(AppContext)
  return (
    <BlockDetailTitlePanel>
      <div className="address__title">Block</div>
      <div className="address__content">
        <div id="block__hash">{hash}</div>
        <div
          role="button"
          tabIndex={-1}
          onKeyDown={() => {}}
          onClick={() => {
            copyDivValue(document.getElementById('block__hash'))
            appContext.toastMessage('copy success', 3000)
          }}
        >
          <img src={CopyIcon} alt="copy" />
        </div>
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

  const initBlock: Block = {
    block_hash: '',
    number: 0,
    transactions_count: 0,
    proposal_transactions_count: 0,
    uncles_count: 0,
    uncle_block_hashes: [],
    reward: 0,
    total_transaction_fee: 0,
    cell_consumed: 0,
    total_cell_capacity: 0,
    miner_hash: '',
    timestamp: 0,
    difficulty: '',
    version: 0,
    nonce: 0,
    proof: '',
  }
  const [blockData, setBlockData] = useState(initBlock)
  const initTransactionWrappers: TransactionWrapper[] = []
  const [transactionsWrapper, setTrasactionsWrapper] = useState(initTransactionWrappers)
  const [totalTransactions, setTotalTransactions] = useState(1)
  const [pageSize, setPageSize] = useState(3)
  const [pageNo, setPageNo] = useState(1)

  const getBlockByHash = () => {
    fetchBlockByHash(hash).then(data => {
      setBlockData(data as Block)
    })
  }

  const getTransactions = (page: number, size: number) => {
    fetchTransactionsByBlockHash(hash).then(response => {
      const { data, meta } = response as Response<TransactionWrapper[]>
      if (meta) {
        const { total } = meta
        setTotalTransactions(total)
      }
      const transactions = data.slice((page - 1) * size, page * size)
      setTrasactionsWrapper(transactions)
    })
  }

  useEffect(() => {
    getBlockByHash()
    getTransactions(pageNo, pageSize)
  }, [])

  const onChange = (page: number, size: number) => {
    setPageSize(size)
    setPageNo(page)
    getTransactions(page, size)
  }

  const BlockLeftSeparateIndex = 3
  const BlockLeftItems: BlockItem[] = [
    {
      image: BlockHeightIcon,
      label: 'Block Height:',
      value: `${blockData.number}`,
    },
    {
      image: BlockTransactionIcon,
      label: 'Transactions:',
      value: `${blockData.transactions_count}`,
    },
    {
      image: ProposalTransactionsIcon,
      label: 'Proposal Transactions:',
      value: `${blockData.proposal_transactions_count}`,
    },
    {
      image: TimestampIcon,
      label: 'Timestamp:',
      value: `${parseSimpleDate(blockData.timestamp)}`,
    },
    {
      image: VersionIcon,
      label: 'Version:',
      value: `${blockData.version}`,
    },
    {
      image: UncleCountIcon,
      label: 'Uncle Count:',
      value: `${blockData.uncles_count}`,
    },
  ]

  const BlockRightItems: BlockItem[] = [
    {
      image: MinerIcon,
      label: 'Miner:',
      value: `${blockData.miner_hash}`,
    },
    {
      image: BlockRewardIcon,
      label: 'Block Reward:',
      value: `${blockData.reward}`,
    },
    {
      image: TransactionFeeIcon,
      label: 'Transaction Fee:',
      value: `${blockData.total_transaction_fee}`,
    },
    {
      image: DifficultyIcon,
      label: 'Difficulty:',
      value: `${blockData.difficulty}`,
    },
    {
      image: NonceIcon,
      label: 'Nonce:',
      value: `${blockData.nonce}`,
    },
    {
      image: ProofIcon,
      label: 'Proof:',
      value: `${blockData.proof}`,
    },
  ]

  return (
    <Page>
      <Header />
      <Content>
        <BlockDetailPanel width={window.innerWidth} className="container">
          <BlockDetailTitle hash={hash} />
          <BlockOverview value="Overview" />
          <BlockCommonContent>
            <div>
              {BlockLeftItems.slice(0, BlockLeftSeparateIndex).map(item => {
                return <SimpleLabel key={item.label} image={item.image} label={item.label} value={item.value} />
              })}
              <CellConsumedLabel
                image={CellConsumedIcon}
                label="Cell Consumed"
                consumed={blockData.cell_consumed}
                balance={blockData.total_cell_capacity}
              />
              {BlockLeftItems.slice(BlockLeftSeparateIndex).map(item => {
                return <SimpleLabel key={item.label} image={item.image} label={item.label} value={item.value} />
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
                return <SimpleLabel key={item.label} image={item.image} label={item.label} value={item.value} />
              })}
            </div>
          </BlockCommonContent>
          <BlockPreviousNext />
          <BlockHightLabel>Block Height</BlockHightLabel>

          <BlockTransactionsPanel>
            <BlockOverview value="Transactions" />
            <div>
              {transactionsWrapper.map((transaction: any) => {
                return (
                  <TransactionComponent
                    transaction={transaction.attributes}
                    key={transaction.attributes.transaction_hash}
                  />
                )
              })}
            </div>
            <BlockTransactionsPagition>
              <Pagination
                showQuickJumper
                showSizeChanger
                defaultPageSize={pageSize}
                defaultCurrent={pageNo}
                total={totalTransactions}
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
