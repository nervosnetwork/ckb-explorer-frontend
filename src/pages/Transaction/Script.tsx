import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../contexts/providers/index'
import CopyGreenIcon from '../../assets/copy_green.png'
import { fetchScript, fetchCellData } from '../../service/http/fetcher'
import { shannonToCkb, copyElementValue } from '../../utils/util'
import { hexToUtf8, parseLongAddressHash } from '../../utils/string'
import { localeNumberString } from '../../utils/number'
import i18n from '../../utils/i18n'
import { ScriptState, CellType } from '../../utils/const'
import initCell from '../../contexts/states/components/cell'
import { AppDispatch, AppActions, ComponentActions } from '../../contexts/providers/reducer'

const ScriptTypeItems = ['Lock Script', 'Type Script', 'Data']
const scriptStateWithItem = (item: string) => {
  if (item === ScriptTypeItems[0]) {
    return ScriptState.LOCK
  }
  if (item === ScriptTypeItems[1]) {
    return ScriptState.TYPE
  }
  if (item === ScriptTypeItems[2]) {
    return ScriptState.DATA
  }
  return ScriptState.NONE
}
const getScriptState = (state: any, item: string) => {
  const scriptState = scriptStateWithItem(item)
  return scriptState === state.cellState ? ScriptState.NONE : scriptState
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

const ScriptComponent = ({
  cellType,
  cell,
  dispatch,
}: {
  cellType: CellType
  cell: State.InputOutput
  dispatch: AppDispatch
}) => {
  const { cellState } = useContext(AppContext)
  const handleCopy = () => {
    copyElementValue(document.getElementById(`textarea-${cellType}-${cell.id}`))
    dispatch({
      type: AppActions.ShowToastMessage,
      payload: {
        text: i18n.t('common.copied'),
        timeout: 3000,
      },
    })
  }

  const handleCellState = (item: string) => {
    dispatch({
      type: ComponentActions.CellScript,
      payload: {
        cellState: getScriptState(cellState, item),
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
    switch (getScriptState(cellState, item)) {
      case ScriptState.LOCK:
        fetchScript(cellType, 'lock_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<State.Script>) => {
          handleCellState(item)
          showScriptContent(wrapper ? wrapper.attributes : initCell.lock)
        })
        break
      case ScriptState.TYPE:
        fetchScript(cellType, 'type_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<State.Script>) => {
          handleCellState(item)
          showScriptContent(wrapper ? wrapper.attributes : initCell.type)
        })
        break
      case ScriptState.DATA:
        fetchCellData(cellType, `${cell.id}`).then((wrapper: Response.Wrapper<State.Data>) => {
          const dataValue: State.Data = wrapper.attributes
          if (wrapper && cell.isGenesisOutput) {
            dataValue.data = hexToUtf8(wrapper.attributes.data.substr(2))
          }
          handleCellState(item)
          showScriptContent(dataValue || initCell.data)
        })
        break
      default:
        handleCellState(item)
        break
    }
  }

  const operationClassName = (item: string) => {
    const scriptState = scriptStateWithItem(item)
    if (cell.from_cellbase) {
      return 'td-operatable-disabled'
    }
    if (cellState.scriptState === scriptState) {
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
      {cellState.scriptState !== ScriptState.NONE && (
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
