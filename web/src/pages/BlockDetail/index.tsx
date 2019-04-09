import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import {
  BlockDetailPanel,
  BlockDetailTitlePanel,
  BlockOverviewPanel,
  BlockCommonContent,
  BlockLabelItemPanel,
  CellConsumedBarDiv,
} from './index.css'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
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
import BlockData from './mock'
import { parseSimpleDate } from '../../utils/date'

const BlockDetailTitle = ({ hash }: { hash: string }) => {
  return (
    <BlockDetailTitlePanel>
      <div className="address__title">Block</div>
      <div className="address__content">
        <div>{hash}</div>
        <img src={CopyIcon} alt="copy" />
      </div>
    </BlockDetailTitlePanel>
  )
}

const BlockOverview = ({ value }: { value: string }) => {
  return <BlockOverviewPanel>{value}</BlockOverviewPanel>
}

const BlockCommonLabel = ({
  image,
  label,
  value,
  highLight,
}: {
  image: string
  label: string
  value: any
  highLight?: boolean
}) => {
  const highLightStyle = {
    color: '#4BBC8E',
  }
  const normalStyle = {
    color: '#888888',
  }
  return (
    <BlockLabelItemPanel>
      <img src={image} alt={value} />
      <span>{label}</span>
      <div style={highLight ? highLightStyle : normalStyle}>{value}</div>
    </BlockLabelItemPanel>
  )
}

const CellConsumedBar = ({ percent }: { percent: number }) => {
  return (
    <CellConsumedBarDiv percent={`${percent}`}>
      <div />
    </CellConsumedBarDiv>
  )
}

const BlockCellConsumedLabel = ({
  image,
  label,
  consumed,
  balance,
}: {
  image: string
  label: string
  consumed: number
  balance: number
}) => {
  return (
    <BlockLabelItemPanel>
      <img src={image} alt="Cell Consumed" />
      <span>{label}</span>
      <CellConsumedBar percent={(consumed * 100) / balance} />
      <div>{`${consumed}B / ${(consumed * 100) / balance}%`}</div>
    </BlockLabelItemPanel>
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

  const BlockLeftItems: BlockItem[] = [
    {
      image: BlockHeightIcon,
      label: 'Block Height:',
      value: `${BlockData.data.number}`,
    },
    {
      image: BlockTransactionIcon,
      label: 'Transactions:',
      value: `${BlockData.data.transactions_count}`,
    },
    {
      image: ProposalTransactionsIcon,
      label: 'Proposal Transactions:',
      value: `${BlockData.data.proposal_transactions_count}`,
    },
    {
      image: TimestampIcon,
      label: 'Timestamp:',
      value: `${parseSimpleDate(BlockData.data.timestamp)}`,
    },
    {
      image: VersionIcon,
      label: 'Version:',
      value: `${BlockData.data.version}`,
    },
    {
      image: UncleCountIcon,
      label: 'Uncle Count:',
      value: `${BlockData.data.uncles_count}`,
    },
  ]

  const BlockRightItems: BlockItem[] = [
    {
      image: MinerIcon,
      label: 'Miner:',
      value: `${BlockData.data.miner_hash}`,
    },
    {
      image: BlockRewardIcon,
      label: 'Block Reward:',
      value: `${BlockData.data.reward}`,
    },
    {
      image: TransactionFeeIcon,
      label: 'Transaction Fee:',
      value: `${BlockData.data.total_transaction_fee}`,
    },
    {
      image: DifficultyIcon,
      label: 'Difficulty:',
      value: `${BlockData.data.difficulty}`,
    },
    {
      image: NonceIcon,
      label: 'Nonce:',
      value: `${BlockData.data.nonce}`,
    },
    {
      image: ProofIcon,
      label: 'Proof:',
      value: `${BlockData.data.proof}`,
    },
  ]

  return (
    <Page>
      <Header />
      <Content>
        <BlockDetailPanel width={window.innerWidth}>
          <BlockDetailTitle hash={hash} />
          <BlockOverview value="Overview" />
          <BlockCommonContent>
            <div>
              {BlockLeftItems.slice(0, 3).map(item => {
                return <BlockCommonLabel image={item.image} label={item.label} value={item.value} />
              })}
              <BlockCellConsumedLabel
                image={CellConsumedIcon}
                label="Cell Consumed"
                consumed={BlockData.data.cell_consumed}
                balance={BlockData.data.total_cell_capacity}
              />
              {BlockLeftItems.slice(3).map(item => {
                return <BlockCommonLabel image={item.image} label={item.label} value={item.value} />
              })}
            </div>
            <span className="block__content__separate" />
            <div>
              <BlockCommonLabel
                image={BlockRightItems[0].image}
                label={BlockRightItems[0].label}
                value={BlockRightItems[0].value}
                highLight
              />
              {BlockRightItems.slice(1).map(item => {
                return <BlockCommonLabel image={item.image} label={item.label} value={item.value} />
              })}
            </div>
          </BlockCommonContent>
        </BlockDetailPanel>
      </Content>
      <Footer />
    </Page>
  )
}
