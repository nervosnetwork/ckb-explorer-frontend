import { useState, useEffect, ReactNode } from 'react'
import { useHistory } from 'react-router'
import { Button, Space, Table } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import Pagination from '../../components/Pagination'
import TransactionItem from '../../components/TransactionItem/index'
import { fetchTransactionByHash } from '../../service/http/fetcher'
import i18n from '../../utils/i18n'
import { ScriptTransactionsPagination, ScriptTransactionsPanel } from './styled'
import { initTransactionState } from '../../contexts/states/transaction'
import { TransactionCellDetailModal, TransactionCellInfoPanel } from '../Transaction/TransactionCell/styled'
import SimpleButton from '../../components/SimpleButton'
import SimpleModal from '../../components/Modal'
import TransactionCellScript from '../Transaction/TransactionCellScript'
import { ScriptInfo, ScriptPageInfo } from './index'

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
  scriptInfo,
  ckbTransaction,
}: {
  scriptInfo: ScriptInfo
  ckbTransaction: ScriptPageInfo<any>
}) => {
  const history = useHistory()
  const totalPages = Math.ceil(ckbTransaction.total / ckbTransaction.size)

  const onChange = (page: number) => {
    history.replace(`/scripts/${scriptInfo.codeHash}/${scriptInfo.hashType}?page=${page}&size=${ckbTransaction.size}`)
  }

  return (
    <>
      <ScriptTransactionsPanel>
        {ckbTransaction.data.map((transaction: any) => {
          const { txHash } = transaction
          return <ScriptTransactionItem txHash={txHash} key={txHash} />
        })}
      </ScriptTransactionsPanel>
      {totalPages > 1 && (
        <ScriptTransactionsPagination>
          <Pagination currentPage={ckbTransaction.page} totalPages={totalPages} onChange={onChange} />
        </ScriptTransactionsPagination>
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
  scriptInfo,
  cell,
  anchor,
}: {
  scriptInfo: ScriptInfo
  cell: ScriptPageInfo<any>
  anchor: string
}) => {
  const history = useHistory()
  const totalPages = Math.ceil(cell.total / cell.size)

  const onChange = (page: number) => {
    history.replace(`/script/${scriptInfo.codeHash}/${scriptInfo.hashType}?page=${page}&size=${cell.size}#${anchor}`)
  }

  return (
    <>
      <ScriptTransactionsPanel>
        <Table
          pagination={false}
          dataSource={cell.data}
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
      {totalPages > 1 && (
        <ScriptTransactionsPagination>
          <Pagination currentPage={cell.page} totalPages={totalPages} onChange={onChange} />
        </ScriptTransactionsPagination>
      )}
    </>
  )
}
