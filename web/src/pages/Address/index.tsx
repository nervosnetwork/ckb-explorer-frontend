import React, { useState, useEffect, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import queryString from 'query-string'
import AppContext from '../../contexts/App'
import browserHistory from '../../routes/history'
import Content from '../../components/Content'
import TransactionComponent from '../../components/Transaction'
import SimpleLabel from '../../components/Label'
import {
  AddressContentPanel,
  AddressTitlePanel,
  AddressOverviewPanel,
  AddressScriptContentPanel,
  AddressCommonContent,
  AddressScriptContent,
  AddressScriptLabelPanel,
  AddressTransactionsPanel,
  AddressCommonRowPanel,
  AddressTransactionsPagition,
} from './styled'
import CopyIcon from '../../asserts/copy.png'
import BalanceIcon from '../../asserts/address_balance.png'
import AddressScriptIcon from '../../asserts/address_script.png'
import TransactionsIcon from '../../asserts/transactions_green.png'
import { Address, AddressWrapper } from '../../http/response/Address'
import { Script } from '../../http/response/Script'
import { Response } from '../../http/response/Response'
import { TransactionWrapper } from '../../http/response/Transaction'
import { fetchAddressInfo, fetchTransactionsByAddress } from '../../http/fetcher'
import { copyElementValue, shannonToCkb } from '../../utils/util'
import { validNumber } from '../../utils/string'

const AddressTitle = ({ address }: { address: string }) => {
  const appContext = useContext(AppContext)
  return (
    <AddressTitlePanel>
      <div className="address__title">Address</div>
      <div className="address__content">
        <div id="address__hash">{address}</div>
        <div
          role="button"
          tabIndex={-1}
          onKeyDown={() => {}}
          onClick={() => {
            copyElementValue(document.getElementById('address__hash'))
            appContext.toastMessage('Copied', 3000)
          }}
        >
          <img src={CopyIcon} alt="copy" />
        </div>
      </div>
    </AddressTitlePanel>
  )
}

const AddressOverview = ({ value }: { value: string }) => {
  return <AddressOverviewPanel>{value}</AddressOverviewPanel>
}

const AddressScriptLabel = ({ image, label, script }: { image: string; label: string; script: Script }) => {
  return (
    <div>
      <AddressScriptLabelPanel>
        <img src={image} alt="script" />
        <span>{label}</span>
      </AddressScriptLabelPanel>
      <AddressScriptContentPanel>
        <AddressScriptContent>
          <div>{`Code hash: ${script.code_hash}`}</div>
          {script.args.length === 1 ? (
            <div>{`Args: ${script.args[0]}`}</div>
          ) : (
            script.args.map((arg: string, index: number) => {
              return index === 0 ? (
                <div>{`Args: #${index} ${arg}`}</div>
              ) : (
                <div className="script__args__others">{`#${index} ${arg}`}</div>
              )
            })
          )}
        </AddressScriptContent>
      </AddressScriptContentPanel>
    </div>
  )
}

enum PageParams {
  PageNo = 1,
  PageSize = 10,
}

export default (props: React.PropsWithoutRef<RouteComponentProps<{ address: string }>>) => {
  const { match, location } = props
  const { params } = match
  const { address } = params

  const { search } = location
  const parsed = queryString.parse(search)
  const { page, size } = parsed

  const appContext = useContext(AppContext)

  const initTransactionWrappers: TransactionWrapper[] = []
  const initAddress: Address = {
    address_hash: '',
    balance: 0,
    transactions_count: 0,
    cell_consumed: 0,
    lock_script: {
      args: [],
      code_hash: '',
    },
  }
  const [addressData, setAddressData] = useState(initAddress)
  const [transactionWrappers, setTransactionWrappers] = useState(initTransactionWrappers)
  const [totalTransactions, setTotalTransactions] = useState(1)
  const [pageNo, setPageNo] = useState(validNumber(page, PageParams.PageNo))
  const [pageSize, setPageSize] = useState(validNumber(size, PageParams.PageSize))

  const getAddressInfo = () => {
    appContext.showLoading()
    fetchAddressInfo(address)
      .then(json => {
        appContext.hideLoading()
        const { data, error } = json as Response<AddressWrapper>
        if (error) {
          browserHistory.push(`/search/fail?q=${address}`)
        } else {
          setAddressData(data.attributes as Address)
        }
      })
      .catch(() => {
        appContext.hideLoading()
        appContext.toastMessage('Network exception, please try again later', 3000)
      })
  }

  const getTransactions = (page_p: number, size_p: number) => {
    appContext.showLoading()
    fetchTransactionsByAddress(address, page_p, size_p)
      .then(json => {
        appContext.hideLoading()
        const { data, meta } = json as Response<TransactionWrapper[]>
        if (meta) {
          const { total } = meta
          setTotalTransactions(total)
        }
        setTransactionWrappers(data)
      })
      .catch(() => {
        appContext.hideLoading()
        appContext.toastMessage('Network exception, please try again later', 3000)
      })
  }

  useEffect(() => {
    getAddressInfo()
    const page_p = validNumber(page, PageParams.PageNo)
    const size_p = validNumber(size, PageParams.PageSize)
    setPageNo(page_p)
    setPageSize(size_p)
    getTransactions(page_p, size_p)
  }, [search, window.location.href])

  const onChange = (page_p: number, size_p: number) => {
    setPageNo(page_p)
    setPageSize(size_p)
    props.history.push(`/address/${address}?page=${page_p}&size=${size_p}`)
  }

  return (
    <Content>
      <AddressContentPanel width={window.innerWidth} className="container">
        <AddressTitle address={address} />
        <AddressOverview value="Overview" />
        <AddressCommonContent>
          <AddressCommonRowPanel>
            <SimpleLabel image={BalanceIcon} label="Balance: " value={`${shannonToCkb(addressData.balance)} CKB`} />
            <SimpleLabel image={TransactionsIcon} label="Transactions : " value={`${addressData.transactions_count}`} />
          </AddressCommonRowPanel>
          <AddressScriptLabel image={AddressScriptIcon} label="Lock Script: " script={addressData.lock_script} />
        </AddressCommonContent>

        <AddressTransactionsPanel>
          <AddressOverview value="Transactions" />
          <div>
            {transactionWrappers &&
              transactionWrappers.map((transaction: any) => {
                return (
                  transaction && (
                    <TransactionComponent
                      address={address}
                      transaction={transaction.attributes}
                      key={transaction.attributes.transaction_hash}
                    />
                  )
                )
              })}
          </div>
          <AddressTransactionsPagition>
            <Pagination
              showQuickJumper
              showSizeChanger
              defaultPageSize={pageSize}
              pageSize={pageSize}
              defaultCurrent={pageNo}
              current={pageNo}
              total={totalTransactions}
              onChange={onChange}
              locale={localeInfo}
            />
          </AddressTransactionsPagition>
        </AddressTransactionsPanel>
      </AddressContentPanel>
    </Content>
  )
}
