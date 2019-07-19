import React, { useEffect, useReducer } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import queryString from 'query-string'
import {
  BlockDetailPanel,
  BlockCommonContent,
  BlockMultiLinesPanel,
  BlockPreviousNextPanel,
  BlockHightLabel,
  BlockTransactionsPanel,
  BlockTransactionsPagition,
} from './styled'
import Content from '../../components/Content'
import TransactionItem from '../../components/Transaction/TransactionItem/index'
import SimpleLabel, { Tooltip } from '../../components/Label'
import TransactionCard from '../../components/Transaction/TransactionCard/index'
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
import { parseSimpleDate } from '../../utils/date'
import { fetchBlock, fetchTransactionsByBlockHash } from '../../service/http/fetcher'
import { shannonToCkb } from '../../utils/util'
import { startEndEllipsis, parsePageNumber } from '../../utils/string'
import browserHistory from '../../routes/history'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import AddressHashCard from '../../components/Card/AddressHashCard'
import TitleCard from '../../components/Card/TitleCard'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'

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

const initBlock: State.Block = {
  block_hash: '',
  number: 0,
  transactions_count: 0,
  proposals_count: 0,
  uncles_count: 0,
  uncle_block_hashes: [],
  reward: 0,
  reward_status: 'issued',
  received_tx_fee: 0,
  received_tx_fee_status: 'calculated',
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
    const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
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
  fetchBlock(`${blockNumber + 1}`)
    .then((wrapper: Response.Wrapper<State.Block>) => {
      dispatch({
        type: Actions.next,
        payload: {
          next: wrapper ? wrapper.attributes.number > 0 : false,
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

// blockParam: block hash or block number
const getBlock = (blockParam: string, page: number, size: number, dispatch: any, replace: any) => {
  fetchBlock(blockParam)
    .then((wrapper: Response.Wrapper<State.Block>) => {
      if (wrapper) {
        const block = wrapper.attributes
        dispatch({
          type: Actions.block,
          payload: {
            block,
          },
        })
        updateBlockPrevNext(block.number, dispatch)
        getTransactions(block.block_hash, page, size, dispatch)
      } else {
        replace(`/search/fail?q=${blockParam}`)
      }
    })
    .catch(() => {
      replace(`/search/fail?q=${blockParam}`)
    })
}

const initialState = {
  block: initBlock,
  transactions: [] as Response.Wrapper<State.Transaction>[],
  total: 1,
  prev: true,
  next: true,
}

const BlockRewardTip: Tooltip = {
  status: 'Pending',
  tip: i18n.t('block.pending_tip'),
}

const TransactionFeeTip: Tooltip = {
  status: 'Calculating',
  tip: i18n.t('block.calculating_tip'),
  hideValue: true,
}

const transactionFee = (block: State.Block) => {
  if (block.received_tx_fee_status === 'calculating' && block.number > 0) {
    return TransactionFeeTip
  }
  return undefined
}

export default (props: React.PropsWithoutRef<RouteComponentProps<{ param: string }>>) => {
  const { match, location, history } = props
  const { params } = match
  // blockParam: block hash or block number
  const { param: blockParam } = params
  const { search } = location
  const { replace } = history
  const parsed = queryString.parse(search)
  const page = parsePageNumber(parsed.page, PageParams.PageNo)
  const size = parsePageNumber(parsed.size, PageParams.PageSize)

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (size > PageParams.MaxPageSize) {
      replace(`/block/${blockParam}?page=${page}&size=${PageParams.MaxPageSize}`)
    }
    getBlock(blockParam, page, size, dispatch, replace)
  }, [replace, blockParam, page, size, dispatch])

  const onChange = (pageNo: number, pageSize: number) => {
    history.push(`/block/${blockParam}?page=${pageNo}&size=${pageSize}`)
  }

  const BlockLeftItems: BlockItem[] = [
    {
      image: BlockHeightIcon,
      label: `${i18n.t('block.block_height')}:`,
      value: localeNumberString(state.block.number),
    },
    {
      image: BlockTransactionIcon,
      label: `${i18n.t('transaction.transactions')}:`,
      value: localeNumberString(state.block.transactions_count),
    },
    {
      image: ProposalTransactionsIcon,
      label: `${i18n.t('block.proposal_transactions')}:`,
      value: `${state.block.proposals_count ? localeNumberString(state.block.proposals_count) : 0}`,
    },
    {
      image: BlockRewardIcon,
      label: `${i18n.t('block.block_reward')}:`,
      value: `${localeNumberString(shannonToCkb(state.block.reward))} CKB`,
      tooltip: state.block.reward_status === 'pending' ? BlockRewardTip : undefined,
    },
    {
      image: TransactionFeeIcon,
      label: `${i18n.t('transaction.transaction_fee')}:`,
      value: `${state.block.received_tx_fee} Shannon`,
      tooltip: transactionFee(state.block),
    },
    {
      image: TimestampIcon,
      label: `${i18n.t('block.timestamp')}:`,
      value: `${parseSimpleDate(state.block.timestamp)}`,
    },
    {
      image: UncleCountIcon,
      label: `${i18n.t('block.uncle_count')}:`,
      value: `${state.block.uncles_count}`,
    },
  ]

  const BlockRightItems: BlockItem[] = [
    {
      image: MinerIcon,
      label: `${i18n.t('block.miner')}:`,
      value: state.block.miner_hash,
    },
    {
      image: EpochIcon,
      label: `${i18n.t('block.epoch')}:`,
      value: localeNumberString(state.block.epoch),
    },
    {
      image: StartNumberIcon,
      label: `${i18n.t('block.epoch_start_number')}:`,
      value: localeNumberString(state.block.start_number),
    },
    {
      image: LengthIcon,
      label: `${i18n.t('block.epoch_length')}:`,
      value: localeNumberString(state.block.length),
    },
    {
      image: DifficultyIcon,
      label: `${i18n.t('block.difficulty')}:`,
      value: localeNumberString(state.block.difficulty, 16),
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
      label: `${i18n.t('block.transactions_root')}:`,
      value: `${state.block.transactions_root}`,
    },
    {
      image: WitnessRootIcon,
      label: `${i18n.t('block.witnesses_root')}:`,
      value: `${state.block.witnesses_root}`,
    },
  ]

  const items: OverviewItemData[] = [
    {
      key: 'block_height',
      title: i18n.t('block.block_height'),
      content: localeNumberString(state.block.number),
    },
    {
      key: 'miner',
      title: i18n.t('block.miner'),
      content: state.block.miner_hash,
    },
    {
      key: 'transactions',
      title: i18n.t('transaction.transactions'),
      content: localeNumberString(state.block.transactions_count),
    },
    {
      key: 'epoch',
      title: i18n.t('block.epoch'),
      content: localeNumberString(state.block.epoch),
    },
  ]

  return (
    <Content>
      <BlockDetailPanel className="container">
        <AddressHashCard title={i18n.t('block.block')} hash={state.block.block_hash} />
        <TitleCard title={i18n.t('common.overview')} />
        <OverviewCard items={items} />
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
                    value={i18n.t('address.unable_decode_address')}
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
                    {isMobile() ? (
                      <MultiLinesItem label={item.label} value={item.value} />
                    ) : (
                      <SimpleLabel image={item.image} label={item.label} value={item.value} />
                    )}
                  </React.Fragment>
                )
              )
            })}
          </div>
        </BlockCommonContent>
        <BlockPreviousNext blockNumber={state.block.number} hasPrev={state.prev} hasNext={state.next} />
        <BlockHightLabel>{i18n.t('block.block_height')}</BlockHightLabel>

        <TitleCard title={i18n.t('transaction.transactions')} />
        <BlockTransactionsPanel>
          {/* <BlockOverview value={i18n.t('transaction.transactions')} /> */}
          <div>
            {state.transactions &&
              state.transactions.map((transaction: any) => {
                return (
                  transaction && (
                    <div key={transaction.attributes.transaction_hash}>
                      {isMobile() ? (
                        <TransactionCard transaction={transaction.attributes} />
                      ) : (
                        <TransactionItem transaction={transaction.attributes} isBlock />
                      )}
                    </div>
                  )
                )
              })}
          </div>
          <BlockTransactionsPagition>
            <Pagination
              showQuickJumper
              showSizeChanger
              defaultPageSize={size}
              pageSize={size}
              defaultCurrent={page}
              current={page}
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
