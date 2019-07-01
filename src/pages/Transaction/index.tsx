import React, { useState, useContext, useEffect } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import AppContext from '../../contexts/App'

import Content from '../../components/Content'
import SimpleLabel from '../../components/Label'
import {
  TransactionDiv,
  TransactionOverviewLabel,
  InputPanelDiv,
  OutputPanelDiv,
  CellPanelPC,
  CellPanelMobile,
  InputOutputTable,
  TransactionTitlePanel,
  TransactionCommonContent,
} from './styled'

import BlockHeightIcon from '../../assets/block_height_green.png'
import TimestampIcon from '../../assets/timestamp_green.png'
import TransactionIcon from '../../assets/transaction_fee.png'
import CopyIcon from '../../assets/copy.png'
import StatusIcon from '../../assets/transcation_status.png'
import { parseSimpleDate } from '../../utils/date'
import { Response } from '../../http/response/Response'
import { Transaction, InputOutput, TransactionWrapper } from '../../http/response/Transaction'
import { CellType, fetchTransactionByHash, fetchStatistics } from '../../http/fetcher'
import { copyElementValue, formattorConfirmation } from '../../utils/util'
import CellCard from '../../components/Card/CellCard'
import ScriptComponent from './Script'
import { StatisticsWrapper } from '../../http/response/Statistics'
import { localeNumberString } from '../../utils/number'

const TransactionTitle = ({ hash }: { hash: string }) => {
  const appContext = useContext(AppContext)
  return (
    <TransactionTitlePanel>
      <div className="transaction__title">Transaction</div>
      <div className="transaction__content">
        <code id="transaction__hash">{hash}</code>
        <div
          role="button"
          tabIndex={-1}
          onKeyDown={() => {}}
          onClick={() => {
            copyElementValue(document.getElementById('transaction__hash'))
            appContext.toastMessage('Copied', 3000)
          }}
        >
          <img src={CopyIcon} alt="copy" />
        </div>
      </div>
    </TransactionTitlePanel>
  )
}

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
          <div>Detail</div>
        </td>
      </tr>
    </thead>
  )
}

const initTransaction: Transaction = {
  transaction_hash: '',
  block_number: 0,
  block_timestamp: 0,
  transaction_fee: 0,
  version: 0,
  display_inputs: [],
  display_outputs: [],
}

const getTransaction = (hash: string, setTransaction: any) => {
  fetchTransactionByHash(hash).then(response => {
    const { data } = response as Response<TransactionWrapper>
    const transactionValue = data.attributes as Transaction
    if (transactionValue.display_outputs && transactionValue.display_outputs.length > 0) {
      transactionValue.display_outputs[0].isGenesisOutput = transactionValue.block_number === 0
    }
    setTransaction(transactionValue)
  })
}

const getTipBlockNumber = (setTipBlockNumber: any) => {
  fetchStatistics().then(response => {
    const { data } = response as Response<StatisticsWrapper>
    if (data) {
      setTipBlockNumber(parseInt(data.attributes.tip_block_number, 10))
    }
  })
}

export default (props: React.PropsWithoutRef<RouteComponentProps<{ hash: string }>>) => {
  const { match } = props
  const { params } = match
  const { hash } = params
  const [transaction, setTransaction] = useState(initTransaction)
  const [tipBlockNumber, setTipBlockNumber] = useState(0)
  const confirmation = tipBlockNumber - transaction.block_number

  useEffect(() => {
    getTransaction(hash, setTransaction)
  }, [hash, setTransaction])

  useEffect(() => {
    getTipBlockNumber(setTipBlockNumber)
  }, [setTipBlockNumber])

  return (
    <Content>
      <TransactionDiv className="container">
        <TransactionTitle hash={hash} />
        <TransactionOverviewLabel>Overview</TransactionOverviewLabel>
        <TransactionCommonContent>
          <div>
            <div>
              <Link
                to={{
                  pathname: `/block/${transaction.block_number}`,
                }}
              >
                <SimpleLabel
                  image={BlockHeightIcon}
                  label="Block Height:"
                  value={localeNumberString(transaction.block_number)}
                  highLight
                />
              </Link>
              <SimpleLabel
                image={TransactionIcon}
                label="Transaction Fee:"
                value={`${transaction.transaction_fee} Shannon`}
              />
            </div>
            <div>
              <div />
              <div>
                <SimpleLabel
                  image={TimestampIcon}
                  label="Timestamp:"
                  value={parseSimpleDate(transaction.block_timestamp)}
                />
                {confirmation > 0 && (
                  <SimpleLabel image={StatusIcon} label="Status:" value={formattorConfirmation(confirmation)} />
                )}
              </div>
            </div>
          </div>
        </TransactionCommonContent>

        <CellPanelPC>
          <InputPanelDiv>
            <InputOutputTable>
              {
                <InputOutputTableTitle
                  transactionType="Input"
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
                  transaction.display_inputs.map((input: InputOutput) => {
                    return input && <ScriptComponent cellType={CellType.Input} key={input.id} cellInputOutput={input} />
                  })}
              </tbody>
            </InputOutputTable>
          </InputPanelDiv>

          <OutputPanelDiv>
            <InputOutputTable>
              <InputOutputTableTitle transactionType="Output" />
              <tbody>
                {transaction &&
                  transaction.display_outputs &&
                  transaction.display_outputs.map((output: InputOutput) => {
                    return (
                      output && <ScriptComponent cellType={CellType.Output} key={output.id} cellInputOutput={output} />
                    )
                  })}
              </tbody>
            </InputOutputTable>
          </OutputPanelDiv>
        </CellPanelPC>
        <CellPanelMobile>
          {transaction.display_inputs.map((input: InputOutput, index: number) => {
            const key = index
            return <CellCard type={CellType.Input} cell={input} key={key} />
          })}
          {transaction.display_outputs.map((output: InputOutput, index: number) => {
            const key = index
            return <CellCard type={CellType.Output} cell={output} key={key} />
          })}
        </CellPanelMobile>
      </TransactionDiv>
    </Content>
  )
}
