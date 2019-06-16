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
  ScriptLabelItemPanel,
  ScriptOtherArgs,
} from './styled'
import CopyIcon from '../../assets/copy.png'
import BalanceIcon from '../../assets/address_balance.png'
import AddressScriptIcon from '../../assets/address_script.png'
import TransactionsIcon from '../../assets/transactions_green.png'
import ItemPointIcon from '../../assets/item_point.png'
import AddressHashIcon from '../../assets/lock_hash_address.png'
import { Address, AddressWrapper } from '../../http/response/Address'
import { Script } from '../../http/response/Script'
import { Response } from '../../http/response/Response'
import { TransactionWrapper } from '../../http/response/Transaction'
import { fetchAddressInfo, fetchTransactionsByAddress } from '../../http/fetcher'
import { copyElementValue, shannonToCkb } from '../../utils/util'
import { validNumber, startEndEllipsis } from '../../utils/string'
import TransactionCard from '../../components/Card/TransactionCard'

const AddressTitle = ({ address, lockHash }: { address: string; lockHash: string }) => {
  const appContext = useContext(AppContext)
  const identityHash = address || lockHash
  return (
    <AddressTitlePanel>
      <div className="address__title">{address ? 'Address' : 'Lock Hash'}</div>
      <div className="address__content">
        <code id="address__hash">{identityHash}</code>
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

const ScriptLabelItem = ({ name, value, noIcon = false }: { name: string; value: string; noIcon?: boolean }) => {
  return (
    <ScriptLabelItemPanel>
      {!noIcon && <img src={ItemPointIcon} alt="item point" />}
      <div>{name}</div>
      <code>{value}</code>
    </ScriptLabelItemPanel>
  )
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
          <ScriptLabelItem name="Code Hash :" value={script.code_hash} />
          {script.args.length === 1 ? (
            <ScriptLabelItem name="Args :" value={script.args[0]} />
          ) : (
            script.args.map((arg: string, index: number) => {
              return index === 0 ? (
                <ScriptLabelItem name="Args: " value={`#${index}: ${arg}`} />
              ) : (
                <ScriptOtherArgs>
                  <ScriptLabelItem name="" value={`#${index}: ${arg}`} noIcon />
                </ScriptOtherArgs>
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
  MaxPageSize = 100,
}

export default (props: React.PropsWithoutRef<RouteComponentProps<{ address: string; hash: string }>>) => {
  const { match, location } = props
  const { params } = match
  const { address, hash: lockHash } = params

  const identityHash = address || lockHash

  const { search } = location
  const parsed = queryString.parse(search)
  const { page, size } = parsed

  const appContext = useContext(AppContext)

  const initTransactionWrappers: TransactionWrapper[] = []
  const initAddress: Address = {
    address_hash: '',
    lock_hash: '',
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

  if (pageSize > PageParams.MaxPageSize) {
    setPageSize(PageParams.MaxPageSize)
    if (address) {
      props.history.replace(`/address/${address}?page=${pageNo}&size=${PageParams.MaxPageSize}`)
    } else {
      props.history.replace(`/lockhash/${lockHash}?page=${pageNo}&size=${PageParams.MaxPageSize}`)
    }
  }

  const getAddressInfo = () => {
    fetchAddressInfo(identityHash)
      .then(json => {
        const { data, error } = json as Response<AddressWrapper>
        if (error) {
          browserHistory.push(`/search/fail?q=${address}`)
        } else {
          setAddressData(data.attributes as Address)
        }
      })
      .catch(() => {
        appContext.toastMessage('Network exception, please try again later', 3000)
      })
  }

  const getTransactions = (page_p: number, size_p: number) => {
    fetchTransactionsByAddress(identityHash, page_p, size_p)
      .then(json => {
        const { data, meta } = json as Response<TransactionWrapper[]>
        if (meta) {
          const { total, page_size } = meta
          setTotalTransactions(total)
          setPageSize(page_size)
        }
        setTransactionWrappers(data)
      })
      .catch(() => {
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
    if (address) {
      props.history.replace(`/address/${address}?page=${page_p}&size=${size_p}`)
    } else {
      props.history.replace(`/lockhash/${lockHash}?page=${page_p}&size=${size_p}`)
    }
  }

  return (
    <Content>
      <AddressContentPanel className="container">
        <AddressTitle address={address} lockHash={lockHash} />
        <AddressOverview value="Overview" />
        <AddressCommonContent>
          <AddressCommonRowPanel>
            <SimpleLabel image={BalanceIcon} label="Balance : " value={`${shannonToCkb(addressData.balance)} CKB`} />
            <SimpleLabel image={TransactionsIcon} label="Transactions : " value={`${addressData.transactions_count}`} />
          </AddressCommonRowPanel>
          {lockHash &&
            (addressData.address_hash ? (
              <SimpleLabel
                image={AddressHashIcon}
                label="Address: "
                value={`${startEndEllipsis(addressData.address_hash, 12)}`}
                lengthNoLimit
              />
            ) : (
              <SimpleLabel image={AddressHashIcon} label="Address: " value="Unable to decode address" lengthNoLimit />
            ))}
          <AddressScriptLabel image={AddressScriptIcon} label="Lock Script : " script={addressData.lock_script} />
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
            {transactionWrappers &&
              transactionWrappers.map((transaction: any) => {
                return (
                  transaction && (
                    <TransactionCard
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
