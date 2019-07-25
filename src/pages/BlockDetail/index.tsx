import React, { useEffect, useState, useContext } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import queryString from 'query-string'
import {
  BlockDetailPanel,
  BlockTransactionsPagition,
  BlockRootInfoItemPanel,
  BlockMinerPanel,
  BlockOverviewItemContentPanel,
  BlockOverviewDisplayControlPanel,
} from './styled'
import Content from '../../components/Content'
import TransactionItem from '../../components/Transaction/TransactionItem/index'
import { parseSimpleDate } from '../../utils/date'
import { shannonToCkb } from '../../utils/util'
import { startEndEllipsis, parsePageNumber } from '../../utils/string'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { isMobile, isSmallMobile, isMediumMobile, isLargeMobile } from '../../utils/screen'
import AddressHashCard from '../../components/Card/AddressHashCard'
import TitleCard from '../../components/Card/TitleCard'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import Tooltip from '../../components/Tooltip'
import DropDownIcon from '../../assets/block_detail_drop_down.png'
import PackUpIcon from '../../assets/block_detail_pack_up.png'
import { PageParams } from '../../utils/const'
import { getBlock } from '../../service/app/block'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'

const handleHashText = (hash: string) => {
  if (isSmallMobile()) {
    return startEndEllipsis(hash, 9, 10)
  }
  if (isMediumMobile()) {
    return startEndEllipsis(hash, 10)
  }
  if (isLargeMobile()) {
    return startEndEllipsis(hash, 15)
  }
  return hash
}

const handleMinerText = (address: string) => {
  if (isSmallMobile()) {
    return startEndEllipsis(address, 11)
  }
  if (isMediumMobile()) {
    return startEndEllipsis(address, 18)
  }
  if (isLargeMobile()) {
    return startEndEllipsis(address, 23)
  }
  return startEndEllipsis(address)
}

const BlockMiner = ({ miner }: { miner: string }) => {
  return (
    <BlockMinerPanel>
      {miner ? (
        <Link to={`/address/${miner}`}>
          <code>{handleMinerText(miner)}</code>
        </Link>
      ) : (
        i18n.t('address.unable_decode_address')
      )}
    </BlockMinerPanel>
  )
}

const BlockOverviewItemContent = ({ value, tip, message }: { value?: string; tip?: string; message?: string }) => {
  const [show, setShow] = useState(false)
  return (
    <BlockOverviewItemContentPanel>
      {value && <div className="block__overview_item_value">{value}</div>}
      {tip && (
        <div
          id={tip}
          className="block__overview_item_tip"
          tabIndex={-1}
          onFocus={() => {}}
          onMouseOver={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          {tip}
          <Tooltip show={show} targetElementId={tip}>
            {message}
          </Tooltip>
        </div>
      )}
    </BlockOverviewItemContentPanel>
  )
}

const BlockOverview = ({ block }: { block: State.Block }) => {
  const [showAllOverview, setShowAllOverview] = useState(false)
  const receivedTxFee = `${localeNumberString(shannonToCkb(block.received_tx_fee))} CKB`
  const rootInfoItems = [
    {
      title: i18n.t('block.transactions_root'),
      content: `${block.transactions_root}`,
    },
    {
      title: i18n.t('block.witnesses_root'),
      content: `${block.witnesses_root}`,
    },
  ]
  let overviewItems: OverviewItemData[] = [
    {
      title: i18n.t('block.block_height'),
      content: localeNumberString(block.number),
    },
    {
      title: i18n.t('block.miner'),
      content: <BlockMiner miner={block.miner_hash} />,
    },
    {
      title: i18n.t('transaction.transactions'),
      content: localeNumberString(block.transactions_count),
    },
    {
      title: i18n.t('block.epoch'),
      content: localeNumberString(block.epoch),
    },
    {
      title: i18n.t('block.proposal_transactions'),
      content: block.proposals_count ? localeNumberString(block.proposals_count) : 0,
    },
    {
      title: i18n.t('block.epoch_start_number'),
      content: localeNumberString(block.start_number),
    },
    {
      title: i18n.t('block.block_reward'),
      content: (
        <BlockOverviewItemContent
          value={`${localeNumberString(shannonToCkb(block.reward))} CKB`}
          tip={block.reward_status === 'pending' ? 'Pending' : undefined}
          message={i18n.t('block.pending_tip')}
        />
      ),
    },
    {
      title: i18n.t('block.epoch_length'),
      content: localeNumberString(block.length),
    },
    {
      title: i18n.t('transaction.transaction_fee'),
      content: (
        <BlockOverviewItemContent
          value={block.received_tx_fee_status === 'calculating' && block.number > 0 ? undefined : receivedTxFee}
          tip={block.received_tx_fee_status === 'calculating' && block.number > 0 ? 'Calculating' : undefined}
          message={i18n.t('block.calculating_tip')}
        />
      ),
    },
    {
      title: i18n.t('block.difficulty'),
      content: localeNumberString(block.difficulty, 16),
    },
    {
      title: i18n.t('block.timestamp'),
      content: `${parseSimpleDate(block.timestamp)}`,
    },
    {
      title: i18n.t('block.nonce'),
      content: `${block.nonce}`,
    },
    {
      title: i18n.t('block.uncle_count'),
      content: `${block.uncles_count}`,
    },
    {
      title: i18n.t('block.proof'),
      content: `${startEndEllipsis(block.proof, 9)}`,
    },
  ]

  if (isMobile()) {
    const newItems: OverviewItemData[] = []
    overviewItems.forEach((item, idx) => (idx % 2 === 0 ? newItems.push(item) : null))
    overviewItems.forEach((item, idx) => (idx % 2 !== 0 ? newItems.push(item) : null))
    overviewItems = newItems.concat(rootInfoItems)
    if (!showAllOverview) {
      overviewItems.splice(11, overviewItems.length - 11)
    }
  }
  return (
    <OverviewCard items={overviewItems}>
      {isMobile() ? (
        <BlockOverviewDisplayControlPanel onClick={() => setShowAllOverview(!showAllOverview)}>
          <img src={showAllOverview ? PackUpIcon : DropDownIcon} alt={showAllOverview ? 'show' : 'hide'} />
        </BlockOverviewDisplayControlPanel>
      ) : (
        rootInfoItems.map(item => {
          return (
            <BlockRootInfoItemPanel key={item.title}>
              <div className="block__root_info_title">{item.title}</div>
              <div className="block__root_info_value">{item.content}</div>
            </BlockRootInfoItemPanel>
          )
        })
      )}
    </OverviewCard>
  )
}

export default ({
  dispatch,
  history: { replace, push },
  match: { params },
  location: { search },
}: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps<{ param: string }>>) => {
  // blockParam: block hash or block number
  const { param: blockParam } = params
  const parsed = queryString.parse(search)
  const page = parsePageNumber(parsed.page, PageParams.PageNo)
  const size = parsePageNumber(parsed.size, PageParams.PageSize)

  const { blockState } = useContext(AppContext)

  useEffect(() => {
    if (size > PageParams.MaxPageSize) {
      replace(`/block/${blockParam}?page=${page}&size=${PageParams.MaxPageSize}`)
    }
    getBlock(blockParam, page, size, dispatch, replace)
  }, [replace, blockParam, page, size, dispatch])

  const onChange = (pageNo: number, pageSize: number) => {
    push(`/block/${blockParam}?page=${pageNo}&size=${pageSize}`)
  }

  return (
    <Content>
      <BlockDetailPanel className="container">
        <AddressHashCard
          title={i18n.t('block.block')}
          hashText={handleHashText(blockState.block.block_hash)}
          dispatch={dispatch}
        />
        <TitleCard title={i18n.t('common.overview')} />
        <BlockOverview block={blockState.block} />
        <TitleCard title={i18n.t('transaction.transactions')} />
        {blockState.transactions &&
          blockState.transactions.map((transaction: any, index: number) => {
            return (
              transaction && (
                <TransactionItem
                  key={transaction.attributes.transaction_hash}
                  transaction={transaction.attributes}
                  isBlock
                  isLastItem={index === blockState.transactions.length - 1}
                />
              )
            )
          })}
        {blockState.total > 1 && (
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
        )}
      </BlockDetailPanel>
    </Content>
  )
}
