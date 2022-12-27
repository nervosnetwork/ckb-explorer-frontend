import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import queryString from 'query-string'
import { useParams } from 'react-router-dom'
import { CopyOutlined } from '@ant-design/icons'
import Content from '../../components/Content'
import { useDispatch } from '../../contexts/providers'
import { ScriptContentPanel, ScriptsTitleOverviewPanel, ScriptTabs } from './styled'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import i18n from '../../utils/i18n'
import { HashCardPanel } from '../../components/Card/HashCard/styled'
import Error from '../../components/Error'
import Loading from '../../components/Loading'
import { ScriptCells, ScriptTransactions } from './ScriptsComp'
import { parsePageNumber } from '../../utils/string'
import { PageParams } from '../../constants/common'
import { localeNumberString } from '../../utils/number'
import { AppActions } from '../../contexts/actions'
import {
  fetchScriptsCkbTransactionsInfo,
  fetchScriptsDeployedCellsInfo,
  fetchScriptsReferringCellsInfo,
} from '../../service/http/fetcher'
import { AppDispatch } from '../../contexts/reducer'

const getScriptInfo = (scriptInfo: ScriptInfo, dispatch: AppDispatch) => {
  const { scriptName, scriptType, typeId, codeHash, hashType, capacityOfDeployedCells, capacityOfReferringCells } =
    scriptInfo
  const items: OverviewItemData[] = [
    {
      title: i18n.t('scripts.script_name'),
      content: scriptName,
    },
    {
      title: i18n.t('address.hash_type'),
      content: hashType,
    },
    {
      title: i18n.t('scripts.script_type'),
      content: scriptType,
    },
    {
      title: i18n.t('scripts.type_id'),
      content: typeId,
    },
    {
      title: i18n.t('address.code_hash'),
      content: (
        <span>
          {`${codeHash.substring(0, 20)}...${codeHash.substring(50)}`}
          <span
            style={{
              marginLeft: '1rem',
            }}
          >
            <CopyOutlined
              onClick={() => {
                navigator.clipboard.writeText(codeHash).then(
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
              }}
            />
          </span>
        </span>
      ),
    },
    {
      title: i18n.t('scripts.capacity_of_deployed_cells'),
      content: capacityOfDeployedCells,
    },
    {
      title: i18n.t('scripts.capacity_of_deployed_cells'),
      content: capacityOfReferringCells,
    },
  ]

  return items
}

const ScriptsTitleOverview = ({ scriptInfo }: { scriptInfo: ScriptInfo }) => {
  const dispatch = useDispatch()
  return (
    <ScriptsTitleOverviewPanel>
      <OverviewCard items={getScriptInfo(scriptInfo, dispatch)} hideShadow />
    </ScriptsTitleOverviewPanel>
  )
}

const LoadingState = ({ status, children }: { status: State.FetchStatus; children: ReactNode }) => {
  switch (status) {
    case 'Error':
      return <Error />
    case 'OK':
      return <>{children}</>
    case 'InProgress':
    case 'None':
    default:
      return <Loading show />
  }
}

export interface ScriptInfo {
  scriptName: string
  scriptType: string
  typeId: number
  codeHash: string
  hashType: string
  capacityOfDeployedCells: string
  capacityOfReferringCells: string
}

export interface ScriptPageInfo<T> {
  total: number
  data: T[]
  status: State.FetchStatus
  page: number
  size: number
}

const initScriptInfo: ScriptInfo = {
  scriptName: '',
  scriptType: '',
  typeId: 0,
  codeHash: '',
  hashType: '',
  capacityOfDeployedCells: '',
  capacityOfReferringCells: '',
}

const initScriptPageInfo: ScriptPageInfo<any> = {
  total: 0,
  data: [],
  status: 'None',
  page: 1,
  size: 10,
}

export const updatePageSection = (
  fetchFunc: () => Promise<Response.Response<Response.Wrapper<any[]>> | null>,
  setScriptInfo: Dispatch<SetStateAction<ScriptInfo>>,
  setPagesInfo: Dispatch<SetStateAction<ScriptPageInfo<any>>>,
  pagesInfo: ScriptPageInfo<any>,
  pageDataName: 'ckbTransactions' | 'deployedCells' | 'referringCells',
) => {
  setPagesInfo({
    ...pagesInfo,
    status: 'InProgress',
  })
  fetchFunc()
    .then(response => {
      const data = response!.data as any
      const meta = response!.meta as Response.Meta
      setScriptInfo({
        scriptName: data.scriptName,
        scriptType: data.scriptType,
        typeId: data.TypeId,
        codeHash: data.codeHash,
        hashType: data.hashType,
        capacityOfDeployedCells: data.capacityOfDeployedCells,
        capacityOfReferringCells: data.capacityOfReferringCells,
      })
      setPagesInfo({
        ...pagesInfo,
        data: data[pageDataName],
        total: meta ? meta.total : 0,
        status: 'OK',
      })
    })
    .catch(error => {
      const isEmpty = error && error.response && error.response.status === 404
      setPagesInfo({
        ...pagesInfo,
        data: [],
        total: 0,
        status: isEmpty ? 'OK' : 'Error',
      })
    })
}

export const ScriptPage = () => {
  const history = useHistory()
  const { search, hash } = useLocation()
  const [activeKey, setActiveKey] = useState<'transactions' | 'deployed_cells' | 'referring_cells'>('transactions')
  const { codeHash } = useParams<{ codeHash: string }>()
  const { hashType } = useParams<{ hashType: string }>()
  const parsed = queryString.parse(search)
  const [scriptInfo, setScriptInfo] = useState<ScriptInfo>(initScriptInfo)
  const [ckbTransaction, setCkbTransaction] = useState<ScriptPageInfo<any>>(initScriptPageInfo)
  const [deployedCell, setDeployedCell] = useState<ScriptPageInfo<any>>(initScriptPageInfo)
  const [referringCell, setReferringCell] = useState<ScriptPageInfo<any>>(initScriptPageInfo)

  const currentPage = parsePageNumber(parsed.page, PageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, PageParams.PageSize)

  useEffect(() => {
    const hashStart = hash.indexOf('#')
    const pageInfo = {
      ...initScriptPageInfo,
      page: currentPage,
      size: pageSize,
    }
    if (hashStart < 0) {
      setActiveKey('transactions')
      updatePageSection(
        () => fetchScriptsCkbTransactionsInfo(codeHash, hashType, currentPage, pageSize),
        setScriptInfo,
        setCkbTransaction,
        pageInfo,
        'ckbTransactions',
      )
    } else {
      const hashEnd = hash.indexOf('?')
      const anchor = hashEnd < hashStart ? hash.substring(hashStart + 1) : hash.substring(hashStart + 1, hashEnd)
      if (anchor === 'deployed_cells') {
        setActiveKey('deployed_cells')
        updatePageSection(
          () => fetchScriptsDeployedCellsInfo(codeHash, hashType, currentPage, pageSize),
          setScriptInfo,
          setDeployedCell,
          pageInfo,
          'deployedCells',
        )
      } else if (anchor === 'referring_cells') {
        setActiveKey('referring_cells')
        updatePageSection(
          () => fetchScriptsReferringCellsInfo(codeHash, hashType, currentPage, pageSize),
          setScriptInfo,
          setReferringCell,
          pageInfo,
          'referringCells',
        )
      } else {
        setActiveKey('transactions')
        updatePageSection(
          () => fetchScriptsCkbTransactionsInfo(codeHash, hashType, currentPage, pageSize),
          setScriptInfo,
          setCkbTransaction,
          pageInfo,
          'ckbTransactions',
        )
      }
    }
  }, [codeHash, currentPage, hash, hashType, history, pageSize])

  return (
    <Content>
      <ScriptContentPanel className="container">
        <HashCardPanel isColumn={false}>
          <ScriptsTitleOverview scriptInfo={scriptInfo} />
        </HashCardPanel>
        <ScriptTabs
          activeKey={activeKey}
          onTabClick={key => {
            if (key === 'deployed_cells') {
              history.replace(
                `/script/${codeHash}/${hashType}?page=${deployedCell.page}&size=${deployedCell.size}#deployed_cells`,
              )
              setActiveKey('deployed_cells')
            } else if (key === 'referring_cells') {
              history.replace(
                `/script/${codeHash}/${hashType}?page=${referringCell.page}&size=${referringCell.size}#referring_cells`,
              )
              setActiveKey('referring_cells')
            } else {
              history.replace(`/script/${codeHash}/${hashType}?page=${ckbTransaction.page}&size=${ckbTransaction.size}`)
              setActiveKey('transactions')
            }
          }}
          items={[
            {
              label: `${i18n.t('transaction.transactions')} (${localeNumberString(ckbTransaction.total)})`,
              key: 'transactions',
              children: (
                <LoadingState status={ckbTransaction.status}>
                  <ScriptTransactions scriptInfo={scriptInfo} ckbTransaction={ckbTransaction} />
                </LoadingState>
              ),
            },
            {
              label: `${i18n.t('scripts.deployed_cells')} (${localeNumberString(deployedCell.total)})`,
              key: 'deployed_cells',
              children: (
                <LoadingState status={deployedCell.status}>
                  <ScriptCells scriptInfo={scriptInfo} cell={deployedCell} anchor="deployed_cells" />
                </LoadingState>
              ),
            },
            {
              label: `${i18n.t('scripts.referring_cells')} (${localeNumberString(referringCell.total)})`,
              key: 'referring_cells',
              children: (
                <LoadingState status={referringCell.status}>
                  <ScriptCells scriptInfo={scriptInfo} cell={referringCell} anchor="referring_cells" />
                </LoadingState>
              ),
            },
          ]}
        />
      </ScriptContentPanel>
    </Content>
  )
}

export default ScriptPage
