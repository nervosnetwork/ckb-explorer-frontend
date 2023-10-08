import { useState, ReactNode, FC } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { Tooltip } from 'antd'
import { Trans } from 'react-i18next'
import Pagination from '../../components/Pagination'
import DropDownIcon from '../../assets/content_drop_down.png'
import PackUpIcon from '../../assets/content_pack_up.png'
import DropDownBlueIcon from '../../assets/content_blue_drop_down.png'
import PackUpBlueIcon from '../../assets/content_blue_pack_up.png'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TransactionItem from '../../components/TransactionItem/index'
import { parseSimpleDate } from '../../utils/date'
import i18n from '../../utils/i18n'
import { localeNumberString, handleDifficulty } from '../../utils/number'
import { useIsMobile, useSearchParams } from '../../utils/hook'
import { hexToUtf8 } from '../../utils/string'
import { deprecatedAddrToNewAddr, shannonToCkb } from '../../utils/util'
import {
  BlockLinkPanel,
  BlockOverviewDisplayControlPanel,
  BlockMinerRewardPanel,
  BlockMinerMessagePanel,
  BlockRootInfoItemPanel,
  BlockTransactionsPagination,
  BlockRootInfoPanel,
} from './styled'
import HelpIcon from '../../assets/qa_help.png'
import MoreIcon from '../../assets/more.png'
import MinerRewardIcon from '../../assets/miner_complete.png'
import { ReactComponent as LeftArrow } from '../../assets/prev_block.svg'
import { isMainnet } from '../../utils/chain'
import DecimalCapacity from '../../components/DecimalCapacity'
import { DELAY_BLOCK_NUMBER } from '../../constants/common'
import TitleCard from '../../components/Card/TitleCard'
import styles from './styles.module.scss'
import AddressText from '../../components/AddressText'
import ComparedToMaxTooltip from '../../components/Tooltip/ComparedToMaxTooltip'
import Filter from '../../components/Search/Filter'
import { HelpTip } from '../../components/HelpTip'
import { useLatestBlockNumber } from '../../services/ExplorerService'

const CELL_BASE_ANCHOR = 'cellbase'

const BlockMiner = ({ miner }: { miner: string }) => {
  if (!miner) {
    return <BlockLinkPanel>{i18n.t('address.unable_decode_address')}</BlockLinkPanel>
  }
  return (
    <BlockLinkPanel>
      <AddressText
        linkProps={{
          to: `/address/${miner}`,
        }}
      >
        {miner}
      </AddressText>
    </BlockLinkPanel>
  )
}

const BlockMinerMessage = ({ minerMessage }: { minerMessage: string }) => {
  return (
    <BlockMinerMessagePanel>
      <AddressText monospace={false}>{minerMessage}</AddressText>
      <Tooltip placement="top" title={`UTF-8: ${hexToUtf8(minerMessage)}`}>
        <img className="blockMinerMessageUtf8" src={MoreIcon} alt="more" />
      </Tooltip>
    </BlockMinerMessagePanel>
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
          className="blockMinerRewardTip"
          role="button"
          tabIndex={-1}
          onKeyDown={() => {}}
          onClick={() => {
            if (sentBlockNumber) {
              history.push(`/block/${sentBlockNumber}#${CELL_BASE_ANCHOR}`)
            }
          }}
        >
          <img src={sentBlockNumber ? MinerRewardIcon : HelpIcon} alt="miner reward" />
        </div>
      </Tooltip>
    </BlockMinerRewardPanel>
  )
}

export const BlockOverview: FC<{ block: State.Block }> = ({ block }) => {
  const isMobile = useIsMobile()
  const tipBlockNumber = useLatestBlockNumber()
  const [showAllOverview, setShowAllOverview] = useState(false)
  const minerReward = <DecimalCapacity value={localeNumberString(shannonToCkb(block.minerReward))} />
  const rootInfoItems = [
    {
      title: i18n.t('block.transactions_root'),
      tooltip: i18n.t('glossary.transactions_root'),
      content: `${block.transactionsRoot}`,
    },
  ]
  const sentBlockNumber = `${Number(block.number) + DELAY_BLOCK_NUMBER}`
  let overviewItems: OverviewItemData[] = [
    {
      title: i18n.t('block.block_height'),
      tooltip: i18n.t('glossary.block_height'),
      content: (
        <div className={styles.blockNumber}>
          <Tooltip placement="top" title={i18n.t('block.view_prev_block')}>
            <Link to={`/block/${+block.number - 1}`} className={styles.prev} data-disabled={+block.number <= 0}>
              <LeftArrow />
            </Link>
          </Tooltip>
          {localeNumberString(block.number)}
          <Tooltip title={i18n.t('block.view_next_block')}>
            <Link
              to={`/block/${+block.number + 1}`}
              className={styles.next}
              data-disabled={+block.number >= +tipBlockNumber}
            >
              <LeftArrow />
            </Link>
          </Tooltip>
        </div>
      ),
    },
    {
      title: i18n.t('block.miner'),
      tooltip: i18n.t('glossary.miner'),
      contentWrapperClass: styles.addressWidthModify,
      content: <BlockMiner miner={block.minerHash} />,
    },
    {
      title: i18n.t('transaction.transactions'),
      tooltip: i18n.t('glossary.transactions'),
      content: localeNumberString(block.transactionsCount),
    },
    {
      title: i18n.t('block.miner_message'),
      tooltip: i18n.t('glossary.miner_message'),
      contentWrapperClass: styles.addressWidthModify,
      content: <BlockMinerMessage minerMessage={block.minerMessage ?? i18n.t('common.none')} />,
    },
    {
      title: i18n.t('block.size'),
      tooltip: i18n.t('glossary.size'),
      content: block.size ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {`${block.size.toLocaleString('en')} Bytes`}
          <ComparedToMaxTooltip
            numerator={block.size}
            maxInEpoch={block.largestBlockInEpoch}
            maxInChain={block.largestBlock}
            titleInEpoch={i18n.t('block.compared_to_the_max_size_in_epoch')}
            titleInChain={i18n.t('block.compared_to_the_max_size_in_chain')}
            unit="Bytes"
          />
        </div>
      ) : (
        '-'
      ),
    },
    null,
    {
      title: i18n.t('block.cycles'),
      tooltip: i18n.t('glossary.cycles'),
      content: block.cycles ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {`${block.cycles.toLocaleString('en')}`}
          <ComparedToMaxTooltip
            numerator={block.cycles}
            maxInEpoch={block.maxCyclesInEpoch}
            maxInChain={block.maxCycles}
            titleInEpoch={i18n.t('block.compared_to_the_max_cycles_in_epoch')}
            titleInChain={i18n.t('block.compared_to_the_max_cycles_in_chain')}
          />
        </div>
      ) : (
        '-'
      ),
    },
    null,
    {
      title: i18n.t('block.proposal_transactions'),
      tooltip: i18n.t('glossary.proposal_transactions'),
      content: block.proposalsCount ? localeNumberString(block.proposalsCount) : 0,
    },
    {
      title: i18n.t('block.epoch'),
      tooltip: i18n.t('glossary.epoch'),
      content: localeNumberString(block.epoch),
    },
    {
      title: i18n.t('block.miner_reward'),
      tooltip: i18n.t('glossary.miner_reward'),
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
      tooltip: i18n.t('glossary.epoch_start_number'),
      content: (
        <BlockLinkPanel>
          <Link to={`/block/${block.startNumber}`}>{localeNumberString(block.startNumber)}</Link>
        </BlockLinkPanel>
      ),
    },
    {
      title: i18n.t('block.difficulty'),
      tooltip: i18n.t('glossary.difficulty'),
      content: handleDifficulty(block.difficulty),
    },
    {
      title: i18n.t('block.block_index'),
      tooltip: i18n.t('glossary.block_index'),
      content: `${Number(block.blockIndexInEpoch) + 1}/${block.length}`,
    },
    {
      title: i18n.t('block.nonce'),
      tooltip: i18n.t('glossary.nonce'),
      content: <>{`0x${new BigNumber(block.nonce).toString(16)}`}</>,
    },
    {
      title: i18n.t('block.timestamp'),
      tooltip: i18n.t('glossary.timestamp'),
      content: `${parseSimpleDate(block.timestamp)}`,
    },
    {
      title: i18n.t('block.uncle_count'),
      tooltip: (
        <Trans
          i18nKey="glossary.uncle_count"
          components={{
            // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
            link1: <a href="https://docs.nervos.org/docs/basics/glossary/#uncle" target="_blank" rel="noreferrer" />,
          }}
        />
      ),
      content: `${block.unclesCount}`,
    },
  ]

  if (isMobile) {
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
      {isMobile ? (
        <BlockOverviewDisplayControlPanel onClick={() => setShowAllOverview(!showAllOverview)}>
          <img src={getDropdownIcon()} alt={showAllOverview ? 'show' : 'hide'} />
        </BlockOverviewDisplayControlPanel>
      ) : (
        <BlockRootInfoPanel>
          <span />
          {rootInfoItems.map(item => (
            <BlockRootInfoItemPanel key={item.title}>
              <div className="blockRootInfoTitle">
                <span>{item.title}</span>
                {item.tooltip && <HelpTip title={item.tooltip} />}
              </div>
              <div className="blockRootInfoValue monospace">{item.content}</div>
            </BlockRootInfoItemPanel>
          ))}
        </BlockRootInfoPanel>
      )}
    </OverviewCard>
  )
}

export const BlockComp = ({
  onPageChange,
  currentPage,
  pageSize,
  transactions,
  total,
}: {
  onPageChange: (page: number) => void
  currentPage: number
  pageSize: number
  transactions: State.Transaction[]
  total: number
}) => {
  const totalPages = Math.ceil(total / pageSize)
  const { push } = useHistory()
  const { hash } = useLocation()
  const { param: blockId } = useParams<{ param: string }>()

  const { filter } = useSearchParams('filter')

  return (
    <>
      <TitleCard
        title={`${i18n.t('transaction.transactions')} (${localeNumberString(total)})`}
        className={styles.transactionTitleCard}
        isSingle
        rear={
          <Filter
            showReset={!!filter}
            defaultValue={filter ?? ''}
            placeholder={i18n.t('block.address_or_hash')}
            onFilter={filter => {
              push(`/block/${blockId}?${new URLSearchParams({ filter })}`)
            }}
            onReset={() => {
              push(`/block/${blockId}`)
            }}
          />
        }
      />
      {transactions.map(
        (transaction, index) =>
          transaction && (
            <TransactionItem
              key={transaction.transactionHash}
              scrollIntoViewOnMount={transaction.isCellbase && hash === `#${CELL_BASE_ANCHOR}`}
              transaction={{
                ...transaction,
                displayInputs: transaction.displayInputs.map(input => ({
                  ...input,
                  addressHash: deprecatedAddrToNewAddr(input.addressHash),
                })),
                displayOutputs: transaction.displayOutputs.map(output => ({
                  ...output,
                  addressHash: deprecatedAddrToNewAddr(output.addressHash),
                })),
              }}
              circleCorner={{
                bottom: index === transactions.length - 1 && totalPages === 1,
              }}
              isBlock
            />
          ),
      )}
      {totalPages > 1 && (
        <BlockTransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onPageChange} />
        </BlockTransactionsPagination>
      )}
    </>
  )
}
