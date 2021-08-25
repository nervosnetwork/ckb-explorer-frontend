import { useState, ReactNode } from 'react'
import { Link, useHistory } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { Tooltip } from 'antd'
import Pagination from '../../components/Pagination'
import DropDownIcon from '../../assets/content_drop_down.png'
import PackUpIcon from '../../assets/content_pack_up.png'
import DropDownBlueIcon from '../../assets/content_blue_drop_down.png'
import PackUpBlueIcon from '../../assets/content_blue_pack_up.png'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TransactionItem from '../../components/TransactionItem/index'
import { useAppState } from '../../contexts/providers'
import { parseSimpleDate } from '../../utils/date'
import i18n from '../../utils/i18n'
import { localeNumberString, handleDifficulty } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { adaptMobileEllipsis, adaptPCEllipsis } from '../../utils/string'
import { shannonToCkb } from '../../utils/util'
import {
  BlockLinkPanel,
  BlockOverviewDisplayControlPanel,
  BlockMinerRewardPanel,
  BlockRootInfoItemPanel,
  BlockTransactionsPagination,
  BlockRootInfoPanel,
} from './styled'
import HelpIcon from '../../assets/qa_help.png'
import MinerRewardIcon from '../../assets/miner_complete.png'
import { isMainnet } from '../../utils/chain'
import DecimalCapacity from '../../components/DecimalCapacity'
import CopyTooltipText from '../../components/Text/CopyTooltipText'
import { DELAY_BLOCK_NUMBER } from '../../constants/common'
import TitleCard from '../../components/Card/TitleCard'

const handleMinerText = (address: string) => {
  if (isMobile()) {
    return adaptMobileEllipsis(address, 8)
  }
  return adaptPCEllipsis(address, 11, 80)
}

const BlockMiner = ({ miner }: { miner: string }) => {
  if (!miner) {
    return <BlockLinkPanel>{i18n.t('address.unable_decode_address')}</BlockLinkPanel>
  }
  const minerText = handleMinerText(miner)
  return (
    <BlockLinkPanel>
      {minerText.includes('...') ? (
        <Tooltip placement="top" title={<CopyTooltipText content={miner} />}>
          <Link to={`/address/${miner}`} className="monospace">
            {minerText}
          </Link>
        </Tooltip>
      ) : (
        <Link to={`/address/${miner}`} className="monospace">
          {minerText}
        </Link>
      )}
    </BlockLinkPanel>
  )
}

const BlockMinerMessage = ({ minerMessage }: { minerMessage: string }) => {
  const minerMsg = handleMinerText(minerMessage)
  return (
    <>
      {minerMsg.includes('...') ? (
        <Tooltip placement="top" title={<CopyTooltipText content={minerMessage} />}>
          {minerMsg}
        </Tooltip>
      ) : (
        minerMessage
      )}
    </>
  )
}

const BlockMinerReward = ({
  value,
  tooltip,
  sentBlockNumber,
}: {
  value: string | ReactNode
  tooltip: string
  sentBlockNumber?: string
}) => {
  const history = useHistory()
  return (
    <BlockMinerRewardPanel sent={!!sentBlockNumber}>
      <div className="block__miner__reward_value">{value}</div>
      <Tooltip placement="top" title={tooltip}>
        <div
          className="block__miner__reward_tip"
          role="button"
          tabIndex={-1}
          onKeyDown={() => {}}
          onClick={() => {
            if (sentBlockNumber) {
              history.push(`/block/${sentBlockNumber}#cellbase`)
            }
          }}
        >
          <img src={sentBlockNumber ? MinerRewardIcon : HelpIcon} alt="miner reward" />
        </div>
      </Tooltip>
    </BlockMinerRewardPanel>
  )
}

export const BlockOverview = () => {
  const {
    blockState: { block },
  } = useAppState()
  const [showAllOverview, setShowAllOverview] = useState(false)
  const minerReward = <DecimalCapacity value={localeNumberString(shannonToCkb(block.minerReward))} />
  const rootInfoItems = [
    {
      title: i18n.t('block.transactions_root'),
      content: `${block.transactionsRoot}`,
    },
  ]
  const sentBlockNumber = `${Number(block.number) + DELAY_BLOCK_NUMBER}`
  let overviewItems: OverviewItemData[] = [
    {
      title: i18n.t('block.block_height'),
      content: localeNumberString(block.number),
    },
    {
      title: i18n.t('block.miner'),
      content: <BlockMiner miner={block.minerHash} />,
    },
    {
      title: i18n.t('transaction.transactions'),
      content: localeNumberString(block.transactionsCount),
    },
    {
      title: i18n.t('block.miner_message'),
      content: <BlockMinerMessage minerMessage={block.minerMessage ?? i18n.t('common.none')} />,
    },
    {
      title: i18n.t('block.proposal_transactions'),
      content: block.proposalsCount ? localeNumberString(block.proposalsCount) : 0,
    },
    {
      title: i18n.t('block.epoch'),
      content: localeNumberString(block.epoch),
    },
    {
      title: i18n.t('block.miner_reward'),
      content: (
        <BlockMinerReward
          value={block.rewardStatus === 'pending' ? i18n.t('block.pending') : minerReward}
          tooltip={block.rewardStatus === 'pending' ? i18n.t('block.pending_tip') : i18n.t('block.reward_sent_tip')}
          sentBlockNumber={block.rewardStatus === 'pending' ? undefined : sentBlockNumber}
        />
      ),
    },
    {
      title: i18n.t('block.epoch_start_number'),
      content: (
        <BlockLinkPanel>
          <Link to={`/block/${block.startNumber}`}>{localeNumberString(block.startNumber)}</Link>
        </BlockLinkPanel>
      ),
    },
    {
      title: i18n.t('block.difficulty'),
      content: handleDifficulty(block.difficulty),
    },
    {
      title: i18n.t('block.block_index'),
      content: `${Number(block.blockIndexInEpoch) + 1}/${block.length}`,
    },
    {
      title: i18n.t('block.nonce'),
      content: <>{`0x${new BigNumber(block.nonce).toString(16)}`}</>,
    },
    {
      title: i18n.t('block.timestamp'),
      content: `${parseSimpleDate(block.timestamp)}`,
    },
    {
      title: i18n.t('block.uncle_count'),
      content: `${block.unclesCount}`,
    },
  ]

  if (isMobile()) {
    const newItems: OverviewItemData[] = []
    overviewItems.forEach((item, index) => (index % 2 === 0 ? newItems.push(item) : null))
    overviewItems.forEach((item, index) => (index % 2 !== 0 ? newItems.push(item) : null))
    overviewItems = newItems.concat(rootInfoItems)
    if (!showAllOverview) {
      overviewItems.splice(11, overviewItems.length - 11)
    }
  }

  const getDropdownIcon = () => {
    if (isMainnet()) {
      return showAllOverview ? PackUpIcon : DropDownIcon
    }
    return showAllOverview ? PackUpBlueIcon : DropDownBlueIcon
  }
  return (
    <OverviewCard items={overviewItems} hideShadow>
      {isMobile() ? (
        <BlockOverviewDisplayControlPanel onClick={() => setShowAllOverview(!showAllOverview)}>
          <img src={getDropdownIcon()} alt={showAllOverview ? 'show' : 'hide'} />
        </BlockOverviewDisplayControlPanel>
      ) : (
        <BlockRootInfoPanel>
          <span />
          {rootInfoItems.map(item => (
            <BlockRootInfoItemPanel key={item.title}>
              <div className="block__root_info_title">{item.title}</div>
              <div className="block__root_info_value monospace">{item.content}</div>
            </BlockRootInfoItemPanel>
          ))}
        </BlockRootInfoPanel>
      )}
    </OverviewCard>
  )
}

export const BlockComp = ({
  currentPage,
  pageSize,
  blockParam,
}: {
  currentPage: number
  pageSize: number
  blockParam: string
}) => {
  const history = useHistory()
  const {
    blockState: { transactions = [], total },
  } = useAppState()

  const totalPages = Math.ceil(total / pageSize)

  const onChange = (page: number) => {
    history.push(`/block/${blockParam}?page=${page}&size=${pageSize}`)
  }

  return (
    <>
      <TitleCard title={`${i18n.t('transaction.transactions')} (${localeNumberString(total)})`} isSingle />
      {transactions.map(
        (transaction: State.Transaction, index: number) =>
          transaction && (
            <TransactionItem
              key={transaction.transactionHash}
              transaction={transaction}
              circleCorner={{
                bottom: index === transactions.length - 1 && totalPages === 1,
              }}
              isBlock
            />
          ),
      )}
      {totalPages > 1 && (
        <BlockTransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
        </BlockTransactionsPagination>
      )}
    </>
  )
}

export default {
  BlockOverview,
  BlockComp,
}
