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
import CopyGreenIcon from '../../assets/copy_green.png'
import CopyIcon from '../../assets/copy.png'
import { parseSimpleDate } from '../../utils/date'
import { Response } from '../../http/response/Response'
import { Transaction, InputOutput, TransactionWrapper } from '../../http/response/Transaction'
import { Script, ScriptWrapper } from '../../http/response/Script'
import { Data } from '../../http/response/Data'
import { CellType, fetchTransactionByHash, fetchScript, fetchCellData } from '../../http/fetcher'
import { copyElementValue, shannonToCkb } from '../../utils/util'
import { hexToUtf8, parseLongAddressHash } from '../../utils/string'
import browserHistory from '../../routes/history'
import CellCard from '../../components/Card/CellCard'

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
    code_hash: '',
    args: [],
  }
  const [script, setScript] = useState(initScript)
  const initCellData: Data = {
    data: '',
  }
  const [cellData, setCellData] = useState(initCellData)

  const AddressHashComponent = () => {
    return cellInputOutput.address_hash ? (
      <Link to={`/address/${cellInputOutput.address_hash}`}>
        <code>{parseLongAddressHash(cellInputOutput.address_hash)}</code>
      </Link>
    ) : (
      <div
        style={{
          color: '#888888',
          fontWeight: 'bold',
        }}
      >
        Unable to decode address
      </div>
    )
  }

  return (
    <>
      <tr className="tr-brief">
        <td>
          {cellInputOutput.from_cellbase ? (
            <div
              style={{
                color: '#888888',
                fontWeight: 'bold',
              }}
            >
              Cellbase
            </div>
          ) : (
            <AddressHashComponent />
          )}
        </td>
        {!cellInputOutput.from_cellbase ? <td>{shannonToCkb(cellInputOutput.capacity)}</td> : <td />}
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
                    fetchScript(cellType, 'lock_scripts', cellInputOutput.id).then(json => {
                      const { data } = json as Response<ScriptWrapper>
                      setScript(data ? data.attributes : initScript)
                      updateCellData(cellType, cellInputOutput.id, newCellInputOutput)
                    })
                  } else if (item === 'Type Script') {
                    fetchScript(cellType, 'type_scripts', cellInputOutput.id).then(json => {
                      const { data } = json as Response<ScriptWrapper>
                      setScript(data ? data.attributes : initScript)
                      updateCellData(cellType, cellInputOutput.id, newCellInputOutput)
                    })
                  } else {
                    fetchCellData(cellType, cellInputOutput.id).then((data: any) => {
                      const dataValue = data
                      if (data && cellInputOutput.isGenesisOutput) {
                        dataValue.data = hexToUtf8(data.data.substr(2))
                      }
                      setCellData(dataValue || initCellData)
                      updateCellData(cellType, cellInputOutput.id, newCellInputOutput)
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
              id={`textarea-${cellType}-${cellInputOutput.id}`}
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
                  const textarea = document.getElementById(
                    `textarea-${cellType}-${cellInputOutput.id}`,
                  ) as HTMLTextAreaElement
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
    fetchTransactionByHash(hash)
      .then(json => {
        const { data, error } = json as Response<TransactionWrapper>
        if (error) {
          browserHistory.push(`/search/fail?q=${hash}`)
        } else {
          const transactionValue = data.attributes as Transaction
          if (transactionValue.display_outputs && transactionValue.display_outputs.length > 0) {
            transactionValue.display_outputs[0].isGenesisOutput = transactionValue.block_number === 0
          }
          setTransaction(transactionValue)
        }
      })
      .catch(() => {
        appContext.toastMessage('Network exception, please try again later', 3000)
      })
  }

  useEffect(() => {
    getTransaction()
  }, [window.location.href])

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
                <SimpleLabel image={BlockHeightIcon} label="Block Height:" value={transaction.block_number} highLight />
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
                    return (
                      input && (
                        <ScriptComponent
                          cellType={CellType.Input}
                          key={input.id}
                          cellInputOutput={input}
                          scriptType={input.select || null}
                          updateCellData={updateCellData}
                        />
                      )
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
                  transaction.display_outputs &&
                  transaction.display_outputs.map((output: InputOutput) => {
                    return (
                      output && (
                        <ScriptComponent
                          cellType={CellType.Output}
                          key={output.id}
                          cellInputOutput={output}
                          scriptType={output.select || null}
                          updateCellData={updateCellData}
                        />
                      )
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
