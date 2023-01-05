import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useParams } from 'react-router-dom'
import { CopyOutlined } from '@ant-design/icons'
import queryString from 'query-string'
import { Tabs } from 'antd'
import { useQuery } from 'react-query'
import { AxiosResponse } from 'axios'
import Content from '../../components/Content'
import { useDispatch } from '../../contexts/providers'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import i18n from '../../utils/i18n'
import { HashCardPanel } from '../../components/Card/HashCard/styled'
import { adaptMobileEllipsis, adaptPCEllipsis, parsePageNumber } from '../../utils/string'
import { PageParams } from '../../constants/common'
import { localeNumberString } from '../../utils/number'
import { AppActions } from '../../contexts/actions'
import { AppDispatch } from '../../contexts/reducer'
import { ScriptCells, ScriptTransactions } from './ScriptsComp'
import { MainnetContractHashTags, TestnetContractHashTags } from '../../constants/scripts'
import { isMainnet } from '../../utils/chain'
import { scripts as scriptNameList } from '../ScriptList'
import { isMobile } from '../../utils/screen'
import { shannonToCkb, toCamelcase } from '../../utils/util'
import DecimalCapacity from '../../components/DecimalCapacity'
import { ScriptGeneralInfoResponse, ScriptInfo, ScriptTabType } from './types'
import styles from './styles.module.scss'
import { v2AxiosIns } from '../../service/http/fetcher'

const scriptDataList = isMainnet() ? MainnetContractHashTags : TestnetContractHashTags

const scriptHashNameMap = new Map<string, string>(
  scriptDataList
    .map(scriptData =>
      scriptData.codeHashes.map(
        codeHash =>
          [
            `${codeHash}_${scriptData.hashType}`,
            scriptNameList.has(scriptData.tag)
              ? scriptNameList.get(scriptData.tag)!.name
              : i18n.t('scripts.unnamed_script'),
          ] as [string, string],
      ),
    )
    .flat(),
)

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
          {codeHash && `${isMobile() ? adaptMobileEllipsis(codeHash, 60) : adaptPCEllipsis(codeHash, 10, 80)}`}
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
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(capacityOfDeployedCells))} />,
    },
    {
      title: '',
      content: '',
    },
    {
      title: i18n.t('scripts.capacity_of_referring_cells'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(capacityOfReferringCells))} />,
    },
  ]

  return items
}

const ScriptsTitleOverview = ({ scriptInfo }: { scriptInfo: ScriptInfo }) => {
  const dispatch = useDispatch()
  return (
    <div className={styles.scriptsTitleOverviewPanel}>
      <OverviewCard items={getScriptInfo(scriptInfo, dispatch)} hideShadow />
    </div>
  )
}

const initScriptInfo: ScriptInfo = {
  scriptName: '',
  scriptType: '',
  typeId: 0,
  codeHash: '',
  hashType: '',
  capacityOfDeployedCells: '',
  capacityOfReferringCells: '',
  countOfTransactions: 0,
  countOfDeployedCells: 0,
  countOfReferringCells: 0,
  pageOfTransactions: 1,
  pageOfDeployedCells: 1,
  pageOfReferringCells: 1,
  sizeOfTransactions: 10,
  sizeOfDeployedCells: 10,
  sizeOfReferringCells: 10,
}

const seekScriptName = (codeHash: string, hashType: string): string =>
  scriptHashNameMap.has(`${codeHash}_${hashType}`)
    ? scriptHashNameMap.get(`${codeHash}_${hashType}`)!
    : i18n.t('scripts.unnamed_script')

export const ScriptPage = () => {
  const history = useHistory()
  const { search } = useLocation()
  const { codeHash, hashType, tab } = useParams<{ codeHash: string; hashType: string; tab: ScriptTabType }>()
  const anchor = (tab ?? 'transactions') as ScriptTabType
  const [activeTab, setActiveTab] = useState<ScriptTabType>(anchor)
  const parsed = queryString.parse(search)
  const currentPage = parsePageNumber(parsed.page, PageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, PageParams.PageSize)
  initScriptInfo.codeHash = codeHash
  initScriptInfo.hashType = hashType
  initScriptInfo.scriptName = seekScriptName(codeHash, hashType)
  const [scriptInfo, setScriptInfo] = useState<ScriptInfo>(initScriptInfo)

  const { status, data: resp } = useQuery<AxiosResponse>(['scripts_general_info', codeHash, hashType], () =>
    v2AxiosIns.get(`scripts/general_info`, {
      params: {
        code_hash: codeHash,
        hash_type: hashType,
      },
    }),
  )

  useEffect(() => {
    if (status === 'success' && resp) {
      const response = toCamelcase<Response.Response<ScriptGeneralInfoResponse>>(resp?.data)
      const { data } = response!

      setScriptInfo(si => ({
        ...si,
        scriptType: data.scriptType,
        typeId: data.typeId,
        capacityOfDeployedCells: data.capacityOfDeployedCells,
        capacityOfReferringCells: data.capacityOfReferringCells,
        countOfTransactions: data.countOfTransactions,
        countOfDeployedCells: data.countOfDeployedCells,
        countOfReferringCells: data.countOfReferringCells,
      }))
    }
  }, [status, resp])

  useEffect(() => {
    if (anchor === 'deployed_cells') {
      setActiveTab('deployed_cells')
    } else if (anchor === 'referring_cells') {
      setActiveTab('referring_cells')
    } else {
      setActiveTab('transactions')
    }
  }, [anchor])

  return (
    <Content>
      <div className={`${styles.scriptContentPanel} container`}>
        <HashCardPanel isColumn={false}>
          <ScriptsTitleOverview scriptInfo={scriptInfo} />
        </HashCardPanel>
        <Tabs
          className={styles.scriptTabs}
          activeKey={activeTab}
          tabBarStyle={{
            fontSize: '5rem !important',
          }}
          onTabClick={key => {
            if (key === 'deployed_cells') {
              history.push(
                `/script/${codeHash}/${hashType}/deployed_cells?page=${scriptInfo.pageOfDeployedCells}&size=${scriptInfo.sizeOfDeployedCells}`,
              )
              setActiveTab('deployed_cells')
            } else if (key === 'referring_cells') {
              history.push(
                `/script/${codeHash}/${hashType}/referring_cells?page=${scriptInfo.pageOfReferringCells}&size=${scriptInfo.sizeOfReferringCells}`,
              )
              setActiveTab('referring_cells')
            } else if (key === 'transactions') {
              history.push(
                `/script/${codeHash}/${hashType}?page=${scriptInfo.pageOfTransactions}&size=${scriptInfo.sizeOfTransactions}`,
              )
              setActiveTab('transactions')
            }
          }}
          items={[
            {
              label: `${i18n.t('transaction.transactions')} (${localeNumberString(scriptInfo.countOfTransactions!)})`,
              key: 'transactions',
              children: (
                <ScriptTransactions
                  page={currentPage}
                  size={pageSize}
                  updateCount={count =>
                    setScriptInfo(si => ({
                      ...si,
                      countOfTransactions: count,
                    }))
                  }
                />
              ),
            },
            {
              label: `${i18n.t('scripts.deployed_cells')} (${localeNumberString(scriptInfo.countOfDeployedCells)})`,
              key: 'deployed_cells',
              children: (
                <ScriptCells
                  page={currentPage}
                  size={pageSize}
                  cellType="deployed_cells"
                  updateCount={count =>
                    setScriptInfo(si => ({
                      ...si,
                      countOfDeployedCells: count,
                    }))
                  }
                />
              ),
            },
            {
              label: `${i18n.t('scripts.referring_cells')} (${localeNumberString(scriptInfo.countOfReferringCells)})`,
              key: 'referring_cells',
              children: (
                <ScriptCells
                  page={currentPage}
                  size={pageSize}
                  cellType="referring_cells"
                  updateCount={count =>
                    setScriptInfo(si => ({
                      ...si,
                      countOfReferringCells: count,
                    }))
                  }
                />
              ),
            },
          ]}
        />
      </div>
    </Content>
  )
}

export default ScriptPage
