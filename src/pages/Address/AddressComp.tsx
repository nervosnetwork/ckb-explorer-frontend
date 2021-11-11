import { useHistory } from 'react-router'
import { useState } from 'react'
import Pagination from '../../components/Pagination'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TransactionItem from '../../components/TransactionItem/index'
import { useAppState } from '../../contexts/providers/index'
import i18n from '../../utils/i18n'
import { localeNumberString, parseUDTAmount } from '../../utils/number'
import { shannonToCkb, baseUrl } from '../../utils/util'
import {
  AddressTransactionsPagination,
  AddressTransactionsPanel,
  AddressUDTAssetsPanel,
  AddressUDTItemPanel,
} from './styled'
import DecimalCapacity from '../../components/DecimalCapacity'
import TitleCard from '../../components/Card/TitleCard'
import CKBTokenIcon from '../../assets/ckb_token_icon.png'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import { isScreenSmallerThan1200 } from '../../utils/screen'
import { sliceNftName } from '../../utils/string'

const addressAssetInfo = (address: State.Address) => {
  const items = [
    {
      title: '',
      content: '',
    },
    {
      title: i18n.t('address.occupied'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.balanceOccupied))} />,
      isAsset: true,
    },
    {
      icon: CKBTokenIcon,
      title: i18n.t('common.ckb_unit'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.balance))} />,
    },
    {
      title: i18n.t('address.dao_deposit'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.daoDeposit))} />,
      isAsset: true,
    },
    {
      title: '',
      content: '',
    },
    {
      title: i18n.t('address.compensation'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.daoCompensation))} />,
      tooltip: i18n.t('address.compensation_tooltip'),
      isAsset: true,
    },
  ] as OverviewItemData[]
  if (isScreenSmallerThan1200()) {
    const item2 = items[2]
    items[0] = item2
    items.splice(2, 1)
    items.splice(3, 1)
  }
  return items
}

const AddressUDTItem = ({ udtAccount }: { udtAccount: State.UDTAccount }) => {
  const { decimal, symbol, amount, udtIconFile, typeHash, udtType } = udtAccount
  const isSudt = udtType === 'sudt'
  const [icon, setIcon] = useState(udtIconFile || SUDTTokenIcon)
  const showDefaultIcon = () => setIcon(SUDTTokenIcon)
  return (
    <AddressUDTItemPanel href={`${baseUrl()}/sudt/${typeHash}`} isLink={isSudt}>
      <img className="address__udt__item__icon" src={icon} alt="udt icon" onError={showDefaultIcon} />
      <div className="address__udt__item__info">
        <span>{isSudt ? symbol : sliceNftName(symbol)}</span>
        <span>{isSudt ? parseUDTAmount(amount, decimal) : `#${amount}`}</span>
      </div>
    </AddressUDTItemPanel>
  )
}

export const AddressAssetComp = () => {
  const {
    addressState: {
      address,
      address: { udtAccounts = [] },
    },
  } = useAppState()

  return (
    <OverviewCard items={addressAssetInfo(address)} titleCard={<TitleCard title={i18n.t('address.assets')} />}>
      {udtAccounts.length > 0 && (
        <AddressUDTAssetsPanel>
          <span>{i18n.t('address.user_defined_token')}</span>
          <div className="address__udt__assets__grid">
            {udtAccounts.map(udt => (
              <AddressUDTItem udtAccount={udt} key={udt.symbol} />
            ))}
          </div>
        </AddressUDTAssetsPanel>
      )}
    </OverviewCard>
  )
}

export const AddressTransactions = ({
  currentPage,
  pageSize,
  address,
}: {
  currentPage: number
  pageSize: number
  address: string
}) => {
  const history = useHistory()
  const {
    addressState: {
      transactions = [],
      total,
      address: { addressHash },
    },
  } = useAppState()

  const totalPages = Math.ceil(total / pageSize)

  const onChange = (page: number) => {
    history.replace(`/address/${address}?page=${page}&size=${pageSize}`)
  }

  return (
    <>
      <TitleCard title={`${i18n.t('transaction.transactions')} (${localeNumberString(total)})`} isSingle />
      <AddressTransactionsPanel>
        {transactions.map((transaction: State.Transaction, index: number) => {
          const { transactionHash } = transaction
          return (
            transaction && (
              <TransactionItem
                address={addressHash}
                transaction={transaction}
                key={transactionHash}
                circleCorner={{
                  bottom: index === transactions.length - 1 && totalPages === 1,
                }}
              />
            )
          )
        })}
      </AddressTransactionsPanel>
      {totalPages > 1 && (
        <AddressTransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
        </AddressTransactionsPagination>
      )}
    </>
  )
}

export default {
  AddressAssetComp,
  AddressTransactions,
}
