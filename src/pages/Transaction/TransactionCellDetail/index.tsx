import React, { useState, useEffect } from 'react'
import TransactionDetailPanel from './styled'
import { CellType, fetchScript, fetchCellData } from '../../../service/http/fetcher'
import { hexToUtf8 } from '../../../utils/string'

export enum TransactionDetailType {
  lockScript = 'lock_scripts',
  typeScript = 'type_scripts',
  data = 'data',
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

const handleFetchScript = (
  cell: State.InputOutput,
  cellType: CellType,
  detailType: TransactionDetailType,
  dispatch: any,
) => {
  switch (detailType) {
    case TransactionDetailType.lockScript:
      fetchScript(cellType, 'lock_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<State.Script>) => {
        dispatch(wrapper ? wrapper.attributes : initScriptContent.lock)
      })
      break
    case TransactionDetailType.typeScript:
      fetchScript(cellType, 'type_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<State.Script>) => {
        dispatch(wrapper ? wrapper.attributes : initScriptContent.type)
      })
      break
    case TransactionDetailType.data:
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

export { CellType }

export default ({
  cell,
  cellType,
  detailType,
}: {
  cell: State.InputOutput
  cellType: CellType
  detailType: TransactionDetailType
}) => {
  const [content, setContent] = useState(undefined as any)

  useEffect(() => {
    handleFetchScript(cell, cellType, detailType, setContent)
  }, [cell, cellType, detailType])

  return (
    <TransactionDetailPanel hidden={!content}>
      <div className="transaction_detail__content">{JSON.stringify(content, null, 4)}</div>
    </TransactionDetailPanel>
  )
}
