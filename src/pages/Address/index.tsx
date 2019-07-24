import React, { useEffect, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import queryString from 'query-string'
import { AppContext } from '../../contexts/providers/index'
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
  AddressEmptyTransactions,
} from './styled'
import CopyIcon from '../../assets/copy.png'
import BalanceIcon from '../../assets/address_balance.png'
import AddressScriptIcon from '../../assets/address_script.png'
import TransactionsIcon from '../../assets/transactions_green.png'
import ItemPointIcon from '../../assets/item_point.png'
import AddressHashIcon from '../../assets/lock_hash_address.png'
import BlockPendingRewardIcon from '../../assets/block_pending_reward.png'

import { copyElementValue, shannonToCkb } from '../../utils/util'
import { parsePageNumber, startEndEllipsis } from '../../utils/string'
import TransactionCard from '../../components/Transaction/TransactionCard/index'
import { localeNumberString } from '../../utils/number'
import i18n from '../../utils/i18n'
import { isMobile } from '../../utils/screen'
import { StateWithDispatch, AppDispatch, AppActions } from '../../contexts/providers/reducer'
import { PageParams } from '../../utils/const'
import { getAddress } from '../../service/app/address'

const AddressTitle = ({
  address,
  lockHash,
  dispatch,
}: {
  address: string
  lockHash: string
  dispatch: AppDispatch
}) => {
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
            const toast = {
              text: i18n.t('common.copied'),
              timeout: 3000,
            }
            dispatch({
              type: AppActions.ShowToastMessage,
              payload: {
                ...toast,
              },
            })
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

const AddressScriptLabel = ({ image, label, script }: { image: string; label: string; script: State.Script }) => {
  return (
    <div>
      <AddressScriptLabelPanel>
        <img src={image} alt="script" />
        <span>{label}</span>
      </AddressScriptLabelPanel>
      <AddressScriptContentPanel>
        <AddressScriptContent>
          {script.code_hash && <ScriptLabelItem name={`${i18n.t('address.code_hash')} :`} value={script.code_hash} />}
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

const PendingRewardTooltip: Tooltip = {
  tip: i18n.t('address.pending_reward_tooltip'),
  haveHelpIcon: true,
  offset: 0.7,
}

const addressContent = (address: State.Address) => {
  const addressText = isMobile() ? startEndEllipsis(address.address_hash, 10) : address.address_hash
  return address.address_hash ? addressText : i18n.t('address.unable_decode_address')
}

export const Address = ({
  dispatch,
  history: { replace },
  location: { search },
  match: { params },
}: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps<{ address: string; hash: string }>>) => {
  const { address, hash: lockHash } = params
  const identityHash = address || lockHash
  const parsed = queryString.parse(search)

  const page = parsePageNumber(parsed.page, PageParams.PageNo)
  const size = parsePageNumber(parsed.size, PageParams.PageSize)

  const { addressState, tipBlockNumber } = useContext(AppContext)

  useEffect(() => {
    if (size > PageParams.MaxPageSize) {
      replace(`/${address ? 'address' : 'lockhash'}/${identityHash}?page=${page}&size=${PageParams.MaxPageSize}`)
    }
    getAddress(identityHash, page, size, dispatch)
  }, [replace, identityHash, page, size, dispatch, address])

  const onChange = (pageNo: number, pageSize: number) => {
    replace(`/${address ? 'address' : 'lockhash'}/${identityHash}?page=${pageNo}&size=${pageSize}`)
  }

  return (
    <Content>
      <AddressContentPanel className="container">
        <AddressTitle address={address} lockHash={lockHash} dispatch={dispatch} />
        <AddressOverview value={i18n.t('common.overview')} />
        <AddressCommonContent>
          <AddressCommonRowPanel>
            <SimpleLabel
              image={BalanceIcon}
              label={`${i18n.t('address.balance')} : `}
              value={`${localeNumberString(shannonToCkb(addressState.address.balance))} CKB`}
            />
            <SimpleLabel
              image={TransactionsIcon}
              label={`${i18n.t('transaction.transactions')} : `}
              value={localeNumberString(addressState.address.transactions_count)}
            />
          </AddressCommonRowPanel>
          {addressState.address.pending_reward_blocks_count ? (
            <SimpleLabel
              image={BlockPendingRewardIcon}
              label={`${i18n.t('address.pending_reward')} : `}
              value={`${addressState.address.pending_reward_blocks_count} 
                ${addressState.address.pending_reward_blocks_count > 1 ? 'blocks' : 'block'}`}
              tooltip={PendingRewardTooltip}
            />
          ) : null}
          {lockHash && addressState.address && (
            <SimpleLabel
              image={AddressHashIcon}
              label={`${i18n.t('address.address')} :`}
              value={addressContent(addressState.address)}
            />
          )}
          <AddressScriptLabel
            image={AddressScriptIcon}
            label={`${i18n.t('address.lock_script')} : `}
            script={addressState.address.lock_script}
          />
        </AddressCommonContent>

        {addressState.transactions && addressState.transactions.length > 0 ? (
          <AddressTransactionsPanel>
            <AddressOverview value={i18n.t('transaction.transactions')} />
            <div>
              {addressState.transactions.map((transaction: any) => {
                return (
                  transaction &&
                  (isMobile() ? (
                    <TransactionCard
                      address={addressState.address.address_hash}
                      confirmation={tipBlockNumber - transaction.attributes.block_number + 1}
                      transaction={transaction.attributes}
                      key={transaction.attributes.transaction_hash}
                    />
                  ) : (
                    <TransactionItem
                      address={addressState.address.address_hash}
                      transaction={transaction.attributes}
                      confirmation={tipBlockNumber - transaction.attributes.block_number + 1}
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
                total={addressState.total}
                onChange={onChange}
                locale={localeInfo}
              />
            </AddressTransactionsPagition>
          </AddressTransactionsPanel>
        ) : (
          <AddressEmptyTransactions />
        )}
      </AddressContentPanel>
    </Content>
  )
}

export default Address
