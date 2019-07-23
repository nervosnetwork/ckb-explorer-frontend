import React, { useContext } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { AppContext } from '../../contexts/providers/index'
import CopyGreenIcon from '../../assets/copy_green.png'
import { startEndEllipsis, hexToUtf8 } from '../../utils/string'
import { shannonToCkb, copyElementValue } from '../../utils/util'
import { fetchScript, fetchCellData } from '../../service/http/fetcher'
import { localeNumberString } from '../../utils/number'
import i18n from '../../utils/i18n'
import { ScriptState, CellType } from '../../utils/const'
import { AppDispatch, AppActions, ComponentActions } from '../../contexts/providers/reducer'
import initCell from '../../contexts/states/components/cell'

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

const Capacity = ({ cell }: { cell: State.InputOutput }) => (
  <CardLabelItem name="Capacity" value={localeNumberString(shannonToCkb(cell.capacity))} />
)
const CellAddressCapacityItem = ({ type, cell }: { type: CellType; cell: State.InputOutput }) => {
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

const getScriptState = (state: Components.Cell, scriptState: ScriptState) => {
  return scriptState === state.scriptState ? ScriptState.NONE : scriptState
}

const CellScriptItem = ({
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
    const textarea = document.getElementById(`script__textarea__${cell.id}`)
    copyElementValue(textarea)
    dispatch({
      type: AppActions.ShowToastMessage,
      payload: {
        text: i18n.t('common.copied'),
        timeout: 3000,
      },
    })
  }

  const handleScriptState = (scriptState: ScriptState) => {
    dispatch({
      type: ComponentActions.CellScript,
      payload: {
        cellState: getScriptState(cellState, scriptState),
      },
    })
  }

  const showScriptContent = (content: any) => {
    const element = document.getElementById(`script__textarea__${cell.id}`)
    if (element) {
      element.innerHTML = JSON.stringify(content, null, 4)
    }
  }

  const handleFetchScript = (scriptState: ScriptState) => {
    if (cell.from_cellbase) return
    switch (getScriptState(cellState, scriptState)) {
      case ScriptState.LOCK:
        fetchScript(cellType, 'lock_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<State.Script>) => {
          handleScriptState(scriptState)
          showScriptContent(wrapper ? wrapper.attributes : initCell.lock)
        })
        break
      case ScriptState.TYPE:
        fetchScript(cellType, 'type_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<State.Script>) => {
          handleScriptState(scriptState)
          showScriptContent(wrapper ? wrapper.attributes : initCell.type)
        })
        break
      case ScriptState.DATA:
        fetchCellData(cellType, `${cell.id}`).then((wrapper: Response.Wrapper<State.Data>) => {
          if (wrapper && wrapper.attributes) {
            if (wrapper.attributes.data.length < MAX_DATA_SIZE) {
              const dataValue: State.Data = wrapper.attributes
              if (dataValue && cell.isGenesisOutput) {
                dataValue.data = hexToUtf8(dataValue.data.substr(2))
              }
              handleScriptState(scriptState)
              showScriptContent(dataValue)
            } else {
              dispatch({
                type: AppActions.ShowToastMessage,
                payload: {
                  text: i18n.t('toast.data_too_large'),
                  timeout: 3000,
                },
              })
            }
          } else {
            handleScriptState(scriptState)
            showScriptContent(initCell.data)
          }
        })
        break
      default:
        handleScriptState(scriptState)
        break
    }
  }

  const CellOperationButton = ({ value, scriptState }: { value: string; scriptState: ScriptState }) => {
    return (
      <CellOperationButtonPanel
        color={cell.from_cellbase ? '#888888' : '#4bbc8e'}
        style={scriptState === cellState.scriptState ? bottomLineStyle : noneStyle}
        role="button"
        tabIndex={-1}
        onKeyPress={() => {}}
        onClick={() => handleFetchScript(scriptState)}
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
          <CellOperationButton value={i18n.t('transaction.lock_script')} scriptState={ScriptState.LOCK} />
          <CellOperationButton value={i18n.t('transaction.type_script')} scriptState={ScriptState.TYPE} />
          <CellOperationButton value={i18n.t('transaction.data')} scriptState={ScriptState.DATA} />
        </div>
      </div>

      {cellState.scriptState !== ScriptState.NONE && (
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

const CellCard = ({ type, cell, dispatch }: { type: CellType; cell: State.InputOutput; dispatch: AppDispatch }) => {
  return (
    <CardPanel>
      <CellAddressCapacityItem type={type} cell={cell} />
      <CellScriptItem cellType={type} cell={cell} dispatch={dispatch} />
    </CardPanel>
  )
}

export default CellCard
