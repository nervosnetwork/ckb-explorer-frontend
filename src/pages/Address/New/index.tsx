import queryString from 'query-string'
import React, { ReactNode, useContext, useEffect, useReducer } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import CopyIcon from '../../../assets/copy.png'
import ItemPointIcon from '../../../assets/item_point.png'
import { Tooltip } from '../../../components/Label'
import AppContext from '../../../contexts/App'
import { fetchAddressInfo, fetchTipBlockNumber, fetchTransactionsByAddress } from '../../../service/http/fetcher'
import i18n from '../../../utils/i18n'
import { localeNumberString } from '../../../utils/number'
import { isMobile } from '../../../utils/screen'
import { parsePageNumber, startEndEllipsis } from '../../../utils/string'
import { copyElementValue, shannonToCkb } from '../../../utils/util'
import TransactionCard from '../../../components/Transaction/TransactionCard/index'
import TransactionItem from '../../../components/Transaction/TransactionItem/index'
import {
  AddressHashPanel,
  AddressLockScriptItemPanel,
  AddressOverviewContentPanel,
  AddressOverviewItemPanel,
  AddressOverviewPanel,
  AddressContentPanel,
  AddressTitlePanel,
  AddressTransactionsPanel,
  AddressTransactionsPagition,
} from './styled'

enum PageParams {
  PageNo = 1,
  PageSize = 10,
  MaxPageSize = 100,
}

const initAddress: State.Address = {
  address_hash: '',
  lock_hash: '',
  balance: 0,
  transactions_count: 0,
  pending_reward_blocks_count: 0,
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
  tipBlockNumber: 'TIP_BLOCK_NUMBER',
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
    case Actions.tipBlockNumber:
      return {
        ...state,
        tipBlockNumber: action.payload.tipBlockNumber,
      }
    default:
      return state
  }
}

const getAddressInfo = (hash: string, dispatch: any) => {
  fetchAddressInfo(hash).then(response => {
    const { data } = response as Response.Response<Response.Wrapper<State.Address>>
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
    const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
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
    }
  })
}

const getTipBlockNumber = (dispatch: any) => {
  fetchTipBlockNumber().then(response => {
    const { data } = response as Response.Response<Response.Wrapper<State.Statistics>>
    if (data) {
      dispatch({
        type: Actions.tipBlockNumber,
        payload: {
          tipBlockNumber: parseInt(data.attributes.tip_block_number, 10),
        },
      })
    }
  })
}

export const PendingRewardTooltip: Tooltip = {
  tip: i18n.t('address.pending_reward_tooltip'),
  haveHelpIcon: true,
  offset: 0.7,
}

const addressContent = (address: State.Address) => {
  const addressText = isMobile() ? startEndEllipsis(address.address_hash, 10) : address.address_hash
  return address.address_hash ? addressText : i18n.t('address.unable_decode_address')
}

const initialState = {
  address: initAddress,
  transactions: [] as Response.Wrapper<State.Transaction>[],
  total: 1,
  tipBlockNumber: 0,
}

const AddressOverviewItem = ({ title, content }: { title: string; content: ReactNode }) => {
  return (
    <AddressOverviewItemPanel>
      <div className="address_overview_item__title">{title}</div>
      <div className="address_overview_item__value">{content}</div>
    </AddressOverviewItemPanel>
  )
}

interface AddressOverviewItem {
  title: string
  content: ReactNode
}

const AddressOverviewContent = ({ items }: { items: AddressOverviewItem[] }) => {
  const leftItems: AddressOverviewItem[] = []
  const rightItems: AddressOverviewItem[] = []
  items.forEach((item, index) => {
    if (index % 2 === 0) {
      leftItems.push(item)
    } else {
      rightItems.push(item)
    }
  })
  return (
    <AddressOverviewContentPanel>
      <div className="address_overview_content__left_items">
        {leftItems.map(item => (
          <AddressOverviewItem key={item.title} title={item.title} content={item.content} />
        ))}
      </div>
      <span />
      <div className="address_overview_content__right_items">
        {rightItems.map(item => (
          <AddressOverviewItem key={item.title} title={item.title} content={item.content} />
        ))}
      </div>
    </AddressOverviewContentPanel>
  )
}

const AddressLockScriptItem = ({ title, children }: { title: string; children?: ReactNode }) => {
  return (
    <AddressLockScriptItemPanel>
      <div className="address_lock_script__title">
        <img src={ItemPointIcon} alt="point" />
        <span>{title}</span>
      </div>
      <div className="address_lock_script__content">{children}</div>
    </AddressLockScriptItemPanel>
  )
}

export default (props: React.PropsWithoutRef<RouteComponentProps<{ address: string; hash: string }>>) => {
  const { match, location, history } = props
  const { params } = match
  const { address, hash: lockHash } = params
  const identityHash = address || lockHash
  const { search } = location
  const parsed = queryString.parse(search)
  const { replace } = history

  const page = parsePageNumber(parsed.page, PageParams.PageNo)
  const size = parsePageNumber(parsed.size, PageParams.PageSize)

  const [state, dispatch] = useReducer(reducer, initialState)
  const appContext = useContext(AppContext)

  useEffect(() => {
    if (size > PageParams.MaxPageSize) {
      replace(`/${address ? 'address' : 'lockhash'}/${identityHash}?page=${page}&size=${PageParams.MaxPageSize}`)
    }
    getAddressInfo(identityHash, dispatch)
    getTransactions(identityHash, page, size, dispatch)
    getTipBlockNumber(dispatch)
  }, [replace, identityHash, page, size, dispatch, address])

  const onChange = (pageNo: number, pageSize: number) => {
    replace(`/${address ? 'address' : 'lockhash'}/${identityHash}?page=${pageNo}&size=${pageSize}`)
  }

  const items = [
    {
      title: i18n.t('address.balance'),
      content: `${localeNumberString(shannonToCkb(state.address.balance))} CKB`,
    },
    {
      title: i18n.t('transaction.transactions'),
      content: localeNumberString(state.address.transactions_count),
    },
    {
      title: 'Pending Reward',
      content: '2 blocks',
    },
  ]
  if (state.address.pending_reward_blocks_count) {
    items.push({
      title: i18n.t('address.pending_reward'),
      content: `${state.address.pending_reward_blocks_count} ${
        state.address.pending_reward_blocks_count > 1 ? 'blocks' : 'block'
      }`,
    })
  }
  if (lockHash && state.address) {
    items.push({
      title: `${i18n.t('address.address')} :`,
      content: addressContent(state.address),
    })
  }

  return (
    <AddressContentPanel className="container">
      <AddressHashPanel>
        <div className="address__title">{address ? i18n.t('address.address') : i18n.t('address.lock_hash')}</div>
        <div className="address__hash">{address || lockHash}</div>
        <div
          className="address__copy_iocn"
          role="button"
          tabIndex={-1}
          onKeyDown={() => {}}
          onClick={() => {
            copyElementValue(document.getElementById('address__hash'))
            appContext.toastMessage(i18n.t('common.copied'), 3000)
          }}
        >
          <img src={CopyIcon} alt="copy" />
        </div>
      </AddressHashPanel>
      <AddressTitlePanel>{i18n.t('common.overview')}</AddressTitlePanel>
      <AddressOverviewPanel>
        <AddressOverviewContent items={items} />
        <div className="address_overview__lock_script_title">{`${i18n.t('address.lock_script')} : `}</div>
        <AddressLockScriptItem title={`${i18n.t('address.code_hash')} :`}>
          <span>{state.address.lock_script.code_hash}</span>
        </AddressLockScriptItem>
        <AddressLockScriptItem title={`${i18n.t('address.args')} :`}>
          {state.address.lock_script.args.length === 1 ? (
            <span>{state.address.lock_script.args[0]}</span>
          ) : (
            state.address.lock_script.args.map((arg: string, index: number) => <span>{`#${index}: ${arg}`}</span>)
          )}
        </AddressLockScriptItem>
      </AddressOverviewPanel>
      <AddressTitlePanel>Transactions</AddressTitlePanel>
      <AddressTransactionsPanel>
        {state.transactions &&
          state.transactions.map((transaction: any, index: number) => {
            return (
              transaction &&
              (isMobile() ? (
                <TransactionCard
                  address={state.address.address_hash}
                  confirmation={state.tipBlockNumber - transaction.attributes.block_number + 1}
                  transaction={transaction.attributes}
                  key={transaction.attributes.transaction_hash}
                />
              ) : (
                <TransactionItem
                  address={state.address.address_hash}
                  transaction={transaction.attributes}
                  confirmation={state.tipBlockNumber - transaction.attributes.block_number + 1}
                  key={transaction.attributes.transaction_hash}
                  isEndItem={index === state.transactions.length - 1}
                />
              ))
            )
          })}
        <AddressTransactionsPagition>
          <Pagination
            showQuickJumper
            showSizeChanger
            defaultPageSize={size}
            pageSize={size}
            defaultCurrent={page}
            current={page}
            total={state.total}
            onChange={onChange}
            locale={localeInfo}
          />
        </AddressTransactionsPagition>
      </AddressTransactionsPanel>
    </AddressContentPanel>
  )
}
