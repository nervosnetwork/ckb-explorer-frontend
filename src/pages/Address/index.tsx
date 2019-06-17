import React, { useState, useEffect, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import queryString from 'query-string'
import AppContext from '../../contexts/App'
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

interface TransactionData {
  transactionWrappers: TransactionWrapper[]
  totalTransactions: number
  pageNo: number
  pageSize: number
}

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

const getAddressInfo = ({
  hash,
  setAddressData,
  appContext,
}: {
  hash: string
  setAddressData: any
  appContext: any
}) => {
  fetchAddressInfo(hash)
    .then(response => {
      const { data } = response as Response<AddressWrapper>
      setAddressData(data.attributes as Address)
    })
    .catch(() => {
      appContext.toastMessage('Network exception, please try again later', 3000)
    })
}

const getTransactions = ({
  hash,
  transactionData,
  setTransactionData,
  appContext,
}: {
  hash: string
  transactionData: TransactionData
  setTransactionData: any
  appContext: any
}) => {
  const { pageNo, pageSize } = transactionData
  fetchTransactionsByAddress(hash, pageNo, pageSize)
    .then(response => {
      const { data, meta } = response as Response<TransactionWrapper[]>
      setTransactionData((state: any) => {
        return {
          ...state,
          transactionWrappers: data,
        }
      })
      if (meta) {
        const { total, page_size } = meta
        setTransactionData((state: any) => {
          return {
            ...state,
            totalTransactions: total,
            pageSize: page_size,
          }
        })
      }
    })
    .catch(() => {
      appContext.toastMessage('Network exception, please try again later', 3000)
    })
}

export default (props: React.PropsWithoutRef<RouteComponentProps<{ address: string; hash: string }>>) => {
  const appContext = useContext(AppContext)

  const { match, location } = props
  const { params } = match
  const { address, hash: lockHash } = params
  const identityHash = address || lockHash

  const { search } = location
  const parsed = queryString.parse(search)
  const pageNo: number = validNumber(parsed.page, PageParams.PageNo)
  const pageSize: number = validNumber(parsed.size, PageParams.PageSize)

  const [addressData, setAddressData] = useState(initAddress)
  const [transactionData, setTransactionData] = useState({
    transactionWrappers: [],
    totalTransactions: 1,
    pageNo,
    pageSize,
  })

  if (pageSize > PageParams.MaxPageSize) {
    props.history.replace(
      `/${address ? 'address' : 'lockhash'}/${identityHash}?page=${pageNo}&size=${PageParams.MaxPageSize}`,
    )
  }

  useEffect(() => {
    getAddressInfo({
      hash: identityHash,
      setAddressData,
      appContext,
    })
    getTransactions({
      hash: identityHash,
      transactionData,
      setTransactionData,
      appContext,
    })
  }, [identityHash, setAddressData, setTransactionData, appContext])

  const onChange = (page: number, size: number) => {
    setTransactionData((state: any) => {
      return {
        ...state,
        pageNo: page,
        pageSize: size,
      }
    })
    props.history.replace(`/${address ? 'address' : 'lockhash'}/${identityHash}?page=${page}&size=${size}`)
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
            {transactionData.transactionWrappers &&
              transactionData.transactionWrappers.map((transaction: any) => {
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
            {transactionData.transactionWrappers &&
              transactionData.transactionWrappers.map((transaction: any) => {
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
              defaultPageSize={transactionData.pageSize}
              pageSize={transactionData.pageSize}
              defaultCurrent={transactionData.pageNo}
              current={transactionData.pageNo}
              total={transactionData.totalTransactions}
              onChange={onChange}
              locale={localeInfo}
            />
          </AddressTransactionsPagition>
        </AddressTransactionsPanel>
      </AddressContentPanel>
    </Content>
  )
}
