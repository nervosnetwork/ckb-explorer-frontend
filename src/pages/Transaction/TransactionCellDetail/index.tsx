import React, { useEffect, useState } from 'react'
import initScriptContent from '../../../contexts/states/cell'
import { fetchCellData, fetchScript } from '../../../service/http/fetcher'
import { CellState, CellType } from '../../../utils/const'
import { hexToUtf8 } from '../../../utils/string'
import TransactionDetailPanel, { TransactionCellDetailCopyButtonPanel } from './styled'
import CopyIcon from '../../../assets/transaction_detail_copy.png'
import i18n from '../../../utils/i18n'
import { copyElementValue } from '../../../utils/util'
import { AppDispatch, AppActions } from '../../../contexts/providers/reducer'

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

export default ({
  cell,
  cellType,
  state,
  dispatch,
}: {
  cell: State.InputOutput
  cellType: CellType
  state: CellState
  dispatch: AppDispatch
}) => {
  const [content, setContent] = useState(undefined as any)

  useEffect(() => {
    handleFetchScript(cell, cellType, state, setContent)
  }, [cell, cellType, state])

  const onClickCopy = () => {
    copyElementValue(document.getElementById('transaction__detail_content'))
    dispatch({
      type: AppActions.ShowToastMessage,
      payload: {
        text: i18n.t('common.copied'),
        timeout: 3000,
      },
    })
  }

  return (
    <TransactionDetailPanel hidden={!content}>
      <div id="transaction__detail_content">{JSON.stringify(content, null, 4)}</div>
      <div className="transaction__detail_copy">
        <TransactionCellDetailCopyButtonPanel onClick={onClickCopy}>
          <img src={CopyIcon} alt="copy" />
        </TransactionCellDetailCopyButtonPanel>
      </div>
    </TransactionDetailPanel>
  )
}
