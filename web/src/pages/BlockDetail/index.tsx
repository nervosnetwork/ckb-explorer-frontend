import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { BlockDetailPanel, BlockDetailTitlePanel, BlockOverviewPanel } from './index.css'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import CopyIcon from '../../asserts/copy.png'

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
        </BlockDetailPanel>
      </Content>
      <Footer />
    </Page>
  )
}
