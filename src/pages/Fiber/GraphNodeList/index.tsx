import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { CopyIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import dayjs from 'dayjs'
import Content from '../../../components/Content'
import { useSetToast } from '../../../components/Toast'
import { explorerService } from '../../../services/ExplorerService'
import type { Fiber } from '../../../services/ExplorerService/fetcher'
import Pagination from '../Pagination'
import { PAGE_SIZE } from '../../../constants/common'
import { useSearchParams } from '../../../hooks'
import { getFundingThreshold } from '../utils'
import styles from './index.module.scss'
import { shannonToCkb } from '../../../utils/util'
import { parseNumericAbbr } from '../../../utils/chart'
import { localeNumberString } from '../../../utils/number'

const TIME_TEMPLATE = 'YYYY/MM/DD hh:mm:ss'

const fields = [
  {
    key: 'alias',
    label: 'alias',
    transformer: (v: unknown, i: Fiber.Graph.Node) => {
      if (typeof v !== 'string') return v
      return (
        <Tooltip title={v}>
          <div className={styles.name}>
            <Link to={`/fiber/graph/node/${i.nodeId}`}>{v || <span style={{ color: '#999' }}>Untitled</span>}</Link>
          </div>
        </Tooltip>
      )
    },
  },
  {
    key: 'autoAcceptMinCkbFundingAmount',
    label: 'auto_accept_funding_amount',
    transformer: (_: unknown, n: Fiber.Graph.Node) => {
      const thresholds = getFundingThreshold(n)

      return (
        <div className={styles.funding}>
          {thresholds.map(threshold => {
            return (
              <Tooltip key={threshold.id} title={threshold.title}>
                <span className={styles.token}>
                  <img src={threshold.icon} alt="icon" width="12" height="12" loading="lazy" />
                  {threshold.display}
                </span>
              </Tooltip>
            )
          })}
        </div>
      )
    },
  },
  {
    key: 'totalCapacity',
    label: 'total_capacity',
    transformer: (v: unknown) => {
      if (typeof v !== 'string') return v

      const ckb = shannonToCkb(v)
      const amount = parseNumericAbbr(ckb)
      return (
        <Tooltip title={`${localeNumberString(ckb)} CKB`}>
          <span>{`${amount} CKB`}</span>
        </Tooltip>
      )
    },
  },
  {
    key: 'timestamp',
    label: 'first_seen',
    transformer: (v: unknown) => {
      if (typeof v !== 'string') return v
      return dayjs(+v).format(TIME_TEMPLATE)
    },
  },
  {
    key: 'nodeId',
    label: 'node_id',
    transformer: (v: unknown) => {
      if (typeof v !== 'string') return v
      return (
        <span className={styles.nodeId}>
          <Tooltip title={v}>
            <Link to={`/fiber/graph/node/${v}`} className="monospace">
              {v.length > 16 ? `0x${v.slice(0, 8)}...${v.slice(-8)}` : `0x${v}`}
            </Link>
          </Tooltip>
          <button type="button" data-copy-text={`0x${v}`}>
            <CopyIcon />
          </button>
        </span>
      )
    },
  },
  {
    key: 'chainHash',
    label: 'chain_hash',
    transformer: (v: unknown) => {
      if (typeof v !== 'string') return v
      return (
        <span className={styles.chainHash}>
          <Tooltip title={v}>
            <span className="monospace">{`${v.slice(0, 8)}...${v.slice(-8)}`}</span>
          </Tooltip>
          <button type="button" data-copy-text={v}>
            <CopyIcon />
          </button>
        </span>
      )
    },
  },
  {
    key: 'addresses',
    label: 'addresses',
    transformer: (v: unknown) => {
      if (!Array.isArray(v)) return v
      const addr = v[0]
      if (!addr || typeof addr !== 'string') return v
      return (
        <span className={styles.address}>
          <Tooltip title={addr}>
            <span>{addr}</span>
          </Tooltip>
          <button type="button" data-copy-text={v}>
            <CopyIcon />
          </button>
          {/* <a href={rpcAddr} title={rpcAddr} target="_blank" rel="noopener noreferrer"> */}
          {/*   <OpenInNewWindowIcon /> */}
          {/* </a> */}
          {v.length > 1 ? (
            <Tooltip title={`${v.length - 1} more address(es)`}>
              <span className={styles.more}>
                <InfoCircledIcon />
              </span>
            </Tooltip>
          ) : null}
        </span>
      )
    },
  },
]

const GraphNodeList = () => {
  const [t] = useTranslation()
  const setToast = useSetToast()
  const { page = 1, page_size: pageSize = PAGE_SIZE } = useSearchParams('page', 'page_size')

  const { data } = useQuery({
    queryKey: ['fiber', 'graph', 'nodes', +page, +pageSize],
    queryFn: () => explorerService.api.getGraphNodes(+page, +pageSize),
  })

  const list = data?.data.fiberGraphNodes ?? []
  const pageInfo = data?.meta ?? { total: 1, pageSize: PAGE_SIZE }
  const totalPages = Math.ceil(pageInfo.total / pageInfo.pageSize)

  const handleCopy = (e: React.SyntheticEvent) => {
    const elm = e.target
    if (!(elm instanceof HTMLElement)) return
    const { copyText } = elm.dataset
    if (!copyText) return
    e.stopPropagation()
    e.preventDefault()
    navigator?.clipboard.writeText(copyText).then(() => setToast({ message: t('common.copied') }))
  }

  return (
    <Content>
      <div className={styles.container} onClick={handleCopy}>
        <h1 className={styles.header}>
          <span>CKB Fiber Graph Nodes</span>
        </h1>
        <table>
          <thead>
            <tr>
              {fields.map(f => {
                return <th key={f.key}>{t(`fiber.graph.node.${f.label}`)}</th>
              })}
            </tr>
          </thead>
          <div className={styles.tableSeparator} />
          <tbody>
            {list.map(i => {
              return (
                <tr>
                  {fields.map(f => {
                    const v = i[f.key as keyof typeof i]
                    return <td key={f.key}>{f.transformer?.(v, i) ?? v}</td>
                  })}
                </tr>
              )
            })}
            <div className={styles.tableSeparator} />
            <tr data-role="pagination">
              <td colSpan={fields.length}>
                <Pagination totalPages={totalPages} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Content>
  )
}

export default GraphNodeList
