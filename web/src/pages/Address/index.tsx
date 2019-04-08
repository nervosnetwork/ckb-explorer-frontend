import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import ReactJson from 'react-json-view'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import {
  AddressContentPanel,
  AddressTitlePanel,
  AddressOverviewPanel,
  AddressCommonContent,
  AddressLabelItemPanel,
  CellConsumedBarDiv,
  AddressTransactionsPenal,
  AddressTransactionsItem,
  AddressTransactionsCell,
  AddressTransactionsPagition,
} from './index.css'
import CopyIcon from '../../asserts/copy.png'
import BalanceIcon from '../../asserts/address_balance.png'
import CellConsumedIcon from '../../asserts/address_cell_consumed.png'
import AddressScriptIcon from '../../asserts/address_script.png'
import TransactionsIcon from '../../asserts/address_transactions.png'
import InputOutputIcon from '../../asserts/input_arrow_output.png'
import { AddressData, TransactionsData } from './mock'

const AddressTitle = ({ address }: { address: string }) => {
  return (
    <AddressTitlePanel>
      <div className="address__title">Address</div>
      <div className="address__content">
        <div>{address}</div>
        <img src={CopyIcon} alt="copy" />
      </div>
    </AddressTitlePanel>
  )
}

const AddressOverview = ({ value }: { value: string }) => {
  return (
    <AddressOverviewPanel>
      <div>{value}</div>
      <span />
    </AddressOverviewPanel>
  )
}

const AddressCommonLabel = ({
  image,
  label,
  value,
  style,
}: {
  image: string
  label: string
  value: any
  style: any
}) => {
  return (
    <AddressLabelItemPanel style={style}>
      <img src={image} alt={value} />
      <span>{label}</span>
      <div>{value}</div>
    </AddressLabelItemPanel>
  )
}

const CellConsumedBar = ({ percent }: { percent: number }) => {
  return (
    <CellConsumedBarDiv percent={`${percent}`}>
      <div />
    </CellConsumedBarDiv>
  )
}

const AddressCellConsumedLabel = ({
  image,
  label,
  consumed,
  balance,
  style,
}: {
  image: string
  label: string
  consumed: number
  balance: number
  style: any
}) => {
  return (
    <AddressLabelItemPanel style={style}>
      <img src={image} alt="Cell Consumed" />
      <span>{label}</span>
      <CellConsumedBar percent={(consumed * 100) / balance} />
      <div>{`${consumed}B / ${(consumed * 100) / balance}%`}</div>
    </AddressLabelItemPanel>
  )
}

const AddressScriptLabel = ({
  image,
  label,
  value,
  style,
}: {
  image: string
  label: string
  value: any
  style: any
}) => {
  return (
    <div style={style}>
      <AddressLabelItemPanel>
        <img src={image} alt={value} />
        <span>{label}</span>
      </AddressLabelItemPanel>
      <ReactJson
        src={value}
        style={{
          marginLeft: 56,
          marginTop: 18,
        }}
      />
    </div>
  )
}

const AddressTransactionCell = ({ cell }: { cell: any }) => {
  return (
    <AddressTransactionsCell>
      <div className="transaction__cell__hash">{cell.address_hash}</div>
      <div className="transaction__cell__capacity">{`${cell.capacity} CKB`}</div>
    </AddressTransactionsCell>
  )
}

const formatData = (data: number) => {
  return data < 10 ? `0${data}` : data
}

const parseDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${formatData(date.getHours())}:${formatData(
    date.getMinutes(),
  )}:${formatData(date.getSeconds())}`
}

const AddressTransactionsComponent = ({ transaction }: { transaction: any }) => {
  return (
    <AddressTransactionsItem>
      <div className="transaction__hash__panel">
        <div className="transaction_hash">{transaction.transaction_hash}</div>
        <div className="transaction_block">
          {`(Block ${transaction.block_number})  ${parseDate(transaction.block_timestamp)}`}
        </div>
      </div>
      <span className="transaction__separate" />
      <div className="transaction__input__output">
        <div className="transaction__input">
          {transaction.display_inputs.map((cell: any) => {
            return <AddressTransactionCell cell={cell} key={cell.input_id} />
          })}
        </div>
        <img src={InputOutputIcon} alt="input and output" />
        <div className="transaction__output">
          {transaction.display_outputs.map((cell: any) => {
            return <AddressTransactionCell cell={cell} key={cell.output_id} />
          })}
        </div>
      </div>
    </AddressTransactionsItem>
  )
}

export default (
  props: React.PropsWithoutRef<RouteComponentProps<{ address: string; pageNo: string; pageSize: string }>>,
) => {
  const { match } = props
  const { params } = match
  const { address, pageNo, pageSize } = params

  const [currentPageNo, setCurrentPageNo] = useState(pageNo === undefined ? 1 : parseInt(pageNo, 10))
  const [currentPageSize, setCurrentPageSize] = useState(pageSize === undefined ? 3 : parseInt(pageSize, 10))

  // TODO: fetch transaction data from server
  const getTransactionOfAddress = (page: number, size: number) => {
    return TransactionsData.data.slice((page - 1) * size, page * size)
  }

  const onChange = (page: number, size: number) => {
    setCurrentPageNo(page)
    setCurrentPageSize(size)
    getTransactionOfAddress(page, size)
  }

  return (
    <Page>
      <Header />
      <Content>
        <AddressContentPanel width={window.innerWidth}>
          <AddressTitle address={address} />
          <AddressOverview value="Overview" />
          <AddressCommonContent>
            <AddressCommonLabel
              image={BalanceIcon}
              label="Balance: "
              value={`${AddressData.data.balance} CKB`}
              style={{
                position: 'relative',
                top: 0,
                left: 0,
              }}
            />
            <AddressCommonLabel
              image={TransactionsIcon}
              label="Transactions: "
              value={`${AddressData.data.transactions_count}`}
              style={{
                position: 'relative',
                top: -28,
                left: 583,
              }}
            />
            <AddressCellConsumedLabel
              image={CellConsumedIcon}
              label="Cell Consumed: "
              consumed={AddressData.data.cell_consumed}
              balance={AddressData.data.balance}
              style={{
                position: 'relative',
                top: -4,
                left: 0,
              }}
            />
            <AddressScriptLabel
              image={AddressScriptIcon}
              label="Lock Script: "
              value={AddressData.data.lock_script}
              style={{
                position: 'relative',
                top: 20,
                left: 0,
              }}
            />
          </AddressCommonContent>

          <AddressTransactionsPenal>
            <AddressOverview value="Transactions" />
            <div>
              {getTransactionOfAddress(currentPageNo, currentPageSize).map((transaction: any) => {
                return <AddressTransactionsComponent transaction={transaction} key={transaction.transaction_hash} />
              })}
            </div>
            <AddressTransactionsPagition>
              <Pagination
                showQuickJumper
                showSizeChanger
                defaultPageSize={currentPageSize}
                defaultCurrent={currentPageNo}
                total={TransactionsData.data.length}
                onChange={onChange}
              />
            </AddressTransactionsPagition>
          </AddressTransactionsPenal>
        </AddressContentPanel>
      </Content>
      <Footer />
    </Page>
  )
}
