import React, { useEffect, useState } from 'react'
import { fetchCellData, fetchScript } from '../../../service/http/fetcher'
import { CellState } from '../../../utils/const'
import { hexToUtf8 } from '../../../utils/string'
import TransactionDetailPanel, { TransactionCellDetailCopyButtonPanel } from './styled'
import CopyIcon from '../../../assets/copy_green.png'
import CopyBlueIcon from '../../../assets/copy_blue.png'
import i18n from '../../../utils/i18n'
import { copyElementValue } from '../../../utils/util'
import { AppDispatch, AppActions } from '../../../contexts/providers/reducer'
import SmallLoading from '../../../components/Loading/SmallLoading'
import { isMainnet } from '../../../utils/chain'

const initScriptContent = {
  lock: 'null',
  type: 'null',
  data: {
    data: '0x',
  },
}

const handleFetchScript = (cell: State.Cell, state: CellState, dispatch: any) => {
  switch (state) {
    case CellState.LOCK:
      fetchScript('lock_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<any>) => {
        dispatch(wrapper ? wrapper.attributes : initScriptContent.lock)
      })
      break
    case CellState.TYPE:
      fetchScript('type_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<any>) => {
        dispatch(wrapper ? wrapper.attributes : initScriptContent.type)
      })
      break
    case CellState.DATA:
      fetchCellData(`${cell.id}`).then((wrapper: Response.Wrapper<any>) => {
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

export default ({ cell, state, dispatch }: { cell: State.Cell; state: CellState; dispatch: AppDispatch }) => {
  const [content, setContent] = useState(undefined as any)
  const contentElementId = `transaction__detail_content:${cell.id}`

  useEffect(() => {
    handleFetchScript(cell, state, setContent)
  }, [cell, state])

  const onClickCopy = () => {
    copyElementValue(document.getElementById(contentElementId))
    dispatch({
      type: AppActions.ShowToastMessage,
      payload: {
        message: i18n.t('common.copied'),
      },
    })
  }

  return (
    <>
      <TransactionDetailPanel hidden={!content}>
        <div className="transaction__detail_content" id={contentElementId}>
          {JSON.stringify(content, null, 4)}
        </div>
        <div className="transaction__detail_copy">
          <TransactionCellDetailCopyButtonPanel onClick={onClickCopy}>
            <div>{i18n.t('common.copy')}</div>
            <img src={isMainnet() ? CopyIcon : CopyBlueIcon} alt="copy" />
          </TransactionCellDetailCopyButtonPanel>
        </div>
      </TransactionDetailPanel>
      {!content && <SmallLoading />}
    </>
  )
}
