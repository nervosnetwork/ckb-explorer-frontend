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
  TransactionCellScriptContentPanel,
} from './styled'
import CopyIcon from '../../../assets/copy_green.png'
import CopyBlueIcon from '../../../assets/copy_blue.png'
import i18n from '../../../utils/i18n'
import { AppActions, AppDispatch, PageActions } from '../../../contexts/providers/reducer'
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
) => {
  setScriptFetchStatus(dispatch, false)
  switch (state) {
    case CellState.LOCK:
      fetchScript('lock_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<State.Script> | null) => {
        setScriptFetchStatus(dispatch, true)
        setContent(wrapper ? wrapper.attributes : initScriptContent.lock)
      })
      break
    case CellState.TYPE:
      fetchScript('type_scripts', `${cell.id}`).then((wrapper: Response.Wrapper<State.Script> | null) => {
        setScriptFetchStatus(dispatch, true)
        setContent(wrapper ? wrapper.attributes : initScriptContent.type)
      })
      break
    case CellState.DATA:
      fetchCellData(`${cell.id}`)
        .then((wrapper: Response.Wrapper<State.Data> | null) => {
          setScriptFetchStatus(dispatch, true)
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
      break
    default:
      break
  }
}

const ScriptContent = ({ content, state }: { content: State.Script | State.Data | undefined; state: CellState }) => {
  const hashTag = (content as State.Script).codeHash ? matchCodeHash((content as State.Script).codeHash) : undefined
  if (state === CellState.DATA) {
    return (content as State.Data).data ? (
      <div>
        <div>{`"${i18n.t('transaction.script_data')}": `}</div>
        <div>{`"${(content as State.Data).data}"`}</div>
      </div>
    ) : (
      <div>{JSON.stringify(initScriptContent.data, null, 4)}</div>
    )
  }
  return (content as State.Script).args ? (
    <>
      <div>
        <div>{`"${i18n.t('transaction.script_args')}": `}</div>
        <div>{`"${(content as State.Script).args}"`}</div>
      </div>
      <div>
        <div>{`"${i18n.t('transaction.script_code_hash')}": `}</div>
        <div>{`"${(content as State.Script).codeHash}"`}</div>
      </div>
      {hashTag && (
        <div>
          <div>{''}</div>
          <div>
            <HashTag content={hashTag.tag} category={hashTag.category} />
          </div>
        </div>
      )}
      <div>
        <div>{`"${i18n.t('transaction.script_hash_type')}": `}</div>
        <div>{`"${(content as State.Script).hashType}"`}</div>
      </div>
    </>
  ) : (
    <div>{JSON.stringify(initScriptContent.lock, null, 4)}</div>
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
    <TransactionCellScriptContentPanel>
      <span>{'{'}</span>
      <ScriptContent content={content} state={state} />
      <span>{'}'}</span>
    </TransactionCellScriptContentPanel>
  )
}

export default ({ cell, onClose }: { cell: State.Cell; onClose: Function }) => {
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
    handleFetchScript(cell, state, setContent, setState, dispatch)
  }, [cell, state, setState, dispatch])

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
