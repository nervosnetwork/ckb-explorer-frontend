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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9 2H20C21.1046 2 22 2.89543 22 4V16C22 17.1046 21.1046 18 20 18H19V8C19 5.79086 17.2091 4 15 4L7 4C7 2.89543 7.89543 2 9 2ZM9 0C6.79086 0 5 1.79086 5 4L4 4C1.79086 4 0 5.79086 0 8V20C0 22.2091 1.79086 24 4 24H15C17.2091 24 19 22.2091 19 20H20C22.2091 20 24 18.2091 24 16V4C24 1.79086 22.2091 0 20 0H9ZM15 6H4C2.89543 6 2 6.89543 2 8V20C2 21.1046 2.89543 22 4 22H15C16.1046 22 17 21.1046 17 20V8C17 6.89543 16.1046 6 15 6ZM6 8C5.44772 8 5 8.44771 5 9C5 9.55229 5.44772 10 6 10H10C10.5523 10 11 9.55229 11 9C11 8.44771 10.5523 8 10 8H6ZM5 18C5 17.4477 5.44772 17 6 17H10C10.5523 17 11 17.4477 11 18C11 18.5523 10.5523 19 10 19H6C5.44772 19 5 18.5523 5 18ZM6 12C5.44772 12 5 12.4477 5 13C5 13.5523 5.44772 14 6 14H13C13.5523 14 14 13.5523 14 13C14 12.4477 13.5523 12 13 12H6Z"
                  fill="none"
                />
              </svg>
            </TransactionDetailCopyButton>
            {(state === CellState.LOCK || state === CellState.TYPE) &&
              content &&
              (content as State.Script).codeHash &&
              (content as State.Script).hashType && (
                <TransactionDetailScriptButton
                  onClick={() => {
                    window.open(
                      `/script/${(content as State.Script).codeHash}/${(content as State.Script).hashType}`,
                      '_blank',
                    )
                  }}
                >
                  <div>{i18n.t('scripts.script')}</div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M21.0245 15.9168C21.0245 15.5129 21.355 15.1824 21.7589 15.1824C22.1628 15.1824 22.4933 15.5129 22.4933 15.9168V19.7968C22.4933 21.0086 21.5018 22 20.2901 22H3.20318C1.99143 22 1 21.0086 1 19.7968V4.20318C1 2.99143 1.99143 2 3.20318 2H10.1554C10.5594 2 10.8898 2.33048 10.8898 2.73439C10.8898 3.13831 10.5594 3.46879 10.1554 3.46879H3.20318C2.79927 3.46879 2.46879 3.79927 2.46879 4.20318V19.7968C2.46879 20.2007 2.79927 20.5312 3.20318 20.5312H20.2901C20.694 20.5312 21.0245 20.2007 21.0245 19.7968V15.9168ZM13.6562 2H21.6367C21.9549 2 22.4934 2.20808 22.4812 2.97919V10.8984C22.4812 11.3023 22.1507 11.6328 21.7468 11.6328C21.3429 11.6328 21.0124 11.3023 21.0124 10.8984V4.46022L9.20091 16.2717C9.06627 16.4186 8.87043 16.492 8.68684 16.492C8.50324 16.492 8.31964 16.4186 8.17276 16.2717C7.89124 15.978 7.89124 15.5129 8.17276 15.2313L19.9353 3.46879H13.6562C13.2523 3.46879 12.9218 3.13831 12.9218 2.73439C12.9218 2.33048 13.2523 2 13.6562 2Z"
                      fill="white"
                    />
                    <path
                      d="M22.4812 2.97919L22.2312 2.97522V2.97919H22.4812ZM21.0124 4.46022H21.2624V3.85667L20.8356 4.28344L21.0124 4.46022ZM9.20091 16.2717L9.02397 16.0948L9.01662 16.1028L9.20091 16.2717ZM8.17276 16.2717L7.99222 16.4447L7.99598 16.4485L8.17276 16.2717ZM8.17276 15.2313L7.99598 15.0546L8.17276 15.2313ZM19.9353 3.46879L20.1121 3.64556L20.5389 3.21879H19.9353V3.46879ZM21.7589 14.9324C21.2169 14.9324 20.7745 15.3748 20.7745 15.9168H21.2745C21.2745 15.6509 21.493 15.4324 21.7589 15.4324V14.9324ZM22.7433 15.9168C22.7433 15.3748 22.3009 14.9324 21.7589 14.9324V15.4324C22.0247 15.4324 22.2433 15.6509 22.2433 15.9168H22.7433ZM22.7433 19.7968V15.9168H22.2433V19.7968H22.7433ZM20.2901 22.25C21.6399 22.25 22.7433 21.1466 22.7433 19.7968H22.2433C22.2433 20.8705 21.3638 21.75 20.2901 21.75V22.25ZM3.20318 22.25H20.2901V21.75H3.20318V22.25ZM0.75 19.7968C0.75 21.1466 1.85336 22.25 3.20318 22.25V21.75C2.1295 21.75 1.25 20.8705 1.25 19.7968H0.75ZM0.75 4.20318V19.7968H1.25V4.20318H0.75ZM3.20318 1.75C1.85336 1.75 0.75 2.85336 0.75 4.20318H1.25C1.25 3.1295 2.1295 2.25 3.20318 2.25V1.75ZM10.1554 1.75H3.20318V2.25H10.1554V1.75ZM11.1398 2.73439C11.1398 2.19241 10.6974 1.75 10.1554 1.75V2.25C10.4213 2.25 10.6398 2.46855 10.6398 2.73439H11.1398ZM10.1554 3.71879C10.6974 3.71879 11.1398 3.27638 11.1398 2.73439H10.6398C10.6398 3.00024 10.4213 3.21879 10.1554 3.21879V3.71879ZM3.20318 3.71879H10.1554V3.21879H3.20318V3.71879ZM2.71879 4.20318C2.71879 3.93734 2.93734 3.71879 3.20318 3.71879V3.21879C2.66119 3.21879 2.21879 3.66119 2.21879 4.20318H2.71879ZM2.71879 19.7968V4.20318H2.21879V19.7968H2.71879ZM3.20318 20.2812C2.93734 20.2812 2.71879 20.0627 2.71879 19.7968H2.21879C2.21879 20.3388 2.66119 20.7812 3.20318 20.7812V20.2812ZM20.2901 20.2812H3.20318V20.7812H20.2901V20.2812ZM20.7745 19.7968C20.7745 20.0627 20.5559 20.2812 20.2901 20.2812V20.7812C20.8321 20.7812 21.2745 20.3388 21.2745 19.7968H20.7745ZM20.7745 15.9168V19.7968H21.2745V15.9168H20.7745ZM21.6367 1.75H13.6562V2.25H21.6367V1.75ZM22.7312 2.98316C22.7383 2.53281 22.5818 2.2134 22.3457 2.01073C22.1187 1.81588 21.8428 1.75 21.6367 1.75V2.25C21.7487 2.25 21.9012 2.28816 22.02 2.39012C22.1297 2.48427 22.2363 2.65446 22.2312 2.97522L22.7312 2.98316ZM22.7312 10.8984V2.97919H22.2312V10.8984H22.7312ZM21.7468 11.8828C22.2888 11.8828 22.7312 11.4404 22.7312 10.8984H22.2312C22.2312 11.1643 22.0127 11.3828 21.7468 11.3828V11.8828ZM20.7624 10.8984C20.7624 11.4404 21.2048 11.8828 21.7468 11.8828V11.3828C21.481 11.3828 21.2624 11.1643 21.2624 10.8984H20.7624ZM20.7624 4.46022V10.8984H21.2624V4.46022H20.7624ZM9.37769 16.4485L21.1892 4.637L20.8356 4.28344L9.02413 16.0949L9.37769 16.4485ZM8.68684 16.742C8.93227 16.742 9.19791 16.645 9.3852 16.4407L9.01662 16.1028C8.93463 16.1922 8.8086 16.242 8.68684 16.242V16.742ZM7.99598 16.4485C8.18825 16.6408 8.43485 16.742 8.68684 16.742V16.242C8.57163 16.242 8.45103 16.1964 8.34954 16.0949L7.99598 16.4485ZM7.99598 15.0546C7.61481 15.4357 7.6201 16.0564 7.99226 16.4447L8.35326 16.0987C8.16239 15.8996 8.16767 15.59 8.34954 15.4081L7.99598 15.0546ZM19.7585 3.29201L7.99598 15.0546L8.34954 15.4081L20.1121 3.64556L19.7585 3.29201ZM13.6562 3.71879H19.9353V3.21879H13.6562V3.71879ZM12.6718 2.73439C12.6718 3.27638 13.1142 3.71879 13.6562 3.71879V3.21879C13.3904 3.21879 13.1718 3.00024 13.1718 2.73439H12.6718ZM13.6562 1.75C13.1142 1.75 12.6718 2.19241 12.6718 2.73439H13.1718C13.1718 2.46855 13.3904 2.25 13.6562 2.25V1.75Z"
                      fill="white"
                    />
                  </svg>
                </TransactionDetailScriptButton>
              )}
          </div>
        )}
      </TransactionDetailPanel>
    </TransactionDetailContainer>
  )
}
