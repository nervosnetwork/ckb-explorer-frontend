import React, { useEffect, useState, ReactNode } from 'react'
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
  TransactionCellScriptContentPanel,
} from './styled'
import CopyIcon from '../../../assets/copy_green.png'
import CopyBlueIcon from '../../../assets/copy_blue.png'
import i18n from '../../../utils/i18n'
import { AppDispatch } from '../../../contexts/reducer'
import { AppActions, PageActions } from '../../../contexts/actions'
import SmallLoading from '../../../components/Loading/SmallLoading'
import { isMainnet } from '../../../utils/chain'
import { useDispatch, useAppState } from '../../../contexts/providers'
import CloseIcon from '../../../assets/modal_close.png'
import { matchCodeHash } from '../../../utils/util'
import HashTag from '../../../components/HashTag'

const initScriptContent = {
  lock: 'null',
  type: 'null',
  data: {
    data: '0x',
  },
}

const setScriptFetchStatus = (dispatch: AppDispatch, status: boolean) => {
  dispatch({
    type: PageActions.UpdateTransactionScriptFetched,
    payload: {
      scriptFetched: status,
    },
  })
}

const handleFetchScript = (
  cell: State.Cell,
  state: CellState,
  setContent: Function,
  setState: Function,
  dispatch: AppDispatch,
  txStatus: string,
) => {
  setScriptFetchStatus(dispatch, false)
  switch (state) {
    case CellState.LOCK:
      if (txStatus === 'committed') {
        fetchScript('lock_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<State.Script> | null) => {
          setScriptFetchStatus(dispatch, true)
          setContent(wrapper ? wrapper.attributes : initScriptContent.lock)
        })
      } else {
        setScriptFetchStatus(dispatch, true)
        setContent(cell.cellInfo.lock || initScriptContent.lock)
      }
      break
    case CellState.TYPE:
      if (txStatus === 'committed') {
        fetchScript('type_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<State.Script> | null) => {
          setScriptFetchStatus(dispatch, true)
          setContent(wrapper ? wrapper.attributes : initScriptContent.type)
        })
      } else {
        setScriptFetchStatus(dispatch, true)
        setContent(cell.cellInfo.type || initScriptContent.type)
      }
      break
    case CellState.DATA:
      if (txStatus === 'committed') {
        fetchCellData(`${cell.id}`)
          .then((wrapper: Response.Wrapper<State.Data> | null) => {
            const dataValue: State.Data = wrapper ? wrapper.attributes : initScriptContent.data
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
          .finally(() => {
            setScriptFetchStatus(dispatch, true)
          })
      } else {
        setScriptFetchStatus(dispatch, true)
        let dataValue: State.Data
        if (cell.cellInfo.data !== '0x') {
          dataValue = { data: hexToUtf8(cell.cellInfo.data.substr(2)) }
        } else {
          dataValue = initScriptContent.data
        }
        setContent(dataValue)
      }
      break
    default:
      break
  }
}

const ScriptContentItem = ({ title = '', value = '' }: { title?: string; value?: ReactNode | string }) => {
  return (
    <div>
      <div>{title}</div>
      <div className="monospace">{value}</div>
    </div>
  )
}

const ScriptContent = ({ content, state }: { content: State.Script | State.Data | undefined; state: CellState }) => {
  const hashTag = (content as State.Script).codeHash ? matchCodeHash((content as State.Script).codeHash) : undefined
  const data = content as State.Data
  const script = content as State.Script
  if (state === CellState.DATA) {
    return (
      <ScriptContentItem
        title={data.data ? `"${i18n.t('transaction.script_data')}": ` : ''}
        value={data.data ? `"${data.data}"` : JSON.stringify(initScriptContent.data, null, 4)}
      />
    )
  }
  if (!script.args) {
    return <ScriptContentItem title={JSON.stringify(initScriptContent.lock, null, 4)} />
  }
  return (
    <>
      <ScriptContentItem title={`"${i18n.t('transaction.script_args')}": `} value={(content as State.Script).args} />
      <ScriptContentItem title={`"${i18n.t('transaction.script_code_hash')}": `} value={script.codeHash} />
      {hashTag && (
        <ScriptContentItem
          value={
            <div>
              <HashTag content={hashTag.tag} category={hashTag.category} />
            </div>
          }
        />
      )}
      <ScriptContentItem title={`"${i18n.t('transaction.script_hash_type')}": `} value={script.hashType} />
    </>
  )
}

const ScriptContentJson = ({
  content,
  state,
}: {
  content: State.Script | State.Data | undefined
  state: CellState
}) => {
  return (
    <TransactionCellScriptContentPanel isData={state === CellState.DATA}>
      <span>{'{'}</span>
      <ScriptContent content={content} state={state} />
      <span>{'}'}</span>
    </TransactionCellScriptContentPanel>
  )
}

export default ({ cell, onClose, txStatus }: { cell: State.Cell; onClose: Function; txStatus: string }) => {
  const dispatch = useDispatch()
  const [content, setContent] = useState(null as State.Script | State.Data | null)
  const [state, setState] = useState(CellState.LOCK as CellState)
  const {
    transactionState: { scriptFetched },
  } = useAppState()

  const changeType = (newState: CellState) => {
    setState(state !== newState ? newState : state)
  }

  useEffect(() => {
    handleFetchScript(cell, state, setContent, setState, dispatch, txStatus)
  }, [cell, state, setState, dispatch, txStatus])

  const onClickCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 4)).then(
      () => {
        dispatch({
          type: AppActions.ShowToastMessage,
          payload: {
            message: i18n.t('common.copied'),
          },
        })
      },
      error => {
        console.error(error)
      },
    )
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
        {content && scriptFetched ? (
          <div className="transaction__detail_content">
            <ScriptContentJson content={content} state={state} />
          </div>
        ) : (
          <div className="transaction__detail_loading">{!scriptFetched ? <SmallLoading /> : null}</div>
        )}
        {!content && scriptFetched ? null : (
          <div className="transaction__detail_copy">
            <TransactionDetailCopyButton onClick={onClickCopy}>
              <div>{i18n.t('common.copy')}</div>
              <img src={isMainnet() ? CopyIcon : CopyBlueIcon} alt="copy" />
            </TransactionDetailCopyButton>
          </div>
        )}
      </TransactionDetailPanel>
    </TransactionDetailContainer>
  )
}
