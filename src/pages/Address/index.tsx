import queryString from 'query-string'
import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import HelpIcon from '../../assets/qa_help.png'
import AddressHashCard from '../../components/Card/AddressHashCard'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TitleCard from '../../components/Card/TitleCard'
import Content from '../../components/Content'
import Tooltip from '../../components/Tooltip'
import TransactionItem from '../../components/TransactionItem/index'
import { AppContext } from '../../contexts/providers/index'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { getAddress } from '../../service/app/address'
import { PageParams } from '../../utils/const'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { parsePageNumber, startEndEllipsis } from '../../utils/string'
import { shannonToCkb } from '../../utils/util'
import {
  AddressContentPanel,
  AddressLockScriptItemPanel,
  AddressLockScriptPanel,
  AddressPendingRewardTitlePanel,
  AddressTransactionsPagition,
  AddressTransactionsPanel,
} from './styled'

const addressContent = (address: State.Address) => {
  const addressText = isMobile() ? startEndEllipsis(address.address_hash, 10) : address.address_hash
  return address.address_hash ? addressText : i18n.t('address.unable_decode_address')
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
        onMouseOver={() => {
          setShow(true)
          const p = document.querySelector('.page') as HTMLElement
          if (p) {
            p.setAttribute('tabindex', '-1')
          }
        }}
        onMouseLeave={() => {
          setShow(false)
          const p = document.querySelector('.page') as HTMLElement
          if (p) {
            p.removeAttribute('tabindex')
          }
        }}
      >
        <img src={HelpIcon} alt="Pending Reward Help" />
      </div>
      <Tooltip show={show} targetElementId="address__pending_reward_help">
        {i18n.t('address.pending_reward_tooltip')}
      </Tooltip>
    </AddressPendingRewardTitlePanel>
  )
}

const AddressLockScriptItem = ({ title, children }: { title: string; children?: ReactNode }) => {
  return (
    <AddressLockScriptItemPanel>
      <div className="address_lock_script__title">
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

export const Address = ({
  dispatch,
  history: { replace },
  location: { search },
  match: { params },
}: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps<{ address: string }>>) => {
  const { address } = params
  const parsed = queryString.parse(search)
  const { addressState, app } = useContext(AppContext)
  const { tipBlockNumber } = app

  const currentPage = parsePageNumber(parsed.page, PageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, PageParams.PageSize)
  const totalPages = Math.ceil(addressState.total / pageSize)

  useEffect(() => {
    if (pageSize > PageParams.MaxPageSize) {
      replace(`/address/${address}?page=${currentPage}&size=${PageParams.MaxPageSize}`)
    }
    getAddress(address, currentPage, pageSize, dispatch)
  }, [replace, address, currentPage, pageSize, dispatch])

  const onChange = (page: number) => {
    replace(`/address/${address}?page=${page}&size=${pageSize}`)
  }

  const items: OverviewItemData[] = [
    {
      title: i18n.t('address.balance'),
      content: `${localeNumberString(shannonToCkb(addressState.address.balance))} CKB`,
    },
    {
      title: i18n.t('transaction.transactions'),
      content: localeNumberString(addressState.address.transactions_count),
    },
  ]
  if (addressState.address.pending_reward_blocks_count) {
    items.push({
      title: <AddressPendingRewardTitle />,
      content: `${addressState.address.pending_reward_blocks_count} ${
        addressState.address.pending_reward_blocks_count > 1 ? 'blocks' : 'block'
      }`,
    })
  }
  if (addressState.address.type === 'LockHash' && addressState.address) {
    items.push({
      title: i18n.t('address.address'),
      content: addressContent(addressState.address),
    })
  }

  return (
    <Content>
      <AddressContentPanel className="container">
        <AddressHashCard
          title={addressState.address.type === 'LockHash' ? i18n.t('address.lock_hash') : i18n.t('address.address')}
          hash={address}
          dispatch={dispatch}
        />
        <TitleCard title={i18n.t('common.overview')} />
        <OverviewCard items={items}>
          {addressState && addressState.address && addressState.address.lock_script && (
            <AddressLockScript script={addressState.address.lock_script} />
          )}
        </OverviewCard>
        {addressState.transactions.length > 0 && <TitleCard title={i18n.t('transaction.transactions')} />}
        <AddressTransactionsPanel>
          {addressState &&
            addressState.transactions &&
            addressState.transactions.map((transaction: any, index: number) => {
              return (
                transaction && (
                  <TransactionItem
                    address={addressState.address.address_hash}
                    transaction={transaction.attributes}
                    confirmation={tipBlockNumber - transaction.attributes.block_number + 1}
                    key={transaction.attributes.transaction_hash}
                    isLastItem={index === addressState.transactions.length - 1}
                  />
                )
              )
            })}
        </AddressTransactionsPanel>
        {totalPages > 1 && (
          <AddressTransactionsPagition>
            <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
          </AddressTransactionsPagition>
        )}
      </AddressContentPanel>
    </Content>
  )
}

export default Address
