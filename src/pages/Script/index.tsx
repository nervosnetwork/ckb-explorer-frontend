import { useState } from 'react'
import { useHistory } from 'react-router'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Tooltip } from 'antd'
import { TFunction, useTranslation } from 'react-i18next'
import { Link } from '../../components/Link'
import Content from '../../components/Content'
import { useCurrentLanguage } from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { CodeHashMessage, ScriptCells, ScriptTransactions } from './ScriptsComp'
import { usePaginationParamsInPage } from '../../hooks'
import { shannonToCkb } from '../../utils/util'
import Capacity from '../../components/Capacity'
import styles from './styles.module.scss'
import { type ScriptInfo, explorerService } from '../../services/ExplorerService'
import { ScriptTab, ScriptTabPane, ScriptTabTitle } from './styled'
import { Card, CardCellInfo, CardCellsLayout } from '../../components/Card'
import { ReactComponent as OpenSourceIcon } from '../../assets/open-source.svg'
import { ReactComponent as VerifiedIcon } from '../../assets/verified-icon.svg'
import { ReactComponent as DeprecatedIcon } from '../../assets/deprecated-icon.svg'
import { ReactComponent as RFCIcon } from '../../assets/rfc-icon.svg'
import { ReactComponent as WebsiteIcon } from '../../assets/website-icon.svg'
import { HashType } from '../../constants/common'

const getScriptInfo = (scriptInfo: ScriptInfo, t: TFunction) => {
  const {
    dataHash,
    typeHash,
    hashType,
    depType,
    isLockScript,
    isTypeScript,
    capacityOfDeployedCells,
    capacityOfReferringCells,
    scriptOutPoint,
  } = scriptInfo
  const [outpointTxHash, outpointIndex] = scriptOutPoint.split('-')
  const parsedHashType = hashType === null ? 'Type' : hashType
  const scriptType = `${isTypeScript ? t('scripts.type_script') : ''} ${isLockScript ? t('scripts.lock_script') : ''}`
  const items: CardCellInfo<'left' | 'right'>[] = [
    {
      slot: 'left',
      cell: {
        title: t('scripts.script_type'),
        content: scriptType,
      },
    },
    {
      title: t('scripts.code_hash'),
      content:
        parsedHashType === 'Type' ? <CodeHashMessage codeHash={typeHash} /> : <CodeHashMessage codeHash={dataHash} />,
    },
    {
      slot: 'right',
      cell: {
        title: t('scripts.hash_type'),
        tooltip: t('glossary.hash_type'),
        content: <span className={styles.hashType}>{parsedHashType}</span>,
      },
    },
    {
      slot: 'right',
      cell:
        parsedHashType === 'Type'
          ? {
              title: t('scripts.data_hash'),
              content: dataHash ? <CodeHashMessage codeHash={dataHash} /> : '-',
            }
          : {
              title: t('scripts.type_hash'),
              content: typeHash ? <CodeHashMessage codeHash={typeHash} /> : '-',
            },
    },
    {
      slot: 'left',
      cell: {
        title: t('scripts.outpoint_tx_hash'),
        content: <CodeHashMessage codeHash={outpointTxHash} />,
      },
    },
    {
      slot: 'left',
      cell: {
        title: t('scripts.outpoint_index'),
        content: outpointIndex,
      },
    },
    {
      slot: 'left',
      cell: {
        title: t('scripts.outpoint_dep_type'),
        content: depType,
      },
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

type ScriptTabType = 'transactions' | 'deployed_cells' | 'referring_cells' | undefined

export function ScriptInfosCard({ scriptInfos }: { scriptInfos: ScriptInfo[] }) {
  const { t } = useTranslation()
  return (
    <>
      {scriptInfos.map(scriptInfo => (
        <Card style={{ marginTop: 24 }} key={scriptInfo.scriptOutPoint}>
          <CardCellsLayout type="left-right" cells={getScriptInfo(scriptInfo, t)} />
        </Card>
      ))}
    </>
  )
}

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

  const [pageOfTransactions, setPageOfTransactions] = useState<number>(1)
  const [pageOfDeployedCells, setPageOfDeployedCells] = useState<number>(1)
  const [pageOfReferringCells, setPageOfReferringCells] = useState<number>(1)

  const { status, data: resp } = useQuery(['scripts_general_info', codeHash, hashType], () =>
    explorerService.api.fetchScriptInfo(codeHash, hashType),
  )

  const scriptInfos: ScriptInfo[] =
    status === 'success' && resp
      ? resp.data
      : [
          {
            name: '',
            dataHash: '',
            typeHash: '',
            depType: '',
            hashType: hashType as HashType,
            isTypeScript: false,
            isLockScript: false,
            capacityOfDeployedCells: '0',
            capacityOfReferringCells: '0',
            countOfTransactions: 0,
            countOfReferringCells: 0,
            rfc: '',
            website: '',
            sourceUrl: '',
            deprecated: false,
            verified: false,
            scriptOutPoint: '',
            description: '',
          },
        ]

  const countOfDeployedCells = scriptInfos.length
  const countOfReferringCells = scriptInfos.reduce((sum, item) => sum + item.countOfReferringCells, 0)
  const countOfTransactions = scriptInfos.reduce((sum, item) => sum + item.countOfTransactions, 0)
  const { name, sourceUrl, rfc, website, deprecated, verified, description } = scriptInfos[0]

  return (
    <Content>
      <div className={`${styles.scriptContentPanel} container`}>
        <Card>
          <div className={styles.headerCard}>
            <span className={styles.headerTitle}>Script</span>
            {name ? <span className={styles.headerSubTitle}>{name}</span> : null}

            <span className={styles.headerLink}>
              {verified === true ? (
                <Tooltip title={t('scripts.verified')} placement="top">
                  <VerifiedIcon />
                </Tooltip>
              ) : null}
              {deprecated === true ? (
                <Tooltip title={t('scripts.deprecated')} placement="top">
                  <DeprecatedIcon />
                </Tooltip>
              ) : null}
              {rfc ? (
                <Tooltip title={t('scripts.link.rfc')} placement="top">
                  <Link to={rfc} className={styles.rfcAction}>
                    <RFCIcon />
                  </Link>
                </Tooltip>
              ) : null}
              {website ? (
                <Tooltip title={t('scripts.link.website')} placement="top">
                  <Link to={website} className={styles.websiteAction}>
                    <WebsiteIcon />
                  </Link>
                </Tooltip>
              ) : null}
              {sourceUrl ? (
                <Link to={sourceUrl} className={styles.openSourceAction}>
                  {t('scripts.open_source_script')}
                  <OpenSourceIcon />
                </Link>
              ) : null}
            </span>
          </div>
          <div className={styles.headerDescription}>{description}</div>
        </Card>

        <ScriptInfosCard scriptInfos={scriptInfos} />
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
          <ScriptTabPane tab={<ScriptTabTitle>{`${t('transaction.transactions')}`}</ScriptTabTitle>} key="transactions">
            <ScriptTransactions page={currentPage} size={pageSize} countOfTransactions={countOfTransactions} />
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
            <ScriptCells page={currentPage} size={100} cellType="referring_cells" />
          </ScriptTabPane>
        </ScriptTab>
      </div>
    </Content>
  )
}

export default ScriptPage
