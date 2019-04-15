import React, { useState, useContext, useEffect } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import AppContext from '../../contexts/App'

import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import SimpleLabel from '../../components/Label'
import {
  TransactionDiv,
  TransactionOverviewLabel,
  InputPanelDiv,
  OutputPanelDiv,
  InputOutputTable,
  TransactionTitlePanel,
  TransactionCommonContent,
} from './styled'

import BlockHeightIcon from '../../asserts/block_height_green.png'
import TimestampIcon from '../../asserts/timestamp_green.png'
import TransactionIcon from '../../asserts/transaction_green.png'
import VersionIcon from '../../asserts/version.png'
import CopyGreenIcon from '../../asserts/copy_green.png'
import CopyIcon from '../../asserts/copy.png'
import { parseSimpleDate } from '../../utils/date'
import { Transaction } from '../../http/response/Transaction'
import { Script } from '../../http/response/Script'
import { Data } from '../../http/response/Data'
import { fetchTransactionByHash, fetchScript, fetchCellData } from '../../http/fetcher'

const ScriptTypeItems = ['Lock Script', 'Type Script', 'Data']

const ScriptComponent = ({
  cellType,
  cellInputOutput,
  scriptType = null,
  updateCellData,
}: {
  cellType: 'input' | 'output'
  cellInputOutput: any
  scriptType?: 'Lock Script' | 'Type Script' | 'Data' | null
  updateCellData: Function
}) => {
  const appContext = useContext(AppContext)
  const initScript: Script = {
    binary_hash: '',
    args: [],
  }
  const [script, setScript] = useState(initScript)
  const initCellData: Data = {
    data: '',
  }
  const [cellData, setCellData] = useState(initCellData)

  return (
    <>
      <tr className="tr-brief">
        <td>{`#${cellInputOutput[`${cellType}_id`]}`}</td>
        <td>
          <Link to={`/address/${cellInputOutput.address_hash}`}>{cellInputOutput.address_hash}</Link>
        </td>
        <td>{cellInputOutput.capacity}</td>
        {ScriptTypeItems.map(item => {
          let className = 'td-operatable'
          if (cellInputOutput.select === item) {
            className += ' td-operatable-active '
          }
          return (
            <td key={item}>
              <div
                role="button"
                tabIndex={-1}
                className={className}
                onKeyPress={() => {}}
                onClick={() => {
                  const newCellInputOutput = {
                    ...cellInputOutput,
                  }
                  newCellInputOutput.select = newCellInputOutput.select === item ? null : item
                  console.log(`onClick: ${JSON.stringify(newCellInputOutput)}`)
                  if (item === 'Lock Script') {
                    fetchScript().then(data => {
                      setScript(data as Script)
                      updateCellData(cellType, cellInputOutput[`${cellType}_id`], newCellInputOutput)
                      console.log('Lock Script')
                    })
                  } else if (item === 'Type Script') {
                    fetchScript().then(data => {
                      setScript(data as Script)
                      updateCellData(cellType, cellInputOutput[`${cellType}_id`], newCellInputOutput)
                    })
                  } else {
                    fetchCellData().then(data => {
                      setCellData(data as Data)
                      updateCellData(cellType, cellInputOutput[`${cellType}_id`], newCellInputOutput)
                      console.log(`Data: ${JSON.stringify(cellData)}`)
                    })
                  }
                }}
              >
                {item}
              </div>
            </td>
          )
        })}
      </tr>
      {scriptType ? (
        <tr className="tr-detail">
          <td />
          <td colSpan={5}>
            <textarea
              id={`textarea-${cellType}${+'-'}${cellInputOutput[`${cellType}_id`]}`}
              defaultValue={JSON.stringify(script.binary_hash ? script : cellData, null, 4)}
              value={JSON.stringify(script.binary_hash ? script : cellData, null, 4)}
            />
            <div className="tr-detail-td-buttons">
              <div
                role="button"
                tabIndex={-1}
                className="td-operatable"
                onKeyPress={() => {}}
                onClick={() => {
                  const textarea = document.getElementById(
                    `textarea-${cellType}${+'-'}${cellInputOutput[`${cellType}_id`]}`,
                  ) as HTMLTextAreaElement
                  textarea.select()
                  document.execCommand('copy')
                  appContext.toastMessage('copy success', 3000)
                }}
              >
                <div>Copy</div>
                <img src={CopyGreenIcon} alt="copy" />
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  )
}

const TransactionTitle = ({ hash, onClick }: { hash: string; onClick: any }) => {
  return (
    <TransactionTitlePanel>
      <div className="transaction__title">Transaction</div>
      <div className="transaction__content">
        <div id="transaction__hash">{hash}</div>
        <div role="button" tabIndex={-1} onKeyDown={() => {}} onClick={onClick}>
          <img src={CopyIcon} alt="copy" />
        </div>
      </div>
    </TransactionTitlePanel>
  )
}

const InputOutputTableTitle = ({ transactionType }: { transactionType: string }) => {
  return (
    <thead>
      <tr>
        <td colSpan={2}>{transactionType}</td>
        <td>
          <div>Capcity</div>
        </td>
        <td colSpan={3}>
          <div>Detail</div>
        </td>
      </tr>
    </thead>
  )
}

export default (props: React.PropsWithoutRef<RouteComponentProps<{ hash: string }>>) => {
  const { match } = props
  const { params } = match
  const { hash } = params

  const appContext = useContext(AppContext)
  const initTransaction: Transaction = {
    transaction_hash: '',
    block_number: '',
    block_timestamp: 0,
    transaction_fee: 0,
    version: 0,
    display_inputs: [],
    display_outputs: [],
  }
  const [transaction, setTransaction] = useState(initTransaction)

  const updateCellData = (cellType: string, cellId: number, newCellInputOutput: any) => {
    setTransaction((state: any) => {
      const newState: any = {
        ...state,
      }
      newState[`display_${cellType}s`].forEach((item: any, i: number) => {
        if (item[`${cellType}_id`] === cellId) {
          newState[`display_${cellType}s`][i] = newCellInputOutput
        }
      })
      console.log(`updateCellData: ${JSON.stringify(newState)}`)
      return newState
    })
  }

  const getTransaction = () => {
    fetchTransactionByHash(hash).then(data => {
      setTransaction(data as Transaction)
    })
  }

  useEffect(() => {
    getTransaction()
  }, [])

  return (
    <Page>
      <Header />
      <Content>
        <TransactionDiv className="container">
          <TransactionTitle
            hash={hash}
            onClick={() => {
              const transactionDiv = document.getElementById('transaction__hash')
              if (transactionDiv) {
                const div = document.createRange()
                div.setStartBefore(transactionDiv)
                div.setEndAfter(transactionDiv)
                window.getSelection().addRange(div)
                document.execCommand('copy')
                appContext.toastMessage('copy success', 3000)
              }
            }}
          />
          <TransactionOverviewLabel>Overview</TransactionOverviewLabel>
          <TransactionCommonContent>
            <div>
              <SimpleLabel image={BlockHeightIcon} label="Block Height:" value={transaction.block_number} />
              <SimpleLabel image={TransactionIcon} label="Transaction Fee:" value={transaction.transaction_fee} />
            </div>
            <span className="block__content__separate" />
            <div>
              <SimpleLabel
                image={TimestampIcon}
                label="Timestamp:"
                value={parseSimpleDate(transaction.block_timestamp)}
              />
              <SimpleLabel image={VersionIcon} label="Version:" value={parseSimpleDate(transaction.version)} />
            </div>
          </TransactionCommonContent>

          <InputPanelDiv>
            <InputOutputTable>
              <InputOutputTableTitle transactionType="Input" />
              <tbody>
                {transaction &&
                  transaction.display_inputs.map((input: any) => {
                    return (
                      <ScriptComponent
                        cellType="input"
                        key={input.input_id}
                        cellInputOutput={input}
                        scriptType={input.select || null}
                        updateCellData={updateCellData}
                      />
                    )
                  })}
              </tbody>
            </InputOutputTable>
          </InputPanelDiv>

          <OutputPanelDiv>
            <InputOutputTable>
              <InputOutputTableTitle transactionType="Output" />
              <tbody>
                {transaction &&
                  transaction.display_outputs.map((ouput: any) => {
                    return (
                      <ScriptComponent
                        cellType="output"
                        key={ouput.output_id}
                        cellInputOutput={ouput}
                        scriptType={ouput.select || null}
                        updateCellData={updateCellData}
                      />
                    )
                  })}
              </tbody>
            </InputOutputTable>
          </OutputPanelDiv>
        </TransactionDiv>
      </Content>
      <Footer />
    </Page>
  )
}
