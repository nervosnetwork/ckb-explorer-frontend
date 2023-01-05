import { useState, useEffect, ReactNode, useMemo } from 'react'
import { useHistory } from 'react-router'
import { Button, Space, Table } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
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
import QueryState from '../../components/QueryState'
import { localeNumberString } from '../../utils/number'
import DecimalCapacity from '../../components/DecimalCapacity'
import { CellInScript, CkbTransactionInScript } from './types'
import styles from './styles.module.scss'

export const ScriptTransactions = ({
  page,
  size,
  updateCount,
}: {
  page: number
  size: number
  updateCount: (count: number) => void
}) => {
  const history = useHistory()
  const { codeHash, hashType } = useParams<{ codeHash: string; hashType: string }>()

  const [total, setTotal] = useState(0)
  const totalPage = useMemo(() => Math.ceil(total / size), [size, total])
  const [items, setItems] = useState<CkbTransactionInScript[]>([])

  const { status, data: resp } = useQuery<AxiosResponse>(
    ['scripts_ckb_transactions', codeHash, hashType, page, size],
    () =>
      v2AxiosIns.get(`scripts/ckb_transactions`, {
        params: {
          code_hash: codeHash,
          hash_type: hashType,
          page,
          page_size: size,
        },
      }),
  )

  useEffect(() => {
    if (status === 'success' && resp) {
      const response = toCamelcase<Response.Response<{ ckbTransactions: CkbTransactionInScript[] }>>(resp?.data)

      const { data } = response!
      setItems(data.ckbTransactions)

      const meta = response!.meta as Response.Meta
      const total = meta ? meta.total : 0
      setTotal(total)
      updateCount(total)
    }
  }, [status, resp, updateCount])

  const onChange = (page: number) => {
    history.push(`/scripts/${codeHash}/${hashType}?page=${page}&size=${size}`)
  }

  return (
    <QueryState status={status}>
      <div className={styles.scriptTransactionsPanel}>
        {items &&
          items.map(item => {
            const transaction = {
              ...item,
              transactionHash: item.txHash,
            } as any as State.Transaction
            return (
              <TransactionItem
                address=""
                transaction={transaction}
                key={item.txHash}
                circleCorner={{
                  bottom: false,
                }}
              />
            )
          })}
      </div>
      {totalPage > 1 && (
        <div className={styles.scriptTransactionsPagination}>
          <Pagination currentPage={page} totalPages={totalPage} onChange={onChange} />
        </div>
      )}
    </QueryState>
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
  updateCount,
}: {
  page: number
  size: number
  cellType: 'deployed_cells' | 'referring_cells'
  updateCount: (count: number) => void
}) => {
  const history = useHistory()
  const { codeHash, hashType } = useParams<{ codeHash: string; hashType: string }>()

  const [total, setTotal] = useState(0)
  const totalPage = useMemo(() => Math.ceil(total / size), [size, total])
  const [items, setItems] = useState<CellInScript[]>([])
  const camelCellType = camelcase(cellType) as 'deployedCells' | 'referringCells'

  const { status, data: resp } = useQuery<AxiosResponse>([`scripts_${cellType}`, codeHash, hashType, page, size], () =>
    v2AxiosIns.get(`scripts/${cellType}`, {
      params: {
        code_hash: codeHash,
        hash_type: hashType,
        page,
        page_size: size,
      },
    }),
  )

  useEffect(() => {
    if (status === 'success' && resp) {
      const response = toCamelcase<
        Response.Response<{ deployedCells?: CellInScript[]; referringCells?: CellInScript[] }>
      >(resp?.data)

      const { data } = response!
      if (data[camelCellType]) {
        setItems(data[camelCellType]!)
      }

      const meta = response!.meta as Response.Meta
      const total = meta ? meta.total : 0
      setTotal(total)
      updateCount(total)
    }
  }, [status, resp, updateCount, camelCellType])

  const onChange = (page: number) => {
    history.push(`/script/${codeHash}/${hashType}/${cellType}?page=${page}&size=${size}`)
  }

  return (
    <QueryState status={status}>
      <div className={styles.scriptTransactionsPanel}>
        <Table
          pagination={false}
          dataSource={items}
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
                    <Button icon={<InfoCircleOutlined />} size="middle" />
                  </CellInfo>
                </Space>
              ),
            },
          ]}
        />
      </div>
      {totalPage > 1 && (
        <div className={styles.scriptTransactionsPagination}>
          <Pagination currentPage={page} totalPages={totalPage} onChange={onChange} />
        </div>
      )}
    </QueryState>
  )
}
