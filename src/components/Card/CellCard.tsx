import React, { useContext, useReducer } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import AppContext from '../../contexts/App'
import CopyGreenIcon from '../../assets/copy_green.png'
import { InputOutput } from '../../http/response/Transaction'
import { startEndEllipsis, hexToUtf8 } from '../../utils/string'
import { shannonToCkb, copyElementValue } from '../../utils/util'
import { CellType, fetchScript, fetchCellData } from '../../http/fetcher'
import { ScriptWrapper } from '../../http/response/Script'
import { Response } from '../../http/response/Response'
import { localeNumberString } from '../../utils/number'
import i18n from '../../utils/i18n'

const CardPanel = styled.div`
  width: 88%;
  background-color: white;
  padding: 20px;
  border: 0px solid white;
  border-radius: 3px;
  box-shadow: 2px 2px 6px #eaeaea;
  display: flex;
  margin-bottom: 10px;
  margin-left: 6%;
  flex-direction: column;
`

const CardItemPanel = styled.div`
  display: flex;
  margin-top: 10px;
  align-items: center;

  .card__name {
    color: #888888;
    font-size: 14px;
    margin-right: 8px;
  }

  .card__value__link {
    height: 23px;
  }

  .card__value {
    color: ${(props: { highLight: boolean }) => (props.highLight ? '#3CC68A' : '#888888')};
    font-weight: 450;
    font-size: 14px;
  }

  @media (max-width: 320px) {
    .card__name {
      font-size: 13px;
      margin-right: 6px;
    }

    .card__value {
      font-size: 12px;
    }
  }
`

const ScriptPanel = styled.div`
  margin-top: 10px;

  .script__operation {
    display: flex;
    width: 100%;

    .script__detail {
      font-size: 14px;
      color: #888888;
      height: 20px;
      flex: 1;
    }

    .script__buttons {
      display: flex;
      flex: 3;
      justify-content: space-between;
    }
  }

  .script__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .script__input {
      border: none;
      width: 100%;
      word-wrap: break-word;
      white-space: pre-wrap;
      padding: 12px;
      font-size: 12px;
      color: #888888;
      font-weight: bold;
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
      margin-top: 6px;
      min-height: 120px;
      background-color: #f9f9f9;
      border-radius: 6px 6px;
      transform: translateZ(0);
    }

    .script__copy {
      width: 90px;
      height: 25px;
      margin-top: 20px;
      text-align: center;
      border-radius: 2px 2px;
      display: flex;
      border: 1px solid #4bbc8e;
      background-color: #4bbc8e;
      justify-content: center;
      align-items: center;

      > div {
        color: white;
        font-szie: 12px;
        @media (max-width: 320px) {
          font-size: 11px;
        }
      }

      img {
        margin-left: 5px;
        width: 14px;
        height: 16px;
      }
    }
  }
`

const CellOperationButtonPanel = styled.div`
  font-size: 14px;
  height: 25px;
  font-weight: bold;
  color: ${(props: { color: string }) => props.color};

  @media (max-width: 320px) {
    font-size: 12px;
  }
`

const bottomLineStyle = {
  borderBottom: '2px solid #4bbc8e',
}
const noneStyle = {
  border: '0px',
}

const CardLabelItem = ({
  name,
  value,
  to,
  highLight = false,
}: {
  name: string
  value: string
  to?: string
  highLight?: boolean
}) => {
  return (
    <CardItemPanel highLight={highLight}>
      <div className="card__name">{name}</div>
      {to ? (
        <Link to={to} className="card__value__link">
          <code className="card__value">{value}</code>
        </Link>
      ) : (
        <div className="card__value">{value}</div>
      )}
    </CardItemPanel>
  )
}

const CellAddressCapacityItem = ({ type, cell }: { type: CellType; cell: InputOutput }) => {
  const name = type === CellType.Input ? 'Input' : 'Output'
  const Capacity = () => <CardLabelItem name="Capacity" value={localeNumberString(shannonToCkb(cell.capacity))} />

  if (cell.from_cellbase) {
    return (
      <div key={cell.id}>
        <CardLabelItem name={name} value="Cellbase" />
        <Capacity />
      </div>
    )
  }
  if (cell.address_hash) {
    return (
      <div key={cell.id}>
        <CardLabelItem
          name={name}
          value={`${startEndEllipsis(cell.address_hash)}`}
          to={`/address/${cell.address_hash}`}
          highLight
        />
        <Capacity />
      </div>
    )
  }
  return (
    <div key={cell.id}>
      <CardLabelItem name={name} value={i18n.t('common.unabledecode')} />
      <Capacity />
    </div>
  )
}

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

const getCellState = (state: any, cellState: CellState) => {
  return cellState === state.cellState ? CellState.NONE : cellState
}

const CellScriptItem = ({ cellType, cell }: { cellType: CellType; cell: InputOutput }) => {
  const appContext = useContext(AppContext)
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleCopy = () => {
    const textarea = document.getElementById(`script__textarea__${cell.id}`)
    copyElementValue(textarea)
    appContext.toastMessage('Copied', 3000)
  }

  const handleCellState = (cellState: CellState) => {
    dispatch({
      type: Actions.cellState,
      payload: {
        cellState: getCellState(state, cellState),
      },
    })
  }

  const handleFetchScript = (cellState: CellState) => {
    if (cell.from_cellbase) return
    switch (getCellState(state, cellState)) {
      case CellState.LOCK:
        fetchScript(cellType, 'lock_scripts', `${cell.id}`).then(response => {
          const { data } = response as Response<ScriptWrapper>
          handleCellState(cellState)
          dispatch({
            type: Actions.lock,
            payload: {
              lock: data ? data.attributes : initialState.lock,
            },
          })
        })
        break
      case CellState.TYPE:
        fetchScript(cellType, 'type_scripts', `${cell.id}`).then(response => {
          const { data } = response as Response<ScriptWrapper>
          handleCellState(cellState)
          dispatch({
            type: Actions.type,
            payload: {
              type: data ? data.attributes : initialState.type,
            },
          })
        })
        break
      case CellState.DATA:
        fetchCellData(cellType, `${cell.id}`).then((data: any) => {
          const dataValue = data
          if (data && cell.isGenesisOutput) {
            dataValue.data = hexToUtf8(data.data.substr(2))
          }
          handleCellState(cellState)
          dispatch({
            type: Actions.data,
            payload: {
              data: dataValue || initialState.data,
            },
          })
        })
        break
      default:
        handleCellState(cellState)
        break
    }
  }

  const CellOperationButton = ({ value, cellState }: { value: string; cellState: CellState }) => {
    return (
      <CellOperationButtonPanel
        color={cell.from_cellbase ? '#888888' : '#4bbc8e'}
        style={cellState === state.cellState ? bottomLineStyle : noneStyle}
        role="button"
        tabIndex={-1}
        onKeyPress={() => {}}
        onClick={() => handleFetchScript(cellState)}
      >
        {value}
      </CellOperationButtonPanel>
    )
  }

  return (
    <ScriptPanel>
      <div className="script__operation">
        <div className="script__detail">Detail</div>
        <div className="script__buttons">
          <CellOperationButton value={i18n.t('transaction.lockscript')} cellState={CellState.LOCK} />
          <CellOperationButton value={i18n.t('transaction.typescript')} cellState={CellState.TYPE} />
          <CellOperationButton value={i18n.t('transaction.data')} cellState={CellState.DATA} />
        </div>
      </div>

      {state.cellState !== CellState.NONE && (
        <div className="script__content">
          <div className="script__input" id={`script__textarea__${cell.id}`}>
            {JSON.stringify(getCell(state), null, 4)}
          </div>
          <div className="script__copy" role="button" tabIndex={-1} onKeyPress={() => {}} onClick={() => handleCopy()}>
            <div>Copy</div>
            <img src={CopyGreenIcon} alt="copy" />
          </div>
        </div>
      )}
    </ScriptPanel>
  )
}

const CellCard = ({ type, cell }: { type: CellType; cell: InputOutput }) => {
  return (
    <CardPanel>
      <CellAddressCapacityItem type={type} cell={cell} />
      <CellScriptItem cellType={type} cell={cell} />
    </CardPanel>
  )
}

export default CellCard
