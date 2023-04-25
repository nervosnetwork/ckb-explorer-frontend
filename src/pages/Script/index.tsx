import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useParams } from 'react-router-dom'
import { Tabs } from 'antd'
import { useQuery } from 'react-query'
import { AxiosResponse } from 'axios'
import Content from '../../components/Content'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import i18n from '../../utils/i18n'
import { HashCardPanel } from '../../components/Card/HashCard/styled'
import { localeNumberString } from '../../utils/number'
import { CodeHashMessage, ScriptCells, ScriptTransactions } from './ScriptsComp'
import { MainnetContractHashTags, TestnetContractHashTags } from '../../constants/scripts'
import { isMainnet } from '../../utils/chain'
import { scripts as scriptNameList } from '../ScriptList'
import { usePaginationParamsInPage } from '../../utils/hook'
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

const getScriptInfo = (scriptInfo: ScriptInfo) => {
  const { scriptName, scriptType, typeId, codeHash, hashType, capacityOfDeployedCells, capacityOfReferringCells } =
    scriptInfo
  const items: OverviewItemData[] = [
    {
      title: i18n.t('scripts.script_name'),
      content: scriptName,
    },
    {
      title: i18n.t('scripts.hash_type'),
      content: <span className={styles.hashType}>{hashType}</span>,
    },
    {
      title: i18n.t('scripts.script_type'),
      content: scriptType ? i18n.t(`scripts.${scriptType}`) : '-',
    },
    {
      title: i18n.t('scripts.type_id'),
      content: typeId || '-',
    },
    {
      title: i18n.t('scripts.code_hash'),
      content: <CodeHashMessage codeHash={codeHash} />,
    },
    {
      title: i18n.t('scripts.capacity_of_deployed_cells'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(capacityOfDeployedCells))} hideZero />,
    },
    {
      title: '',
      content: '',
    },
    {
      title: i18n.t('scripts.capacity_of_referring_cells'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(capacityOfReferringCells))} hideZero />,
    },
  ]

  // don't show `referring_cells` temporarily
  return items.slice(0, 6)
}

const ScriptsTitleOverview = ({ scriptInfo }: { scriptInfo: ScriptInfo }) => {
  return (
    <div className={styles.scriptsTitleOverviewPanel}>
      <OverviewCard items={getScriptInfo(scriptInfo)} hideShadow />
    </div>
  )
}

const seekScriptName = (codeHash: string, hashType: string): string =>
  scriptHashNameMap.has(`${codeHash}_${hashType}`)
    ? scriptHashNameMap.get(`${codeHash}_${hashType}`)!
    : i18n.t('scripts.unnamed_script')

export const ScriptPage = () => {
  const history = useHistory()
  const { codeHash, hashType, tab } = useParams<{ codeHash: string; hashType: string; tab: ScriptTabType }>()
  const { currentPage, pageSize } = usePaginationParamsInPage()

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
          key={i18n.language + countOfTransactions + countOfDeployedCells + countOfReferringCells}
          className={styles.scriptTabs}
          activeKey={tab ?? 'transactions'}
          animated={{ inkBar: false }}
          tabBarStyle={{
            marginBottom: 0,
            height: 56,
          }}
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
              children: <ScriptTransactions page={currentPage} size={pageSize} />,
            },
            {
              label: `${i18n.t('scripts.deployed_cells')} (${localeNumberString(countOfDeployedCells)})`,
              key: 'deployed_cells',
              children: <ScriptCells page={currentPage} size={pageSize} cellType="deployed_cells" />,
            },
            {
              label: `${i18n.t('scripts.referring_cells')} (${localeNumberString(countOfReferringCells)})`,
              key: 'referring_cells',
              children: <ScriptCells page={currentPage} size={pageSize} cellType="referring_cells" />,
            },
          ]
            // don't show `referring_cells` temporarily
            .slice(0, 2)}
        />
      </div>
    </Content>
  )
}

export default ScriptPage
