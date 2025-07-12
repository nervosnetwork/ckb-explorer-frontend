import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react'
import { TFunction } from 'i18next'
import classNames from 'classnames'
import Content from '../../components/Content'
import styles from './styles.module.scss'
import { explorerService } from '../../services/ExplorerService'
import { usePaginationParamsInPage, useSortParam, useSearchParams } from '../../hooks'
import Pagination from '../../components/Pagination'
import type { ScriptDetail } from '../../models/Script'
import { QueryResult } from '../../components/QueryResult'
import { Card } from '../../components/Card'
import SortButton from '../../components/SortButton'
import Capacity from '../../components/Capacity'
import MultiFilterButton from '../../components/MultiFilterButton'
import { Link } from '../../components/Link'
import SmallLoading from '../../components/Loading/SmallLoading'
import { parseSimpleDate } from '../../utils/date'
import { shannonToCkb } from '../../utils/util'
import { ReactComponent as OwnerLessIcon } from '../../assets/ownerless-icon.svg'
import { ReactComponent as DeprecatedIcon } from '../../assets/deprecated-icon.svg'
import { ReactComponent as OpenSourceIcon } from '../../assets/open-source.svg'
import { ReactComponent as RFCIcon } from '../../assets/rfc-icon.svg'
import { ReactComponent as WebsiteIcon } from '../../assets/website-icon.svg'
import Tooltip from '../../components/Tooltip'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'

type SortField = 'capacity' | 'timestamp'

const getfilterList = (t: TFunction) => [
  {
    key: 'lock',
    value: 'lock',
    title: t('scripts.lock_script'),
    to: '/scripts',
  },
  {
    key: 'type',
    value: 'type',
    title: t('scripts.type_script'),
    to: '/scripts',
  },
]

const getNotefilterList = (t: TFunction) => [
  {
    key: 'ownerless_cell',
    value: 'ownerless_cell',
    title: (
      <>
        <OwnerLessIcon />
        {t('scripts.link.ownerless_cell')}
      </>
    ),
    to: '/scripts',
  },
  {
    key: 'deprecated',
    value: 'deprecated',
    title: (
      <>
        <DeprecatedIcon />
        {t('scripts.deprecated')}
      </>
    ),
    to: '/scripts',
  },

  {
    key: 'rfc',
    value: 'rfc',
    title: (
      <>
        <RFCIcon />
        {t('scripts.link.rfc')}
      </>
    ),
    to: '/scripts',
  },
  {
    key: 'website',
    value: 'website',
    title: (
      <>
        <WebsiteIcon />
        {t('scripts.link.website')}
      </>
    ),
    to: '/scripts',
  },
  {
    key: 'open_source',
    value: 'open_source',
    title: (
      <>
        <OpenSourceIcon />
        {t('scripts.link.code')}
      </>
    ),
    to: '/scripts',
  },
]
const ScriptInfo: FC<{ script: ScriptDetail }> = ({ script }) => {
  const { t } = useTranslation()
  const codeHash = script.hashType === null ? script.typeHash : script.dataHash
  const hashType = script.hashType === null ? 'type' : script.hashType

  const fields: { name: string; value: ReactNode }[] = [
    {
      name: t('scripts.capacity_of_referring_cells'),
      value: <Capacity capacity={shannonToCkb(script.totalReferringCellsCapacity)} display="short" />,
    },
    {
      name: t('scripts.timestamp'),
      value: script.deployedBlockTimestamp ? parseSimpleDate(+script.deployedBlockTimestamp) : null,
    },
  ]

  return (
    <Card key={script.typeHash} className={styles.tokensCard}>
      <dl className={styles.tokenInfo}>
        <dt className={styles.title}>Name</dt>
        <dd>
          <Link className={styles.link} to={`/script/${codeHash}/${hashType}`}>
            {script.name}
          </Link>
        </dd>
      </dl>
      <dl className={styles.tokenInfo}>
        <dt className={styles.title}>{t('scripts.script_note')}</dt>
        <dd className={styles.tdNotes}>
          {script.isZeroLock && <OwnerLessIcon />}
          {script.deprecated && <DeprecatedIcon />}
          {script.rfc && (
            <Link to={script.rfc}>
              <RFCIcon />
            </Link>
          )}
          {script.website && (
            <Link to={script.website}>
              <WebsiteIcon />
            </Link>
          )}
          {script.sourceUrl && (
            <Link to={script.sourceUrl}>
              <OpenSourceIcon />
            </Link>
          )}
        </dd>
      </dl>
      <dl className={styles.tokenInfo}>
        <dt className={styles.title}>{t('scripts.script_type')}</dt>
        {script.isTypeScript && <dd className={styles.value}>{t('scripts.type_script')}</dd>}
        {script.isLockScript && <dd className={styles.value}>{t('scripts.lock_script')}</dd>}
      </dl>
      {fields.map(field => (
        <dl key={field.name} className={styles.tokenInfo}>
          <dt className={styles.title}>{field.name}</dt>
          <dd className={styles.value}>{field.value}</dd>
        </dl>
      ))}
    </Card>
  )
}

function ScriptCard({
  query,
}: {
  query: UseQueryResult<{
    data: ScriptDetail[]
    meta: {
      total: number
      pageSize: number
    }
  }>
}) {
  const { t } = useTranslation()
  const { sortBy, orderBy, updateOrderBy, handleSortClick } = useSortParam<SortField>(undefined, 'capacity.desc')

  return (
    <>
      <Card className="p-2!" shadow={false}>
        <div className="flex flex-wrap gap-2">
          <span className={classNames(styles.sortOption, 'gap-1 text-nowrap mr-auto')}>
            {t('scripts.script_type')}
            <MultiFilterButton filterName="script_type" key="" filterList={getfilterList(t)} />
          </span>
          <div className="flex items-center">
            <Select value={sortBy} onValueChange={value => handleSortClick(value as SortField)}>
              <SelectTrigger className="border-r-0! rounded-r-none!">
                <SelectValue placeholder="sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="capacity">{t('scripts.capacity_of_referring_cells')}</SelectItem>
                <SelectItem value="timestamp">{t('scripts.timestamp')}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="rounded-l-none!"
              variant="outline"
              size="icon"
              onClick={() => updateOrderBy(orderBy === 'desc' ? 'asc' : 'desc')}
            >
              {orderBy === 'desc' ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />}
            </Button>
          </div>
        </div>
      </Card>

      <QueryResult
        query={query}
        loadingRender={() => (
          <div className={styles.tokensLoadingPanel}>
            <SmallLoading />
          </div>
        )}
      >
        {data => (
          <div>
            {data?.data.map(script => (
              <ScriptInfo key={script.typeHash ?? script.dataHash} script={script} />
            ))}
          </div>
        )}
      </QueryResult>
    </>
  )
}

const ScriptTable: FC<{
  scripts: ScriptDetail[]
  sortParam?: ReturnType<typeof useSortParam<SortField>>
}> = ({ scripts, sortParam }) => {
  const { t } = useTranslation()

  const columns = [
    {
      title: t('scripts.script_name'),
      className: styles.colName,
      key: 'name',
      render: (script: ScriptDetail) => {
        const codeHash = script.hashType === null ? script.typeHash : script.dataHash
        const hashType = script.hashType === null ? 'type' : script.hashType

        return (
          <div className={styles.container}>
            <div className={styles.right}>
              <div className={styles.symbolAndName}>
                <Link className={styles.link} to={`/script/${codeHash}/${hashType}`}>
                  {script.name}
                </Link>
                <div className={styles.codeHash}>
                  {codeHash.slice(0, 10)}...{codeHash.slice(-8)}
                </div>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      title: (
        <div>
          {t('scripts.script_note')}
          <MultiFilterButton filterName="script_note" key="" filterList={getNotefilterList(t)} />
        </div>
      ),
      classNames: styles.colNotes,
      key: 'script_note',
      render: (script: ScriptDetail) => (
        <div className={styles.tdNotes}>
          {script.isZeroLock === true ? (
            <Tooltip trigger={<OwnerLessIcon />} placement="top">
              {t('scripts.link.ownerless_cell')}
            </Tooltip>
          ) : null}
          {script.deprecated === true ? (
            <Tooltip trigger={<DeprecatedIcon />} placement="top">
              {t('scripts.deprecated')}
            </Tooltip>
          ) : null}
          {script.rfc ? (
            <Tooltip
              trigger={
                <Link to={script.rfc} className={styles.rfcAction}>
                  <RFCIcon />
                </Link>
              }
              placement="top"
            >
              {t('scripts.link.rfc')}
            </Tooltip>
          ) : null}
          {script.website ? (
            <Tooltip
              trigger={
                <Link to={script.website} className={styles.websiteAction}>
                  <WebsiteIcon />
                </Link>
              }
              placement="top"
            >
              {t('scripts.link.website')}
            </Tooltip>
          ) : null}
          {script.sourceUrl ? (
            <Tooltip
              trigger={
                <Link to={script.sourceUrl} className={styles.openSourceAction}>
                  <OpenSourceIcon />
                </Link>
              }
              placement="top"
            >
              {t('scripts.link.code')}
            </Tooltip>
          ) : null}
        </div>
      ),
    },
    {
      title: (
        <div>
          {t('scripts.script_type')}
          <MultiFilterButton filterName="script_type" key="" filterList={getfilterList(t)} />
        </div>
      ),
      key: 'script_type',
      className: styles.colTags,
      render: (script: ScriptDetail) => (
        <div className={styles.tags}>
          {script.isTypeScript && <span className={styles.tag}>{t('scripts.type_script')}</span>}
          {script.isLockScript && <span className={styles.tag}>{t('scripts.lock_script')}</span>}
        </div>
      ),
    },
    {
      title: (
        <div>
          {t('scripts.capacity_of_referring_cells')}
          <SortButton field="capacity" sortParam={sortParam} />
        </div>
      ),
      key: 'capacity',
      className: styles.colTransactions,
      render: (script: ScriptDetail) => (
        <Capacity capacity={shannonToCkb(script.totalReferringCellsCapacity)} display="short" />
      ),
    },
    {
      title: (
        <div>
          {t('scripts.timestamp')}
          <SortButton field="timestamp" sortParam={sortParam} />
        </div>
      ),
      key: 'timestamp',
      className: styles.colCreatedTime,
      render: (script: ScriptDetail) => parseSimpleDate(+script.deployedBlockTimestamp),
    },
    {
      key: 'action',
      render: (script: ScriptDetail) => {
        const codeHash = script.hashType === null ? script.typeHash : script.dataHash
        const hashType = script.hashType === null ? 'type' : script.hashType
        return (
          <div>
            <Link className={styles.action} to={`/script/${codeHash}/${hashType}`}>
              {t('scripts.detail')}
            </Link>
          </div>
        )
      },
    },
  ]

  return (
    <table className={styles.tokensTable}>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column.key}>{column.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {scripts.map(script => (
          <tr key={script.typeHash ?? script.dataHash}>
            {columns.map(column => (
              <td key={column.key} className={column.className}>
                {column.render?.(script)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const ScriptList: FC = () => {
  const { t } = useTranslation()
  const { script_type: scriptType } = useSearchParams('script_type') ?? []
  const { script_note: scriptNote } = useSearchParams('script_note') ?? []

  const { currentPage, pageSize: _pageSize, setPage } = usePaginationParamsInPage()
  const sortParam = useSortParam<SortField>(undefined, 'capacity.desc')
  const { sort } = sortParam

  const scriptTypeArr = scriptType ? decodeURIComponent(scriptType).split(',') : []
  const scriptNoteArr = scriptNote ? decodeURIComponent(scriptNote).split(',') : []

  const query = useQuery(['scripts', currentPage, _pageSize, sort, scriptTypeArr, scriptNoteArr], () =>
    explorerService.api.fetchScripts(currentPage, _pageSize, sort ?? undefined, scriptTypeArr, scriptNoteArr),
  )

  const meta = query?.data?.meta ?? { total: 0, pageSize: 10 }
  const pageSize = meta.pageSize ?? _pageSize
  const totalPages = Math.ceil(meta.total / pageSize)

  return (
    <Content>
      <div className={classNames(styles.tokensPanel, 'container')}>
        <div className={styles.title}>{t(`script_list.title`)}</div>
        <div className={styles.cards}>
          <ScriptCard query={query} />
        </div>
        <div className={styles.table}>
          <ScriptTable scripts={query.data?.data ?? []} sortParam={sortParam} />
        </div>

        <Pagination
          className={styles.pagination}
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>
    </Content>
  )
}

export default ScriptList
