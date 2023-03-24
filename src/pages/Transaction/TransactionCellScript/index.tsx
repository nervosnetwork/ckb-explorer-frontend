/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState, ReactNode } from 'react'
import BigNumber from 'bignumber.js'
import { fetchCellData, fetchScript } from '../../../service/http/fetcher'
import { CellState } from '../../../constants/common'
import { hexToUtf8 } from '../../../utils/string'
import {
  TransactionDetailCopyButton,
  TransactionDetailContainer,
  TransactionDetailPanel,
  TransactionDetailLock,
  TransactionDetailType,
  TransactionCellDetailPanel,
  TransactionDetailData,
  TransactionDetailCapacityUsage,
  TransactionCellScriptContentPanel,
  TransactionDetailScriptButton,
} from './styled'
import i18n from '../../../utils/i18n'
import { AppDispatch } from '../../../contexts/reducer'
import { AppActions } from '../../../contexts/actions'
import SmallLoading from '../../../components/Loading/SmallLoading'
import { useDispatch } from '../../../contexts/providers'
import CloseIcon from '../../../assets/modal_close.png'
import { matchScript } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import HashTag from '../../../components/HashTag'
import { ReactComponent as CopyIcon } from '../../../assets/copy_icon.svg'
import { ReactComponent as OuterLinkIcon } from '../../../assets/outer_link_icon.svg'

const initScriptContent = {
  lock: 'null',
  type: 'null',
  data: {
    data: '0x',
  },
}

type CapacityUsage = Record<'declared' | 'occupied', string | null>

const updateJsonFormat = (content: State.Script | State.Data | CapacityUsage | null): string => {
  if (content !== null && (content as State.Script).args !== undefined) {
    const { codeHash, args, hashType } = content as State.Script
    return JSON.stringify(
      {
        code_hash: codeHash,
        args,
        hash_type: hashType,
      },
      null,
      4,
    )
  }
  return JSON.stringify(content, null, 4)
}

const handleFetchCellInfo = async (
  cell: State.Cell,
  state: CellState,
  setScriptFetchStatus: (val: boolean) => void,
  setContent: Function,
  dispatch: AppDispatch,
  txStatus: string,
) => {
  setScriptFetchStatus(false)

  const fetchLock = async () => {
    if (txStatus === 'committed') {
      const wrapper: Response.Wrapper<State.Script> | null = await fetchScript('lock_scripts', `${cell.id}`)
      return wrapper ? wrapper.attributes : initScriptContent.lock
    }
    return cell.cellInfo.lock || initScriptContent.lock
  }

  const fetchType = async () => {
    if (txStatus === 'committed') {
      const wrapper: Response.Wrapper<State.Script> | null = await fetchScript('type_scripts', `${cell.id}`)
      return wrapper ? wrapper.attributes : initScriptContent.type
    }
    return cell.cellInfo.type || initScriptContent.type
  }

  const fetchData = async () => {
    if (txStatus === 'committed') {
      return fetchCellData(`${cell.id}`)
        .then((wrapper: Response.Wrapper<State.Data> | null) => {
          const dataValue: State.Data = wrapper ? wrapper.attributes : initScriptContent.data
          if (wrapper && cell.isGenesisOutput) {
            dataValue.data = hexToUtf8(wrapper.attributes.data)
          }
          return dataValue || initScriptContent.data
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data[0]) {
            const err = error.response.data[0]
            if (err.status === 400 && err.code === 1022) {
              dispatch({
                type: AppActions.ShowToastMessage,
                payload: {
                  message: i18n.t('toast.data_too_large'),
                  type: 'warning',
                },
              })
              return null
            }
          }
          return null
        })
    }
    let dataValue: State.Data
    if (cell.cellInfo.data !== '0x') {
      dataValue = {
        data: cell.cellInfo.data,
      }
    } else {
      dataValue = initScriptContent.data
    }
    return dataValue
  }

  switch (state) {
    case CellState.LOCK:
      fetchLock().then(lock => {
        setScriptFetchStatus(true)
        setContent(lock)
      })
      break
    case CellState.TYPE:
      fetchType().then(type => {
        setScriptFetchStatus(true)
        setContent(type)
      })
      break
    case CellState.DATA:
      fetchData().then(data => {
        setScriptFetchStatus(true)
        setContent(data)
      })
      break
    case CellState.CAPACITY:
      setContent(null)

      Promise.all([fetchLock(), fetchType(), fetchData()]).then(([lock, type, data]) => {
        setScriptFetchStatus(true)
        const declared = new BigNumber(cell.capacity)

        if (!data) {
          setContent({
            declared: `${localeNumberString(declared.dividedBy(10 ** 8))} CKBytes`,
            occupied: null,
          })
          return
        }

        const CAPACITY_SIZE = 8
        const occupied = ([lock, type] as Array<any>)
          .filter(s => s !== 'null')
          .map(
            script => Math.ceil(script.codeHash.slice(2).length / 2) + Math.ceil(script.args.slice(2).length / 2) + 1,
          )
          .reduce((acc, cur) => acc.plus(cur), new BigNumber(0))
          .plus(CAPACITY_SIZE)
          .plus(Math.ceil(data.data.slice(2).length / 2))

        setContent({
          declared: `${localeNumberString(declared.dividedBy(10 ** 8))} CKBytes`,
          occupied: `${localeNumberString(occupied)} CKBytes`,
        })
      })

      break
    default:
      break
  }
}

const ScriptContentItem = ({ title = '', value = '' }: { title?: string; value?: ReactNode | string }) => (
  <div>
    <div>{title}</div>
    <div className="monospace">{value}</div>
  </div>
)

const ScriptContent = ({
  content,
  state,
}: {
  content: State.Script | State.Data | CapacityUsage | undefined
  state: CellState
}) => {
  const hashTag = (content as State.Script).codeHash
    ? matchScript((content as State.Script).codeHash, (content as State.Script).hashType)
    : undefined
  const data = content as State.Data
  const script = content as State.Script

  if (state === CellState.CAPACITY) {
    const capacities = content as CapacityUsage

    return (
      <>
        {Object.keys(capacities).map(key => {
          const v = capacities[key as keyof CapacityUsage]

          if (!v) return null
          const field = i18n.t(`transaction.${key}_capacity`)
          return <ScriptContentItem key={key} title={`"${field}": `} value={v || ''} />
        })}
      </>
    )
  }
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
      <ScriptContentItem title={`"${i18n.t('transaction.script_args')}": `} value={(content as State.Script).args} />
    </>
  )
}

const ScriptContentJson = ({
  content,
  state,
}: {
  content: State.Script | State.Data | CapacityUsage | undefined
  state: CellState
}) => (
  <TransactionCellScriptContentPanel isData={state === CellState.DATA}>
    <span>{'{'}</span>
    <ScriptContent content={content} state={state} />
    <span>{'}'}</span>
  </TransactionCellScriptContentPanel>
)

export default ({ cell, onClose, txStatus }: { cell: State.Cell; onClose: Function; txStatus: string }) => {
  const dispatch = useDispatch()
  const [scriptFetched, setScriptFetched] = useState(false)
  const [content, setContent] = useState(null as State.Script | State.Data | CapacityUsage | null)
  const [state, setState] = useState(CellState.LOCK as CellState)

  const changeType = (newState: CellState) => {
    setState(state !== newState ? newState : state)
  }

  useEffect(() => {
    handleFetchCellInfo(cell, state, setScriptFetched, setContent, dispatch, txStatus)
  }, [cell, state, dispatch, txStatus])

  const onClickCopy = () => {
    navigator.clipboard.writeText(updateJsonFormat(content)).then(
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
        <TransactionDetailCapacityUsage
          selected={state === CellState.CAPACITY}
          onClick={() => changeType(CellState.CAPACITY)}
        >
          {i18n.t('transaction.capacity_usage')}
        </TransactionDetailCapacityUsage>
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
              <CopyIcon />
            </TransactionDetailCopyButton>
            {(state === CellState.LOCK || state === CellState.TYPE) &&
            content &&
            typeof content === 'object' &&
            'codeHash' in content &&
            'hashType' in content ? (
              <TransactionDetailScriptButton href={`/script/${content.codeHash}/${content.hashType}`} target="_blank">
                <div>{i18n.t('scripts.script')}</div>
                <OuterLinkIcon />
              </TransactionDetailScriptButton>
            ) : null}
          </div>
        )}
      </TransactionDetailPanel>
    </TransactionDetailContainer>
  )
}
