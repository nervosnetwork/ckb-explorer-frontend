import { useState } from 'react'
import { useHistory } from 'react-router'
import { useQuery } from 'react-query'
import { AxiosResponse } from 'axios'
import camelcase from 'camelcase'
import { useParams } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import TransactionItem from '../../components/TransactionItem/index'
import { v2AxiosIns } from '../../service/http/fetcher'
import i18n from '../../utils/i18n'
import { TransactionCellDetailModal, TransactionCellInfoPanel } from '../Transaction/TransactionCell/styled'
import SimpleButton from '../../components/SimpleButton'
import SimpleModal from '../../components/Modal'
import TransactionCellScript from '../Transaction/TransactionCellScript'
import { shannonToCkb, toCamelcase } from '../../utils/util'
import { localeNumberString } from '../../utils/number'
import DecimalCapacity from '../../components/DecimalCapacity'
import { CellInScript, CkbTransactionInScript } from './types'
import styles from './styles.module.scss'
import { QueryResult } from '../../components/QueryResult'
import AddressText from '../../components/AddressText'
import { AppActions } from '../../contexts/actions'
import { useDispatch } from '../../contexts/providers'
import { ReactComponent as CopyIcon } from '../../assets/copy_icon.svg'
import { ReactComponent as InfoMoreIcon } from '../../assets/info_more_icon.svg'

export const ScriptTransactions = ({ page, size }: { page: number; size: number }) => {
  const history = useHistory()
  const { codeHash, hashType } = useParams<{ codeHash: string; hashType: string }>()

  const transactionsQuery = useQuery(['scripts_ckb_transactions', codeHash, hashType, page, size], async () => {
    const { data, meta } = await v2AxiosIns
      .get(`scripts/ckb_transactions`, {
        params: {
          code_hash: codeHash,
          hash_type: hashType,
          page,
          page_size: size,
        },
      })
      .then((res: AxiosResponse) =>
        toCamelcase<Response.Response<{ ckbTransactions: CkbTransactionInScript[] }>>(res.data),
      )

    if (data == null || data.ckbTransactions == null || data.ckbTransactions.length === 0) {
      throw new Error('Transactions empty')
    }
    return {
      total: meta?.total ?? 0,
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
              data.ckbTransactions.map(tr => {
                const transaction = {
                  ...tr,
                  transactionHash: tr.txHash,
                } as any as State.Transaction
                return (
                  <TransactionItem
                    address=""
                    transaction={transaction}
                    key={tr.txHash}
                    circleCorner={{
                      bottom: false,
                    }}
                  />
                )
              })}
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

export const CellInfo = ({ cell }: { cell: State.Cell }) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <TransactionCellInfoPanel>
      <SimpleButton
        className="transaction__cell__info__content"
        onClick={() => {
          setShowModal(true)
        }}
      >
        <InfoMoreIcon />
      </SimpleButton>
      <SimpleModal isShow={showModal} setIsShow={setShowModal}>
        <TransactionCellDetailModal>
          <TransactionCellScript cell={cell} onClose={() => setShowModal(false)} txStatus="committed" />
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
  const history = useHistory()
  const { codeHash, hashType } = useParams<{ codeHash: string; hashType: string }>()

  const cellsQuery = useQuery([`scripts_${cellType}`, codeHash, hashType, page, size], async () => {
    const { data, meta } = await v2AxiosIns
      .get(`scripts/${cellType}`, {
        params: {
          code_hash: codeHash,
          hash_type: hashType,
          page,
          page_size: size,
        },
      })
      .then((res: AxiosResponse) =>
        toCamelcase<Response.Response<{ deployedCells?: CellInScript[]; referringCells?: CellInScript[] }>>(res.data),
      )
    const camelCellType = camelcase(cellType) as 'deployedCells' | 'referringCells'
    if (data == null) {
      throw new Error('Fetch Cells null')
    }
    const cells = data[camelCellType]!
    if (cells == null || cells.length === 0) {
      throw new Error('Cells empty')
    }
    return {
      total: meta?.total ?? 0,
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
                  <th align="left">{i18n.t('transaction.transaction')}</th>
                  <th>{i18n.t('scripts.index')}</th>
                  <th align="left">{i18n.t('transaction.capacity')}</th>
                  <th align="right">{i18n.t('scripts.cell_info')}</th>
                </tr>
              </thead>
              <tbody>
                {data.cells.map(record => {
                  return (
                    <tr key={`${record.txHash}_${record.cellIndex}`}>
                      <td align="left">
                        <AddressText
                          disableTooltip
                          className="transaction_item__hash"
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
                          <CellInfo cell={record as any as State.Cell} />
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
  const dispatch = useDispatch()
  return (
    <div className={styles.codeHashMessagePanel}>
      <AddressText className={styles.codeHash}>{codeHash}</AddressText>

      <CopyIcon
        onClick={() => {
          navigator.clipboard.writeText(codeHash).then(
            () => {
              dispatch({
                type: AppActions.ShowToastMessage,
                payload: {
                  message: i18n.t('common.copied'),
                },
              })
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
