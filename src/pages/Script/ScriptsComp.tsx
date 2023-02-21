import { useState, ReactNode } from 'react'
import { useHistory } from 'react-router'
import { Button, Space, Table } from 'antd'
import { CopyOutlined, InfoCircleFilled } from '@ant-design/icons'
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

export const CellInfo = ({ cell, children }: { cell: State.Cell; children: string | ReactNode }) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <TransactionCellInfoPanel>
      <SimpleButton
        className="transaction__cell__info__content"
        onClick={() => {
          setShowModal(true)
        }}
      >
        <div>{children}</div>
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
          <div className={styles.scriptTransactionsPanel}>
            <Table
              pagination={false}
              dataSource={data.cells}
              rowKey={record => `${record.txHash}_${record.cellIndex}`}
              columns={[
                {
                  title: i18n.t('transaction.transactions'),
                  dataIndex: 'txHash',
                  key: 'txHash',
                  render: (_, record) => (
                    <a href={`/transaction/${record.txHash}`}>
                      <span className="transaction_item__hash monospace">{record.txHash}</span>
                    </a>
                  ),
                },
                {
                  title: 'Index',
                  dataIndex: 'cellIndex',
                  key: 'cellIndex',
                },
                {
                  title: i18n.t('transaction.capacity'),
                  dataIndex: 'capacity',
                  key: 'capacity',
                  render: (_, record) => <DecimalCapacity value={localeNumberString(shannonToCkb(record.capacity))} />,
                },
                {
                  title: 'Cell Info',
                  key: 'Cell Info',
                  render: (_, record) => (
                    <Space size="middle">
                      <CellInfo cell={record as any as State.Cell}>
                        <Button
                          icon={<InfoCircleFilled />}
                          size="middle"
                          style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: 'black' }}
                        />
                      </CellInfo>
                    </Space>
                  ),
                },
              ]}
            />
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
      <AddressText monospace={false}>{codeHash}</AddressText>
      <span
        style={{
          marginLeft: '1rem',
        }}
      >
        <CopyOutlined
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
      </span>
    </div>
  )
}
