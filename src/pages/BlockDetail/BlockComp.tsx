import { ReactNode, FC } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { Tooltip } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import Pagination from '../../components/Pagination'
import TransactionItem from '../../components/TransactionItem/index'
import { parseSimpleDate } from '../../utils/date'
import { localeNumberString, handleDifficulty } from '../../utils/number'
import { useIsMobile, useSearchParams } from '../../hooks'
import { hexToUtf8 } from '../../utils/string'
import { deprecatedAddrToNewAddr, shannonToCkb } from '../../utils/util'
import { BlockLinkPanel, BlockMinerRewardPanel, BlockMinerMessagePanel, BlockTransactionsPagination } from './styled'
import HelpIcon from '../../assets/qa_help.png'
import MoreIcon from '../../assets/more.png'
import MinerRewardIcon from './miner_complete.png'
import { ReactComponent as LeftArrow } from './prev_block.svg'
import DecimalCapacity from '../../components/DecimalCapacity'
import { DELAY_BLOCK_NUMBER } from '../../constants/common'
import { Card, CardCell, CardCellInfo, CardCellsLayout, HashCardHeader } from '../../components/Card'
import styles from './styles.module.scss'
import AddressText from '../../components/AddressText'
import ComparedToMaxTooltip from '../../components/Tooltip/ComparedToMaxTooltip'
import Filter from '../../components/Search/Filter'
import { useLatestBlockNumber } from '../../services/ExplorerService'
import { Block } from '../../models/Block'
import { Transaction } from '../../models/Transaction'
import { CardHeader } from '../../components/Card/CardHeader'

const CELL_BASE_ANCHOR = 'cellbase'

const BlockMiner = ({ miner }: { miner: string }) => {
  const { t } = useTranslation()
  if (!miner) {
    return <BlockLinkPanel>{t('address.unable_decode_address')}</BlockLinkPanel>
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

export const BlockOverviewCard: FC<{ blockHeightOrHash: string; block: Block }> = ({ blockHeightOrHash, block }) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const tipBlockNumber = useLatestBlockNumber()
  const minerReward = <DecimalCapacity value={localeNumberString(shannonToCkb(block.minerReward))} />
  const rootInfoItem: CardCellInfo = {
    title: t('block.transactions_root'),
    tooltip: t('glossary.transactions_root'),
    content: <AddressText>{block.transactionsRoot}</AddressText>,
  }
  const sentBlockNumber = `${Number(block.number) + DELAY_BLOCK_NUMBER}`
  const overviewItems: CardCellInfo<'left' | 'right'>[] = [
    {
      title: t('block.block_height'),
      tooltip: t('glossary.block_height'),
      content: (
        <div className={styles.blockNumber}>
          <Tooltip placement="top" title={t('block.view_prev_block')}>
            <Link to={`/block/${+block.number - 1}`} className={styles.prev} data-disabled={+block.number <= 0}>
              <LeftArrow />
            </Link>
          </Tooltip>
          {localeNumberString(block.number)}
          <Tooltip title={t('block.view_next_block')}>
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
      title: t('block.miner'),
      tooltip: t('glossary.miner'),
      contentWrapperClass: styles.addressWidthModify,
      content: <BlockMiner miner={block.minerHash} />,
    },
    {
      title: t('transaction.transactions'),
      tooltip: t('glossary.transactions'),
      content: localeNumberString(block.transactionsCount),
    },
    {
      title: t('block.miner_message'),
      tooltip: t('glossary.miner_message'),
      contentWrapperClass: styles.addressWidthModify,
      content: <BlockMinerMessage minerMessage={block.minerMessage ?? t('common.none')} />,
    },
    {
      title: t('block.size'),
      tooltip: t('glossary.size'),
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
            titleInEpoch={t('block.compared_to_the_max_size_in_epoch')}
            titleInChain={t('block.compared_to_the_max_size_in_chain')}
            unit="Bytes"
          />
        </div>
      ) : (
        '-'
      ),
    },
    {
      slot: 'left',
      cell: {
        title: t('block.cycles'),
        tooltip: t('glossary.cycles'),
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
              titleInEpoch={t('block.compared_to_the_max_cycles_in_epoch')}
              titleInChain={t('block.compared_to_the_max_cycles_in_chain')}
            />
          </div>
        ) : (
          '-'
        ),
      },
    },
    {
      slot: 'left',
      cell: {
        title: t('block.proposal_transactions'),
        tooltip: t('glossary.proposal_transactions'),
        content: block.proposalsCount ? localeNumberString(block.proposalsCount) : 0,
      },
    },
    {
      title: t('block.epoch'),
      tooltip: t('glossary.epoch'),
      content: localeNumberString(block.epoch),
    },
    {
      title: t('block.miner_reward'),
      tooltip: t('glossary.miner_reward'),
      content: (
        <BlockMinerReward
          value={block.rewardStatus === 'pending' ? t('block.pending') : minerReward}
          tooltip={block.rewardStatus === 'pending' ? t('block.pending_tip') : t('block.reward_sent_tip')}
          sentBlockNumber={block.rewardStatus === 'pending' ? undefined : sentBlockNumber}
        />
      ),
    },
    {
      title: t('block.epoch_start_number'),
      tooltip: t('glossary.epoch_start_number'),
      content: (
        <BlockLinkPanel>
          <Link to={`/block/${block.startNumber}`}>{localeNumberString(block.startNumber)}</Link>
        </BlockLinkPanel>
      ),
    },
    {
      title: t('block.difficulty'),
      tooltip: t('glossary.difficulty'),
      content: handleDifficulty(block.difficulty),
    },
    {
      title: t('block.block_index'),
      tooltip: t('glossary.block_index'),
      content: `${Number(block.blockIndexInEpoch) + 1}/${block.length}`,
    },
    {
      title: t('block.nonce'),
      tooltip: t('glossary.nonce'),
      content: <>{`0x${new BigNumber(block.nonce).toString(16)}`}</>,
    },
    {
      title: t('block.timestamp'),
      tooltip: t('glossary.timestamp'),
      content: `${parseSimpleDate(block.timestamp)}`,
    },
    {
      title: t('block.uncle_count'),
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
    overviewItems.push(rootInfoItem)
  }

  return (
    <Card>
      <HashCardHeader title={t('block.block')} hash={blockHeightOrHash} />
      <CardCellsLayout type="left-right" cells={overviewItems} borderTop />
      {!isMobile && <CardCell {...rootInfoItem} className={styles.cellTransactionsRoot} />}
    </Card>
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
  transactions: Transaction[]
  total: number
}) => {
  const { t } = useTranslation()
  const totalPages = Math.ceil(total / pageSize)
  const { push } = useHistory()
  const { hash } = useLocation()
  const { param: blockId } = useParams<{ param: string }>()

  const { filter } = useSearchParams('filter')

  return (
    <>
      <Card className={styles.transactionListOptionsCard} rounded="top">
        <CardHeader
          className={styles.cardHeader}
          leftContent={`${t('transaction.transactions')} (${localeNumberString(total)})`}
          rightProps={{ className: styles.rear }}
          rightContent={
            <Filter
              showReset={!!filter}
              defaultValue={filter ?? ''}
              placeholder={t('block.address_or_hash')}
              onFilter={filter => {
                push(`/block/${blockId}?${new URLSearchParams({ filter })}`)
              }}
              onReset={() => {
                push(`/block/${blockId}`)
              }}
            />
          }
        />
      </Card>

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
