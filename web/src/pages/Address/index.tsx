import React, { useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import ReactJson from 'react-json-view'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import TransactionComponent from '../../components/Transaction'
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
import { Address } from '../../http/response/Address'
import { Response } from '../../http/response/Response'
import { TransactionWrapper } from '../../http/response/Transaction'
import { fetchAddressInfo, fetchTransactionsByAddress } from '../../http/fetcher'

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

export default (props: React.PropsWithoutRef<RouteComponentProps<{ address: string }>>) => {
  const { match } = props
  const { params } = match
  const { address } = params

  const initTransactionWrappers: TransactionWrapper[] = []
  const initAddress: Address = {
    address_hash: '',
    balance: 0,
    transactions_count: 0,
    cell_consumed: 0,
    lock_script: {
      args: [],
      binary_hash: '',
    },
  }
  const [addressData, setAddressData] = useState(initAddress)
  const [transactionWrappers, setTrasactionWrappers] = useState(initTransactionWrappers)
  const [totalTransactions, setTotalTransactions] = useState(1)
  const [pageSize, setPageSize] = useState(3)
  const [pageNo, setPageNo] = useState(1)

  const getAddressInfo = () => {
    fetchAddressInfo(address).then(data => {
      setAddressData(data as Address)
    })
  }

  const getTransactions = (page: number, size: number) => {
    fetchTransactionsByAddress(address).then(response => {
      const { data, meta } = response as Response<TransactionWrapper[]>
      if (meta) {
        const { total } = meta
        setTotalTransactions(total)
      }
      const transactions = data.slice((page - 1) * size, page * size)
      setTrasactionWrappers(transactions)
    })
  }

  useEffect(() => {
    getAddressInfo()
    getTransactions(pageNo, pageSize)
  }, [])

  const onChange = (page: number, size: number) => {
    setPageSize(size)
    setPageNo(page)
    getTransactions(page, size)
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
              <SimpleLabel image={BalanceIcon} label="Balance: " value={`${addressData.balance} CKB`} />
              <SimpleLabel
                image={TransactionsIcon}
                label="Transactions : "
                value={`${addressData.transactions_count}`}
                style={{
                  marginRight: '25%',
                }}
              />
            </AddressCommonRowPanel>

            <CellConsumedLabel
              image={CellConsumedIcon}
              label="Cell Consumed: "
              consumed={addressData.cell_consumed}
              balance={addressData.balance}
            />
            <AddressScriptLabel image={AddressScriptIcon} label="Lock Script: " value={addressData.lock_script} />
          </AddressCommonContent>

          <AddressTransactionsPanel>
            <AddressOverview value="Transactions" />
            <div>
              {transactionWrappers.map((transaction: any) => {
                return <TransactionComponent transaction={transaction} key={transaction.attributes.transaction_hash} />
              })}
            </div>
            <AddressTransactionsPagition>
              <Pagination
                showQuickJumper
                showSizeChanger
                defaultPageSize={pageSize}
                defaultCurrent={pageNo}
                total={totalTransactions}
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
