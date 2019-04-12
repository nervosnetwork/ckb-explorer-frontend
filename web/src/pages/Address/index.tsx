import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import ReactJson from 'react-json-view'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import Transaction from '../../components/Transaction'
import SimpleLabel from '../../components/Label'
import CellConsumedLabel from '../../components/Label/CellConsumedLabel'
import {
  AddressContentPanel,
  AddressTitlePanel,
  AddressOverviewPanel,
  AddressCommonContent,
  AddressScriptLabelPanel,
  AddressTransactionsPanel,
  AddressCommonRowPanel,
  AddressTransactionsPagition,
} from './index.css'
import CopyIcon from '../../asserts/copy.png'
import BalanceIcon from '../../asserts/address_balance.png'
import CellConsumedIcon from '../../asserts/address_cell_consumed.png'
import AddressScriptIcon from '../../asserts/address_script.png'
import TransactionsIcon from '../../asserts/transactions_green.png'
import { AddressData, TransactionsData } from '../../http/mock/address'

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
  return <AddressOverviewPanel>{value}</AddressOverviewPanel>
}

const AddressScriptLabel = ({ image, label, value }: { image: string; label: string; value: any }) => {
  return (
    <div>
      <AddressScriptLabelPanel>
        <img src={image} alt={value} />
        <span>{label}</span>
      </AddressScriptLabelPanel>
      <ReactJson src={value} />
    </div>
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
            <AddressCommonRowPanel>
              <SimpleLabel image={BalanceIcon} label="Balance: " value={`${AddressData.data.balance} CKB`} />
              <SimpleLabel
                image={TransactionsIcon}
                label="Transactions : "
                value={`${AddressData.data.transactions_count}`}
                style={{
                  marginRight: '25%',
                }}
              />
            </AddressCommonRowPanel>

            <CellConsumedLabel
              image={CellConsumedIcon}
              label="Cell Consumed: "
              consumed={AddressData.data.cell_consumed}
              balance={AddressData.data.balance}
            />
            <AddressScriptLabel image={AddressScriptIcon} label="Lock Script: " value={AddressData.data.lock_script} />
          </AddressCommonContent>

          <AddressTransactionsPanel>
            <AddressOverview value="Transactions" />
            <div>
              {getTransactionOfAddress(currentPageNo, currentPageSize).map((transaction: any) => {
                return <Transaction transaction={transaction} key={transaction.transaction_hash} />
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
          </AddressTransactionsPanel>
        </AddressContentPanel>
      </Content>
      <Footer />
    </Page>
  )
}
