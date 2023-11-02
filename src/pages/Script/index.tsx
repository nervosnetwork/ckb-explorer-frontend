import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useParams } from 'react-router-dom'
import { Tabs } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Content from '../../components/Content'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import { useCurrentLanguage } from '../../utils/i18n'
import { HashCardPanel } from '../../components/Card/HashCard/styled'
import { localeNumberString } from '../../utils/number'
import { CodeHashMessage, ScriptCells, ScriptTransactions } from './ScriptsComp'
import { MainnetContractHashTags, TestnetContractHashTags } from '../../constants/scripts'
import { isMainnet } from '../../utils/chain'
import { scripts as scriptNameList } from '../ScriptList'
import { usePaginationParamsInPage } from '../../utils/hook'
import { shannonToCkb } from '../../utils/util'
import DecimalCapacity from '../../components/DecimalCapacity'
import styles from './styles.module.scss'
import { explorerService } from '../../services/ExplorerService'
import type { ScriptInfo } from '../../services/ExplorerService/fetcher'

const scriptDataList = isMainnet() ? MainnetContractHashTags : TestnetContractHashTags

const useScriptHashNameMap = (): Map<string, string> => {
  const { t } = useTranslation()
  return new Map(
    scriptDataList
      .map(scriptData =>
        scriptData.codeHashes.map(
          codeHash =>
            [
              `${codeHash}_${scriptData.hashType}`,
              scriptNameList.has(scriptData.tag)
                ? scriptNameList.get(scriptData.tag)!.name
                : t('scripts.unnamed_script'),
            ] as [string, string],
        ),
      )
      .flat(),
  )
}

const useScriptInfo = (scriptInfo: ScriptInfo) => {
  const { t } = useTranslation()
  const { scriptName, scriptType, id, codeHash, hashType, capacityOfDeployedCells, capacityOfReferringCells } =
    scriptInfo
  const items: OverviewItemData[] = [
    {
      title: t('scripts.script_name'),
      tooltip: t('glossary.script_name'),
      content: scriptName,
    },
    {
      title: t('scripts.hash_type'),
      tooltip: t('glossary.hash_type'),
      content: <span className={styles.hashType}>{hashType}</span>,
    },
    {
      title: t('scripts.script_type'),
      content: scriptType ? t(`scripts.${scriptType}`) : '-',
    },
    {
      title: t('scripts.type_id'),
      content: id ? <CodeHashMessage codeHash={id} /> : '-',
    },
    {
      title: t('scripts.code_hash'),
      tooltip: t('glossary.code_hash'),
      content: <CodeHashMessage codeHash={codeHash} />,
    },
    {
      title: t('scripts.capacity_of_deployed_cells'),
      tooltip: t('glossary.capacity_of_deployed_cells'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(capacityOfDeployedCells))} hideZero />,
    },
    {
      title: '',
      content: '',
    },
    {
      title: t('scripts.capacity_of_referring_cells'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(capacityOfReferringCells))} hideZero />,
    },
  ]

  return items
}

const ScriptsTitleOverview = ({ scriptInfo }: { scriptInfo: ScriptInfo }) => {
  return (
    <div className={styles.scriptsTitleOverviewPanel}>
      <OverviewCard items={useScriptInfo(scriptInfo)} hideShadow />
    </div>
  )
}

const useSeekScriptName = (codeHash: string, hashType: string): string => {
  const { t } = useTranslation()
  const nameMap = useScriptHashNameMap()
  return nameMap.has(`${codeHash}_${hashType}`) ? nameMap.get(`${codeHash}_${hashType}`)! : t('scripts.unnamed_script')
}

type ScriptTabType = 'transactions' | 'deployed_cells' | 'referring_cells' | undefined

export const ScriptPage = () => {
  const history = useHistory()
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()

  const { codeHash, hashType: _hashType, tab } = useParams<{ codeHash: string; hashType: string; tab: ScriptTabType }>()
  const hashType = _hashType === 'data' ? 'data' : 'type'
  const { currentPage, pageSize } = usePaginationParamsInPage()

  const [countOfTransactions, setCountOfTransactions] = useState<number>(0)
  const [countOfDeployedCells, setCountOfDeployedCells] = useState<number>(0)
  const [countOfReferringCells, setCountOfReferringCells] = useState<number>(0)

  const [pageOfTransactions, setPageOfTransactions] = useState<number>(1)
  const [pageOfDeployedCells, setPageOfDeployedCells] = useState<number>(1)
  const [pageOfReferringCells, setPageOfReferringCells] = useState<number>(1)

  const { status, data: resp } = useQuery(['scripts_general_info', codeHash, hashType], () =>
    explorerService.api.fetchScriptInfo(codeHash, hashType),
  )

  const scriptInfo: ScriptInfo =
    status === 'success' && resp
      ? resp.data
      : {
          id: '-',
          scriptName: '',
          scriptType: '',
          codeHash,
          hashType,
          capacityOfDeployedCells: '0',
          capacityOfReferringCells: '0',
          countOfTransactions: 0,
          countOfDeployedCells: 0,
          countOfReferringCells: 0,
        }
  scriptInfo.scriptName = useSeekScriptName(scriptInfo.codeHash, scriptInfo.hashType)

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
          key={currentLanguage + countOfTransactions + countOfDeployedCells + countOfReferringCells}
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
              label: `${t('transaction.transactions')} (${localeNumberString(countOfTransactions!)})`,
              key: 'transactions',
              children: <ScriptTransactions page={currentPage} size={pageSize} />,
            },
            {
              label: `${t('scripts.deployed_cells')} (${localeNumberString(countOfDeployedCells)})`,
              key: 'deployed_cells',
              children: <ScriptCells page={currentPage} size={pageSize} cellType="deployed_cells" />,
            },
            {
              label: `${t('scripts.referring_cells')} (${localeNumberString(countOfReferringCells)})`,
              key: 'referring_cells',
              children: <ScriptCells page={currentPage} size={pageSize} cellType="referring_cells" />,
            },
          ]}
        />
      </div>
    </Content>
  )
}

export default ScriptPage
