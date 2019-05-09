import React, { useState, useEffect, useContext } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import queryString from 'query-string'
import {
  BlockDetailPanel,
  BlockDetailTitlePanel,
  BlockOverviewPanel,
  BlockCommonContentWrap,
  BlockCommonContent,
  BlockPreviousNextPanel,
  BlockHightLabel,
  BlockTransactionsPanel,
  BlockTransactionsPagition,
} from './styled'
import AppContext from '../../contexts/App'
import Content from '../../components/Content'
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
import { Block, BlockWrapper } from '../../http/response/Block'
import { parseSimpleDate } from '../../utils/date'
import { Response } from '../../http/response/Response'
import { TransactionWrapper } from '../../http/response/Transaction'
import { fetchBlockByHash, fetchTransactionsByBlockHash, fetchBlockByNumber } from '../../http/fetcher'
import { copyDivValue, validNumber, shannonToCkb } from '../../utils/util'
import browserHistory from '../../routes/history'

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

const BlockPreviousNext = ({
  blockNumber,
  hasPrev = true,
  hasNext = true,
}: {
  blockNumber: any
  hasPrev?: boolean
  hasNext?: boolean
}) => {
  return (
    <BlockPreviousNextPanel>
      {hasPrev ? (
        <div
          role="button"
          tabIndex={-1}
          className="block__arrow"
          onClick={() => {
            browserHistory.push(`/block/${blockNumber - 1}`)
          }}
          onKeyUp={() => {}}
        >
          <img src={PreviousBlockIcon} alt="previous block" />
        </div>
      ) : null}
      <img className="block__mouse" src={MouseIcon} alt="mouse" />
      {hasNext ? (
        <div
          role="button"
          tabIndex={-1}
          className="block__arrow"
          onClick={() => {
            browserHistory.push(`/block/${blockNumber + 1}`)
          }}
          onKeyUp={() => {}}
        >
          <img src={NextBlockIcon} alt="next block" />
        </div>
      ) : null}
    </BlockPreviousNextPanel>
  )
}

interface BlockItem {
  image: any
  label: string
  value: string
}

enum PageParams {
  PageNo = 1,
  PageSize = 10,
}

export default (props: React.PropsWithoutRef<RouteComponentProps<{ hash: string }>>) => {
  const { match, location } = props
  const { params } = match
  const { hash } = params

  const { search } = location
  const parsed = queryString.parse(search)
  const { page, size } = parsed

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
  const [transactionWrappers, setTransactionWrappers] = useState(initTransactionWrappers)
  const [totalTransactions, setTotalTransactions] = useState(1)
  const [pageNo, setPageNo] = useState(validNumber(page, PageParams.PageNo))
  const [pageSize, setPageSize] = useState(validNumber(size, PageParams.PageSize))
  const [hasPrev, setHasPrev] = useState(true)
  const [hasNext, setHasNext] = useState(true)

  const getTransactions = (block_hash: string, page_p: number, size_p: number) => {
    fetchTransactionsByBlockHash(block_hash, page_p, size_p).then(json => {
      const { data, meta } = json as Response<TransactionWrapper[]>
      if (meta) {
        const { total } = meta
        setTotalTransactions(total)
      }
      setTransactionWrappers(data)
    })
  }

  const updateBlockPrevNext = (blockNumber: number) => {
    setHasPrev(blockNumber > 0)
    fetchBlockByNumber(`${blockNumber + 1}`)
      .then(json => {
        const { data } = json as Response<BlockWrapper>
        setHasNext(data.attributes.number > 0)
      })
      .catch(() => {
        setHasNext(false)
      })
  }

  const getBlockByHash = () => {
    fetchBlockByHash(hash)
      .then(json => {
        const { data } = json as Response<BlockWrapper>
        const block = data.attributes as Block
        setBlockData(block)
        updateBlockPrevNext(block.number)
        const page_p = validNumber(page, PageParams.PageNo)
        const size_p = validNumber(size, PageParams.PageSize)
        getTransactions(data.attributes.block_hash, page_p, size_p)
      })
      .catch(() => {
        setBlockData(initBlock)
        setTotalTransactions(0)
        setTransactionWrappers([])
      })
  }

  useEffect(() => {
    getBlockByHash()
    const page_p = validNumber(page, PageParams.PageNo)
    const size_p = validNumber(size, PageParams.PageSize)
    setPageNo(page_p)
    setPageSize(size_p)
  }, [search, window.location.href])

  const onChange = (page_p: number, size_p: number) => {
    setPageNo(page_p)
    setPageSize(size_p)
    props.history.push(`/block/${hash}?page=${page_p}&size=${size_p}`)
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
      value: `${shannonToCkb(blockData.reward)} CKB`,
    },
    {
      image: TransactionFeeIcon,
      label: 'Transaction Fee:',
      value: `${shannonToCkb(blockData.total_transaction_fee)} CKB`,
    },
    {
      image: DifficultyIcon,
      label: 'Difficulty:',
      value: `${parseInt(blockData.difficulty, 16)}`,
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
    <Content>
      <BlockDetailPanel width={window.innerWidth} className="container">
        <BlockDetailTitle hash={blockData.block_hash} />
        <BlockOverview value="Overview" />
        <BlockCommonContentWrap className={(hasPrev ? 'hasPrev' : '') + (hasNext ? ' hasNext' : '')}>
          <BlockCommonContent>
            <div>
              {BlockLeftItems.slice(0, BlockLeftSeparateIndex).map(item => {
                return <SimpleLabel key={item.label} image={item.image} label={item.label} value={item.value} />
              })}
              <CellConsumedLabel
                image={CellConsumedIcon}
                label="Cell Consumed"
                consumed={shannonToCkb(blockData.cell_consumed)}
                balance={shannonToCkb(blockData.total_cell_capacity)}
              />
              {BlockLeftItems.slice(BlockLeftSeparateIndex).map(item => {
                return <SimpleLabel key={item.label} image={item.image} label={item.label} value={item.value} />
              })}
            </div>
            <div>
              <div />
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
            </div>
          </BlockCommonContent>
        </BlockCommonContentWrap>
        <BlockPreviousNext blockNumber={blockData.number} hasPrev={hasPrev} hasNext={hasNext} />
        <BlockHightLabel>Block Height</BlockHightLabel>

        <BlockTransactionsPanel>
          <BlockOverview value="Transactions" />
          <div>
            {transactionWrappers.map((transaction: any) => {
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
              pageSize={pageSize}
              defaultCurrent={pageNo}
              current={pageNo}
              total={totalTransactions}
              onChange={onChange}
            />
          </BlockTransactionsPagition>
        </BlockTransactionsPanel>
      </BlockDetailPanel>
    </Content>
  )
}
