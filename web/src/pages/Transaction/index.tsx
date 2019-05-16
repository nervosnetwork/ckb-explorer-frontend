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
  InputOutputTable,
  TransactionTitlePanel,
  TransactionCommonContent,
} from './styled'

import BlockHeightIcon from '../../asserts/block_height_green.png'
import TimestampIcon from '../../asserts/timestamp_green.png'
import TransactionIcon from '../../asserts/transaction_fee.png'
import CopyGreenIcon from '../../asserts/copy_green.png'
import CopyIcon from '../../asserts/copy.png'
import { parseSimpleDate } from '../../utils/date'
import { Response } from '../../http/response/Response'
import { Transaction, InputOutput, TransactionWrapper } from '../../http/response/Transaction'
import { Script, ScriptWrapper } from '../../http/response/Script'
import { Data } from '../../http/response/Data'
import { CellType, fetchTransactionByHash, fetchScript, fetchCellData } from '../../http/fetcher'
import { copyElementValue, shannonToCkb, hexToUtf8 } from '../../utils/util'
import browserHistory from '../../routes/history'

const ScriptTypeItems = ['Lock Script', 'Type Script', 'Data']

const ScriptComponent = ({
  cellType,
  cellInputOutput,
  scriptType = null,
  updateCellData,
}: {
  cellType: CellType
  cellInputOutput: any
  scriptType?: string | null
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
        <td>
          {
            cellInputOutput.address_hash? (
              <Link to={`/address/${cellInputOutput.address_hash}`}>{cellInputOutput.address_hash}</Link>
            ) : (
              <div style={{color: '#888888'}}>Unable to decode address</div>
            )
          }
        </td>
        <td>{shannonToCkb(cellInputOutput.capacity)}</td>
        {ScriptTypeItems.map(item => {
          let className = 'td-operatable'
          if (cellInputOutput.select === item) {
            className += ' td-operatable-active '
          }
          if (cellInputOutput.from_cellbase) {
            className += ' td-operatable-disabled '
          }
          return (
            <td key={item}>
              <div
                role="button"
                tabIndex={-1}
                className={className}
                onKeyPress={() => {}}
                onClick={() => {
                  if (cellInputOutput.from_cellbase) return
                  const newCellInputOutput = {
                    ...cellInputOutput,
                  }
                  newCellInputOutput.select = newCellInputOutput.select === item ? null : item
                  if (item === 'Lock Script') {
                    appContext.showLoading()
                    fetchScript(cellType, 'lock_scripts', cellInputOutput.id)
                      .then(json => {
                        const { data } = json as Response<ScriptWrapper>
                        setScript(data? data.attributes : initScript)
                        updateCellData(cellType, cellInputOutput.id, newCellInputOutput)
                        appContext.hideLoading()
                      })
                      .catch(() => {
                        appContext.hideLoading()
                      })
                  } else if (item === 'Type Script') {
                    appContext.showLoading()
                    fetchScript(cellType, 'type_scripts', cellInputOutput.id)
                      .then(json => {
                        const { data } = json as Response<ScriptWrapper>
                        setScript(data? data.attributes : initScript)
                        updateCellData(cellType, cellInputOutput.id, newCellInputOutput)
                        appContext.hideLoading()
                      })
                      .catch(() => {
                        appContext.hideLoading()
                      })
                  } else {
                    appContext.showLoading()
                    fetchCellData(cellType, cellInputOutput.id)
                      .then(data => {
                        if (data && cellInputOutput.isUTF8) {
                          data.data = hexToUtf8(data.data.substr(2))
                        }
                        setCellData(data? data : initCellData)
                        updateCellData(cellType, cellInputOutput.id, newCellInputOutput)
                        appContext.hideLoading()
                      })
                      .catch(() => {
                        appContext.hideLoading()
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
          <td colSpan={5}>
            <textarea
              id="textarea"
              value={JSON.stringify(scriptType === 'Data' ? cellData : script, null, 4)}
              readOnly
            />
            <div className="tr-detail-td-buttons">
              <div
                role="button"
                tabIndex={-1}
                className="td-operatable"
                onKeyPress={() => {}}
                onClick={() => {
                  const textarea = document.getElementById('textarea') as HTMLTextAreaElement
                  textarea.select()
                  document.execCommand('Copy')
                  window.getSelection().removeAllRanges()
                  appContext.toastMessage('Copied', 3000)
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

const TransactionTitle = ({ hash }: { hash: string }) => {
  const appContext = useContext(AppContext)
  return (
    <TransactionTitlePanel>
      <div className="transaction__title">Transaction</div>
      <div className="transaction__content">
        <div id="transaction__hash">{hash}</div>
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

const InputOutputTableTitle = ({ transactionType }: { transactionType: string }) => {
  return (
    <thead>
      <tr>
        <td colSpan={1}>{transactionType}</td>
        <td>
          <div>Capacity</div>
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
    block_number: 0,
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
        if (item.id === cellId) {
          newState[`display_${cellType}s`][i] = newCellInputOutput
        }
      })
      return newState
    })
  }

  const getTransaction = () => {
    appContext.showLoading()
    fetchTransactionByHash(hash)
      .then(json => {
        const { data, error } = json as Response<TransactionWrapper>
        if (error) {
          browserHistory.push(`/search/fail?q=${hash}`)
        } else {
          const transaction = data.attributes as Transaction
          if (transaction.display_outputs && transaction.display_outputs.length > 0) {
            transaction.display_outputs[0].isUTF8 = (transaction.block_number === 0)
          } 
          setTransaction(data.attributes as Transaction)
        }
        appContext.hideLoading()
      })
      .catch(() => {
        appContext.hideLoading()
        browserHistory.push(`/search/fail?q=${hash}`)
      })
  }

  useEffect(() => {
    getTransaction()
  }, [])

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
                <SimpleLabel image={BlockHeightIcon} label="Block Height:" value={transaction.block_number} highLight/>
              </Link>
              <SimpleLabel image={TransactionIcon} label="Transaction Fee:" value={`${transaction.transaction_fee} CKB`} />
            </div>
            <div>
              <div />
              <div>
                <SimpleLabel
                  image={TimestampIcon}
                  label="Timestamp:"
                  value={parseSimpleDate(transaction.block_timestamp)}
                />
              </div>
            </div>
          </div>
        </TransactionCommonContent>

        <InputPanelDiv>
          <InputOutputTable>
            <InputOutputTableTitle transactionType="Input" />
            <tbody>
              {transaction && transaction.display_inputs &&
                transaction.display_inputs.map((input: InputOutput) => {
                  return input &&
                    <ScriptComponent
                      cellType={CellType.Input}
                      key={input.id}
                      cellInputOutput={input}
                      scriptType={input.select || null}
                      updateCellData={updateCellData}
                    />
                })}
            </tbody>
          </InputOutputTable>
        </InputPanelDiv>

        <OutputPanelDiv>
          <InputOutputTable>
            <InputOutputTableTitle transactionType="Output" />
            <tbody>
              {transaction && transaction.display_outputs &&
                transaction.display_outputs.map((output: InputOutput) => {
                  return (output &&
                    <ScriptComponent
                      cellType={CellType.Output}
                      key={output.id}
                      cellInputOutput={output}
                      scriptType={output.select || null}
                      updateCellData={updateCellData}
                    />
                  )
                })}
            </tbody>
          </InputOutputTable>
        </OutputPanelDiv>
      </TransactionDiv>
    </Content>
  )
}
