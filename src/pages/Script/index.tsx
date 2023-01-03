import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useParams } from 'react-router-dom'
import { CopyOutlined } from '@ant-design/icons'
import Content from '../../components/Content'
import { useDispatch } from '../../contexts/providers'
import { ScriptContentPanel, ScriptsTitleOverviewPanel, ScriptTabs } from './styled'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import i18n from '../../utils/i18n'
import { HashCardPanel } from '../../components/Card/HashCard/styled'
import { parsePageNumber } from '../../utils/string'
import { PageParams } from '../../constants/common'
import { localeNumberString } from '../../utils/number'
import { AppActions } from '../../contexts/actions'
import { AppDispatch } from '../../contexts/reducer'
import { ScriptCells, ScriptTransactions } from './ScriptsComp'

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
          {codeHash && `${codeHash.substring(0, 20)}...${codeHash.substring(50)}`}
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

export interface ScriptInfo {
  scriptName: string
  scriptType: string
  typeId: number
  codeHash: string
  hashType: string
  capacityOfDeployedCells: string
  capacityOfReferringCells: string
  ckbTransactions?: {
    total?: number
    page?: number
    size?: number
  }
  deployedCells?: {
    total?: number
    page?: number
    size?: number
  }
  referringCells?: {
    total?: number
    page?: number
    size?: number
  }
}

const initScriptInfo: ScriptInfo = {
  scriptName: '',
  scriptType: '',
  typeId: 0,
  codeHash: '',
  hashType: '',
  capacityOfDeployedCells: '',
  capacityOfReferringCells: '',
  ckbTransactions: {
    total: 0,
    page: 1,
    size: 10,
  },
  deployedCells: {
    total: 0,
    page: 1,
    size: 10,
  },
  referringCells: {
    total: 0,
    page: 1,
    size: 10,
  },
}

export type ScriptTabType = 'transactions' | 'deployed_cells' | 'referring_cells' | undefined

export const ScriptPage = () => {
  const history = useHistory()
  const { search } = useLocation()
  const { codeHash, hashType, tab } = useParams<{ codeHash: string; hashType: string; tab: ScriptTabType }>()
  const anchor = (tab ?? 'transactions') as ScriptTabType
  const [activeTab, setActiveTab] = useState<ScriptTabType>(anchor)
  const searchParams = new URLSearchParams(search)
  const currentPage = parsePageNumber(searchParams.get('page'), PageParams.PageNo)
  const pageSize = parsePageNumber(searchParams.get('size'), PageParams.PageSize)
  const [scriptInfo, setScriptInfo] = useState<ScriptInfo>(initScriptInfo)

  useEffect(() => {
    if (anchor === 'deployed_cells') {
      setActiveTab('deployed_cells')
    } else if (anchor === 'referring_cells') {
      setActiveTab('referring_cells')
    } else {
      setActiveTab('transactions')
    }
  }, [anchor, codeHash, currentPage, hashType, pageSize, scriptInfo, tab])

  return (
    <Content>
      <ScriptContentPanel className="container">
        <HashCardPanel isColumn={false}>
          <ScriptsTitleOverview scriptInfo={scriptInfo} />
        </HashCardPanel>
        <ScriptTabs
          activeKey={activeTab}
          onTabClick={key => {
            if (key === 'deployed_cells') {
              history.push(
                `/script/${codeHash}/${hashType}/deployed_cells?page=${scriptInfo!.deployedCells!.page}&size=${
                  scriptInfo!.deployedCells!.size
                }`,
              )
              setActiveTab('deployed_cells')
            } else if (key === 'referring_cells') {
              history.push(
                `/script/${codeHash}/${hashType}/referring_cells?page=${scriptInfo!.referringCells!.page}&size=${
                  scriptInfo!.referringCells!.size
                }`,
              )
              setActiveTab('referring_cells')
            } else {
              history.push(
                `/script/${codeHash}/${hashType}?page=${scriptInfo!.ckbTransactions!.page}&size=${
                  scriptInfo!.ckbTransactions!.size
                }`,
              )
              setActiveTab('transactions')
            }
          }}
          items={[
            {
              label: `${i18n.t('transaction.transactions')} (${localeNumberString(
                scriptInfo!.ckbTransactions!.total!,
              )})`,
              key: 'transactions',
              children: <ScriptTransactions page={currentPage} size={pageSize} setScriptInfo={setScriptInfo} />,
            },
            {
              label: `${i18n.t('scripts.deployed_cells')} (${localeNumberString(scriptInfo!.deployedCells!.total!)})`,
              key: 'deployed_cells',
              children: (
                <ScriptCells
                  page={currentPage}
                  size={pageSize}
                  setScriptInfo={setScriptInfo}
                  cellType="deployed_cells"
                />
              ),
            },
            {
              label: `${i18n.t('scripts.referring_cells')} (${localeNumberString(scriptInfo!.referringCells!.total!)})`,
              key: 'referring_cells',
              children: (
                <ScriptCells
                  page={currentPage}
                  size={pageSize}
                  setScriptInfo={setScriptInfo}
                  cellType="referring_cells"
                />
              ),
            },
          ]}
        />
      </ScriptContentPanel>
    </Content>
  )
}

export default ScriptPage
