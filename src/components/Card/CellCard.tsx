import React, { useContext, useReducer } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import AppContext from '../../contexts/App'
import CopyGreenIcon from '../../assets/copy_green.png'
import { InputOutput } from '../../service/response/Transaction'
import { startEndEllipsis, hexToUtf8 } from '../../utils/string'
import { shannonToCkb, copyElementValue } from '../../utils/util'
import { CellType, fetchScript, fetchCellData } from '../../service/fetcher'
import { ScriptWrapper } from '../../service/response/Script'
import { Data } from '../../service/response/Data'
import { Response } from '../../service/response/Response'
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
      max-height: 400px;
      overflow-y: auto;
      word-wrap: break-word;
      white-space: pre-wrap;
      word-break: break-all;
      padding: 12px;
      font-size: 12px;
      color: #888888;
      font-weight: bold;
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
      margin-top: 6px;
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

const Capacity = ({ cell }: { cell: InputOutput }) => (
  <CardLabelItem name="Capacity" value={localeNumberString(shannonToCkb(cell.capacity))} />
)
const CellAddressCapacityItem = ({ type, cell }: { type: CellType; cell: InputOutput }) => {
  const name = type === CellType.Input ? 'Input' : 'Output'

  if (cell.from_cellbase) {
    return (
      <div key={cell.id}>
        <CardLabelItem name={name} value="Cellbase" />
        <Capacity cell={cell} />
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
        <Capacity cell={cell} />
      </div>
    )
  }
  return (
    <div key={cell.id}>
      <CardLabelItem name={name} value={i18n.t('address.unable_decode_address')} />
      <Capacity cell={cell} />
    </div>
  )
}

const MAX_DATA_SIZE = 10 * 1024

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

const getCellState = (state: any, cellState: CellState) => {
  return cellState === state.cellState ? CellState.NONE : cellState
}

const CellScriptItem = ({ cellType, cell }: { cellType: CellType; cell: InputOutput }) => {
  const appContext = useContext(AppContext)
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleCopy = () => {
    const textarea = document.getElementById(`script__textarea__${cell.id}`)
    copyElementValue(textarea)
    appContext.toastMessage(i18n.t('common.copied'), 3000)
  }

  const handleCellState = (cellState: CellState) => {
    dispatch({
      type: Actions.cellState,
      payload: {
        cellState: getCellState(state, cellState),
      },
    })
  }

  const showScriptContent = (content: any) => {
    const element = document.getElementById(`script__textarea__${cell.id}`)
    if (element) {
      element.innerHTML = JSON.stringify(content, null, 4)
    }
  }

  const handleFetchScript = (cellState: CellState) => {
    if (cell.from_cellbase) return
    switch (getCellState(state, cellState)) {
      case CellState.LOCK:
        fetchScript(cellType, 'lock_scripts', `${cell.id}`).then(response => {
          const { data } = response as Response<ScriptWrapper>
          handleCellState(cellState)
          showScriptContent(data ? data.attributes : initScriptContent.lock)
        })
        break
      case CellState.TYPE:
        fetchScript(cellType, 'type_scripts', `${cell.id}`).then(response => {
          const { data } = response as Response<ScriptWrapper>
          handleCellState(cellState)
          showScriptContent(data ? data.attributes : initScriptContent.type)
        })
        break
      case CellState.DATA:
        fetchCellData(cellType, `${cell.id}`).then((data: Data) => {
          if (data.data.length < MAX_DATA_SIZE) {
            const dataValue: Data = data
            if (data && cell.isGenesisOutput) {
              dataValue.data = hexToUtf8(data.data.substr(2))
            }
            handleCellState(cellState)
            showScriptContent(dataValue || initScriptContent.data)
          } else {
            appContext.toastMessage(i18n.t('toast.data_too_large'), 3000)
          }
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
          <CellOperationButton value={i18n.t('transaction.lock_script')} cellState={CellState.LOCK} />
          <CellOperationButton value={i18n.t('transaction.type_script')} cellState={CellState.TYPE} />
          <CellOperationButton value={i18n.t('transaction.data')} cellState={CellState.DATA} />
        </div>
      </div>

      {state.cellState !== CellState.NONE && (
        <div className="script__content">
          <div className="script__input" id={`script__textarea__${cell.id}`} />
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
