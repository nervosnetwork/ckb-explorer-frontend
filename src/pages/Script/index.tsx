import { useState } from 'react'
import { useHistory } from 'react-router'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
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
import { Card, CardCellInfo, CardCellsLayout } from '../../components/Card'
import { ReactComponent as OpenSourceIcon } from '../../assets/open-source.svg'
import { ReactComponent as VerifiedIcon } from '../../assets/verified-icon.svg'
import { ReactComponent as DeprecatedIcon } from '../../assets/deprecated-icon.svg'
import { ReactComponent as OwnerLessIcon } from '../../assets/ownerless-icon.svg'
import { ReactComponent as RFCIcon } from '../../assets/rfc-icon.svg'
import { ReactComponent as WebsiteIcon } from '../../assets/website-icon.svg'
import { HashType, GITHUB_ISSUE_URL } from '../../constants/common'
import Tooltip from '../../components/Tooltip'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs'

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
    verified,
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
        content: verified ? (
          <CodeHashMessage codeHash={outpointTxHash} />
        ) : (
          <Tooltip
            trigger={
              <Link to={GITHUB_ISSUE_URL} className={styles.unverifiedTooltip}>
                {t('scripts.unverified')}
              </Link>
            }
            placement="top"
          >
            {t('scripts.unverified_description')}
          </Tooltip>
        ),
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
            isZeroLock: false,
            isDeployedCellDead: false,
          },
        ]

  const countOfDeployedCells =
    scriptInfos[0]?.dataHash === '0x0000000000000000000000000000000000000000000000000000000000000000'
      ? 0
      : scriptInfos.length
  const countOfReferringCells = scriptInfos.reduce((sum, item) => sum + item.countOfReferringCells, 0)
  const countOfTransactions = scriptInfos.reduce((sum, item) => sum + item.countOfTransactions, 0)
  const liveScriptInfos = scriptInfos.filter(scriptInfo => !scriptInfo.isDeployedCellDead)
  const {
    name = '',
    sourceUrl = '',
    rfc = '',
    website = '',
    isZeroLock = false,
    verified = false,
    description = '',
    deprecated = false,
  } = liveScriptInfos[0] || {}

  return (
    <Content>
      <div className={`${styles.scriptContentPanel} container`}>
        <Card>
          <div className={styles.headerCard}>
            <span className={styles.headerTitle}>Script</span>
            {name ? (
              <span className={styles.headerSubTitle}>{name}</span>
            ) : (
              <span className={styles.headerSubTitle}>{codeHash}</span>
            )}

            <span className={styles.headerLink}>
              {verified === true ? (
                <Tooltip trigger={<VerifiedIcon />} placement="top">
                  {t('scripts.verified')}
                </Tooltip>
              ) : null}
              {deprecated === true ? (
                <Tooltip trigger={<DeprecatedIcon />} placement="top">
                  {t('scripts.deprecated')}
                </Tooltip>
              ) : null}
              {isZeroLock === true ? (
                <Tooltip trigger={<OwnerLessIcon />} placement="top">
                  {t('scripts.link.ownerless_cell')}
                </Tooltip>
              ) : null}
              {rfc ? (
                <Tooltip
                  trigger={
                    <Link to={rfc} className={styles.rfcAction}>
                      <RFCIcon />
                    </Link>
                  }
                  placement="top"
                >
                  {t('scripts.link.rfc')}
                </Tooltip>
              ) : null}
              {website ? (
                <Tooltip
                  trigger={
                    <Link to={website} className={styles.websiteAction}>
                      <WebsiteIcon />
                    </Link>
                  }
                  placement="top"
                >
                  {t('scripts.link.website')}
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

        {scriptInfos.length !== 0 && liveScriptInfos.length === 0 ? (
          <Card className={styles.noInfoCard}>
            <div>{t('scripts.no_live_cells')}</div>
          </Card>
        ) : (
          <ScriptInfosCard scriptInfos={liveScriptInfos} />
        )}
        <Tabs
          key={currentLanguage + countOfTransactions + countOfDeployedCells + countOfReferringCells}
          className={styles.scriptTabs}
          type="underline"
          value={tab ?? 'transactions'}
          style={{ marginTop: 24 }}
          onValueChange={key => {
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
        >
          <TabsList>
            <TabsTrigger value="transactions">
              <span className={styles.scriptTabTitle}>{`${t('transaction.transactions')}`}</span>
            </TabsTrigger>
            <TabsTrigger value="deployed_cells">
              <span className={styles.scriptTabTitle}>
                {`${t('scripts.deployed_cells')} (${localeNumberString(countOfDeployedCells)})`}
              </span>
            </TabsTrigger>
            <TabsTrigger value="referring_cells">
              <span className={styles.scriptTabTitle}>
                {`${t('scripts.referring_cells')} (${localeNumberString(countOfReferringCells)})`}
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="transactions" style={{ width: '100%' }}>
            <ScriptTransactions page={currentPage} size={pageSize} countOfTransactions={countOfTransactions} />
          </TabsContent>
          <TabsContent value="deployed_cells" style={{ width: '100%' }}>
            <ScriptCells page={currentPage} size={pageSize} cellType="deployed_cells" />
          </TabsContent>
          <TabsContent value="referring_cells" style={{ width: '100%' }}>
            <ScriptCells page={currentPage} size={100} cellType="referring_cells" />
          </TabsContent>
        </Tabs>
      </div>
    </Content>
  )
}

export default ScriptPage
