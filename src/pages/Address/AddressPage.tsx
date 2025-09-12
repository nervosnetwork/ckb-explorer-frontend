import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { FC, useMemo, useEffect, ReactNode } from 'react'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import type { Script } from '../../models/Script'
import { Address as AddressInfo } from '../../models/Address'
import { LayoutLiteProfessional } from '../../constants/common'
import Content from '../../components/Content'
import { AddressTransactions, AddressOverviewCard } from './AddressComp'
// import { ReactComponent as TimeDownIcon } from '../../assets/time_down.svg'
// import { ReactComponent as TimeUpIcon } from '../../assets/time_up.svg'
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
// import { omit } from '../../utils/object'
import { localeNumberString } from '../../utils/number'
import { isRequestError } from '../../utils/error'
import RgbppBanner from '../../components/RgbppBanner'
import { Card, HashCardHeader } from '../../components/Card'
import { ReactComponent as CopyIcon } from '../../components/Card/copy.svg'
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
import { ReactComponent as MultisigIcon } from '../../components/LockIcons/Multisig.svg'
import { ReactComponent as TimelockIcon } from '../../components/LockIcons/Timelock.svg'
import Tooltip from '../../components/Tooltip'
import { useSetToast } from '../../components/Toast'
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs'

const AddressBadge: FC<{
  badge: ReactNode
  script: Script
  scriptName: string | undefined | null
}> = ({ badge, script, scriptName }) => {
  const { t } = useTranslation()
  const setToast = useSetToast()
  return (
    <Tooltip trigger={badge} placement="top">
      <div>
        <div className={styles.scriptIcon}>{scriptName}</div>
        <div>
          <div className={styles.copyCodeHash}>
            Code Hash:
            <CopyIcon
              className={styles.copyIcon}
              onClick={() => {
                navigator.clipboard.writeText(script.codeHash ?? '')
                setToast({ message: t('common.copied') })
              }}
            />
          </div>
          {script.codeHash}
        </div>
      </div>
    </Tooltip>
  )
}

export const Address = () => {
  const { address } = useParams<{ address: string }>()
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { currentPage, pageSize } = usePaginationParamsInListPage({ defaultPageSize: 10 })
  const searchParams = useSearchParams('layout', 'tx_status')
  const { layout: _layout, tx_status: txStatus } = searchParams

  // REFACTOR: avoid using useSortParam
  const { sort } = useSortParam<'time'>(s => s === 'time')

  const isPendingTxListActive = txStatus === 'pending'

  const addressInfoQuery = useQuery(['address_info', address], () => explorerService.api.fetchAddressInfo(address))

  const isRGBPP = isValidBTCAddress(address)
  const updateSearchParams = useUpdateSearchParams<'layout' | 'sort' | 'tx_type'>()
  const { Professional, Lite } = LayoutLiteProfessional
  const defaultLayout = Professional
  // const timeOrderBy = sortBy === 'time' ? orderBy : 'desc'
  const layout = _layout === Lite ? Lite : defaultLayout

  const onChangeLayout = (layoutType: LayoutLiteProfessional) => {
    updateSearchParams(params =>
      layoutType === defaultLayout
        ? Object.fromEntries(Object.entries(params).filter(entry => entry[0] !== 'layout'))
        : { ...params, layout: layoutType },
    )
  }
  // const handleTimeSort = () => {
  //   updateSearchParams(
  //     params =>
  //       timeOrderBy === 'asc' ? omit(params, ['sort', 'tx_type']) : omit({ ...params, sort: 'time' }, ['tx_type']),
  //     true,
  //   )
  // }

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
        const isEmptyAddress = isRequestError(err) && err.response?.status === 404
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

  useEffect(() => {
    transactionCountQuery.refetch()
    pendingTransactionCountQuery.refetch()
    addressPendingTransactionsQuery.refetch()
    addressInfoQuery.refetch()
    addressTransactionsQuery.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPendingTxListActive])

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
      {/* <div className={styles.sortAndFilter} data-is-active={timeOrderBy === 'asc'}>
        {timeOrderBy === 'asc' ? <TimeDownIcon onClick={handleTimeSort} /> : <TimeUpIcon onClick={handleTimeSort} />}
      </div> */}
      <div className={styles.professionalLiteBox}>
        <button
          type="button"
          className={classNames(styles.button, layout === LayoutLiteProfessional.Professional ? styles.selected : '')}
          onClick={() => onChangeLayout(LayoutLiteProfessional.Professional)}
        >
          {t('transaction.professional')}
        </button>
        <button
          className={classNames(styles.button, layout === LayoutLiteProfessional.Lite ? styles.selected : '')}
          type="button"
          onClick={() => onChangeLayout(LayoutLiteProfessional.Lite)}
        >
          {t('transaction.lite')}
        </button>
      </div>
    </div>
  )

  const newAddr = useNewAddr(address)
  const deprecatedAddr = useDeprecatedAddr(address)
  const counterpartAddr = newAddr === address ? deprecatedAddr : newAddr
  const isBtcAddress = isRGBPP ? isValidBTCAddress(address) : false

  const script = addressInfo?.lockScript

  return (
    <Content>
      {isRGBPP ? <RgbppBanner path={`/address/${address}`} /> : null}
      <div className={classNames(styles.addressContentPanel, 'container')}>
        <Card>
          <HashCardHeader
            title={addressInfo?.type === 'LockHash' ? t('address.lock_hash') : t('address.address')}
            hash={address}
            customActions={[
              <Qrcode text={address} />,
              script && addressInfo?.lockScript.tags?.includes('multisig') ? (
                <AddressBadge
                  badge={<MultisigIcon />}
                  script={script}
                  scriptName={addressInfo.lockScript.verifiedScriptName}
                />
              ) : null,
              script &&
              addressInfo &&
              ['btc_time_lock', 'multisig_time_lock'].some(tag => addressInfo?.lockScript.tags?.includes(tag)) ? (
                <AddressBadge
                  badge={<TimelockIcon />}
                  script={script}
                  scriptName={addressInfo.lockScript.verifiedScriptName}
                />
              ) : null,
              isBtcAddress ? <LinkToBtcAddress address={address} /> : null,
              <FaucetMenu address={address} />,
              counterpartAddr ? (
                <Tooltip
                  trigger={
                    <Link
                      className={styles.openInNew}
                      to={`/address/${counterpartAddr}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ShareIcon />
                    </Link>
                  }
                  placement="top"
                >
                  {t(`address.${newAddr === address ? 'visit-deprecated-address' : 'view-new-address'}`)}
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
              <Tabs
                type="underline"
                className={styles.txHeaderLabels}
                defaultValue={isPendingTxListActive ? 'pending' : 'committed'}
              >
                <TabsList>
                  <TabsTrigger value="committed">
                    <Link
                      to={`/address/${address}?${new URLSearchParams({ ...searchParams, tx_status: 'committed' })}`}
                      data-is-active={!isPendingTxListActive}
                    >{`${t('transaction.transactions')} (${
                      transactionCounts.committed === '-'
                        ? transactionCounts.committed
                        : localeNumberString(transactionCounts.committed)
                    })`}</Link>
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    <Link
                      to={`/address/${address}?${new URLSearchParams({ ...searchParams, tx_status: 'pending' })}`}
                      data-is-active={isPendingTxListActive}
                    >{`${t('transaction.pending_transactions')} (${
                      transactionCounts.pending === '-'
                        ? transactionCounts.pending
                        : localeNumberString(transactionCounts.pending)
                    })`}</Link>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            }
            rightContent={!isMobile && searchOptionsAndModeSwitch}
          />
          {isMobile && searchOptionsAndModeSwitch}
        </Card>

        {!isPendingTxListActive && (transactionCountQuery.data?.totalPages ?? 0) >= 200 && (
          <div className={styles.notice}>
            {t('transaction.range_notice', {
              count: 500,
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
      </div>
    </Content>
  )
}

const LinkToBtcAddress = ({ address }: { address: string }) => {
  const { t } = useTranslation()
  return (
    <Tooltip
      trigger={
        <BTCExplorerLink className={styles.openInNew} address={address} path="/address">
          <ShareIcon />
        </BTCExplorerLink>
      }
      placement="top"
    >
      {t('address.view_in_btc_explorer')}
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
    <Tooltip
      trigger={
        <a className={styles.dasAccount} href={`https://data.did.id/${alias}`} target="_blank" rel="noreferrer">
          <img src={`https://display.did.id/identicon/${alias}`} alt={alias} />
          <span>{alias}</span>
        </a>
      }
      placement="top"
    >
      {alias}
    </Tooltip>
  )
}

export default Address
