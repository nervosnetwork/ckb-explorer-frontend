import React, { useState, useContext, useEffect } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import AppContext from '../../contexts/App'

import Content from '../../components/Content'
import SimpleLabel from '../../components/Label'
import i18n from '../../utils/i18n'
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
import { parseSimpleDate } from '../../utils/date'
import { Response } from '../../http/response/Response'
import { Transaction, InputOutput, TransactionWrapper } from '../../http/response/Transaction'
import { CellType, fetchTransactionByHash } from '../../http/fetcher'
import { copyElementValue } from '../../utils/util'
import CellCard from '../../components/Card/CellCard'
import ScriptComponent from './Script'
import { localeNumberString } from '../../utils/number'

const TransactionTitle = ({ hash }: { hash: string }) => {
  const appContext = useContext(AppContext)
  return (
    <TransactionTitlePanel>
      <div className="transaction__title">{i18n.t('transaction.transaction')}</div>
      <div className="transaction__content">
        <code id="transaction__hash">{hash}</code>
        <div
          role="button"
          tabIndex={-1}
          onKeyDown={() => {}}
          onClick={() => {
            copyElementValue(document.getElementById('transaction__hash'))
            appContext.toastMessage(i18n.t('common.copied'), 3000)
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
          <div>{i18n.t('common.detail')}</div>
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
  is_cellbase: false,
  target_block_number: 0,
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

export default (props: React.PropsWithoutRef<RouteComponentProps<{ hash: string }>>) => {
  const { match } = props
  const { params } = match
  const { hash } = params
  const [transaction, setTransaction] = useState(initTransaction)

  useEffect(() => {
    getTransaction(hash, setTransaction)
  }, [hash, setTransaction])

  return (
    <Content>
      <TransactionDiv className="container">
        <TransactionTitle hash={hash} />
        <TransactionOverviewLabel>{i18n.t('common.overview')}</TransactionOverviewLabel>
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
                  label={`${i18n.t('common.blockheight')}:`}
                  value={localeNumberString(transaction.block_number)}
                  highLight
                />
              </Link>
              <SimpleLabel
                image={TransactionIcon}
                label={`${i18n.t('common.transactionfee')}:`}
                value={`${transaction.transaction_fee} Shannon`}
              />
            </div>
            <div>
              <div />
              <div>
                <SimpleLabel
                  image={TimestampIcon}
                  label={`${i18n.t('common.timestamp')}:`}
                  value={parseSimpleDate(transaction.block_timestamp)}
                />
              </div>
            </div>
          </div>
        </TransactionCommonContent>

        <CellPanelPC>
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
                  transaction.display_inputs.map((input: InputOutput) => {
                    return input && <ScriptComponent cellType={CellType.Input} key={input.id} cellInputOutput={input} />
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
          {transaction &&
            transaction.display_inputs &&
            transaction.display_inputs.map((input: InputOutput, index: number) => {
              const key = index
              return <CellCard type={CellType.Input} cell={input} key={key} />
            })}
          {transaction &&
            transaction.display_outputs &&
            transaction.display_outputs.map((output: InputOutput, index: number) => {
              const key = index
              return <CellCard type={CellType.Output} cell={output} key={key} />
            })}
        </CellPanelMobile>
      </TransactionDiv>
    </Content>
  )
}
