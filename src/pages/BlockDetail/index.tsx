import React, { useEffect, useContext } from 'react'
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
} from './styled'
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
import { parseSimpleDate } from '../../utils/date'

import { copyElementValue, shannonToCkb } from '../../utils/util'
import { startEndEllipsis, parsePageNumber } from '../../utils/string'
import browserHistory from '../../routes/history'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { isMobile, isSmallMobile } from '../../utils/screen'
import { PageParams } from '../../utils/const'
import { StateWithDispatch, PageActions, AppDispatch, AppActions } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers/index'

const BlockDetailTitle = ({ hash, dispatch }: { hash: string; dispatch: AppDispatch }) => {
  return (
    <BlockDetailTitlePanel>
      <div className="block__title">{i18n.t('block.block')}</div>
      <div className="block__content">
        <code id="block__hash">{hash}</code>
        <div
          role="button"
          tabIndex={-1}
          onKeyDown={() => {}}
          onClick={() => {
            copyElementValue(document.getElementById('block__hash'))
            dispatch({
              type: AppActions.ShowToastMessage,
              payload: {
                text: i18n.t('common.copied'),
                timeout: 3000,
              },
            })
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

// blockParam: block hash or block number
export default ({
  dispatch,
  history: { replace, push },
  match: { params },
  location: { search },
}: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps<{ param: string }>>) => {
  const { param: blockParam } = params
  const parsed = queryString.parse(search)
  const page = parsePageNumber(parsed.page, PageParams.PageNo)
  const size = parsePageNumber(parsed.size, PageParams.PageSize)

  const { blockState } = useContext(AppContext)

  useEffect(() => {
    if (size > PageParams.MaxPageSize) {
      replace(`/block/${blockParam}?page=${page}&size=${PageParams.MaxPageSize}`)
    }
    const payload = {
      blockParam,
      page,
      size,
      dispatch,
      replace,
    }
    dispatch({
      type: PageActions.TriggerBlock,
      payload: {
        ...payload,
      },
    })
  }, [replace, blockParam, page, size, dispatch])

  const onChange = (pageNo: number, pageSize: number) => {
    push(`/block/${blockParam}?page=${pageNo}&size=${pageSize}`)
  }

  const BlockLeftItems: BlockItem[] = [
    {
      image: BlockHeightIcon,
      label: `${i18n.t('block.block_height')}:`,
      value: localeNumberString(blockState.block.number),
    },
    {
      image: BlockTransactionIcon,
      label: `${i18n.t('transaction.transactions')}:`,
      value: localeNumberString(blockState.block.transactions_count),
    },
    {
      image: ProposalTransactionsIcon,
      label: `${i18n.t('block.proposal_transactions')}:`,
      value: `${blockState.block.proposals_count ? localeNumberString(blockState.block.proposals_count) : 0}`,
    },
    {
      image: BlockRewardIcon,
      label: `${i18n.t('block.block_reward')}:`,
      value: `${localeNumberString(shannonToCkb(blockState.block.reward))} CKB`,
      tooltip: blockState.block.reward_status === 'pending' ? BlockRewardTip : undefined,
    },
    {
      image: TransactionFeeIcon,
      label: `${i18n.t('transaction.transaction_fee')}:`,
      value: `${blockState.block.received_tx_fee} Shannon`,
      tooltip: transactionFee(blockState.block),
    },
    {
      image: TimestampIcon,
      label: `${i18n.t('block.timestamp')}:`,
      value: `${parseSimpleDate(blockState.block.timestamp)}`,
    },
    {
      image: UncleCountIcon,
      label: `${i18n.t('block.uncle_count')}:`,
      value: `${blockState.block.uncles_count}`,
    },
  ]

  const BlockRightItems: BlockItem[] = [
    {
      image: MinerIcon,
      label: `${i18n.t('block.miner')}:`,
      value: blockState.block.miner_hash,
    },
    {
      image: EpochIcon,
      label: `${i18n.t('block.epoch')}:`,
      value: localeNumberString(blockState.block.epoch),
    },
    {
      image: StartNumberIcon,
      label: `${i18n.t('block.epoch_start_number')}:`,
      value: localeNumberString(blockState.block.start_number),
    },
    {
      image: LengthIcon,
      label: `${i18n.t('block.epoch_length')}:`,
      value: localeNumberString(blockState.block.length),
    },
    {
      image: DifficultyIcon,
      label: `${i18n.t('block.difficulty')}:`,
      value: localeNumberString(blockState.block.difficulty, 16),
    },
    {
      image: NonceIcon,
      label: `${i18n.t('block.nonce')}:`,
      value: `${blockState.block.nonce}`,
    },
    {
      image: ProofIcon,
      label: `${i18n.t('block.proof')}:`,
      value: `${startEndEllipsis(blockState.block.proof, isSmallMobile() ? 5 : 9)}`,
    },
  ]

  const BlockRootInfoItems: BlockItem[] = [
    {
      image: TransactionsRootIcon,
      label: `${i18n.t('block.transactions_root')}:`,
      value: `${blockState.block.transactions_root}`,
    },
    {
      image: WitnessRootIcon,
      label: `${i18n.t('block.witnesses_root')}:`,
      value: `${blockState.block.witnesses_root}`,
    },
  ]

  return (
    <Content>
      <BlockDetailPanel className="container">
        <BlockDetailTitle hash={blockState.block.block_hash} dispatch={dispatch} />
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
        <BlockPreviousNext blockNumber={blockState.block.number} hasPrev={blockState.prev} hasNext={blockState.next} />
        <BlockHightLabel>{i18n.t('block.block_height')}</BlockHightLabel>

        <BlockTransactionsPanel>
          <BlockOverview value={i18n.t('transaction.transactions')} />
          <div>
            {blockState.transactions &&
              blockState.transactions.map((transaction: any) => {
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
              total={blockState.total}
              onChange={onChange}
              locale={localeInfo}
            />
          </BlockTransactionsPagition>
        </BlockTransactionsPanel>
      </BlockDetailPanel>
    </Content>
  )
}
