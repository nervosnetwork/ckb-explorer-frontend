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
import TransactionItem from '../../components/Transaction/TransactionItem/index'
import SimpleLabel, { Tooltip } from '../../components/Label'
import TransactionCard from '../../components/Transaction/TransactionCard/index'
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
import { Block, BlockWrapper, RewardStatus, TransactionFeeStatus } from '../../http/response/Block'
import { parseSimpleDate } from '../../utils/date'
import { Response } from '../../http/response/Response'
import { TransactionWrapper } from '../../http/response/Transaction'
import { fetchBlockByHash, fetchTransactionsByBlockHash, fetchBlockByNumber } from '../../http/fetcher'
import { copyElementValue, shannonToCkb } from '../../utils/util'
import { startEndEllipsis, validNumber } from '../../utils/string'
import browserHistory from '../../routes/history'
import i18n from '../../utils/i18n'

const BlockDetailTitle = ({ hash }: { hash: string }) => {
  const appContext = useContext(AppContext)
  return (
    <BlockDetailTitlePanel>
      <div className="block__title">{i18n.t('common.block')}</div>
      <div className="block__content">
        <code id="block__hash">{hash}</code>
        <div
          role="button"
          tabIndex={-1}
          onKeyDown={() => {}}
          onClick={() => {
            copyElementValue(document.getElementById('block__hash'))
            appContext.toastMessage(i18n.t('common.copied'), 3000)
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
  tooltip?: Tooltip
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
  reward_status: RewardStatus.issued,
  received_tx_fee: 0,
  received_tx_fee_status: TransactionFeeStatus.calculated,
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

const getTransactions = (hash: string, page: number, size: number, dispatch: any) => {
  fetchTransactionsByBlockHash(hash, page, size).then(response => {
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

const updateBlockPrevNext = (blockNumber: number, dispatch: any) => {
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
        payload: {
          next: false,
        },
      })
    })
}

const getBlockByHash = (blockHash: string, page: number, size: number, dispatch: any) => {
  fetchBlockByHash(blockHash).then(response => {
    const { data } = response as Response<BlockWrapper>
    const block = data.attributes as Block
    dispatch({
      type: Actions.block,
      payload: {
        block,
      },
    })
    updateBlockPrevNext(block.number, dispatch)
    getTransactions(block.block_hash, page, size, dispatch)
  })
}

const BlockRewardTip: Tooltip = {
  status: 'Pending',
  tip: 'The block reward of this block will send to the miner after 11 blocks，learn more from our Consensus Protocol',
}

const TransactionFeeTip: Tooltip = {
  status: 'Calculating',
  tip:
    'The transaction fee of this block will send to the miner after 11 blocks，learn more from our Consensus Protocol',
  hideValue: true,
}

const transactionFee = (block: Block) => {
  if (block.received_tx_fee_status === TransactionFeeStatus.calculating && block.number > 0) {
    return TransactionFeeTip
  }
  return undefined
}

export default (props: React.PropsWithoutRef<RouteComponentProps<{ hash: string }>>) => {
  const { match, location } = props
  const { params } = match
  const { hash: blockHash } = params
  const { search } = location
  const parsed = queryString.parse(search)

  const initialState = {
    block: initBlock,
    transactions: [] as TransactionWrapper[],
    total: 1,
    page: validNumber(parsed.page, PageParams.PageNo),
    size: validNumber(parsed.size, PageParams.PageSize),
    prev: true,
    next: true,
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  const { page, size } = state
  const { history } = props
  const { replace } = history

  useEffect(() => {
    if (size > PageParams.MaxPageSize) {
      replace(`/block/${blockHash}?page=${page}&size=${PageParams.MaxPageSize}`)
    }
    getBlockByHash(blockHash, page, size, dispatch)
  }, [replace, blockHash, page, size, dispatch])

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
      label: `${i18n.t('common.blockheight')}:`,
      value: `${state.block.number}`,
    },
    {
      image: BlockTransactionIcon,
      label: `${i18n.t('common.transactions')}:`,
      value: `${state.block.transactions_count}`,
    },
    {
      image: ProposalTransactionsIcon,
      label: `${i18n.t('block.proposal_transactions')}:`,
      value: `${state.block.proposal_transactions_count ? state.block.proposal_transactions_count : 0}`,
    },
    {
      image: BlockRewardIcon,
      label: `${i18n.t('block.blockreward')}:`,
      value: `${shannonToCkb(state.block.reward)} CKB`,
      tooltip: state.block.reward_status === RewardStatus.pending ? BlockRewardTip : undefined,
    },
    {
      image: TransactionFeeIcon,
      label: `${i18n.t('common.transactionfee')}:`,
      value: `${state.block.received_tx_fee} Shannon`,
      tooltip: transactionFee(state.block),
    },
    {
      image: TimestampIcon,
      label: `${i18n.t('common.timestamp')}:`,
      value: `${parseSimpleDate(state.block.timestamp)}`,
    },
    {
      image: UncleCountIcon,
      label: `${i18n.t('block.unclecount')}:`,
      value: `${state.block.uncles_count}`,
    },
  ]

  const BlockRightItems: BlockItem[] = [
    {
      image: MinerIcon,
      label: `${i18n.t('common.miner')}:`,
      value: state.block.miner_hash,
    },
    {
      image: EpochIcon,
      label: `${i18n.t('block.epoch')}:`,
      value: `${state.block.epoch}`,
    },
    {
      image: StartNumberIcon,
      label: `${i18n.t('block.epoch_start_number')}:`,
      value: `${state.block.start_number}`,
    },
    {
      image: LengthIcon,
      label: `${i18n.t('block.epochlength')}:`,
      value: state.block.length,
    },
    {
      image: DifficultyIcon,
      label: `${i18n.t('common.difficulty')}:`,
      value: parseInt(state.block.difficulty, 16).toLocaleString(),
    },
    {
      image: NonceIcon,
      label: `${i18n.t('block.nonce')}:`,
      value: `${state.block.nonce}`,
    },
    {
      image: ProofIcon,
      label: `${i18n.t('block.proof')}:`,
      value: `${startEndEllipsis(state.block.proof, 9)}`,
    },
  ]

  const BlockRootInfoItems: BlockItem[] = [
    {
      image: TransactionsRootIcon,
      label: `${i18n.t('block.transactionsroot')}:`,
      value: `${state.block.transactions_root}`,
    },
    {
      image: WitnessRootIcon,
      label: `${i18n.t('block.witnessesroot')}:`,
      value: `${state.block.witnesses_root}`,
    },
  ]

  return (
    <Content>
      <BlockDetailPanel className="container">
        <BlockDetailTitle hash={state.block.block_hash} />
        <BlockOverview value={i18n.t('common.overview')} />
        <BlockCommonContent>
          <div>
            <div>
              {BlockLeftItems.map(item => {
                return (
                  item && (
                    <SimpleLabel
                      key={item.label}
                      image={item.image}
                      label={item.label}
                      value={item.value}
                      tooltip={item.tooltip}
                    />
                  )
                )
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
                      value={startEndEllipsis(BlockRightItems[0].value, 7)}
                      highLight
                    />
                  </Link>
                ) : (
                  <SimpleLabel
                    image={BlockRightItems[0].image}
                    label={BlockRightItems[0].label}
                    value={i18n.t('common.unabledecode')}
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
                      <SimpleLabel image={item.image} label={item.label} value={item.value} />
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
        <BlockHightLabel>{i18n.t('common.blockheight')}</BlockHightLabel>

        <BlockTransactionsPanel>
          <BlockOverview value={i18n.t('common.transactions')} />
          <div>
            {state.transactions &&
              state.transactions.map((transaction: any) => {
                return (
                  transaction && (
                    <div key={transaction.attributes.transaction_hash}>
                      <TransactionItem transaction={transaction.attributes} confirmation={10} isBlock />
                      <TransactionCard transaction={transaction.attributes} />
                    </div>
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
