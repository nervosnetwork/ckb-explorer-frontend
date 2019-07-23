import queryString from 'query-string'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import React, { ReactNode, useEffect, useReducer, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import ItemPointIcon from '../../assets/item_point.png'
import HelpIcon from '../../assets/qa_help.png'
import AddressHashCard from '../../components/Card/AddressHashCard'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TitleCard from '../../components/Card/TitleCard'
import Content from '../../components/Content'
import TransactionItem from '../../components/Transaction/TransactionItem/index'
import { fetchAddressInfo, fetchTipBlockNumber, fetchTransactionsByAddress } from '../../service/http/fetcher'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { parsePageNumber, startEndEllipsis } from '../../utils/string'
import { shannonToCkb } from '../../utils/util'
import Tooltip from '../../components/Tooltip'
import {
  AddressContentPanel,
  AddressLockScriptItemPanel,
  AddressLockScriptPanel,
  AddressPendingRewardTitlePanel,
  AddressTransactionsPagition,
  AddressTransactionsPanel,
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
  fetchAddressInfo(hash).then((wrapper: Response.Wrapper<State.Address>) => {
    if (wrapper) {
      dispatch({
        type: Actions.address,
        payload: {
          address: wrapper.attributes,
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
  fetchTipBlockNumber().then((wrapper: Response.Wrapper<State.Statistics>) => {
    if (wrapper) {
      dispatch({
        type: Actions.tipBlockNumber,
        payload: {
          tipBlockNumber: parseInt(wrapper.attributes.tip_block_number, 10),
        },
      })
    }
  })
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

const AddressPendingRewardTitle = () => {
  const [show, setShow] = useState(false)
  return (
    <AddressPendingRewardTitlePanel>
      {`${i18n.t('address.pending_reward')}`}
      <div
        id="address__pending_reward_help"
        tabIndex={-1}
        onFocus={() => {}}
        onMouseOver={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <img src={HelpIcon} alt="Pending Reward Help" />
      </div>
      <Tooltip
        show={show}
        targetElementId="address__pending_reward_help"
        offset={{
          x: 0,
          y: isMobile() ? 28 : 32,
        }}
      >
        {i18n.t('address.pending_reward_tooltip')}
      </Tooltip>
    </AddressPendingRewardTitlePanel>
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

const AddressLockScript = ({ script }: { script: State.Script }) => {
  return (
    <AddressLockScriptPanel>
      <div className="address__lock_script_title">{i18n.t('address.lock_script')}</div>
      <AddressLockScriptItem title={i18n.t('address.code_hash')}>
        <code>{script.code_hash}</code>
      </AddressLockScriptItem>
      <AddressLockScriptItem title={i18n.t('address.args')}>
        {script.args.length === 1 ? (
          <code>{script.args[0]}</code>
        ) : (
          script.args.map((arg: string, index: number) => <code>{`#${index}: ${arg}`}</code>)
        )}
      </AddressLockScriptItem>
    </AddressLockScriptPanel>
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

  const items: OverviewItemData[] = [
    {
      key: 'balance',
      title: i18n.t('address.balance'),
      content: `${localeNumberString(shannonToCkb(state.address.balance))} CKB`,
    },
    {
      key: 'transactions',
      title: i18n.t('transaction.transactions'),
      content: localeNumberString(state.address.transactions_count),
    },
  ]
  state.address.pending_reward_blocks_count = 4
  if (state.address.pending_reward_blocks_count) {
    items.push({
      key: 'pending_reward',
      title: <AddressPendingRewardTitle />,
      content: `${state.address.pending_reward_blocks_count} ${
        state.address.pending_reward_blocks_count > 1 ? 'blocks' : 'block'
      }`,
    })
  }
  if (lockHash && state.address) {
    items.push({
      key: 'address',
      title: i18n.t('address.address'),
      content: addressContent(state.address),
    })
  }

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

  return (
    <Content>
      <AddressContentPanel className="container">
        <AddressHashCard
          title={address ? i18n.t('address.address') : i18n.t('address.lock_hash')}
          hash={address || lockHash}
        />
        <TitleCard title={i18n.t('common.overview')} />
        <OverviewCard items={items}>
          <AddressLockScript script={state.address.lock_script} />
        </OverviewCard>
        <TitleCard title={i18n.t('transaction.transactions')} />
        <AddressTransactionsPanel>
          {state.transactions &&
            state.transactions.map((transaction: any, index: number) => {
              return (
                transaction && (
                  <TransactionItem
                    address={state.address.address_hash}
                    transaction={transaction.attributes}
                    confirmation={state.tipBlockNumber - transaction.attributes.block_number + 1}
                    key={transaction.attributes.transaction_hash}
                    isLastItem={index === state.transactions.length - 1}
                  />
                )
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
    </Content>
  )
}
