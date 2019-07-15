import React, { useReducer, useEffect, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import queryString from 'query-string'
import AppContext from '../../contexts/App'
import Content from '../../components/Content'
import TransactionItem from '../../components/Transaction/TransactionItem/index'
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
import { fetchAddressInfo, fetchTransactionsByAddress, fetchTipBlockNumber } from '../../http/fetcher'
import { copyElementValue, shannonToCkb } from '../../utils/util'
import { parsePageNumber, startEndEllipsis } from '../../utils/string'
import TransactionCard from '../../components/Transaction/TransactionCard/index'
import { StatisticsWrapper } from '../../http/response/Statistics'
import { localeNumberString } from '../../utils/number'
import i18n from '../../utils/i18n'
import { isMobile } from '../../utils/screen'

const AddressTitle = ({ address, lockHash }: { address: string; lockHash: string }) => {
  const appContext = useContext(AppContext)
  const identityHash = address || lockHash
  return (
    <AddressTitlePanel>
      <div className="address__title">{address ? i18n.t('address.address') : i18n.t('address.lock_hash')}</div>
      <div className="address__content">
        <code id="address__hash">{identityHash}</code>
        <div
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
          <ScriptLabelItem name={`${i18n.t('address.code_hash')} :`} value={script.code_hash} />
          {script.args.length === 1 ? (
            <ScriptLabelItem name={`${i18n.t('address.args')} :`} value={script.args[0]} />
          ) : (
            script.args.map((arg: string, index: number) => {
              return index === 0 ? (
                <ScriptLabelItem name={`${i18n.t('address.args')} :`} value={`#${index}: ${arg}`} />
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
    }
  })
}

const getTipBlockNumber = (dispatch: any) => {
  fetchTipBlockNumber().then(response => {
    const { data } = response as Response<StatisticsWrapper>
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

const PendingRewardTooltip: Tooltip = {
  tip: i18n.t('address.pending_reward_tooltip'),
  haveHelpIcon: true,
  offset: 0.7,
}

const addressContent = (address: Address) => {
  const addressText = isMobile() ? startEndEllipsis(address.address_hash, 10) : address.address_hash
  return address.address_hash ? addressText : i18n.t('address.unable_decode_address')
}

const initialState = {
  address: initAddress,
  transactions: [] as TransactionWrapper[],
  total: 1,
  tipBlockNumber: 0,
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
        <AddressTitle address={address} lockHash={lockHash} />
        <AddressOverview value={i18n.t('common.overview')} />
        <AddressCommonContent>
          <AddressCommonRowPanel>
            <SimpleLabel
              image={BalanceIcon}
              label={`${i18n.t('address.balance')} : `}
              value={`${localeNumberString(shannonToCkb(state.address.balance))} CKB`}
            />
            <SimpleLabel
              image={TransactionsIcon}
              label={`${i18n.t('transaction.transactions')} : `}
              value={localeNumberString(state.address.transactions_count)}
            />
          </AddressCommonRowPanel>
          {state.address.pending_reward_blocks_count ? (
            <SimpleLabel
              image={BlockPendingRewardIcon}
              label={`${i18n.t('address.pending_reward')} : `}
              value={`${state.address.pending_reward_blocks_count} 
                ${state.address.pending_reward_blocks_count > 1 ? 'blocks' : 'block'}`}
              tooltip={PendingRewardTooltip}
            />
          ) : null}
          {lockHash && state.address && (
            <SimpleLabel
              image={AddressHashIcon}
              label={`${i18n.t('address.address')} :`}
              value={addressContent(state.address)}
            />
          )}
          <AddressScriptLabel
            image={AddressScriptIcon}
            label={`${i18n.t('address.lock_script')} : `}
            script={state.address.lock_script}
          />
        </AddressCommonContent>

        <AddressTransactionsPanel>
          <AddressOverview value={i18n.t('transaction.transactions')} />
          <div>
            {state.transactions &&
              state.transactions.map((transaction: any) => {
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
                    />
                  ))
                )
              })}
          </div>
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
