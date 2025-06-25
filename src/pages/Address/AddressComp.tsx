import { useState, FC, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { useTranslation } from 'react-i18next'
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'
import { utils } from '@ckb-lumos/base'
import TransactionItem from '../../components/TransactionItem/index'
import NodeTransactionItem from '../../components/TransactionItem/NodeTransactionItem'
import { explorerService, RawBtcRPC } from '../../services/ExplorerService'
import { localeNumberString } from '../../utils/number'
import { shannonToCkb, deprecatedAddrToNewAddr } from '../../utils/util'
import Capacity from '../../components/Capacity'
import CKBTokenIcon from './ckb_token_icon.png'
import { useNewAddr, usePaginationParamsInListPage, useSearchParams } from '../../hooks'
import styles from './styles.module.scss'
import LiteTransactionList from '../../components/LiteTransactionList'
import Script from '../../components/Script'
import AddressText from '../../components/AddressText'
import { parseSimpleDateNoSecond } from '../../utils/date'
import { LayoutLiteProfessional } from '../../constants/common'
import { CsvExport } from '../../components/CsvExport'
import PaginationWithRear from '../../components/PaginationWithRear'
import { Transaction } from '../../models/Transaction'
import { Address, UDTAccount } from '../../models/Address'
import { Card, CardCellInfo, CardCellsLayout } from '../../components/Card'
import { CardHeader } from '../../components/Card/CardHeader'
import Cells from './Cells'
import DefinedTokens from './DefinedTokens'
import { AddressOmigaInscriptionComp } from './AddressAssetComp'
import { useCKBNode } from '../../hooks/useCKBNode'
import { useTransactions } from '../../hooks/transaction'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs'
import SimpleButton from '../../components/SimpleButton'

enum AssetInfo {
  UDT = 1,
  INSCRIPTION,
  CELLs,
  DEPLOYMENT_CELLs,
  FIBER_CELLs,
}

const AddressLockScript: FC<{ address: Address }> = ({ address }) => {
  const [isScriptDisplayed, setIsScriptDisplayed] = useState<boolean>(false)
  const { t } = useTranslation()

  const { liveCellsCount, minedBlocksCount, type, addressHash, lockInfo } = address

  const toggleScriptDisplay = () => {
    if (!address.lockScript) {
      return
    }
    setIsScriptDisplayed(is => !is)
  }

  const overviewItems: CardCellInfo<'left' | 'right'>[] = [
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
      overviewItems.push({
        title: t('address.address'),
        content: t('address.unable_decode_address'),
      })
    } else {
      overviewItems.push({
        title: t('address.address'),
        contentWrapperClass: styles.addressWidthModify,
        content: <AddressText>{addressHash}</AddressText>,
      })
    }
  }
  if (lockInfo && lockInfo.epochNumber !== '0' && lockInfo.estimatedUnlockTime !== '0') {
    const estimate = Number(lockInfo.estimatedUnlockTime) > new Date().getTime() ? t('address.estimated') : ''
    overviewItems.push({
      title: t('address.lock_until'),
      content: `${lockInfo.epochNumber} ${t('address.epoch')} (${estimate} ${parseSimpleDateNoSecond(
        lockInfo.estimatedUnlockTime,
      )})`,
    })
  }

  const hash = address.lockScript
    ? utils.computeScriptHash({
        codeHash: address.lockScript.codeHash,
        hashType: address.lockScript.hashType as any,
        args: address.lockScript.args,
      })
    : null

  return (
    <div className={styles.addressLockScriptPanel}>
      <CardCellsLayout type="left-right" cells={overviewItems} borderTop />
      <SimpleButton className={styles.addressLockScriptController} onClick={toggleScriptDisplay}>
        {isScriptDisplayed ? (
          <div className={styles.scriptToggle}>
            <EyeOpenIcon />
            <div>{t('address.lock_script')}</div>
          </div>
        ) : (
          <div className={styles.scriptToggle}>
            <EyeClosedIcon />
            <div>{t('address.lock_script_hash')}</div>
          </div>
        )}
      </SimpleButton>
      {isScriptDisplayed ? (
        <Script script={address.lockScript} />
      ) : (
        <div className={`monospace ${styles.scriptHash}`}>{hash}</div>
      )}
    </div>
  )
}

export const AddressOverviewCard: FC<{ address: Address }> = ({ address }) => {
  const { t } = useTranslation()
  const { udtAccounts = [] } = address
  const [activeTab, setActiveTab] = useState<AssetInfo>(AssetInfo.UDT)

  const [udts, inscriptions] = udtAccounts.reduce(
    (acc, cur) => {
      switch (cur?.udtType) {
        case 'sudt':
        case 'did_cell':
        case 'spore_cell':
        case 'm_nft_token':
        case 'cota':
        case 'nrc_721_token':
          acc[0].push(cur)
          break
        case 'xudt_compatible':
        case 'xudt':
          if (cur.amount !== '0') {
            acc[0].push(cur)
          }
          break
        case 'omiga_inscription':
          if (cur.amount !== '0') {
            // FIXME: remove this condition after the backend fix the data
            acc[1].push(cur)
          }
          break
        default:
          break
      }
      return acc
    },
    [[] as UDTAccount[], [] as UDTAccount[]],
  )

  const { data: initList } = useQuery(
    ['cota-list', address.addressHash],
    () => explorerService.api.fetchNFTItemByOwner(address.addressHash, 'cota'),
    {
      enabled: !!address?.addressHash,
    },
  )

  const { data: cotaList } = useQuery(
    ['cota-list', initList?.pagination?.series],
    () =>
      Promise.all(
        (initList?.pagination.series ?? []).map(p =>
          explorerService.api.fetchNFTItemByOwner(address.addressHash, 'cota', p),
        ),
      ).then(resList => resList.flatMap(res => res.data)),
    {
      enabled: !!initList?.pagination?.series?.length,
    },
  )

  const { data: deploymentCells } = useQuery(
    ['address', 'deployment_cells', address.addressHash],
    () =>
      explorerService.api.fetchAddressLiveCells({ address: address.addressHash, page: 1, size: 10, tag: 'deployment' }),
    {
      enabled: !!address?.addressHash,
    },
  )

  const { data: fiberCells } = useQuery(
    ['address', 'fiber_cells', address.addressHash],
    () => explorerService.api.fetchAddressLiveCells({ address: address.addressHash, page: 1, size: 10, tag: 'fiber' }),
    {
      enabled: !!address?.addressHash,
    },
  )

  const overviewItems: CardCellInfo<'left' | 'right'>[] = [
    {
      slot: 'left',
      cell: {
        icon: <img src={CKBTokenIcon} alt="item icon" width="100%" />,
        title: t('common.ckb_unit'),
        content: <Capacity capacity={shannonToCkb(address.balance)} />,
      },
    },
    {
      title: t('address.occupied'),
      tooltip: t('glossary.occupied'),
      content: <Capacity capacity={shannonToCkb(address.balanceOccupied)} />,
    },
    {
      title: t('address.dao_deposit'),
      tooltip: t('glossary.nervos_dao_deposit'),
      content: <Capacity capacity={shannonToCkb(address.daoDeposit)} />,
    },
    {
      title: t('address.compensation'),
      content: <Capacity capacity={shannonToCkb(address.daoCompensation)} />,
      tooltip: t('glossary.nervos_dao_compensation'),
    },
  ]

  const hasAssets = udts.length > 0 || (cotaList?.length && cotaList.length > 0)
  const hasInscriptions = inscriptions.length > 0
  const hasCells = +address.liveCellsCount > 0
  const hasDeploymentCells = Boolean(deploymentCells?.total ?? 0)
  const hasFiberCells = Boolean(fiberCells?.total ?? 0)

  useEffect(() => {
    if (hasAssets) {
      return
    }
    if (hasInscriptions) {
      setActiveTab(AssetInfo.INSCRIPTION)
      return
    }
    if (hasCells) {
      setActiveTab(AssetInfo.CELLs)
    }
  }, [hasAssets, hasInscriptions, hasCells, setActiveTab])

  return (
    <Card className={styles.addressOverviewCard}>
      <div className={styles.cardTitle}>{t('address.overview')}</div>

      <CardCellsLayout type="leftSingle-right" cells={overviewItems} borderTop />

      {hasAssets || hasInscriptions || hasCells ? (
        <div className={styles.addressUDTAssetsPanel}>
          <Tabs value={activeTab.toString()} type="underline">
            <TabsList>
              {!!hasCells && (
                <TabsTrigger value={AssetInfo.CELLs.toString()}>
                  <span className={styles.addressAssetsTabPaneTitle} onClick={() => setActiveTab(AssetInfo.CELLs)}>
                    {t('address.live_cell_tab')}
                  </span>
                </TabsTrigger>
              )}
              {hasFiberCells && (
                <TabsTrigger value={AssetInfo.FIBER_CELLs.toString()}>
                  <span
                    className={styles.addressAssetsTabPaneTitle}
                    onClick={() => setActiveTab(AssetInfo.FIBER_CELLs)}
                  >
                    Fiber Channel(s)
                  </span>
                </TabsTrigger>
              )}

              {!!hasAssets && (
                <TabsTrigger value={AssetInfo.UDT.toString()}>
                  <span className={styles.addressAssetsTabPaneTitle} onClick={() => setActiveTab(AssetInfo.UDT)}>
                    {t('address.user_defined_token')}
                  </span>
                </TabsTrigger>
              )}
              {!!hasInscriptions && (
                <TabsTrigger value={AssetInfo.INSCRIPTION.toString()}>
                  <span
                    className={styles.addressAssetsTabPaneTitle}
                    onClick={() => setActiveTab(AssetInfo.INSCRIPTION)}
                  >
                    {t('address.inscription')}
                  </span>
                </TabsTrigger>
              )}

              {hasDeploymentCells && (
                <TabsTrigger value={AssetInfo.DEPLOYMENT_CELLs.toString()}>
                  <span
                    className={styles.addressAssetsTabPaneTitle}
                    onClick={() => setActiveTab(AssetInfo.DEPLOYMENT_CELLs)}
                  >
                    Deployment(s)
                  </span>
                </TabsTrigger>
              )}
            </TabsList>
            {!!hasCells && (
              <TabsContent value={AssetInfo.CELLs.toString()} style={{ width: '100%' }}>
                <div className={styles.assetCardList}>
                  <Cells address={address.addressHash} />
                </div>
              </TabsContent>
            )}
            {!!hasDeploymentCells && (
              <TabsContent value={AssetInfo.DEPLOYMENT_CELLs.toString()} style={{ width: '100%' }}>
                <div className={styles.assetCardList}>
                  <Cells address={address.addressHash} tag="deployment" />
                </div>
              </TabsContent>
            )}
            {!!hasFiberCells && (
              <TabsContent value={AssetInfo.FIBER_CELLs.toString()} style={{ width: '100%' }}>
                <div className={styles.assetCardList}>
                  <Cells address={address.addressHash} tag="fiber" defaultDisplayAsList />
                </div>
              </TabsContent>
            )}
            {!!hasAssets && (
              <TabsContent value={AssetInfo.UDT.toString()} style={{ width: '100%' }}>
                <div className={styles.assetCardList}>
                  <DefinedTokens udts={udts} cotaList={cotaList} />
                </div>
              </TabsContent>
            )}
            {!!hasInscriptions && (
              <TabsContent value={AssetInfo.INSCRIPTION.toString()} style={{ width: '100%' }}>
                <div className={styles.assetCardList}>
                  <div className={styles.inscriptions}>
                    <ul>
                      {inscriptions.map(inscription => {
                        switch (inscription.udtType) {
                          case 'omiga_inscription':
                            return (
                              <li>
                                <AddressOmigaInscriptionComp
                                  account={inscription}
                                  key={`${inscription.symbol + inscription.udtType + inscription.udtAmount}`}
                                />
                              </li>
                            )

                          default:
                            return null
                        }
                      })}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      ) : null}

      <AddressLockScript address={address} />
    </Card>
  )
}

// TODO: Adding loading
export const AddressTransactions = ({
  address,
  transactions,
  meta,
}: {
  address: string
  transactions: (Transaction & { btcTx: RawBtcRPC.BtcTx | null })[]
  meta: { totalPages?: number }
}) => {
  const { totalPages = 0 } = meta
  const { t } = useTranslation()
  const { currentPage, setPage } = usePaginationParamsInListPage()
  const { Professional, Lite } = LayoutLiteProfessional
  const defaultLayout = Professional

  const searchParams = useSearchParams('layout', 'tx_status')

  const layout = searchParams.layout === Lite ? Lite : defaultLayout

  const txStatus = searchParams.tx_status
  const isPendingListActive = txStatus === 'pending'
  // const total = isPendingListActive ? counts.pending : counts.committed
  // const totalPages = _totalPages ?? total === '-' ? 0 : Math.ceil(total / pageSize)

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
      <div className={styles.addressTransactionsPanel}>
        {layout === 'lite' ? (
          <LiteTransactionList address={address} list={transactions} />
        ) : (
          <>
            {txList.map((transaction, index) => (
              <TransactionItem
                address={address}
                transaction={transaction}
                key={transaction.transactionHash}
                circleCorner={{
                  bottom: index === transactions.length - 1 && totalPages === 1,
                }}
              />
            ))}
            {txList.length === 0 ? <div className={styles.noRecords}>{t(`transaction.no_records`)}</div> : null}
          </>
        )}
      </div>
      <PaginationWithRear
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={setPage}
        rear={
          isPendingListActive ? null : (
            <CsvExport link={`/export-transactions?type=address_transactions&id=${address}`} />
          )
        }
      />
    </>
  )
}

// FIXME: plural in i18n not work, address.cell and address.cells

export const NodeAddressOverviewCard: FC<{ address: string }> = ({ address }) => {
  const { t } = useTranslation()
  const [isScriptDisplayed, setIsScriptDisplayed] = useState<boolean>(false)
  const { nodeService } = useCKBNode()

  const lockScript = addressToScript(address)
  const lockScriptHash = utils.computeScriptHash(lockScript)

  const capacityQuery = useQuery(
    ['node', 'address', 'capacity', address],
    () => nodeService.rpc.getCellsCapacity({ script: lockScript, scriptType: 'lock' }),
    { staleTime: 1000 * 60 },
  )

  const occupiedCapacityQuery = useQuery(
    ['node', 'address', 'occupied', 'capacity', address],
    () =>
      nodeService.rpc.getCellsCapacity({
        script: lockScript,
        scriptType: 'lock',
        filter: { scriptLenRange: ['0x1', '0x1000'] },
      }),
    { staleTime: 1000 * 60 },
  )

  const overviewItems: CardCellInfo<'left' | 'right'>[] = [
    {
      slot: 'left',
      cell: {
        icon: <img src={CKBTokenIcon} alt="item icon" width="100%" />,
        title: t('common.ckb_unit'),
        content: capacityQuery.data ? <Capacity capacity={shannonToCkb(capacityQuery.data.capacity)} /> : 'loading...',
      },
    },
    {
      title: t('address.occupied'),
      tooltip: t('glossary.occupied'),
      content: occupiedCapacityQuery.data ? (
        <Capacity capacity={shannonToCkb(occupiedCapacityQuery.data.capacity)} />
      ) : (
        'loading...'
      ),
    },
  ]

  return (
    <Card className={styles.addressOverviewCard}>
      <div className={styles.cardTitle}>{t('address.overview')}</div>

      <div style={{ marginBottom: 24 }}>
        <CardCellsLayout type="left-right" cells={overviewItems} borderTop />
      </div>

      <SimpleButton
        className={styles.addressLockScriptController}
        onClick={() => setIsScriptDisplayed(!isScriptDisplayed)}
      >
        {isScriptDisplayed ? (
          <div className={styles.scriptToggle}>
            <EyeOpenIcon />
            <div>{t('address.lock_script')}</div>
          </div>
        ) : (
          <div className={styles.scriptToggle}>
            <EyeClosedIcon />
            <div>{t('address.lock_script_hash')}</div>
          </div>
        )}
      </SimpleButton>
      {isScriptDisplayed ? (
        <Script script={lockScript} />
      ) : (
        <div className={`monospace ${styles.scriptHash}`}>{lockScriptHash}</div>
      )}
    </Card>
  )
}

export const NodeAddressTransactions = ({ address }: { address: string }) => {
  const { t } = useTranslation()
  const lockScript = addressToScript(address)
  const { data, isLoading, hasNextPage, fetchNextPage } = useTransactions({
    searchKey: { script: lockScript, scriptType: 'lock' },
    pageSize: 10,
  })

  return (
    <>
      <Card className={styles.transactionListOptionsCard} rounded="top">
        <CardHeader
          className={styles.cardHeader}
          leftContent={<div className={styles.txHeaderLabels}>{t('transaction.transactions')}</div>}
        />
      </Card>

      <div className={styles.addressTransactionsPanel}>
        {data?.pages.map(page =>
          page.txs.map(tx => (
            <NodeTransactionItem
              transaction={tx.transaction}
              key={tx.transaction.hash!}
              highlightAddress={address}
              blockHashOrNumber={tx.txStatus.blockHash ?? undefined}
            />
          )),
        )}
        {!isLoading && data?.pages.length === 0 ? (
          <div className={styles.noRecords}>{t(`transaction.no_records`)}</div>
        ) : null}
      </div>

      {data?.pages.length !== 0 && (
        <div className={styles.cardFooterPanel} style={{ marginTop: 4 }}>
          {hasNextPage ? (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div className={styles.cardFooterButton} onClick={() => fetchNextPage()}>
              {t('pagination.load_more')}
            </div>
          ) : (
            <div>{t('pagination.no_more_data')}</div>
          )}
        </div>
      )}
    </>
  )
}
