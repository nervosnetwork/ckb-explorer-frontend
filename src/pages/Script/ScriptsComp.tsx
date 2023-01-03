import { useState, useEffect, ReactNode, Dispatch, SetStateAction, useMemo } from 'react'
import { useHistory } from 'react-router'
import { Button, Space, Table } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useQuery } from 'react-query'
import { AxiosResponse } from 'axios'
import camelcase from 'camelcase'
import { useParams } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import TransactionItem from '../../components/TransactionItem/index'
import { fetchTransactionByHash, v2AxiosIns } from '../../service/http/fetcher'
import i18n from '../../utils/i18n'
import { ScriptTransactionsPagination, ScriptTransactionsPanel } from './styled'
import { initTransactionState } from '../../contexts/states/transaction'
import { TransactionCellDetailModal, TransactionCellInfoPanel } from '../Transaction/TransactionCell/styled'
import SimpleButton from '../../components/SimpleButton'
import SimpleModal from '../../components/Modal'
import TransactionCellScript from '../Transaction/TransactionCellScript'
import { ScriptInfo, ScriptTabType } from './index'
import { toCamelcase } from '../../utils/util'
import QueryState from '../../components/QueryState'

export const ScriptTransactionItem = ({ txHash }: { txHash: string }) => {
  const [transaction, setTransaction] = useState<State.Transaction>(initTransactionState.transaction)

  useEffect(() => {
    fetchTransactionByHash(txHash)
      .then((wrapper: Response.Wrapper<State.Transaction> | null) => {
        if (wrapper) {
          const transactionValue = wrapper.attributes
          if (transactionValue.displayOutputs && transactionValue.displayOutputs.length > 0) {
            transactionValue.displayOutputs[0].isGenesisOutput = transactionValue.blockNumber === 0
          }
          setTransaction(transactionValue)
        } else {
          setTransaction(initTransactionState.transaction)
        }
      })
      .catch(() => {
        setTransaction(initTransactionState.transaction)
      })
  }, [txHash])

  return (
    transaction && (
      <TransactionItem
        address=""
        transaction={transaction}
        key={txHash}
        circleCorner={{
          bottom: false,
        }}
      />
    )
  )
}

export const ScriptTransactions = ({
  page,
  size,
  setScriptInfo,
}: {
  page: number
  size: number
  setScriptInfo: Dispatch<SetStateAction<ScriptInfo>>
}) => {
  const history = useHistory()
  const { codeHash, hashType, tab } = useParams<{ codeHash: string; hashType: string; tab: ScriptTabType }>()

  const [total, setTotal] = useState(0)
  const totalPage = useMemo(() => Math.ceil(total / size), [size, total])
  const [items, setItems] = useState([])

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
      const response = toCamelcase<Response.Response<Response.Wrapper<any[]>>>(resp?.data)

      const data = response!.data as any
      const meta = response!.meta as Response.Meta
      const total = meta ? meta.total : 0
      setTotal(total)

      setScriptInfo(si => {
        const newSi = {
          ...si,
          scriptName: data.scriptName,
          scriptType: data.scriptType,
          typeId: data.TypeId,
          capacityOfDeployedCells: data.capacityOfDeployedCells,
          capacityOfReferringCells: data.capacityOfReferringCells,
        }
        if (!tab || tab === 'transactions') {
          newSi.ckbTransactions = {
            ...si.ckbTransactions,
            total,
          }
        }
        return newSi
      })

      setItems(data.ckbTransactions)
    }
  }, [size, resp, setScriptInfo, status, tab])

  const onChange = (page: number) => {
    history.push(`/scripts/${codeHash}/${hashType}?page=${page}&size=${size}`)
  }

  return (
    <QueryState status={status}>
      <ScriptTransactionsPanel>
        {items &&
          items.map((transaction: any) => {
            const { txHash } = transaction
            return <ScriptTransactionItem txHash={txHash} key={txHash} />
          })}
      </ScriptTransactionsPanel>
      {totalPage > 1 && (
        <ScriptTransactionsPagination>
          <Pagination currentPage={page} totalPages={totalPage} onChange={onChange} />
        </ScriptTransactionsPagination>
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
  setScriptInfo,
  cellType,
}: {
  page: number
  size: number
  setScriptInfo: Dispatch<SetStateAction<ScriptInfo>>
  cellType: 'deployed_cells' | 'referring_cells'
}) => {
  const history = useHistory()
  const { codeHash, hashType, tab } = useParams<{ codeHash: string; hashType: string; tab: ScriptTabType }>()

  const [total, setTotal] = useState(0)
  const totalPage = useMemo(() => Math.ceil(total / size), [size, total])
  const [items, setItems] = useState<any>([])

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
      const response = toCamelcase<Response.Response<Response.Wrapper<any[]>>>(resp?.data)

      const data = response!.data as any
      const meta = response!.meta as Response.Meta
      const total = meta ? meta.total : 0
      setTotal(total)

      setScriptInfo(si => {
        const newSi = {
          ...si,
          scriptName: data.scriptName,
          scriptType: data.scriptType,
          typeId: data.TypeId,
          capacityOfDeployedCells: data.capacityOfDeployedCells,
          capacityOfReferringCells: data.capacityOfReferringCells,
        } as any
        if (cellType === tab) {
          newSi[`${camelcase(cellType)}`] = {
            page,
            size,
            total,
          }
        }
        return newSi
      })

      setItems(data[camelcase(cellType) as string])
    }
  }, [cellType, size, resp, setScriptInfo, status, page, tab])

  const onChange = (page: number) => {
    history.push(`/script/${codeHash}/${hashType}/${cellType}?page=${page}&size=${size}`)
  }

  return (
    <QueryState status={status}>
      <ScriptTransactionsPanel>
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
            },
            {
              title: 'Cell Info',
              key: 'Cell Info',
              render: (_, record) => (
                <Space size="middle">
                  <CellInfo cell={record}>
                    <Button icon={<InfoCircleOutlined />} size="middle" />
                  </CellInfo>
                </Space>
              ),
            },
          ]}
        />
      </ScriptTransactionsPanel>
      {totalPage > 1 && (
        <ScriptTransactionsPagination>
          <Pagination currentPage={page} totalPages={totalPage} onChange={onChange} />
        </ScriptTransactionsPagination>
      )}
    </QueryState>
  )
}
