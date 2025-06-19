import { useState } from 'react'
import { useHistory } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import camelcase from 'camelcase'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RefreshCw } from 'lucide-react'
import Pagination from '../../components/Pagination'
import TransactionItem from '../../components/TransactionItem/index'
import { explorerService } from '../../services/ExplorerService'
import { TransactionCellInfoPanel } from '../Transaction/TransactionCell/styled'
import SimpleButton from '../../components/SimpleButton'
import SimpleModal from '../../components/Modal'
import { localeNumberString } from '../../utils/number'
import { shannonToCkb } from '../../utils/util'
import Capacity from '../../components/Capacity'
import styles from './styles.module.scss'
import AddressText from '../../components/AddressText'
import { ReactComponent as CopyIcon } from '../../assets/copy_icon.svg'
import { ReactComponent as InfoMoreIcon } from './info_more_icon.svg'
import { ReactComponent as LiveCellIcon } from './radio-wave-on.svg'
import { ReactComponent as DeadCellIcon } from './radio-wave-off.svg'
import { useSetToast } from '../../components/Toast'
import { CellBasicInfo, transformToCellBasicInfo, transformToTransaction } from '../../utils/transformer'
import { usePrevious, useSearchParams } from '../../hooks'
import CellModal from '../../components/Cell/CellModal'
import { Switch } from '../../components/ui/Switch'
import { HelpTip } from '../../components/HelpTip'
import Tooltip from '../../components/Tooltip'

export const ScriptTransactions = ({
  page,
  size,
  countOfTransactions,
}: {
  page: number
  size: number
  countOfTransactions: number
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const history = useHistory()
  const { codeHash, hashType } = useParams<{ codeHash: string; hashType: string }>()

  const [transactionsEmpty, setTransactionsEmpty] = useState(false)
  const previousTransactionEmpty = usePrevious(transactionsEmpty)
  const { restrict } = useSearchParams('restrict')
  const isRestricted = restrict === 'true'

  const {
    data = {
      total: 0,
      ckbTransactions: [],
    },
    isLoading,
    error,
  } = useQuery(['scripts_ckb_transactions', codeHash, hashType, isRestricted, page, size], async () => {
    const { transactions, total } = await explorerService.api.fetchScriptCKBTransactions(
      codeHash,
      hashType,
      isRestricted,
      page,
      size,
    )

    if (!transactions.length) {
      setTransactionsEmpty(true)
    }
    return {
      total,
      ckbTransactions: transactions,
    }
  })

  const { total, ckbTransactions } = data
  const totalPages = Math.ceil(total / size)

  const onChange = (page: number) => {
    const search = new URLSearchParams(window.location.search)
    search.set('page', page.toString()) // we can also use { ...search, page, search }
    search.set('size', size.toString())
    search.set('restrict', isRestricted.toString())
    const url = `/${language}/script/${codeHash}/${hashType}?${search}`
    history.push(url)
  }

  const switchRestrictMode = (checked: boolean) => {
    history.push(`/${language}/script/${codeHash}/${hashType}?restrict=${checked.toString()}`)
  }

  const status = (() => {
    if (error) {
      return (error as Error).message
    }

    if (isLoading && !previousTransactionEmpty) {
      return t('nft.loading')
    }

    return t(`nft.no_record`)
  })()

  return (
    <>
      {total >= 5000 && (
        <div className={styles.notice}>
          {t('transaction.range_notice', {
            count: 5000,
          })}
        </div>
      )}
      <div className={styles.scriptTransactionsConfigPanel}>
        <span className={styles.countInfo}>
          Total {isLoading ? <RefreshCw className="animate-spin" size={16} /> : localeNumberString(countOfTransactions)}{' '}
          Transactions
        </span>

        <label style={{ marginLeft: 'auto' }} htmlFor="script-restrict-mode">
          {t('scripts.restrict_mode')}
        </label>
        <HelpTip>{t('scripts.restrict_tooltip')}</HelpTip>
        <Switch
          id="script-restrict-mode"
          style={{ marginLeft: '4px' }}
          checked={isRestricted}
          onCheckedChange={checked => switchRestrictMode(checked)}
        />
      </div>

      <div className={styles.scriptTransactionsPanel}>
        {ckbTransactions.length > 0 ? (
          ckbTransactions.map(tr => (
            <TransactionItem
              address=""
              transaction={transformToTransaction(tr)}
              key={tr.txHash}
              circleCorner={{
                bottom: false,
              }}
            />
          ))
        ) : (
          <div className={styles.loadingOrEmpty}>{status}</div>
        )}
      </div>
      {totalPages > 1 && (
        <div className={styles.scriptPagination}>
          <Pagination currentPage={page} totalPages={totalPages} onChange={onChange} />
        </div>
      )}
    </>
  )
}

const CellIcon = ({ status }: { status: 'live' | 'dead' | null }) => {
  const [t] = useTranslation()
  if (status === 'live') {
    return (
      <Tooltip
        trigger={
          <span>
            <LiveCellIcon width="16" height="16" />
          </span>
        }
      >
        {t('cell.live_cell')}
      </Tooltip>
    )
  }
  if (status === 'dead') {
    return (
      <Tooltip
        trigger={
          <span>
            <DeadCellIcon width="16" height="16" />
          </span>
        }
      >
        {t('cell.dead_cell')}
      </Tooltip>
    )
  }
  return <InfoMoreIcon />
}

export const CellInfo = ({ cell }: { cell: CellBasicInfo }) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <TransactionCellInfoPanel>
      <SimpleButton
        className="transactionCellInfoContent"
        onClick={() => {
          setShowModal(true)
        }}
      >
        <CellIcon status={cell.status} />
      </SimpleButton>
      <SimpleModal isShow={showModal} setIsShow={setShowModal}>
        <CellModal cell={cell} onClose={() => setShowModal(false)} />
      </SimpleModal>
    </TransactionCellInfoPanel>
  )
}

export const ScriptCells = ({
  page,
  size,
  cellType,
}: {
  page: number
  size: number
  cellType: 'deployed_cells' | 'referring_cells'
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const history = useHistory()
  const { codeHash, hashType } = useParams<{ codeHash: string; hashType: string }>()

  const [cellsEmpty, setCellsEmpty] = useState<Record<'deployedCells' | 'referringCells', boolean>>({
    deployedCells: false,
    referringCells: false,
  })
  const previousCellsEmpty = usePrevious(cellsEmpty)

  const camelCellType = camelcase(cellType) as 'deployedCells' | 'referringCells'

  const cellsQuery = useQuery([`scripts_${cellType}`, codeHash, hashType, page, size], async () => {
    try {
      const { data } = await explorerService.api.fetchScriptCells(cellType, codeHash, hashType, page, size)
      const cells = data[camelCellType]
      if (cells == null || cells.length === 0) {
        setCellsEmpty(prev => ({ ...prev, [camelCellType]: true }))
      }
      return {
        total: data.meta.total ?? 0,
        cells,
      }
    } catch (error) {
      setCellsEmpty(prev => ({ ...prev, [camelCellType]: true }))
      return {
        total: 0,
        cells: [],
      }
    }
  })

  const cells = cellsQuery.data?.cells ?? []
  const total = cellsQuery.data?.total ?? 0
  const totalPages = Math.ceil(total / size)

  const onChange = (page: number) => {
    history.push(`/${language}/script/${codeHash}/${hashType}/${cellType}?page=${page}&size=${size}`)
  }

  return (
    <>
      {total >= 500 && (
        <div className={styles.notice}>
          {t('transaction.range_notice', {
            count: 500,
          })}
        </div>
      )}

      <div className={styles.scriptCellsPanel}>
        <table>
          <thead>
            <tr>
              <th align="left">{t('transaction.transaction')}</th>
              <th>{t('scripts.index')}</th>
              <th align="left">{t('transaction.capacity')}</th>
              <th align="right">{t('scripts.cell_info')}</th>
            </tr>
          </thead>
          <tbody>
            {cells.length > 0 ? (
              cells.map(record => {
                return (
                  <tr key={`${record.txHash}_${record.cellIndex}`}>
                    <td align="left">
                      <AddressText
                        disableTooltip
                        className="transactionItemHash"
                        linkProps={{
                          to: `/transaction/${record.txHash}`,
                        }}
                      >
                        {record.txHash}
                      </AddressText>
                    </td>
                    <td align="center">{record.cellIndex}</td>
                    <td align="left">
                      <Capacity capacity={shannonToCkb(record.capacity)} display="short" />
                    </td>
                    <td>
                      <div className={styles.cellInfoMore}>
                        <CellInfo cell={transformToCellBasicInfo(record)} />
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <td colSpan={4} className={styles.noRecord}>
                {cellsQuery.isLoading && (!previousCellsEmpty || !previousCellsEmpty[camelCellType])
                  ? t('nft.loading')
                  : t(`nft.no_record`)}
              </td>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className={styles.scriptPagination}>
          <Pagination currentPage={page} totalPages={totalPages} onChange={onChange} />
        </div>
      )}
    </>
  )
}

export const CodeHashMessage = ({ codeHash }: { codeHash: string }) => {
  const setToast = useSetToast()
  const { t } = useTranslation()
  return (
    <div className={styles.codeHashMessagePanel}>
      <div className={styles.codeHash}>
        <AddressText>{codeHash}</AddressText>
      </div>

      <CopyIcon
        className={styles.action}
        onClick={() => {
          navigator.clipboard.writeText(codeHash).then(
            () => {
              setToast({ message: t('common.copied') })
            },
            error => {
              console.error(error)
            },
          )
        }}
      />
    </div>
  )
}
