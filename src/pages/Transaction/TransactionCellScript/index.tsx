/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState, ReactNode, useRef } from 'react'
import BigNumber from 'bignumber.js'
import { TFunction, useTranslation } from 'react-i18next'
import { explorerService, Response } from '../../../services/ExplorerService'
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
import SmallLoading from '../../../components/Loading/SmallLoading'
import CloseIcon from '../../../assets/modal_close.png'
import { getContractHashTag } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import HashTag from '../../../components/HashTag'
import { ReactComponent as CopyIcon } from '../../../assets/copy_icon.svg'
import { ReactComponent as OuterLinkIcon } from '../../../assets/outer_link_icon.svg'
import { HelpTip } from '../../../components/HelpTip'
import { useSetToast } from '../../../components/Toast'

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
  setToast: ReturnType<typeof useSetToast>,
  t: TFunction,
) => {
  setScriptFetchStatus(false)

  const fetchLock = async () => {
    if (cell.id) {
      const wrapper: Response.Wrapper<State.Script> | null = await explorerService.api.fetchScript(
        'lock_scripts',
        `${cell.id}`,
      )
      return wrapper ? wrapper.attributes : initScriptContent.lock
    }
    return initScriptContent.lock
  }

  const fetchType = async () => {
    if (cell.id) {
      const wrapper: Response.Wrapper<State.Script> | null = await explorerService.api.fetchScript(
        'type_scripts',
        `${cell.id}`,
      )
      return wrapper ? wrapper.attributes : initScriptContent.type
    }
    return initScriptContent.type
  }

  const fetchData = async () => {
    if (cell.id) {
      return explorerService.api
        .fetchCellData(`${cell.id}`)
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
              setToast({
                message: t('toast.data_too_large'),
                type: 'warning',
              })
              return null
            }
          }
          return null
        })
    }
    const dataValue: State.Data = initScriptContent.data
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
  const { t } = useTranslation()
  const hashTag = getContractHashTag(content as State.Script)
  const data = content as State.Data
  const script = content as State.Script

  if (state === CellState.CAPACITY) {
    const capacities = content as CapacityUsage

    return (
      <>
        {Object.keys(capacities).map(key => {
          const v = capacities[key as keyof CapacityUsage]

          if (!v) return null
          const field = t(`transaction.${key}_capacity`)
          return <ScriptContentItem key={key} title={`"${field}": `} value={v || ''} />
        })}
      </>
    )
  }
  if (state === CellState.DATA) {
    return (
      <ScriptContentItem
        title={data.data ? `"${t('transaction.script_data')}": ` : ''}
        value={data.data ? `"${data.data}"` : JSON.stringify(initScriptContent.data, null, 4)}
      />
    )
  }
  if (!script.args) {
    return <ScriptContentItem title={JSON.stringify(initScriptContent.lock, null, 4)} />
  }
  return (
    <>
      <ScriptContentItem title={`"${t('transaction.script_code_hash')}": `} value={script.codeHash} />
      {hashTag && (
        <ScriptContentItem
          value={
            <div>
              <HashTag content={hashTag.tag} category={hashTag.category} />
            </div>
          }
        />
      )}
      <ScriptContentItem title={`"${t('transaction.script_hash_type')}": `} value={script.hashType} />
      <ScriptContentItem title={`"${t('transaction.script_args')}": `} value={(content as State.Script).args} />
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

export default ({ cell, onClose }: { cell: State.Cell; onClose: Function }) => {
  const setToast = useSetToast()
  const { t } = useTranslation()
  const [scriptFetched, setScriptFetched] = useState(false)
  const [content, setContent] = useState(null as State.Script | State.Data | CapacityUsage | null)
  const [state, setState] = useState(CellState.LOCK as CellState)
  const ref = useRef<HTMLDivElement>(null)

  const changeType = (newState: CellState) => {
    setState(state !== newState ? newState : state)
  }

  useEffect(() => {
    handleFetchCellInfo(cell, state, setScriptFetched, setContent, setToast, t)
  }, [cell, state, setToast, t])

  const onClickCopy = () => {
    navigator.clipboard.writeText(updateJsonFormat(content)).then(
      () => {
        setToast({ message: t('common.copied') })
      },
      error => {
        console.error(error)
      },
    )
  }

  return (
    <TransactionDetailContainer ref={ref}>
      <TransactionCellDetailPanel>
        <TransactionDetailLock selected={state === CellState.LOCK} onClick={() => changeType(CellState.LOCK)}>
          {t('transaction.lock_script')}
          <HelpTip title={t('glossary.lock_script')} placement="bottom" containerRef={ref} />
        </TransactionDetailLock>
        <TransactionDetailType selected={state === CellState.TYPE} onClick={() => changeType(CellState.TYPE)}>
          {t('transaction.type_script')}
          <HelpTip title={t('glossary.type_script')} placement="bottom" containerRef={ref} />
        </TransactionDetailType>
        <TransactionDetailData selected={state === CellState.DATA} onClick={() => changeType(CellState.DATA)}>
          {t('transaction.data')}
        </TransactionDetailData>
        <TransactionDetailCapacityUsage
          selected={state === CellState.CAPACITY}
          onClick={() => changeType(CellState.CAPACITY)}
        >
          {t('transaction.capacity_usage')}
          <HelpTip title={t('glossary.capacity_usage')} placement="bottom" containerRef={ref} />
        </TransactionDetailCapacityUsage>
        <div className="transactionDetailModalClose">
          <img src={CloseIcon} alt="close icon" tabIndex={-1} onKeyDown={() => {}} onClick={() => onClose()} />
        </div>
      </TransactionCellDetailPanel>

      <div className="transactionDetailSeparate" />

      <TransactionDetailPanel>
        {content && scriptFetched ? (
          <div className="transactionDetailContent">
            <ScriptContentJson content={content} state={state} />
          </div>
        ) : (
          <div className="transactionDetailLoading">{!scriptFetched ? <SmallLoading /> : null}</div>
        )}
        {!content && scriptFetched ? null : (
          <div className="transactionDetailCopy">
            <TransactionDetailCopyButton onClick={onClickCopy}>
              <div>{t('common.copy')}</div>
              <CopyIcon />
            </TransactionDetailCopyButton>
            {(state === CellState.LOCK || state === CellState.TYPE) &&
            content &&
            typeof content === 'object' &&
            'codeHash' in content &&
            'hashType' in content ? (
              <TransactionDetailScriptButton href={`/script/${content.codeHash}/${content.hashType}`} target="_blank">
                <div>{t('scripts.script')}</div>
                <OuterLinkIcon />
              </TransactionDetailScriptButton>
            ) : null}
          </div>
        )}
      </TransactionDetailPanel>
    </TransactionDetailContainer>
  )
}
