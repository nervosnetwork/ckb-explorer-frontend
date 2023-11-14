import axios, { AxiosResponse } from 'axios'
import { useState, useEffect, FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Radio } from 'antd'
import { Base64 } from 'js-base64'
import { hexToBytes } from '@nervosnetwork/ckb-sdk-utils'
import { TFunction, useTranslation } from 'react-i18next'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TransactionItem from '../../components/TransactionItem/index'
import { explorerService } from '../../services/ExplorerService'
import { parseSporeCellData } from '../../utils/spore'
import { localeNumberString, parseUDTAmount } from '../../utils/number'
import { shannonToCkb, deprecatedAddrToNewAddr, handleNftImgError, patchMibaoImg } from '../../utils/util'
import {
  AddressLockScriptController,
  AddressLockScriptPanel,
  AddressTransactionsPanel,
  AddressUDTAssetsPanel,
  AddressUDTItemPanel,
} from './styled'
import DecimalCapacity from '../../components/DecimalCapacity'
import TitleCard from '../../components/Card/TitleCard'
import CKBTokenIcon from './ckb_token_icon.png'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import { ReactComponent as TimeDownIcon } from './time_down.svg'
import { ReactComponent as TimeUpIcon } from './time_up.svg'
import { sliceNftName } from '../../utils/string'
import {
  OrderByType,
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
import { LayoutLiteProfessional } from '../../constants/common'
import { omit } from '../../utils/object'
import { CsvExport } from '../../components/CsvExport'
import PaginationWithRear from '../../components/PaginationWithRear'
import { Transaction } from '../../models/Transaction'
import { Address, SUDT, UDTAccount } from '../../models/Address'

const addressAssetInfo = (address: Address, useMiniStyle: boolean, t: TFunction) => {
  const items = [
    {
      title: '',
      content: '',
    },
    {
      title: t('address.occupied'),
      tooltip: t('glossary.occupied'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.balanceOccupied))} />,
      isAsset: true,
    },
    {
      icon: CKBTokenIcon,
      title: t('common.ckb_unit'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.balance))} />,
    },
    {
      title: t('address.dao_deposit'),
      tooltip: t('glossary.nervos_dao_deposit'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.daoDeposit))} />,
      isAsset: true,
    },
    {
      title: '',
      content: '',
    },
    {
      title: t('address.compensation'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.daoCompensation))} />,
      tooltip: t('glossary.nervos_dao_compensation'),
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

const UDT_LABEL: Record<UDTAccount['udtType'], string> = {
  sudt: 'sudt',
  m_nft_token: 'm nft',
  nrc_721_token: 'nrc 721',
  cota: 'CoTA',
  spore_cell: 'Spore',
}

const AddressUDTItem = ({ udtAccount }: { udtAccount: UDTAccount }) => {
  const { t } = useTranslation()
  const { symbol, uan, amount, udtIconFile, typeHash, udtType, collection, cota } = udtAccount
  const isSudt = udtType === 'sudt'
  const isSpore = udtType === 'spore_cell'
  const isNft = ['m_nft_token', 'nrc_721_token', 'cota', 'spore_cell'].includes(udtType)
  const [icon, setIcon] = useState(udtIconFile || SUDTTokenIcon)
  const showDefaultIcon = () => setIcon(SUDTTokenIcon)

  useEffect(() => {
    if (udtIconFile && udtType === 'spore_cell') {
      const sporeData = parseSporeCellData(udtIconFile)
      if (sporeData.contentType.slice(0, 5) === 'image') {
        const base64data = Base64.fromUint8Array(hexToBytes(`0x${sporeData.content}`))

        setIcon(`data:${sporeData.contentType};base64,${base64data}`)
      }
      return
    }

    if (udtIconFile && udtType !== 'sudt' && udtType !== 'spore_cell') {
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
      property = parseUDTAmount(amount, (udtAccount as SUDT).decimal)
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
  const coverQuery =
    isSudt || isSpore
      ? ''
      : `?${new URLSearchParams({
          size: 'small',
          tid: cota?.cotaId?.toString() ?? amount,
        })}`

  return (
    <AddressUDTItemPanel href={href} isLink={isSudt || isNft}>
      <div className="addressUdtLabel">
        {isUnverified ? `${t('udt.unverified')}: ` : null}
        <span>{UDT_LABEL[udtType] ?? 'unknown'}</span>
      </div>
      <div className="addressUdtDetail">
        <img
          className="addressUdtItemIcon"
          src={`${patchMibaoImg(icon)}${coverQuery}`}
          alt="udt icon"
          onError={isSudt ? showDefaultIcon : handleNftImgError}
        />
        <div className="addressUdtItemInfo">
          <span>{isUnverified ? '?' : name}</span>
          <span>{isUnverified ? '?' : property}</span>
        </div>
      </div>
    </AddressUDTItemPanel>
  )
}

const lockScriptIcon = (show: boolean) => {
  if (show) {
    return isMainnet() ? ArrowUpIcon : ArrowUpBlueIcon
  }
  return isMainnet() ? ArrowDownIcon : ArrowDownBlueIcon
}

const useAddressInfo = ({ liveCellsCount, minedBlocksCount, type, addressHash, lockInfo }: Address) => {
  const { t } = useTranslation()
  const items: OverviewItemData[] = [
    {
      title: t('address.live_cells'),
      tooltip: t('glossary.live_cells'),
      content: localeNumberString(liveCellsCount),
    },
    {
      title: t('address.block_mined'),
      tooltip: t('glossary.block_mined'),
      content: localeNumberString(minedBlocksCount),
    },
  ]

  if (type === 'LockHash') {
    if (!addressHash) {
      items.push({
        title: t('address.address'),
        content: t('address.unable_decode_address'),
      })
    } else {
      items.push({
        title: t('address.address'),
        contentWrapperClass: styles.addressWidthModify,
        content: <AddressText>{addressHash}</AddressText>,
      })
    }
  }
  if (lockInfo && lockInfo.epochNumber !== '0' && lockInfo.estimatedUnlockTime !== '0') {
    const estimate = Number(lockInfo.estimatedUnlockTime) > new Date().getTime() ? t('address.estimated') : ''
    items.push({
      title: t('address.lock_until'),
      content: `${lockInfo.epochNumber} ${t('address.epoch')} (${estimate} ${parseSimpleDateNoSecond(
        lockInfo.estimatedUnlockTime,
      )})`,
    })
  }
  return items
}

const AddressLockScript: FC<{ address: Address }> = ({ address }) => {
  const [showLock, setShowLock] = useState<boolean>(false)
  const { t } = useTranslation()

  return (
    <AddressLockScriptPanel>
      <OverviewCard items={useAddressInfo(address)} hideShadow>
        <AddressLockScriptController onClick={() => setShowLock(!showLock)}>
          <div>{t('address.lock_script')}</div>
          <img alt="lock script" src={lockScriptIcon(showLock)} />
        </AddressLockScriptController>
        {showLock && address.lockScript && <Script script={address.lockScript} />}
      </OverviewCard>
    </AddressLockScriptPanel>
  )
}

export const AddressOverview: FC<{ address: Address }> = ({ address }) => {
  const isLG = useIsLGScreen()
  const { t } = useTranslation()
  const { udtAccounts = [] } = address

  const { data: initList } = useQuery(
    ['cota-list', address.addressHash],
    () => explorerService.api.fetchNFTItemByOwner(address.addressHash, 'cota'),
    {
      enabled: !!address?.addressHash,
    },
  )

  const { data: cotaList } = useQuery(['cota-list', initList?.pagination.series], () =>
    Promise.all(
      (initList?.pagination.series ?? []).map(p =>
        explorerService.api.fetchNFTItemByOwner(address.addressHash, 'cota', p),
      ),
    ).then(resList => resList.flatMap(res => res.data)),
  )

  return (
    <OverviewCard items={addressAssetInfo(address, isLG, t)} titleCard={<TitleCard title={t('address.overview')} />}>
      {udtAccounts.length || cotaList?.length ? (
        <AddressUDTAssetsPanel>
          <span>{t('address.user_defined_token')}</span>
          <div className="addressUdtAssetsGrid">
            {udtAccounts.map(udt => (
              <AddressUDTItem udtAccount={udt} key={udt.symbol + udt.udtType + udt.amount} />
            ))}
            {cotaList?.map(cota => (
              <AddressUDTItem
                udtAccount={{
                  symbol: cota.collection.name,
                  amount: '',
                  typeHash: '',
                  udtIconFile: cota.collection.icon_url ?? '',
                  udtType: 'cota',
                  cota: {
                    cotaId: cota.collection.id,
                    tokenId: Number(cota.token_id),
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
  timeOrderBy,
}: {
  address: string
  transactions: Transaction[]
  transactionsTotal: number
  timeOrderBy: OrderByType
}) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const { currentPage, pageSize, setPage } = usePaginationParamsInListPage()
  const { Professional, Lite } = LayoutLiteProfessional
  const searchParams = useSearchParams('layout')
  const defaultLayout = Professional
  const updateSearchParams = useUpdateSearchParams<'layout' | 'sort' | 'tx_type'>()
  const layout = searchParams.layout === Lite ? Lite : defaultLayout
  const totalPages = Math.ceil(total / pageSize)

  const onChangeLayout = (layoutType: LayoutLiteProfessional) => {
    updateSearchParams(params =>
      layoutType === defaultLayout
        ? Object.fromEntries(Object.entries(params).filter(entry => entry[0] !== 'layout'))
        : { ...params, layout: layoutType },
    )
  }
  const handleTimeSort = () => {
    updateSearchParams(
      params =>
        timeOrderBy === 'asc' ? omit(params, ['sort', 'tx_type']) : omit({ ...params, sort: 'time' }, ['tx_type']),
      true,
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
        title={`${t('transaction.transactions')} (${localeNumberString(total)})`}
        className={styles.transactionTitleCard}
        isSingle
        rear={
          <>
            <div className={styles.sortAndFilter} data-is-active={timeOrderBy === 'asc'}>
              {timeOrderBy === 'asc' ? (
                <TimeDownIcon onClick={handleTimeSort} />
              ) : (
                <TimeUpIcon onClick={handleTimeSort} />
              )}
            </div>
            <Radio.Group
              className={styles.layoutButtons}
              options={[
                { label: t('transaction.professional'), value: Professional },
                { label: t('transaction.lite'), value: Lite },
              ]}
              onChange={({ target: { value } }) => onChangeLayout(value)}
              value={layout}
              optionType="button"
              buttonStyle="solid"
            />
          </>
        }
      />
      <AddressTransactionsPanel>
        {layout === 'lite' ? (
          <>
            {!isMobile && (
              <div className={styles.liteTransactionHeader}>
                <div>{t('transaction.transaction_hash')}</div>
                <div>{t('transaction.height')}</div>
                <div>{t('transaction.time')}</div>
                <div>{`${t('transaction.input')} & ${t('transaction.output')}`}</div>
                <div>{t('transaction.capacity_change')}</div>
              </div>
            )}
            {txList.map((transaction: Transaction) => (
              <TransactionLiteItem address={address} transaction={transaction} key={transaction.transactionHash} />
            ))}
          </>
        ) : (
          txList.map((transaction: Transaction, index: number) => (
            <TransactionItem
              address={address}
              transaction={transaction}
              key={transaction.transactionHash}
              circleCorner={{
                bottom: index === transactions.length - 1 && totalPages === 1,
              }}
            />
          ))
        )}
      </AddressTransactionsPanel>
      <PaginationWithRear
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={setPage}
        rear={<CsvExport type="address_transactions" id={address} />}
      />
    </>
  )
}

export default {
  AddressOverview,
  AddressTransactions,
}
