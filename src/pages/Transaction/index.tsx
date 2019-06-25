import React, { useState, useContext, useEffect, useReducer } from 'react'
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
import { ScriptWrapper } from '../../http/response/Script'
import { CellType, fetchTransactionByHash, fetchScript, fetchCellData } from '../../http/fetcher'
import { copyElementValue, shannonToCkb } from '../../utils/util'
import { hexToUtf8, parseLongAddressHash } from '../../utils/string'
import CellCard from '../../components/Card/CellCard'

enum CellState {
  NONE,
  LOCK,
  TYPE,
  DATA,
}
const initialState = {
  lock: {
    code_hash: '',
    args: [],
  },
  type: {
    code_hash: '',
    args: [],
  },
  data: {
    data: '',
  },
  cellState: CellState.NONE,
}
const Actions = {
  lock: 'LOCK',
  type: 'TYPE',
  data: 'DATA',
  cellState: 'CELL_STATE',
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case Actions.lock:
      return {
        ...state,
        lock: action.payload.lock,
      }
    case Actions.type:
      return {
        ...state,
        type: action.payload.type,
      }
    case Actions.data:
      return {
        ...state,
        data: action.payload.data,
      }
    case Actions.cellState:
      return {
        ...state,
        cellState: action.payload.cellState,
      }
    default:
      return state
  }
}

const getCell = (state: any) => {
  switch (state.cellState) {
    case CellState.LOCK:
      return state.lock
    case CellState.TYPE:
      return state.type
    case CellState.DATA:
      return state.data
    case CellState.NONE:
      return ''
    default:
      return ''
  }
}

const ScriptTypeItems = ['Lock Script', 'Type Script', 'Data']
const getCellState = (state: any, item: string) => {
  let cellState: CellState = CellState.NONE
  if (item === ScriptTypeItems[0]) {
    cellState = CellState.LOCK
  } else if (item === ScriptTypeItems[1]) {
    cellState = CellState.TYPE
  } else if (item === ScriptTypeItems[2]) {
    cellState = CellState.DATA
  }
  return cellState === state.cellState ? CellState.NONE : cellState
}

const ScriptComponent = ({ cellType, cellInputOutput }: { cellType: CellType; cellInputOutput: any }) => {
  const appContext = useContext(AppContext)
  const [state, dispatch] = useReducer(reducer, initialState)

  const AddressHashComponent = () => {
    return cellInputOutput.address_hash ? (
      <Link to={`/address/${cellInputOutput.address_hash}`}>
        <code>{parseLongAddressHash(cellInputOutput.address_hash)}</code>
      </Link>
    ) : (
      <div className="address__bold__grey">Unable to decode address</div>
    )
  }

  const handleCopy = () => {
    const textarea = document.getElementById(`textarea-${cellType}-${cellInputOutput.id}`) as HTMLTextAreaElement
    textarea.select()
    document.execCommand('Copy')
    window.getSelection()!.removeAllRanges()
    appContext.toastMessage('Copied', 3000)
  }

  const handleFetchScript = (item: string) => {
    if (cellInputOutput.from_cellbase) return
    dispatch({
      type: Actions.cellState,
      payload: {
        cellState: getCellState(state, item),
      },
    })
    switch (state.cellState) {
      case CellState.LOCK:
        fetchScript(cellType, 'lock_scripts', cellInputOutput.id).then(response => {
          const { data } = response as Response<ScriptWrapper>
          dispatch({
            type: Actions.lock,
            payload: {
              lock: data ? data.attributes : initialState.lock,
            },
          })
        })
        break
      case CellState.TYPE:
        fetchScript(cellType, 'type_scripts', cellInputOutput.id).then(response => {
          const { data } = response as Response<ScriptWrapper>
          dispatch({
            type: Actions.type,
            payload: {
              type: data ? data.attributes : initialState.type,
            },
          })
        })
        break
      case CellState.DATA:
        fetchCellData(cellType, cellInputOutput.id).then((data: any) => {
          const dataValue = data
          if (data && cellInputOutput.isGenesisOutput) {
            dataValue.data = hexToUtf8(data.data.substr(2))
          }
          dispatch({
            type: Actions.data,
            payload: {
              data: dataValue || initialState.data,
            },
          })
        })
        break
      default:
        break
    }
  }

  return (
    <>
      <tr className="tr-brief">
        <td>
          {cellInputOutput.from_cellbase ? (
            <div className="address__bold__grey">Cellbase</div>
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
                onClick={() => handleFetchScript(item)}
              >
                {item}
              </div>
            </td>
          )
        })}
      </tr>
      {state.cellState !== CellState.NONE ? (
        <tr className="tr-detail">
          <td colSpan={5}>
            <textarea
              id={`textarea-${cellType}-${cellInputOutput.id}`}
              value={JSON.stringify(getCell(state), null, 4)}
              readOnly
            />
            <div className="tr-detail-td-buttons">
              <div
                role="button"
                tabIndex={-1}
                className="td-operatable"
                onKeyPress={() => {}}
                onClick={() => handleCopy()}
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
