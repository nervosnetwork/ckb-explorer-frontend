import axios, { AxiosResponse } from 'axios'
import { useState, useEffect, FC } from 'react'
import { useQuery } from 'react-query'
import { Radio } from 'antd'
import Pagination from '../../components/Pagination'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TransactionItem from '../../components/TransactionItem/index'
import { v2AxiosIns } from '../../service/http/fetcher'
import i18n from '../../utils/i18n'
import { localeNumberString, parseUDTAmount } from '../../utils/number'
import { shannonToCkb, deprecatedAddrToNewAddr, handleNftImgError, patchMibaoImg } from '../../utils/util'
import {
  AddressLockScriptController,
  AddressLockScriptPanel,
  AddressTransactionsPagination,
  AddressTransactionsPanel,
  AddressUDTAssetsPanel,
  AddressUDTItemPanel,
} from './styled'
import DecimalCapacity from '../../components/DecimalCapacity'
import TitleCard from '../../components/Card/TitleCard'
import CKBTokenIcon from '../../assets/ckb_token_icon.png'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import { sliceNftName } from '../../utils/string'
import {
  useIsLGScreen,
  useIsMobile,
  useNewAddr,
  usePaginationParamsInListPage,
  useSearchParams,
  useUpdateSearchParams,
} from '../../utils/hook'
import styles from './styles.module.scss'
import TransactionLiteItem from '../../components/TransactionItem/TransactionLiteItem'
import Script from '../../components/Script'
import AddressText from '../../components/AddressText'
import { parseSimpleDateNoSecond } from '../../utils/date'
import { isMainnet } from '../../utils/chain'
import ArrowUpIcon from '../../assets/arrow_up.png'
import ArrowUpBlueIcon from '../../assets/arrow_up_blue.png'
import ArrowDownIcon from '../../assets/arrow_down.png'
import ArrowDownBlueIcon from '../../assets/arrow_down_blue.png'

const addressAssetInfo = (address: State.Address, useMiniStyle: boolean) => {
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
  if (useMiniStyle) {
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

const lockScriptIcon = (show: boolean) => {
  if (show) {
    return isMainnet() ? ArrowUpIcon : ArrowUpBlueIcon
  }
  return isMainnet() ? ArrowDownIcon : ArrowDownBlueIcon
}

const getAddressInfo = ({ liveCellsCount, minedBlocksCount, type, addressHash, lockInfo }: State.Address) => {
  const items: OverviewItemData[] = [
    {
      title: i18n.t('address.live_cells'),
      content: localeNumberString(liveCellsCount),
    },
    {
      title: i18n.t('address.block_mined'),
      content: localeNumberString(minedBlocksCount),
    },
  ]

  if (type === 'LockHash') {
    if (!addressHash) {
      items.push({
        title: i18n.t('address.address'),
        content: i18n.t('address.unable_decode_address'),
      })
    } else {
      items.push({
        title: i18n.t('address.address'),
        contentWrapperClass: styles.addressWidthModify,
        content: <AddressText>{addressHash}</AddressText>,
      })
    }
  }
  if (lockInfo && lockInfo.epochNumber !== '0' && lockInfo.estimatedUnlockTime !== '0') {
    const estimate = Number(lockInfo.estimatedUnlockTime) > new Date().getTime() ? i18n.t('address.estimated') : ''
    items.push({
      title: i18n.t('address.lock_until'),
      content: `${lockInfo.epochNumber} ${i18n.t('address.epoch')} (${estimate} ${parseSimpleDateNoSecond(
        lockInfo.estimatedUnlockTime,
      )})`,
    })
  }
  return items
}

const AddressLockScript: FC<{ address: State.Address }> = ({ address }) => {
  const [showLock, setShowLock] = useState<boolean>(false)

  return (
    <AddressLockScriptPanel>
      <OverviewCard items={getAddressInfo(address)} hideShadow>
        <AddressLockScriptController onClick={() => setShowLock(!showLock)}>
          <div>{i18n.t('address.lock_script')}</div>
          <img alt="lock script" src={lockScriptIcon(showLock)} />
        </AddressLockScriptController>
        {showLock && address.lockScript && <Script script={address.lockScript} />}
      </OverviewCard>
    </AddressLockScriptPanel>
  )
}

export const AddressOverview: FC<{ address: State.Address }> = ({ address }) => {
  const isLG = useIsLGScreen()
  const { udtAccounts = [] } = address

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
    <OverviewCard items={addressAssetInfo(address, isLG)} titleCard={<TitleCard title={i18n.t('address.overview')} />}>
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
      <AddressLockScript address={address} />
    </OverviewCard>
  )
}

export const AddressTransactions = ({
  address,
  transactions,
  transactionsTotal: total,
  addressInfo: { addressHash },
}: {
  address: string
  transactions: State.Transaction[]
  transactionsTotal: number
  addressInfo: State.Address
}) => {
  const isMobile = useIsMobile()
  const { currentPage, pageSize, setPage } = usePaginationParamsInListPage()
  const searchParams = useSearchParams('layout')
  const defaultLayout = 'professional'
  const updateSearchParams = useUpdateSearchParams<'layout'>()
  const layout = searchParams.layout === 'lite' ? 'lite' : defaultLayout
  const totalPages = Math.ceil(total / pageSize)

  const onChangeLayout = (lo: 'professional' | 'lite') => {
    updateSearchParams(params =>
      lo === defaultLayout
        ? Object.fromEntries(Object.entries(params).filter(entry => entry[0] !== 'layout'))
        : { ...params, layout: lo },
    )
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
      <TitleCard
        title={`${i18n.t('transaction.transactions')} (${localeNumberString(total)})`}
        className={styles.transactionTitleCard}
        isSingle
        rear={
          <Radio.Group
            className={styles.layoutButtons}
            options={[
              { label: i18n.t('transaction.professional'), value: 'professional' },
              { label: i18n.t('transaction.lite'), value: 'lite' },
            ]}
            onChange={({ target: { value } }) => onChangeLayout(value)}
            value={layout}
            optionType="button"
            buttonStyle="solid"
          />
        }
      />
      <AddressTransactionsPanel>
        {layout === 'lite' ? (
          <>
            {!isMobile && (
              <div className={styles.liteTransactionHeader}>
                <div>{i18n.t('transaction.transaction_hash')}</div>
                <div>{i18n.t('transaction.height')}</div>
                <div>{i18n.t('transaction.time')}</div>
                <div>{`${i18n.t('transaction.input')} & ${i18n.t('transaction.output')}`}</div>
                <div>{i18n.t('transaction.capacity_change')}</div>
              </div>
            )}
            {txList.map((transaction: State.Transaction) => (
              <TransactionLiteItem address={addressHash} transaction={transaction} key={transaction.transactionHash} />
            ))}
          </>
        ) : (
          txList.map((transaction: State.Transaction, index: number) => (
            <TransactionItem
              address={addressHash}
              transaction={transaction}
              key={transaction.transactionHash}
              circleCorner={{
                bottom: index === transactions.length - 1 && totalPages === 1,
              }}
            />
          ))
        )}
      </AddressTransactionsPanel>
      {totalPages > 1 && (
        <AddressTransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setPage} />
        </AddressTransactionsPagination>
      )}
    </>
  )
}

export default {
  AddressOverview,
  AddressTransactions,
}
