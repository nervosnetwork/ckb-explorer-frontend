import axios, { AxiosResponse } from 'axios'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { useQuery } from 'react-query'
import Pagination from '../../components/Pagination'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TransactionItem from '../../components/TransactionItem/index'
import { useAppState } from '../../contexts/providers/index'
import { v2AxiosIns } from '../../service/http/fetcher'
import i18n from '../../utils/i18n'
import { localeNumberString, parseUDTAmount } from '../../utils/number'
import { shannonToCkb, deprecatedAddrToNewAddr, handleNftImgError, patchMibaoImg } from '../../utils/util'
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
import { useNewAddr } from '../../utils/hook'

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

const UDT_LABEL: Record<State.UDTAccount['udtType'], string> = {
  sudt: 'sudt',
  m_nft_token: 'm nft',
  nrc_721_token: 'nrc 721',
  cota: 'CoTA',
}

const AddressUDTItem = ({ udtAccount }: { udtAccount: State.UDTAccount }) => {
  const { symbol, uan, amount, udtIconFile, typeHash, udtType, collection, cota } = udtAccount
  const isSudt = udtType === 'sudt'
  const isNft = ['m_nft_token', 'nrc_721_token', 'cota'].includes(udtType)
  const [icon, setIcon] = useState(udtIconFile || SUDTTokenIcon)
  const showDefaultIcon = () => setIcon(SUDTTokenIcon)

  useEffect(() => {
    if (udtIconFile && udtType !== 'sudt') {
      axios
        .get(/https?:\/\//.test(udtIconFile) ? udtIconFile : `https://${udtIconFile}`)
        .then((res: AxiosResponse) => {
          if (typeof res.data?.image === 'string') {
            setIcon(res.data.image)
          } else {
            throw new Error('Image not found in metadata')
          }
        })
        .catch((err: Error) => {
          console.error(err.message)
        })
    }
  }, [udtIconFile, udtType])

  const sudtSymbol = uan || symbol

  const isUnverified = udtType === 'nrc_721_token' && !symbol
  const name = isSudt ? sudtSymbol : sliceNftName(symbol)
  let property = ''
  let href = ''

  switch (true) {
    case isSudt: {
      property = parseUDTAmount(amount, (udtAccount as State.SUDT).decimal)
      href = `/sudt/${typeHash}`
      break
    }
    case !!cota: {
      property = `#${cota?.tokenId}`
      href = `/nft-collections/${cota?.cotaId}`
      break
    }
    default: {
      property = `#${amount}`
      href = `/nft-collections/${collection?.typeHash}`
    }
  }
  const coverQuery = isSudt
    ? ''
    : `?${new URLSearchParams({
        size: 'small',
        tid: cota?.cotaId?.toString() ?? amount,
      })}`

  return (
    <AddressUDTItemPanel href={href} isLink={isSudt || isNft}>
      <div className="address__udt__label">
        {isUnverified ? `${i18n.t('udt.unverified')}: ` : null}
        <span>{UDT_LABEL[udtType] ?? 'unknown'}</span>
      </div>
      <div className="address__udt__detail">
        <img
          className="address__udt__item__icon"
          src={`${patchMibaoImg(icon)}${coverQuery}`}
          alt="udt icon"
          onError={isSudt ? showDefaultIcon : handleNftImgError}
        />
        <div className="address__udt__item__info">
          <span>{isUnverified ? '?' : name}</span>
          <span>{isUnverified ? '?' : property}</span>
        </div>
      </div>
    </AddressUDTItemPanel>
  )
}

interface CoTAList {
  data: Array<{
    id: number
    token_id: number
    owner: string
    collection: {
      id: number
      name: string
      description: string
      icon_url: string
    }
  }>
  pagination: {
    series: Array<string>
  }
}

export const AddressAssetComp = () => {
  const {
    addressState: {
      address,
      address: { udtAccounts = [] },
    },
  } = useAppState()

  const { data: initList } = useQuery<AxiosResponse<CoTAList>>(
    ['cota-list', address.addressHash],
    () => v2AxiosIns(`nft/items?owner=${address.addressHash}&standard=cota`),
    {
      enabled: !!address?.addressHash,
    },
  )

  const { data: cotaList } = useQuery<CoTAList['data']>(['cota-list', initList?.data.pagination.series], () =>
    Promise.all(
      (initList?.data.pagination.series ?? []).map(p =>
        v2AxiosIns(`nft/items?owner=${address.addressHash}&standard=cota&page=${p}`),
      ),
    ).then(list => {
      return list.reduce((total, acc) => [...total, ...acc.data.data], [] as CoTAList['data'])
    }),
  )

  return (
    <OverviewCard items={addressAssetInfo(address)} titleCard={<TitleCard title={i18n.t('address.assets')} />}>
      {udtAccounts.length || cotaList?.length ? (
        <AddressUDTAssetsPanel>
          <span>{i18n.t('address.user_defined_token')}</span>
          <div className="address__udt__assets__grid">
            {udtAccounts.map(udt => (
              <AddressUDTItem udtAccount={udt} key={udt.symbol + udt.udtType + udt.amount} />
            ))}
            {cotaList?.map(cota => (
              <AddressUDTItem
                udtAccount={{
                  symbol: cota.collection.name,
                  amount: '',
                  typeHash: '',
                  udtIconFile: cota.collection.icon_url,
                  udtType: 'cota',
                  cota: {
                    cotaId: cota.collection.id,
                    tokenId: cota.token_id,
                  },
                  uan: undefined,
                  collection: undefined,
                }}
                key={`${cota.collection.id}-${cota.token_id}`}
              />
            )) ?? null}
          </div>
        </AddressUDTAssetsPanel>
      ) : null}
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

  const newAddr = useNewAddr(address)
  const isNewAddr = newAddr === address
  const txList = isNewAddr
    ? transactions.map(tx => ({
        ...tx,
        displayInputs: tx.displayInputs.map(i => ({
          ...i,
          addressHash: deprecatedAddrToNewAddr(i.addressHash),
        })),
        displayOutputs: tx.displayOutputs.map(o => ({
          ...o,
          addressHash: deprecatedAddrToNewAddr(o.addressHash),
        })),
      }))
    : transactions

  return (
    <>
      <TitleCard title={`${i18n.t('transaction.transactions')} (${localeNumberString(total)})`} isSingle />
      <AddressTransactionsPanel>
        {txList.map((transaction: State.Transaction, index: number) => {
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
