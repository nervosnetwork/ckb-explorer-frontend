import React, { useState, useEffect } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import Content from '../../components/Content'
import i18n from '../../utils/i18n'
import { TransactionDiv, InputPanelDiv, OutputPanelDiv, InputOutputTable, TransactionBlockHeightPanel } from './styled'
// import BlockHeightIcon from '../../assets/block_height_green.png'
// import TimestampIcon from '../../assets/timestamp_green.png'
// import TransactionIcon from '../../assets/transaction_fee.png'
// import StatusIcon from '../../assets/transcation_status.png'
import { parseSimpleDate } from '../../utils/date'
import { CellType, fetchTransactionByHash, fetchTipBlockNumber } from '../../service/http/fetcher'
import { formatConfirmation, shannonToCkb } from '../../utils/util'
import CellCard from '../../components/Card/CellCard'
import ScriptComponent from './Script'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import AddressHashCard from '../../components/Card/AddressHashCard'
import TitleCard from '../../components/Card/TitleCard'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TransactionCellList from './TransactionCellList'

const InputOutputTableTitle = ({ transactionType, isCellbase }: { transactionType: string; isCellbase?: boolean }) => {
  return (
    <thead>
      <tr>
        <td colSpan={1}>{transactionType}</td>
        {!isCellbase ? (
          <td>
            <div>Capacity</div>
          </td>
        ) : (
          <td>
            <div />
          </td>
        )}
        <td colSpan={3}>
          <div>{i18n.t('common.detail')}</div>
        </td>
      </tr>
    </thead>
  )
}

const initTransaction: State.Transaction = {
  transaction_hash: '',
  block_number: 0,
  block_timestamp: 0,
  transaction_fee: 0,
  is_cellbase: false,
  target_block_number: 0,
  version: 0,
  display_inputs: [],
  display_outputs: [],
}

const getTransaction = (hash: string, setTransaction: any, replace: any) => {
  fetchTransactionByHash(hash)
    .then((wrapper: Response.Wrapper<State.Transaction>) => {
      if (wrapper) {
        const transactionValue = wrapper.attributes
        if (transactionValue.display_outputs && transactionValue.display_outputs.length > 0) {
          transactionValue.display_outputs[0].isGenesisOutput = transactionValue.block_number === 0
        }
        setTransaction(transactionValue)
      } else {
        replace(`/search/fail?q=${hash}`)
      }
    })
    .catch(() => {
      replace(`/search/fail?q=${hash}`)
    })
}

const getTipBlockNumber = (setTipBlockNumber: any) => {
  fetchTipBlockNumber().then((wrapper: Response.Wrapper<State.Statistics>) => {
    if (wrapper) {
      setTipBlockNumber(parseInt(wrapper.attributes.tip_block_number, 10))
    }
  })
}

const TransactionBlockHeight = ({ blockNumber }: { blockNumber: number }) => {
  return (
    <TransactionBlockHeightPanel>
      <Link to={`/block/${blockNumber}`}>{localeNumberString(blockNumber)}</Link>
    </TransactionBlockHeightPanel>
  )
}

export default (props: React.PropsWithoutRef<RouteComponentProps<{ hash: string }>>) => {
  const { match, history } = props
  const { params } = match
  const { hash } = params
  const { replace } = history
  const [transaction, setTransaction] = useState(initTransaction)
  const [tipBlockNumber, setTipBlockNumber] = useState(0)
  let confirmation = 0
  if (tipBlockNumber && transaction.block_number) {
    confirmation = tipBlockNumber - transaction.block_number + 1
  }

  useEffect(() => {
    getTransaction(hash, setTransaction, replace)
  }, [hash, setTransaction, replace])

  useEffect(() => {
    getTipBlockNumber(setTipBlockNumber)
  }, [setTipBlockNumber])

  const overviewItems: OverviewItemData[] = [
    {
      key: '',
      title: i18n.t('block.block_height'),
      content: <TransactionBlockHeight blockNumber={transaction.block_number} />,
    },
    {
      key: '',
      title: i18n.t('block.timestamp'),
      content: parseSimpleDate(transaction.block_timestamp),
    },
    {
      key: '',
      title: i18n.t('transaction.transaction_fee'),
      content: `${shannonToCkb(transaction.transaction_fee)} CKB`,
    },
    {
      key: '',
      title: i18n.t('transaction.status'),
      content: formatConfirmation(confirmation),
    },
  ]

  return (
    <Content>
      <TransactionDiv className="container">
        <AddressHashCard title={i18n.t('transaction.transaction')} hash={hash} />
        <TitleCard title={i18n.t('common.overview')} />
        <OverviewCard items={overviewItems} />

        <TransactionCellList />

        {isMobile() ? (
          <div>
            {transaction &&
              transaction.display_inputs &&
              transaction.display_inputs.map((input: State.InputOutput, index: number) => {
                const key = index
                return <CellCard type={CellType.Input} cell={input} key={key} />
              })}
            {transaction &&
              transaction.display_outputs &&
              transaction.display_outputs.map((output: State.InputOutput, index: number) => {
                const key = index
                return <CellCard type={CellType.Output} cell={output} key={key} />
              })}
          </div>
        ) : (
          <div>
            <InputPanelDiv>
              <InputOutputTable>
                {
                  <InputOutputTableTitle
                    transactionType={i18n.t('transaction.input')}
                    isCellbase={
                      transaction.display_inputs &&
                      transaction.display_inputs[0] &&
                      transaction.display_inputs[0].from_cellbase
                    }
                  />
                }
                <tbody>
                  {transaction &&
                    transaction.display_inputs &&
                    transaction.display_inputs.map((input: State.InputOutput) => {
                      return input && <ScriptComponent cellType={CellType.Input} key={input.id} cell={input} />
                    })}
                </tbody>
              </InputOutputTable>
            </InputPanelDiv>

            <OutputPanelDiv>
              <InputOutputTable>
                <InputOutputTableTitle transactionType={i18n.t('transaction.output')} />
                <tbody>
                  {transaction &&
                    transaction.display_outputs &&
                    transaction.display_outputs.map((output: State.InputOutput) => {
                      return output && <ScriptComponent cellType={CellType.Output} key={output.id} cell={output} />
                    })}
                </tbody>
              </InputOutputTable>
            </OutputPanelDiv>
          </div>
        )}
      </TransactionDiv>
    </Content>
  )
}
