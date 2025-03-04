import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Tooltip, Radio } from 'antd'
import { FC, useMemo } from 'react'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { Address as AddressInfo } from '../../models/Address'
import { LayoutLiteProfessional } from '../../constants/common'
import Content from '../../components/Content'
import { AddressContentPanel } from './styled'
import { AddressTransactions, AddressOverviewCard } from './AddressComp'
import { ReactComponent as TimeDownIcon } from '../../assets/time_down.svg'
import { ReactComponent as TimeUpIcon } from '../../assets/time_up.svg'
import { explorerService } from '../../services/ExplorerService'
import { QueryResult } from '../../components/QueryResult'
import type { Transaction } from '../../models/Transaction'
import {
  useDeprecatedAddr,
  useNewAddr,
  usePaginationParamsInListPage,
  useSearchParams,
  useUpdateSearchParams,
  useIsMobile,
  useSortParam,
} from '../../hooks'
import { omit } from '../../utils/object'
import { localeNumberString } from '../../utils/number'
import { isAxiosError } from '../../utils/error'
import RgbppBanner from '../../components/RgbppBanner'
import { Card, HashCardHeader } from '../../components/Card'
import { CardHeader } from '../../components/Card/CardHeader'
import { ReactComponent as ShareIcon } from './share.svg'
import styles from './styles.module.scss'
import { useDASAccount } from '../../hooks/useDASAccount'
import { BTCExplorerLink, Link } from '../../components/Link'
import { isValidBTCAddress } from '../../utils/bitcoin'
import { defaultAddressInfo } from './state'
import { BTCAddressOverviewCard } from './BTCAddressComp'
import Qrcode from '../../components/Qrcode'
import { FaucetMenu } from '../../components/FaucetMenu'

export const Address = () => {
  const { address } = useParams<{ address: string }>()
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { currentPage, pageSize } = usePaginationParamsInListPage()
  const searchParams = useSearchParams('layout', 'tx_status')
  const { layout: _layout, tx_status: txStatus } = searchParams

  // REFACTOR: avoid using useSortParam
  const { sortBy, orderBy, sort } = useSortParam<'time'>(s => s === 'time')

  const isPendingTxListActive = txStatus === 'pending'

  const addressInfoQuery = useQuery(['address_info', address], () => explorerService.api.fetchAddressInfo(address))

  const isRGBPP = isValidBTCAddress(address)
  const updateSearchParams = useUpdateSearchParams<'layout' | 'sort' | 'tx_type'>()
  const { Professional, Lite } = LayoutLiteProfessional
  const defaultLayout = Professional
  const timeOrderBy = sortBy === 'time' ? orderBy : 'desc'
  const layout = _layout === Lite ? Lite : defaultLayout

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

  let addressInfo: AddressInfo | undefined
  if (!isRGBPP) {
    addressInfo = addressInfoQuery.data?.[0] ?? {
      ...defaultAddressInfo,
      addressHash: address,
      lockScript: addressToScript(address),
    }
  } else {
    addressInfo = addressInfoQuery.data?.reduce((acc, cur) => {
      return {
        ...cur,
        ...{
          daoCompensation: (BigInt(acc.daoCompensation) + BigInt(cur.daoCompensation ?? 0)).toString(),
          daoDeposit: (BigInt(acc.daoDeposit) + BigInt(cur.daoDeposit ?? 0)).toString(),
          interest: (BigInt(acc.interest) + BigInt(cur.interest ?? 0)).toString(),
          liveCellsCount: (BigInt(acc.liveCellsCount) + BigInt(cur.liveCellsCount ?? 0)).toString(),
          minedBlocksCount: (BigInt(acc.minedBlocksCount) + BigInt(cur.minedBlocksCount ?? 0)).toString(),
          pendingRewardBlocksCount: (
            BigInt(acc.pendingRewardBlocksCount) + BigInt(cur.pendingRewardBlocksCount ?? 0)
          ).toString(),
          transactionsCount: (BigInt(acc.transactionsCount) + BigInt(cur.transactionsCount ?? 0)).toString(),
          udtAccounts: acc.udtAccounts ? acc.udtAccounts.concat(cur.udtAccounts ?? []) : cur.udtAccounts,
        },
      }
    }, defaultAddressInfo)
  }

  const addressTransactionsQuery = useQuery(
    ['address_transactions', address, currentPage, pageSize, sort],
    () => explorerService.api.fetchTransactionsByAddress(address, currentPage, pageSize, sort),
    {
      enabled: !isPendingTxListActive,
    },
  )

  const addressPendingTransactionsQuery = useQuery(
    ['address_pending_transactions', address, currentPage, pageSize, sort],
    async () => {
      try {
        const { transactions, total } = await explorerService.api.fetchPendingTransactionsByAddress(
          address,
          currentPage,
          pageSize,
          sort,
        )
        return {
          transactions,
          total,
        }
      } catch (err) {
        const isEmptyAddress = isAxiosError(err) && err.response?.status === 404
        if (isEmptyAddress) {
          return {
            transactions: [],
            total: 0,
          }
        }
        throw err
      }
    },
    {
      enabled: isPendingTxListActive,
    },
  )
  /* FIXME: the total count of tx cannot be aggregated from addresses api if its RGB++ Address because some of them are repeated and double counted */
  /* reuse the cache of address_transactions query by using the same query key */
  const transactionCountQuery = useQuery<{ transactions: Transaction[]; total: number | '-'; totalPages?: number }>(
    ['address_transactions', address, currentPage, pageSize, sort],
    async () => {
      try {
        return explorerService.api.fetchTransactionsByAddress(address, currentPage, pageSize, sort)
      } catch (err) {
        return { transactions: [], total: '-' }
      }
    },
    {
      initialData: { transactions: [], total: '-' },
      enabled: isRGBPP,
    },
  )

  /* reuse the cache of address_pending_transactions query by using the same query key */
  const pendingTransactionCountQuery = useQuery<{ transactions: Transaction[]; total: number | '-' }>(
    ['address_pending_transactions', address, currentPage, pageSize, sort],
    async () => {
      try {
        const { transactions, total } = await explorerService.api.fetchPendingTransactionsByAddress(
          address,
          currentPage,
          pageSize,
          sort,
        )
        return {
          transactions,
          total,
        }
      } catch (err) {
        return { transactions: [], total: '-' }
      }
    },
    {
      initialData: { transactions: [], total: '-' },
    },
  )

  const transactionCounts: Record<'committed' | 'pending', number | '-'> = useMemo(() => {
    let committed: number | '-' = '-'
    if (isRGBPP) {
      committed = transactionCountQuery.data?.total ?? '-'
    } else {
      committed = Number(addressInfo?.transactionsCount) ?? '-'
    }
    const pending = pendingTransactionCountQuery.data?.total ?? '-'
    return {
      committed,
      pending,
    }
  }, [addressInfo?.transactionsCount, pendingTransactionCountQuery, transactionCountQuery, isRGBPP])

  const searchOptionsAndModeSwitch = (
    <div className={styles.searchOptionsAndModeSwitch}>
      <div className={styles.sortAndFilter} data-is-active={timeOrderBy === 'asc'}>
        {timeOrderBy === 'asc' ? <TimeDownIcon onClick={handleTimeSort} /> : <TimeUpIcon onClick={handleTimeSort} />}
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
    </div>
  )

  const newAddr = useNewAddr(address)
  const deprecatedAddr = useDeprecatedAddr(address)
  const counterpartAddr = newAddr === address ? deprecatedAddr : newAddr
  const isBtcAddress = isRGBPP ? isValidBTCAddress(address) : false

  return (
    <Content>
      {isRGBPP ? <RgbppBanner path={`/address/${address}`} /> : null}
      <AddressContentPanel className="container">
        <Card>
          <HashCardHeader
            title={addressInfo?.type === 'LockHash' ? t('address.lock_hash') : t('address.address')}
            hash={address}
            customActions={[
              <Qrcode text={address} />,
              isBtcAddress ? <LinkToBtcAddress address={address} /> : null,
              <FaucetMenu address={address} />,
              counterpartAddr ? (
                <Tooltip
                  placement="top"
                  title={t(`address.${newAddr === address ? 'visit-deprecated-address' : 'view-new-address'}`)}
                >
                  <Link
                    className={styles.openInNew}
                    to={`/address/${counterpartAddr}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ShareIcon />
                  </Link>
                </Tooltip>
              ) : null,
            ]}
            rightContent={addressInfo?.addressHash && <DASInfo address={addressInfo?.addressHash} />}
          />
        </Card>

        <AddressOverView isRGBPP={isRGBPP} addressInfo={addressInfo} />

        <Card className={styles.transactionListOptionsCard} rounded="top">
          <CardHeader
            className={styles.cardHeader}
            leftContent={
              <div className={styles.txHeaderLabels}>
                <Link
                  to={`/address/${address}?${new URLSearchParams({ ...searchParams, tx_status: 'committed' })}`}
                  data-is-active={!isPendingTxListActive}
                >{`${t('transaction.transactions')} (${
                  transactionCounts.committed === '-'
                    ? transactionCounts.committed
                    : localeNumberString(transactionCounts.committed)
                })`}</Link>
                <Link
                  to={`/address/${address}?${new URLSearchParams({ ...searchParams, tx_status: 'pending' })}`}
                  data-is-active={isPendingTxListActive}
                >{`${t('transaction.pending_transactions')} (${
                  transactionCounts.pending === '-'
                    ? transactionCounts.pending
                    : localeNumberString(transactionCounts.pending)
                })`}</Link>
              </div>
            }
            rightContent={!isMobile && searchOptionsAndModeSwitch}
          />
          {isMobile && searchOptionsAndModeSwitch}
        </Card>

        {!isPendingTxListActive && (transactionCountQuery.data?.totalPages ?? 0) >= 200 && (
          <div className={styles.notice}>
            {t('transaction.range_notice', {
              count: 5000,
            })}
          </div>
        )}

        {isPendingTxListActive ? (
          <QueryResult query={addressPendingTransactionsQuery} delayLoading>
            {data => (
              <AddressTransactions
                address={address}
                transactions={data?.transactions ?? []}
                meta={{
                  totalPages: data?.total ? 0 : Math.ceil(data?.total ?? 0 / pageSize),
                }}
              />
            )}
          </QueryResult>
        ) : (
          <QueryResult query={addressTransactionsQuery} delayLoading>
            {data => (
              <AddressTransactions
                address={address}
                transactions={data?.transactions ?? []}
                meta={{
                  totalPages: data?.totalPages,
                }}
              />
            )}
          </QueryResult>
        )}
      </AddressContentPanel>
    </Content>
  )
}

const LinkToBtcAddress = ({ address }: { address: string }) => {
  const { t } = useTranslation()
  return (
    <Tooltip placement="top" title={t('address.view_in_btc_explorer')}>
      <BTCExplorerLink className={styles.openInNew} address={address} path="/address">
        <ShareIcon />
      </BTCExplorerLink>
    </Tooltip>
  )
}

const AddressOverView = ({ isRGBPP, addressInfo }: { isRGBPP: boolean; addressInfo?: AddressInfo }) => {
  if (addressInfo) {
    if (isRGBPP) {
      return <BTCAddressOverviewCard address={addressInfo} />
    }

    return <AddressOverviewCard address={addressInfo} />
  }

  return <div />
}

export const DASInfo: FC<{ address: string }> = ({ address }) => {
  const alias = useDASAccount(address)

  if (alias == null) return null

  return (
    <Tooltip placement="top" title={alias}>
      <a className={styles.dasAccount} href={`https://data.did.id/${alias}`} target="_blank" rel="noreferrer">
        <img src={`https://display.did.id/identicon/${alias}`} alt={alias} />
        <span>{alias}</span>
      </a>
    </Tooltip>
  )
}

export default Address
