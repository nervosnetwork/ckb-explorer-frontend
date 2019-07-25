import React, { useEffect, useState } from 'react'
import initScriptContent from '../../../contexts/states/cell'
import { fetchCellData, fetchScript } from '../../../service/http/fetcher'
import { CellState, CellType } from '../../../utils/const'
import { hexToUtf8 } from '../../../utils/string'
import TransactionDetailPanel from './styled'

const handleFetchScript = (cell: State.InputOutput, cellType: CellType, state: CellState, dispatch: any) => {
  switch (state) {
    case CellState.LOCK:
      fetchScript(cellType, 'lock_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<State.Script>) => {
        dispatch(wrapper ? wrapper.attributes : initScriptContent.lock)
      })
      break
    case CellState.TYPE:
      fetchScript(cellType, 'type_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<State.Script>) => {
        dispatch(wrapper ? wrapper.attributes : initScriptContent.type)
      })
      break
    case CellState.DATA:
      fetchCellData(cellType, `${cell.id}`).then((wrapper: Response.Wrapper<State.Data>) => {
        const dataValue: State.Data = wrapper.attributes
        if (wrapper && cell.isGenesisOutput) {
          dataValue.data = hexToUtf8(wrapper.attributes.data.substr(2))
        }
        dispatch(dataValue || initScriptContent.data)
      })
      break
    default:
      break
  }
}

export default ({ cell, cellType, state }: { cell: State.InputOutput; cellType: CellType; state: CellState }) => {
  const [content, setContent] = useState(undefined as any)

  useEffect(() => {
    handleFetchScript(cell, cellType, state, setContent)
  }, [cell, cellType, state])

  return (
    <TransactionDetailPanel hidden={!content}>
      <div className="transaction__detail_content">{JSON.stringify(content, null, 4)}</div>
    </TransactionDetailPanel>
  )
}
