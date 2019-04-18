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
import TransactionIcon from '../../asserts/transaction_green.png'
import VersionIcon from '../../asserts/version.png'
import CopyGreenIcon from '../../asserts/copy_green.png'
import CopyIcon from '../../asserts/copy.png'
import { parseSimpleDate } from '../../utils/date'
import { Transaction } from '../../http/response/Transaction'
import { Script } from '../../http/response/Script'
import { Data } from '../../http/response/Data'
import { fetchTransactionByHash, fetchScript, fetchCellData } from '../../http/fetcher'
import { copyDivValue } from '../../utils/util'

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
        <td>{`#${cellInputOutput.id}`}</td>
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
                  if (item === 'Lock Script') {
                    fetchScript().then(data => {
                      setScript(data as Script)
                      updateCellData(cellType, cellInputOutput.id, newCellInputOutput)
                    })
                  } else if (item === 'Type Script') {
                    fetchScript().then(data => {
                      setScript(data as Script)
                      updateCellData(cellType, cellInputOutput.id, newCellInputOutput)
                    })
                  } else {
                    fetchCellData().then(data => {
                      setCellData(data as Data)
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
          <td />
          <td colSpan={5}>
            <textarea
              id={`textarea-${cellType}${+'-'}${cellInputOutput.id}`}
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
                    `textarea-${cellType}${+'-'}${cellInputOutput.id}`,
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
            copyDivValue(document.getElementById('transaction__hash'))
            appContext.toastMessage('copy success', 3000)
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
        if (item.id === cellId) {
          newState[`display_${cellType}s`][i] = newCellInputOutput
        }
      })
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
    <Content>
      <TransactionDiv className="container">
        <TransactionTitle hash={hash} />
        <TransactionOverviewLabel>Overview</TransactionOverviewLabel>
        <TransactionCommonContent>
          <div>
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
                      key={input.id}
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
                      key={ouput.id}
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
  )
}
