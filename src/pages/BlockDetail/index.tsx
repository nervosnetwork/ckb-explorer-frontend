import React, { useEffect, useContext, useReducer } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import queryString from 'query-string'
import {
  BlockDetailPanel,
  BlockDetailTitlePanel,
  BlockOverviewPanel,
  BlockCommonContent,
  BlockMultiLinesPanel,
  BlockPreviousNextPanel,
  BlockHightLabel,
  BlockTransactionsPanel,
  BlockTransactionsPagition,
  BlockItemPC,
  BlockItemMobile,
} from './styled'
import AppContext from '../../contexts/App'
import Content from '../../components/Content'
import TransactionComponent from '../../components/Transaction'
import SimpleLabel from '../../components/Label'
import TransactionCard from '../../components/Card/TransactionCard'
import CopyIcon from '../../assets/copy.png'
import BlockHeightIcon from '../../assets/block_height_green.png'
import BlockTransactionIcon from '../../assets/transactions_green.png'
import ProposalTransactionsIcon from '../../assets/proposal_transactions.png'
import TimestampIcon from '../../assets/timestamp_green.png'
import UncleCountIcon from '../../assets/uncle_count.png'
import MinerIcon from '../../assets/miner_green.png'
import BlockRewardIcon from '../../assets/block_reward.png'
import TransactionFeeIcon from '../../assets/transaction_fee.png'
import DifficultyIcon from '../../assets/difficulty.png'
import NonceIcon from '../../assets/nonce.png'
import ProofIcon from '../../assets/proof.png'
import EpochIcon from '../../assets/epoch.png'
import StartNumberIcon from '../../assets/start_number.png'
import LengthIcon from '../../assets/length.png'
import PreviousBlockIcon from '../../assets/left_arrow.png'
import PreviousBlockGreyIcon from '../../assets/left_arrow_grey.png'
import NextBlockIcon from '../../assets/right_arrow.png'
import NextBlockGreyIcon from '../../assets/right_arrow_grey.png'
import MouseIcon from '../../assets/block_mouse.png'
import TransactionsRootIcon from '../../assets/transactions_root.png'
import WitnessRootIcon from '../../assets/witness_root.png'
import { Block, BlockWrapper } from '../../http/response/Block'
import { parseSimpleDate } from '../../utils/date'
import { Response } from '../../http/response/Response'
import { TransactionWrapper } from '../../http/response/Transaction'
import { fetchBlockByHash, fetchTransactionsByBlockHash, fetchBlockByNumber } from '../../http/fetcher'
import { copyElementValue, shannonToCkb } from '../../utils/util'
import { validNumber, startEndEllipsis } from '../../utils/string'
import browserHistory from '../../routes/history'

const BlockDetailTitle = ({ hash }: { hash: string }) => {
  const appContext = useContext(AppContext)
  return (
    <BlockDetailTitlePanel>
      <div className="block__title">Block</div>
      <div className="block__content">
        <code id="block__hash">{hash}</code>
        <div
          role="button"
          tabIndex={-1}
          onKeyDown={() => {}}
          onClick={() => {
            copyElementValue(document.getElementById('block__hash'))
            appContext.toastMessage('Copied', 3000)
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
      ) : (
        <div className="block__arrow_grey">
          <img src={PreviousBlockGreyIcon} alt="previous block" />
        </div>
      )}
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
      ) : (
        <div role="button" tabIndex={-1} className="block__arrow_grey">
          <img src={NextBlockGreyIcon} alt="next block" />
        </div>
      )}
    </BlockPreviousNextPanel>
  )
}

const MultiLinesItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <BlockMultiLinesPanel>
      <div>{label}</div>
      <code>{value}</code>
    </BlockMultiLinesPanel>
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
  MaxPageSize = 100,
}

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
  start_number: 0,
  epoch: 0,
  length: '',
  version: 0,
  nonce: 0,
  proof: '',
  transactions_root: '',
  witnesses_root: '',
}

const Actions = {
  block: 'BLOCK',
  transactions: 'TRANSACTIONS',
  total: 'TOTAL',
  page: 'PAGE_NO',
  size: 'PAGE_SIZE',
  prev: 'PREV',
  next: 'NEXT',
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case Actions.block:
      return {
        ...state,
        block: action.payload.block,
      }
    case Actions.transactions:
      return {
        ...state,
        transactions: action.payload.transactions,
      }
    case Actions.total:
      return {
        ...state,
        total: action.payload.total,
      }
    case Actions.page:
      return {
        ...state,
        page: action.payload.page,
      }
    case Actions.size:
      return {
        ...state,
        size: action.payload.size,
      }
    case Actions.prev:
      return {
        ...state,
        prev: action.payload.prev,
      }
    case Actions.next:
      return {
        ...state,
        next: action.payload.next,
      }
    default:
      return state
  }
}

export default (props: React.PropsWithoutRef<RouteComponentProps<{ hash: string }>>) => {
  const { match, location } = props
  const { params } = match
  const { hash: blockHash } = params
  const { search } = location
  const parsed = queryString.parse(search)
  const { page, size } = parsed

  const initialState = {
    block: initBlock,
    transactions: [] as TransactionWrapper[],
    total: 1,
    page: validNumber(page, PageParams.PageNo),
    size: validNumber(size, PageParams.PageSize),
    prev: true,
    next: true,
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  if (state.size > PageParams.MaxPageSize) {
    props.history.replace(`/block/${blockHash}?page=${page}&size=${PageParams.MaxPageSize}`)
  }

  const getTransactions = (hash: string, pageNo: number, pageSize: number) => {
    fetchTransactionsByBlockHash(hash, pageNo, pageSize).then(response => {
      const { data, meta } = response as Response<TransactionWrapper[]>
      dispatch({
        type: Actions.transactions,
        payload: {
          transactions: data,
        },
      })
      if (meta) {
        dispatch({
          type: Actions.total,
          payload: {
            total: meta.total,
          },
        })
      }
    })
  }

  const updateBlockPrevNext = (blockNumber: number) => {
    dispatch({
      type: Actions.prev,
      payload: {
        prev: blockNumber > 0,
      },
    })
    fetchBlockByNumber(`${blockNumber + 1}`)
      .then(response => {
        const { data } = response as Response<BlockWrapper>
        dispatch({
          type: Actions.next,
          payload: {
            next: data.attributes.number > 0,
          },
        })
      })
      .catch(() => {
        dispatch({
          type: Actions.next,
          payload: false,
        })
      })
  }

  const getBlockByHash = () => {
    fetchBlockByHash(blockHash).then(response => {
      const { data } = response as Response<BlockWrapper>
      const block = data.attributes as Block
      dispatch({
        type: Actions.block,
        payload: {
          block,
        },
      })
      updateBlockPrevNext(block.number)
      getTransactions(block.block_hash, state.page, state.size)
    })
  }

  useEffect(() => {
    getBlockByHash()
  }, [getBlockByHash])

  const onChange = (pageNo: number, pageSize: number) => {
    dispatch({
      type: Actions.page,
      payload: {
        pageNo,
      },
    })
    dispatch({
      type: Actions.size,
      payload: {
        pageSize,
      },
    })
    props.history.push(`/block/${blockHash}?page=${pageSize}&size=${pageSize}`)
  }

  const BlockLeftItems: BlockItem[] = [
    {
      image: BlockHeightIcon,
      label: 'Block Height:',
      value: `${state.block.number}`,
    },
    {
      image: BlockTransactionIcon,
      label: 'Transactions:',
      value: `${state.block.transactions_count}`,
    },
    {
      image: ProposalTransactionsIcon,
      label: 'Proposal Transactions:',
      value: `${state.block.proposal_transactions_count ? state.block.proposal_transactions_count : 0}`,
    },
    {
      image: BlockRewardIcon,
      label: 'Block Reward:',
      value: `${shannonToCkb(state.block.reward)} CKB`,
    },
    {
      image: TransactionFeeIcon,
      label: 'Transaction Fee:',
      value: `${state.block.total_transaction_fee} Shannon`,
    },
    {
      image: TimestampIcon,
      label: 'Timestamp:',
      value: `${parseSimpleDate(state.block.timestamp)}`,
    },
    {
      image: UncleCountIcon,
      label: 'Uncle Count:',
      value: `${state.block.uncles_count}`,
    },
  ]

  const BlockRightItems: BlockItem[] = [
    {
      image: MinerIcon,
      label: 'Miner:',
      value: state.block.miner_hash,
    },
    {
      image: EpochIcon,
      label: 'Epoch:',
      value: `${state.block.epoch}`,
    },
    {
      image: StartNumberIcon,
      label: 'Epoch Start Number:',
      value: `${state.block.start_number}`,
    },
    {
      image: LengthIcon,
      label: 'Epoch Length:',
      value: state.block.length,
    },
    {
      image: DifficultyIcon,
      label: 'Difficulty:',
      value: `${parseInt(state.block.difficulty, 16)}`,
    },
    {
      image: NonceIcon,
      label: 'Nonce:',
      value: `${state.block.nonce}`,
    },
    {
      image: ProofIcon,
      label: 'Proof:',
      value: `${startEndEllipsis(state.block.proof, 9)}`,
    },
  ]

  const BlockRootInfoItems: BlockItem[] = [
    {
      image: TransactionsRootIcon,
      label: 'Transactions Root:',
      value: `${state.block.transactions_root}`,
    },
    {
      image: WitnessRootIcon,
      label: 'Witnesses Root:',
      value: `${state.block.witnesses_root}`,
    },
  ]

  return (
    <Content>
      <BlockDetailPanel className="container">
        <BlockDetailTitle hash={state.block.block_hash} />
        <BlockOverview value="Overview" />
        <BlockCommonContent>
          <div>
            <div>
              {BlockLeftItems.map(item => {
                return item && <SimpleLabel key={item.label} image={item.image} label={item.label} value={item.value} />
              })}
            </div>
            <div>
              <div>
                {BlockRightItems[0].value ? (
                  <Link
                    to={{
                      pathname: `/address/${BlockRightItems[0].value}`,
                    }}
                  >
                    <SimpleLabel
                      image={BlockRightItems[0].image}
                      label={BlockRightItems[0].label}
                      value={startEndEllipsis(BlockRightItems[0].value, 5)}
                      style={{
                        fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace',
                      }}
                      highLight
                    />
                  </Link>
                ) : (
                  <SimpleLabel
                    image={BlockRightItems[0].image}
                    label={BlockRightItems[0].label}
                    value="Unable to decode address"
                  />
                )}
                {BlockRightItems.slice(1).map(item => {
                  return (
                    item && <SimpleLabel key={item.label} image={item.image} label={item.label} value={item.value} />
                  )
                })}
              </div>
            </div>
          </div>
          <div>
            {BlockRootInfoItems.map(item => {
              return (
                item && (
                  <React.Fragment key={item.label}>
                    <BlockItemPC>
                      <SimpleLabel image={item.image} label={item.label} value={item.value} lengthNoLimit />
                    </BlockItemPC>
                    <BlockItemMobile>
                      <MultiLinesItem key={item.label} label={item.label} value={item.value} />
                    </BlockItemMobile>
                  </React.Fragment>
                )
              )
            })}
          </div>
        </BlockCommonContent>
        <BlockPreviousNext blockNumber={state.block.number} hasPrev={state.prev} hasNext={state.next} />
        <BlockHightLabel>Block Height</BlockHightLabel>

        <BlockTransactionsPanel>
          <BlockOverview value="Transactions" />
          <div>
            {state.transactions &&
              state.transactions.map((transaction: any) => {
                return (
                  transaction && (
                    <TransactionComponent
                      transaction={transaction.attributes}
                      key={transaction.attributes.transaction_hash}
                      isBlock
                    />
                  )
                )
              })}

            {state.transactions &&
              state.transactions.map((transaction: any) => {
                return (
                  transaction && (
                    <TransactionCard
                      transaction={transaction.attributes}
                      key={transaction.attributes.transaction_hash}
                    />
                  )
                )
              })}
          </div>
          <BlockTransactionsPagition>
            <Pagination
              showQuickJumper
              showSizeChanger
              defaultPageSize={state.size}
              pageSize={state.size}
              defaultCurrent={state.page}
              current={state.page}
              total={state.total}
              onChange={onChange}
              locale={localeInfo}
            />
          </BlockTransactionsPagition>
        </BlockTransactionsPanel>
      </BlockDetailPanel>
    </Content>
  )
}
