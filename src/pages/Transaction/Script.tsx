import React, { useContext, useReducer } from 'react'
import { Link } from 'react-router-dom'
import AppContext from '../../contexts/App'
import CopyGreenIcon from '../../assets/copy_green.png'
import { CellType, fetchScript, fetchCellData } from '../../service/http/fetcher'
import { shannonToCkb, copyElementValue } from '../../utils/util'
import { hexToUtf8, parseLongAddressHash } from '../../utils/string'
import { localeNumberString } from '../../utils/number'
import i18n from '../../utils/i18n'

enum CellState {
  NONE,
  LOCK,
  TYPE,
  DATA,
}
const initScriptContent = {
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
}

const initialState = {
  cellState: CellState.NONE,
}
const Actions = {
  cellState: 'CELL_STATE',
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case Actions.cellState:
      return {
        ...state,
        cellState: action.payload.cellState,
      }
    default:
      return state
  }
}

const ScriptTypeItems = ['Lock Script', 'Type Script', 'Data']
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

const AddressHashComponent = ({ cell }: { cell: State.InputOutput }) => {
  return cell.address_hash ? (
    <Link to={`/address/${cell.address_hash}`}>
      <code>{parseLongAddressHash(cell.address_hash)}</code>
    </Link>
  ) : (
    <div className="address__bold__grey">{i18n.t('address.unable_decode_address')}</div>
  )
}

const ScriptComponent = ({ cellType, cell }: { cellType: CellType; cell: State.InputOutput }) => {
  const appContext = useContext(AppContext)
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleCopy = () => {
    copyElementValue(document.getElementById(`textarea-${cellType}-${cell.id}`))
    appContext.toastMessage(i18n.t('common.copied'), 3000)
  }

  const handleCellState = (item: string) => {
    dispatch({
      type: Actions.cellState,
      payload: {
        cellState: getCellState(state, item),
      },
    })
  }

  const showScriptContent = (content: any) => {
    const element = document.getElementById(`textarea-${cellType}-${cell.id}`)
    if (element) {
      element.innerHTML = JSON.stringify(content, null, 4)
    }
  }

  const handleFetchScript = (item: string) => {
    if (cell.from_cellbase) return
    switch (getCellState(state, item)) {
      case CellState.LOCK:
        fetchScript(cellType, 'lock_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<State.Script>) => {
          handleCellState(item)
          showScriptContent(wrapper ? wrapper.attributes : initScriptContent.lock)
        })
        break
      case CellState.TYPE:
        fetchScript(cellType, 'type_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<State.Script>) => {
          handleCellState(item)
          showScriptContent(wrapper ? wrapper.attributes : initScriptContent.type)
        })
        break
      case CellState.DATA:
        fetchCellData(cellType, `${cell.id}`).then((wrapper: Response.Wrapper<State.Data>) => {
          const dataValue: State.Data = wrapper.attributes
          if (wrapper && cell.isGenesisOutput) {
            dataValue.data = hexToUtf8(wrapper.attributes.data.substr(2))
          }
          handleCellState(item)
          showScriptContent(dataValue || initScriptContent.data)
        })
        break
      default:
        handleCellState(item)
        break
    }
  }

  const operationClassName = (item: string) => {
    const cellState = cellStateWithItem(item)
    if (cell.from_cellbase) {
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
          {cell.from_cellbase ? (
            <div className="address__bold__grey">Cellbase</div>
          ) : (
            <AddressHashComponent cell={cell} />
          )}
        </td>
        {!cell.from_cellbase ? <td>{localeNumberString(shannonToCkb(cell.capacity))}</td> : <td />}
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
            <div className="script__input" id={`textarea-${cellType}-${cell.id}`} />
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
