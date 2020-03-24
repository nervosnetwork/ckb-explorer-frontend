import React, { useEffect, useState } from 'react'
import { fetchCellData, fetchScript } from '../../../service/http/fetcher'
import { CellState } from '../../../utils/const'
import { hexToUtf8 } from '../../../utils/string'
import {
  TransactionDetailCopyButton,
  TransactionDetailContainer,
  TransactionDetailPanel,
  TransactionDetailLock,
  TransactionDetailType,
  TransactionCellDetailPanel,
  TransactionDetailData,
} from './styled'
import CopyIcon from '../../../assets/copy_green.png'
import CopyBlueIcon from '../../../assets/copy_blue.png'
import i18n from '../../../utils/i18n'
import { copyElementValue } from '../../../utils/util'
import { AppActions } from '../../../contexts/providers/reducer'
import SmallLoading from '../../../components/Loading/SmallLoading'
import { isMainnet } from '../../../utils/chain'
import { useDispatch } from '../../../contexts/providers'
import CloseIcon from '../../../assets/modal_close.png'

const initScriptContent = {
  lock: 'null',
  type: 'null',
  data: {
    data: '0x',
  },
}

const handleFetchScript = (cell: State.Cell, state: CellState, setContent: any, setState: any, dispatch: any) => {
  switch (state) {
    case CellState.LOCK:
      fetchScript('lock_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<any>) => {
        setContent(wrapper ? wrapper.attributes : initScriptContent.lock)
      })
      break
    case CellState.TYPE:
      fetchScript('type_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<any>) => {
        setContent(wrapper ? wrapper.attributes : initScriptContent.type)
      })
      break
    case CellState.DATA:
      fetchCellData(`${cell.id}`)
        .then((wrapper: Response.Wrapper<State.Data>) => {
          const dataValue: State.Data = wrapper.attributes
          if (wrapper && cell.isGenesisOutput) {
            dataValue.data = hexToUtf8(wrapper.attributes.data.substr(2))
          }
          setContent(dataValue || initScriptContent.data)
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data[0]) {
            const err = error.response.data[0]
            if (err.status === 400 && err.code === 1022) {
              setContent(null)
              setState(CellState.NONE)
              dispatch({
                type: AppActions.ShowToastMessage,
                payload: {
                  message: i18n.t('toast.data_too_large'),
                  type: 'warning',
                },
              })
            }
          }
        })
      break
    default:
      break
  }
}

export default ({ cell, onClose }: { cell: State.Cell; onClose: Function }) => {
  const dispatch = useDispatch()
  const [content, setContent] = useState(undefined as any)
  const [state, setState] = useState(CellState.LOCK as CellState)
  const contentElementId = `transaction__detail_content:${cell.id}`

  const changeType = (newState: CellState) => {
    setState(state !== newState ? newState : CellState.NONE)
  }

  useEffect(() => {
    handleFetchScript(cell, state, setContent, setState, dispatch)
  }, [cell, state, setState, dispatch])

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
    <TransactionDetailContainer>
      <TransactionCellDetailPanel>
        <TransactionDetailLock selected={state === CellState.LOCK} onClick={() => changeType(CellState.LOCK)}>
          {i18n.t('transaction.lock_script')}
        </TransactionDetailLock>
        <TransactionDetailType selected={state === CellState.TYPE} onClick={() => changeType(CellState.TYPE)}>
          {i18n.t('transaction.type_script')}
        </TransactionDetailType>
        <TransactionDetailData selected={state === CellState.DATA} onClick={() => changeType(CellState.DATA)}>
          {i18n.t('transaction.data')}
        </TransactionDetailData>
        <div className="transaction__detail__modal__close">
          <img src={CloseIcon} alt="close icon" tabIndex={-1} onKeyDown={() => {}} onClick={() => onClose()} />
        </div>
      </TransactionCellDetailPanel>

      <div className="transaction__detail__separate" />

      <TransactionDetailPanel>
        {content ? (
          <div className="transaction__detail_content" id={contentElementId}>
            {JSON.stringify(content, null, 4)}
          </div>
        ) : (
          <div className="transaction__detail_loading">
            <SmallLoading />
          </div>
        )}
        <div className="transaction__detail_copy">
          <TransactionDetailCopyButton onClick={onClickCopy}>
            <div>{i18n.t('common.copy')}</div>
            <img src={isMainnet() ? CopyIcon : CopyBlueIcon} alt="copy" />
          </TransactionDetailCopyButton>
        </div>
      </TransactionDetailPanel>
    </TransactionDetailContainer>
  )
}
