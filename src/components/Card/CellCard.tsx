import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import AppContext from '../../contexts/App'
import CopyGreenIcon from '../../assets/copy_green.png'
import { InputOutput } from '../../http/response/Transaction'
import { startEndEllipsis, hexToUtf8 } from '../../utils/string'
import { shannonToCkb } from '../../utils/util'
import { CellType, fetchScript, fetchCellData } from '../../http/fetcher'
import { Script, ScriptWrapper } from '../../http/response/Script'
import { Data } from '../../http/response/Data'
import { Response } from '../../http/response/Response'

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

    textarea {
      border: none;
      width: 100%;
      padding: 12px;
      font-size: 12px;
      color: #888888;
      font-weight: bold;
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
      margin-top: 6px;
      min-height: 120px;
      background-color: #f9f9f9;
      border-radius: 6px 6px;
      user-select: none;
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

const CellOperationButton = styled.div`
  font-size: 14px;
  height: 20px;
  font-weight: bold;
  color: ${(props: { color: string }) => props.color};

  @media (max-width: 320px) {
    font-size: 12px;
  }
`

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

  if (cell.from_cellbase) {
    return (
      <div key={cell.id}>
        <CardLabelItem name={name} value="Cellbase" />
        <CardLabelItem name="Capacity" value={`${shannonToCkb(cell.capacity)}`} />
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
        <CardLabelItem name="Capacity" value={`${shannonToCkb(cell.capacity)}`} />
      </div>
    )
  }
  return (
    <div key={cell.id}>
      <CardLabelItem name={name} value="Unable to decode address" />
      <CardLabelItem name="Capacity" value={`${shannonToCkb(cell.capacity)}`} />
    </div>
  )
}

const CellScriptItem = ({ type, cell }: { type: CellType; cell: InputOutput }) => {
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
  const [isScript, setIsScript] = useState(true)
  const [showScript, setShowScript] = useState(false)

  return (
    <ScriptPanel>
      <div className="script__operation">
        <div className="script__detail">Detail</div>
        <div className="script__buttons">
          <CellOperationButton
            color={cell.from_cellbase ? '#888888' : '#4bbc8e'}
            className="script__button"
            role="button"
            tabIndex={-1}
            onKeyPress={() => {}}
            onClick={() => {
              fetchScript(type, 'lock_scripts', `${cell.id}`)
                .then(json => {
                  const { data } = json as Response<ScriptWrapper>
                  setScript(data ? data.attributes : initScript)
                  setIsScript(true)
                  setShowScript(true)
                })
                .catch(() => {
                  console.error('Network error')
                })
            }}
          >
            Lock Script
          </CellOperationButton>

          <CellOperationButton
            color={cell.from_cellbase ? '#888888' : '#4bbc8e'}
            className="script__button"
            role="button"
            tabIndex={-1}
            onKeyPress={() => {}}
            onClick={() => {
              fetchScript(type, 'type_scripts', `${cell.id}`)
                .then(json => {
                  const { data } = json as Response<ScriptWrapper>
                  setScript(data ? data.attributes : initScript)
                  setIsScript(true)
                  setShowScript(true)
                })
                .catch(() => {
                  console.error('Network error')
                })
            }}
          >
            Type Script
          </CellOperationButton>

          <CellOperationButton
            color={cell.from_cellbase ? '#888888' : '#4bbc8e'}
            className="script__button"
            role="button"
            tabIndex={-1}
            onKeyPress={() => {}}
            onClick={() => {
              fetchCellData(type, `${cell.id}`)
                .then(data => {
                  const dataValue = data
                  if (data && cell.isGenesisOutput) {
                    dataValue.data = hexToUtf8(data.data.substr(2))
                  }
                  setCellData(dataValue || initCellData)
                  setIsScript(false)
                  setShowScript(true)
                })
                .catch(() => {
                  console.error('Network error')
                })
            }}
          >
            Data
          </CellOperationButton>
        </div>
      </div>

      {showScript && (
        <div className="script__content">
          <textarea
            id={`script__textarea__${cell.id}`}
            value={JSON.stringify(isScript ? script : cellData, null, 4)}
            readOnly
          />
          <div
            className="script__copy"
            role="button"
            tabIndex={-1}
            onKeyPress={() => {}}
            onClick={() => {
              const textarea = document.getElementById(`script__textarea__${cell.id}`) as HTMLTextAreaElement
              const range = document.createRange()
              range.selectNodeContents(textarea)
              const selection = window.getSelection()
              selection.removeAllRanges()
              selection.addRange(range)
              textarea.setSelectionRange(0, 999999)
              document.execCommand('copy')

              appContext.toastMessage('Copied', 3000)
            }}
          >
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
      <CellScriptItem type={type} cell={cell} />
    </CardPanel>
  )
}

export default CellCard
