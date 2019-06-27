import React, { useReducer, useEffect, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import queryString from 'query-string'
import AppContext from '../../contexts/App'
import Content from '../../components/Content'
import TransactionComponent from '../../components/Transaction'
import SimpleLabel, { Tooltip } from '../../components/Label'
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
import BlockPendingRewardIcon from '../../assets/block_pending_reward.png'
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

const Actions = {
  address: 'ADDRESS',
  transactions: 'TRANSACTIONS',
  total: 'TOTAL',
  page: 'PAGE_NO',
  size: 'PAGE_SIZE',
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case Actions.address:
      return {
        ...state,
        address: action.payload.address,
      }
    case Actions.transactions:
      return {
        ...state,
        transactions: action.payload.transactions,
      }
    case Actions.total:
      return {
        ...state,
        total: action.payload.total,
      }
    case Actions.page:
      return {
        ...state,
        page: action.payload.page,
      }
    case Actions.size:
      return {
        ...state,
        size: action.payload.size,
      }
    default:
      return state
  }
}

const getAddressInfo = (hash: string, dispatch: any) => {
  fetchAddressInfo(hash).then(response => {
    const { data } = response as Response<AddressWrapper>
    if (data) {
      dispatch({
        type: Actions.address,
        payload: {
          address: data.attributes,
        },
      })
    }
  })
}

const getTransactions = (hash: string, page: number, size: number, dispatch: any) => {
  fetchTransactionsByAddress(hash, page, size).then(response => {
    const { data, meta } = response as Response<TransactionWrapper[]>
    if (data) {
      dispatch({
        type: Actions.transactions,
        payload: {
          transactions: data,
        },
      })
    }
    if (meta) {
      dispatch({
        type: Actions.total,
        payload: {
          total: meta.total,
        },
      })
      dispatch({
        type: Actions.size,
        payload: {
          size: meta.page_size,
        },
      })
    }
  })
}

const PendingRewardTooltip: Tooltip = {
  tip:
    'The block reward and transaction fee of this block will send to the miner after 11 blocks，learn more from our Consensus Protocol',
  haveHelpIcon: true,
}

export default (props: React.PropsWithoutRef<RouteComponentProps<{ address: string; hash: string }>>) => {
  const { match, location } = props
  const { params } = match
  const { address, hash: lockHash } = params
  const identityHash = address || lockHash
  const { search } = location
  const parsed = queryString.parse(search)
  const { history } = props
  const { replace } = history

  const initialState = {
    address: initAddress,
    transactions: [] as TransactionWrapper[],
    total: 1,
    page: validNumber(parsed.page, PageParams.PageNo),
    size: validNumber(parsed.size, PageParams.PageSize),
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  const { page, size } = state

  useEffect(() => {
    if (size > PageParams.MaxPageSize) {
      replace(`/${address ? 'address' : 'lockhash'}/${identityHash}?page=${page}&size=${PageParams.MaxPageSize}`)
    }
    getAddressInfo(identityHash, dispatch)
    getTransactions(identityHash, page, size, dispatch)
  }, [replace, identityHash, page, size, dispatch, address])

  const onChange = (pageNo: number, pageSize: number) => {
    dispatch({
      type: Actions.page,
      payload: {
        page: pageNo,
      },
    })
    dispatch({
      type: Actions.size,
      payload: {
        size: pageSize,
      },
    })
    replace(`/${address ? 'address' : 'lockhash'}/${identityHash}?page=${pageNo}&size=${pageSize}`)
  }

  return (
    <Content>
      <AddressContentPanel className="container">
        <AddressTitle address={address} lockHash={lockHash} />
        <AddressOverview value="Overview" />
        <AddressCommonContent>
          <AddressCommonRowPanel>
            <SimpleLabel image={BalanceIcon} label="Balance : " value={`${shannonToCkb(state.address.balance)} CKB`} />
            <SimpleLabel
              image={TransactionsIcon}
              label="Transactions : "
              value={`${state.address.transactions_count}`}
            />
          </AddressCommonRowPanel>
          <SimpleLabel
            image={BlockPendingRewardIcon}
            label="Pending Reward : "
            value={`${state.address.transactions_count}`}
            tooltip={PendingRewardTooltip}
          />
          {lockHash &&
            state.address &&
            (state.address.address_hash ? (
              <SimpleLabel
                image={AddressHashIcon}
                label="Address: "
                value={`${startEndEllipsis(state.address.address_hash, 12)}`}
              />
            ) : (
              <SimpleLabel image={AddressHashIcon} label="Address: " value="Unable to decode address" />
            ))}
          <AddressScriptLabel image={AddressScriptIcon} label="Lock Script : " script={state.address.lock_script} />
        </AddressCommonContent>

        <AddressTransactionsPanel>
          <AddressOverview value="Transactions" />
          <div>
            {state.transactions &&
              state.transactions.map((transaction: any) => {
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
            {state.transactions &&
              state.transactions.map((transaction: any) => {
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
              defaultPageSize={state.size}
              pageSize={state.size}
              defaultCurrent={state.page}
              current={state.page}
              total={state.total}
              onChange={onChange}
              locale={localeInfo}
            />
          </AddressTransactionsPagition>
        </AddressTransactionsPanel>
      </AddressContentPanel>
    </Content>
  )
}
