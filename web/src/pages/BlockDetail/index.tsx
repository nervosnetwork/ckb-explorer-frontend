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
import BlockData from './mock'

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

const BlockCommonLabel = ({ image, label, value }: { image: string; label: string; value: any }) => {
  return (
    <BlockLabelItemPanel>
      <img src={image} alt={value} />
      <span>{label}</span>
      <div>{value}</div>
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

export default (props: React.PropsWithoutRef<RouteComponentProps<{ hash: string }>>) => {
  const { match } = props
  const { params } = match
  const { hash } = params

  return (
    <Page>
      <Header />
      <Content>
        <BlockDetailPanel width={window.innerWidth}>
          <BlockDetailTitle hash={hash} />
          <BlockOverview value="Overview" />
          <BlockCommonContent>
            <div>
              <BlockCommonLabel image={BlockHeightIcon} label="Block Height" value={BlockData.data.number} />
            </div>
            <span className="block__content__separate" />
            <div>
              <BlockCellConsumedLabel
                image={BlockHeightIcon}
                label="Block Height"
                consumed={BlockData.data.cell_consumed}
                balance={BlockData.data.total_cell_capacity}
              />
            </div>
          </BlockCommonContent>
        </BlockDetailPanel>
      </Content>
      <Footer />
    </Page>
  )
}
