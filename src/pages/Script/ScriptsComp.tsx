import { useState } from 'react'
import { useHistory } from 'react-router'
import { useQuery } from 'react-query'
import camelcase from 'camelcase'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Pagination from '../../components/Pagination'
import TransactionItem from '../../components/TransactionItem/index'
import { explorerService } from '../../services/ExplorerService'
import { TransactionCellDetailModal, TransactionCellInfoPanel } from '../Transaction/TransactionCell/styled'
import SimpleButton from '../../components/SimpleButton'
import SimpleModal from '../../components/Modal'
import TransactionCellScript from '../Transaction/TransactionCellScript'
import { shannonToCkb } from '../../utils/util'
import { localeNumberString } from '../../utils/number'
import DecimalCapacity from '../../components/DecimalCapacity'
import styles from './styles.module.scss'
import { QueryResult } from '../../components/QueryResult'
import AddressText from '../../components/AddressText'
import { ReactComponent as CopyIcon } from '../../assets/copy_icon.svg'
import { ReactComponent as InfoMoreIcon } from '../../assets/info_more_icon.svg'
import { useSetToast } from '../../components/Toast'
import { CellBasicInfo, transformToTransaction } from '../../utils/transformer'

export const ScriptTransactions = ({ page, size }: { page: number; size: number }) => {
  const history = useHistory()
  const { codeHash, hashType } = useParams<{ codeHash: string; hashType: string }>()

  const transactionsQuery = useQuery(['scripts_ckb_transactions', codeHash, hashType, page, size], async () => {
    const { data } = await explorerService.api.fetchScriptCKBTransactions(codeHash, hashType, page, size)

    if (data == null || data.ckbTransactions == null || data.ckbTransactions.length === 0) {
      throw new Error('Transactions empty')
    }
    return {
      total: data.meta.total,
      ckbTransactions: data.ckbTransactions,
    }
  })
  const total = transactionsQuery.data?.total ?? 0
  const totalPages = Math.ceil(total / size)

  const onChange = (page: number) => {
    history.push(`/script/${codeHash}/${hashType}?page=${page}&size=${size}`)
  }

  return (
    <>
      <QueryResult query={transactionsQuery} delayLoading>
        {data => (
          <div className={styles.scriptTransactionsPanel}>
            {data.ckbTransactions &&
              data.ckbTransactions.map(tr => (
                <TransactionItem
                  address=""
                  transaction={transformToTransaction(tr)}
                  key={tr.txHash}
                  circleCorner={{
                    bottom: false,
                  }}
                />
              ))}
          </div>
        )}
      </QueryResult>
      {totalPages > 1 && (
        <div className={styles.scriptPagination}>
          <Pagination currentPage={page} totalPages={totalPages} onChange={onChange} />
        </div>
      )}
    </>
  )
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
        <InfoMoreIcon />
      </SimpleButton>
      <SimpleModal isShow={showModal} setIsShow={setShowModal}>
        <TransactionCellDetailModal>
          <TransactionCellScript cell={cell} onClose={() => setShowModal(false)} />
        </TransactionCellDetailModal>
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
  const { t } = useTranslation()
  const history = useHistory()
  const { codeHash, hashType } = useParams<{ codeHash: string; hashType: string }>()

  const cellsQuery = useQuery([`scripts_${cellType}`, codeHash, hashType, page, size], async () => {
    const { data } = await explorerService.api.fetchScriptCells(cellType, codeHash, hashType, page, size)
    const camelCellType = camelcase(cellType) as 'deployedCells' | 'referringCells'
    if (data == null) {
      throw new Error('Fetch Cells null')
    }
    const cells = data[camelCellType]!
    if (cells == null || cells.length === 0) {
      throw new Error('Cells empty')
    }
    return {
      total: data.meta.total ?? 0,
      cells,
    }
  })
  const total = cellsQuery.data?.total ?? 0
  const totalPages = Math.ceil(total / size)

  const onChange = (page: number) => {
    history.push(`/script/${codeHash}/${hashType}/${cellType}?page=${page}&size=${size}`)
  }

  return (
    <>
      <QueryResult query={cellsQuery}>
        {data => (
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
                {data.cells.map(record => {
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
                        <DecimalCapacity value={localeNumberString(shannonToCkb(record.capacity))} hideZero />
                      </td>
                      <td>
                        <div className={styles.cellInfoMore}>
                          <CellInfo
                            cell={{
                              id: record.id,
                              capacity: record.capacity,
                              isGenesisOutput: false,
                              occupiedCapacity: String(record.occupiedCapacity),
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </QueryResult>
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
