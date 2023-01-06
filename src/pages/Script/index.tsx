import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useParams } from 'react-router-dom'
import { CopyOutlined } from '@ant-design/icons'
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
import { ScriptInfo, ScriptTabType } from './types'
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

const seekScriptName = (codeHash: string, hashType: string): string =>
  scriptHashNameMap.has(`${codeHash}_${hashType}`)
    ? scriptHashNameMap.get(`${codeHash}_${hashType}`)!
    : i18n.t('scripts.unnamed_script')

export const ScriptPage = () => {
  const history = useHistory()
  const { search } = useLocation()
  const { codeHash, hashType, tab } = useParams<{ codeHash: string; hashType: string; tab: ScriptTabType }>()

  const searchParams = new URLSearchParams(search)
  const currentPage = parsePageNumber(searchParams.get('page'), PageParams.PageNo)
  const pageSize = parsePageNumber(searchParams.get('size'), PageParams.PageSize)

  const [countOfTransactions, setCountOfTransactions] = useState<number>(0)
  const [countOfDeployedCells, setCountOfDeployedCells] = useState<number>(0)
  const [countOfReferringCells, setCountOfReferringCells] = useState<number>(0)

  const [pageOfTransactions, setPageOfTransactions] = useState<number>(1)
  const [pageOfDeployedCells, setPageOfDeployedCells] = useState<number>(1)
  const [pageOfReferringCells, setPageOfReferringCells] = useState<number>(1)

  const { status, data: resp } = useQuery<AxiosResponse>(['scripts_general_info', codeHash, hashType], () =>
    v2AxiosIns.get(`scripts/general_info`, {
      params: {
        code_hash: codeHash,
        hash_type: hashType,
      },
    }),
  )

  const scriptInfo =
    status === 'success' && resp
      ? toCamelcase<Response.Response<ScriptInfo>>(resp?.data)!.data
      : ({
          id: 0,
          scriptName: '',
          scriptType: '',
          typeId: '',
          codeHash,
          hashType,
          capacityOfDeployedCells: '0',
          capacityOfReferringCells: '0',
          countOfTransactions: 0,
          countOfDeployedCells: 0,
          countOfReferringCells: 0,
        } as ScriptInfo)
  scriptInfo.scriptName = seekScriptName(scriptInfo.codeHash, scriptInfo.hashType)

  useEffect(() => {
    setCountOfTransactions(scriptInfo.countOfTransactions)
    setCountOfDeployedCells(scriptInfo.countOfDeployedCells)
    setCountOfReferringCells(scriptInfo.countOfReferringCells)
  }, [scriptInfo.countOfDeployedCells, scriptInfo.countOfReferringCells, scriptInfo.countOfTransactions])

  return (
    <Content>
      <div className={`${styles.scriptContentPanel} container`}>
        <HashCardPanel isColumn={false}>
          <ScriptsTitleOverview scriptInfo={scriptInfo} />
        </HashCardPanel>
        <Tabs
          className={styles.scriptTabs}
          activeKey={tab ?? 'transactions'}
          onTabClick={key => {
            const currentTab = tab ?? 'transactions'
            if (currentTab === key) return

            if (currentTab === 'deployed_cells') {
              setPageOfDeployedCells(currentPage)
            } else if (currentTab === 'referring_cells') {
              setPageOfReferringCells(currentPage)
            } else if (currentTab === 'transactions') {
              setPageOfTransactions(currentPage)
            }
            if (key === 'deployed_cells') {
              history.push(
                `/script/${codeHash}/${hashType}/deployed_cells?page=${pageOfDeployedCells}&size=${pageSize}`,
              )
            } else if (key === 'referring_cells') {
              history.push(
                `/script/${codeHash}/${hashType}/referring_cells?page=${pageOfReferringCells}&size=${pageSize}`,
              )
            } else if (key === 'transactions') {
              history.push(`/script/${codeHash}/${hashType}?page=${pageOfTransactions}&size=${pageSize}`)
            }
          }}
          items={[
            {
              label: `${i18n.t('transaction.transactions')} (${localeNumberString(countOfTransactions!)})`,
              key: 'transactions',
              children: (
                <ScriptTransactions
                  page={currentPage}
                  size={pageSize}
                  updateCount={count => setCountOfTransactions(count)}
                />
              ),
            },
            {
              label: `${i18n.t('scripts.deployed_cells')} (${localeNumberString(countOfDeployedCells)})`,
              key: 'deployed_cells',
              children: (
                <ScriptCells
                  page={currentPage}
                  size={pageSize}
                  cellType="deployed_cells"
                  updateCount={count => setCountOfDeployedCells(count)}
                />
              ),
            },
            {
              label: `${i18n.t('scripts.referring_cells')} (${localeNumberString(countOfReferringCells)})`,
              key: 'referring_cells',
              children: (
                <ScriptCells
                  page={currentPage}
                  size={pageSize}
                  cellType="referring_cells"
                  updateCount={count => setCountOfReferringCells(count)}
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
