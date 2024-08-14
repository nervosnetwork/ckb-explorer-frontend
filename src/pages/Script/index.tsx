import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from '../../components/Link'
import Content from '../../components/Content'
import { useCurrentLanguage } from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { CodeHashMessage, ScriptCells, ScriptTransactions } from './ScriptsComp'
import { MainnetContractHashTags, TestnetContractHashTags } from '../../constants/scripts'
import { isMainnet } from '../../utils/chain'
import { scripts as scriptNameList } from '../ScriptList'
import { usePaginationParamsInPage } from '../../hooks'
import { shannonToCkb } from '../../utils/util'
import Capacity from '../../components/Capacity'
import styles from './styles.module.scss'
import { explorerService } from '../../services/ExplorerService'
import type { ScriptInfo } from '../../services/ExplorerService/fetcher'
import { ScriptTab, ScriptTabPane, ScriptTabTitle } from './styled'
import { Card, CardCellInfo, CardCellsLayout } from '../../components/Card'
import { ReactComponent as OpenSourceIcon } from '../../assets/open-source.svg'
import { HashType } from '../../constants/common'

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
  const items: CardCellInfo<'left' | 'right'>[] = [
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
      content: <Capacity capacity={shannonToCkb(capacityOfDeployedCells)} display="short" />,
    },
    {
      slot: 'right',
      cell: {
        title: t('scripts.capacity_of_referring_cells'),
        content: <Capacity capacity={shannonToCkb(capacityOfReferringCells)} display="short" />,
      },
    },
  ]

  return items
}

const useSeekScriptName = (codeHash: string, hashType: string): string => {
  const { t } = useTranslation()
  const nameMap = useScriptHashNameMap()
  return nameMap.has(`${codeHash}_${hashType}`) ? nameMap.get(`${codeHash}_${hashType}`)! : t('scripts.unnamed_script')
}

type ScriptTabType = 'transactions' | 'deployed_cells' | 'referring_cells' | undefined

export const ScriptPage = () => {
  const history = useHistory()
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const currentLanguage = useCurrentLanguage()

  const { codeHash, hashType, tab } = useParams<{
    codeHash: string
    hashType: HashType
    tab: ScriptTabType
  }>()
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
          hashType: hashType as HashType,
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

  useEffect(() => {
    if (!Object.values(HashType).includes(hashType as HashType)) {
      history.replace('/404')
    }
  }, [hashType, history])

  const codeUrl = scriptNameList.get(scriptInfo.scriptName)?.code

  return (
    <Content>
      <div className={`${styles.scriptContentPanel} container`}>
        <Card>
          <div className={styles.headerCard}>
            <span className={styles.headerTitle}>Script</span>

            {scriptInfo.scriptName ? <span className={styles.headerSubTitle}>{scriptInfo.scriptName}</span> : null}

            {codeUrl ? (
              <Link to={codeUrl} style={{ marginLeft: 'auto' }} className={styles.openSourceAction}>
                {t('scripts.open_source_script')}
                <OpenSourceIcon />
              </Link>
            ) : null}
          </div>
        </Card>

        <Card style={{ marginTop: 24 }}>
          <CardCellsLayout type="left-right" cells={useScriptInfo(scriptInfo)} />
        </Card>

        <ScriptTab
          key={currentLanguage + countOfTransactions + countOfDeployedCells + countOfReferringCells}
          className={styles.scriptTabs}
          activeKey={tab ?? 'transactions'}
          animated={{ inkBar: false }}
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
                `/${language}/script/${codeHash}/${hashType}/deployed_cells?page=${pageOfDeployedCells}&size=${pageSize}`,
              )
            } else if (key === 'referring_cells') {
              history.push(
                `/${language}/script/${codeHash}/${hashType}/referring_cells?page=${pageOfReferringCells}&size=${pageSize}`,
              )
            } else if (key === 'transactions') {
              history.push(`/${language}/script/${codeHash}/${hashType}?page=${pageOfTransactions}&size=${pageSize}`)
            }
          }}
          renderTabBar={(props, DefaultTabBar) => {
            return (
              <Card rounded="top" className={styles.cardHeader}>
                <DefaultTabBar {...props} className={styles.tablist} />
              </Card>
            )
          }}
        >
          <ScriptTabPane
            tab={
              <ScriptTabTitle>
                {`${t('transaction.transactions')} (${localeNumberString(countOfTransactions!)})`}
              </ScriptTabTitle>
            }
            key="transactions"
          >
            <ScriptTransactions page={currentPage} size={pageSize} />
          </ScriptTabPane>
          <ScriptTabPane
            tab={
              <ScriptTabTitle>
                {`${t('scripts.deployed_cells')} (${localeNumberString(countOfDeployedCells)})`}
              </ScriptTabTitle>
            }
            key="deployed_cells"
          >
            <ScriptCells page={currentPage} size={pageSize} cellType="deployed_cells" />
          </ScriptTabPane>
          <ScriptTabPane
            tab={
              <ScriptTabTitle>
                {`${t('scripts.referring_cells')} (${localeNumberString(countOfReferringCells)})`}
              </ScriptTabTitle>
            }
            key="referring_cells"
          >
            <ScriptCells page={currentPage} size={pageSize} cellType="referring_cells" />
          </ScriptTabPane>
        </ScriptTab>
      </div>
    </Content>
  )
}

export default ScriptPage
