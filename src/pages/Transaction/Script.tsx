import React, { useContext, useReducer } from 'react'
import { Link } from 'react-router-dom'
import AppContext from '../../contexts/App'
import CopyGreenIcon from '../../assets/copy_green.png'
import { Response } from '../../http/response/Response'
import { ScriptWrapper } from '../../http/response/Script'
import { CellType, fetchScript, fetchCellData } from '../../http/fetcher'
import { shannonToCkb } from '../../utils/util'
import { hexToUtf8, parseLongAddressHash } from '../../utils/string'
import { localeNumberString } from '../../utils/number'
import i18n from '../../utils/i18n'

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

const ScriptTypeItems = [i18n.t('transaction.lockscript'), i18n.t('transaction.typescript'), i18n.t('transaction.data')]
const cellStateWithItem = (item: string) => {
  if (item === ScriptTypeItems[0]) {
    return CellState.LOCK
  }
  if (item === ScriptTypeItems[1]) {
    return CellState.TYPE
  }
  if (item === ScriptTypeItems[2]) {
    return CellState.DATA
  }
  return CellState.NONE
}
const getCellState = (state: any, item: string) => {
  const cellState = cellStateWithItem(item)
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
      <div className="address__bold__grey">{i18n.t('common.unabledecode')}</div>
    )
  }

  const handleCopy = () => {
    const textarea = document.getElementById(`textarea-${cellType}-${cellInputOutput.id}`) as HTMLTextAreaElement
    textarea.select()
    document.execCommand('Copy')
    window.getSelection()!.removeAllRanges()
    appContext.toastMessage('Copied', 3000)
  }

  const handleCellState = (item: string) => {
    dispatch({
      type: Actions.cellState,
      payload: {
        cellState: getCellState(state, item),
      },
    })
  }

  const handleFetchScript = (item: string) => {
    if (cellInputOutput.from_cellbase) return
    switch (getCellState(state, item)) {
      case CellState.LOCK:
        fetchScript(cellType, 'lock_scripts', cellInputOutput.id).then(response => {
          const { data } = response as Response<ScriptWrapper>
          handleCellState(item)
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
          handleCellState(item)
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
          handleCellState(item)
          dispatch({
            type: Actions.data,
            payload: {
              data: dataValue || initialState.data,
            },
          })
        })
        break
      default:
        handleCellState(item)
        break
    }
  }

  const operationClassName = (item: string) => {
    const cellState = cellStateWithItem(item)
    if (cellInputOutput.from_cellbase) {
      return 'td-operatable-disabled'
    }
    if (state.cellState === cellState) {
      return 'td-operatable-active'
    }
    return 'td-operatable'
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
        {!cellInputOutput.from_cellbase ? (
          <td>{localeNumberString(shannonToCkb(cellInputOutput.capacity))}</td>
        ) : (
          <td />
        )}
        {ScriptTypeItems.map(item => {
          return (
            <td key={item}>
              <div
                role="button"
                tabIndex={-1}
                className={operationClassName(item)}
                onKeyPress={() => {}}
                onClick={() => handleFetchScript(item)}
              >
                {item}
              </div>
            </td>
          )
        })}
      </tr>
      {state.cellState !== CellState.NONE && (
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
      )}
    </>
  )
}

export default ScriptComponent
