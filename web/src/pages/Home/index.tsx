import React from 'react'
import {
  HomeHeaderPanel,
  HomeHeader,
  LogoPanel,
  SearchPanel,
  BlockPanel,
  ContentTitle,
  ContentTable,
  TableTitleRow,
  TableContentRow,
} from './index.css'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import HomeLogo from '../../asserts/logo_home.png'
import SearchLogo from '../../asserts/search.png'
import BlockHeightIcon from '../../asserts/block_height.png'
import TransactionIcon from '../../asserts/transactions.png'
import CellConsumedIcon from '../../asserts/cell_consumed.png'
import MinerIcon from '../../asserts/miner.png'
import TimestampIcon from '../../asserts/timestamp.png'
import BlocksData from './mock'

const TableTitleItem = ({ image, title }: { image: string; title: string }) => {
  return (
    <th>
      <img src={image} alt={title} />
      <div>{title}</div>
    </th>
  )
}

const TableContentItem = ({ color, content }: { color: string; content: string }) => {
  return (
    <td
      style={{
        color,
        height: (78 * window.innerWidth) / 1920,
      }}
    >
      {content}
    </td>
  )
}

const TableLoogContentItem = ({ color, content }: { color: string; content: string }) => {
  return (
    <td
      style={{
        color,
        height: (78 * window.innerWidth) / 1920,
      }}
    >
      <div
        style={{
          maxWidth: 90,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {content}
      </div>
    </td>
  )
}

export default () => {
  const [clickableColor, normalColor] = ['#4bbc8e', '888888']
  return (
    <Page>
      <Header search={false} />
      <Content>
        <HomeHeaderPanel width={window.innerWidth}>
          <HomeHeader>
            <LogoPanel>
              <img src={HomeLogo} alt="home logo" />
              <div>CKB Testnet Explorer</div>
            </LogoPanel>
            <SearchPanel width={window.innerWidth}>
              <input placeholder="Block Heigth / Block Hash / TxHash / Address" />
              <img src={SearchLogo} alt="search logo" />
            </SearchPanel>
          </HomeHeader>
        </HomeHeaderPanel>

        <BlockPanel width={window.innerWidth}>
          <ContentTitle>
            <div>Latest Blocks</div>
            <span />
          </ContentTitle>

          <ContentTable>
            <table>
              <TableTitleRow width={window.innerWidth}>
                <TableTitleItem image={BlockHeightIcon} title="Height" />
                <TableTitleItem image={TransactionIcon} title="Transactions" />
                <TableTitleItem image={CellConsumedIcon} title="Cell Consumed(B)" />
                <TableTitleItem image={MinerIcon} title="Miner" />
                <TableTitleItem image={TimestampIcon} title="Time" />
              </TableTitleRow>
              {BlocksData.data.map((data: any) => {
                return (
                  <TableContentRow>
                    <TableContentItem color={clickableColor} content={data.number} />
                    <TableContentItem color={normalColor} content={data.transactions_count} />
                    <TableContentItem color={normalColor} content={data.cell_consumed} />
                    <TableLoogContentItem color={clickableColor} content={data.miner_hash} />
                    <TableContentItem color={normalColor} content={data.timestamp} />
                  </TableContentRow>
                )
              })}
            </table>
          </ContentTable>
        </BlockPanel>
      </Content>
      <Footer />
    </Page>
  )
}
