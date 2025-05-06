import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { InfoCircledIcon, Link1Icon, LinkBreak2Icon, UpdateIcon } from '@radix-ui/react-icons'
import dayjs from 'dayjs'
import Content from '../../../components/Content'
import { useSetToast } from '../../../components/Toast'
import { explorerService } from '../../../services/ExplorerService'
import type { Fiber } from '../../../services/ExplorerService'
import { ReactComponent as CopyIcon } from '../../../components/Copy/icon.svg'
import Pagination from '../Pagination'
import { PAGE_SIZE } from '../../../constants/common'
import { useSearchParams } from '../../../hooks'
import { getFundingThreshold } from '../utils'
import styles from './index.module.scss'
import { handleFtImgError, shannonToCkb } from '../../../utils/util'
import { parseNumericAbbr } from '../../../utils/chart'
import { localeNumberString } from '../../../utils/number'
import GraphNodeIps from '../../../components/GraphNodeIps'
import FtFallbackIcon from '../../../assets/ft_fallback_icon.png'
import { fetchIpsInfo, IpInfo } from '../../../services/UtilityService'
import { getIpFromP2pAddr } from '../../../utils/fiber'

const TIME_TEMPLATE = 'YYYY-MM-DD'

const fields = [
  {
    key: 'nodeName',
    label: 'name',
    transformer: (v: unknown, i: Fiber.Graph.Node) => {
      if (typeof v !== 'string') return v
      return (
        <Tooltip title={v}>
          <div className={styles.name}>
            <Link to={`/fiber/graph/node/${i.nodeId}`}>
              {v || <span className={styles.nameFallback}>Untitled</span>}
            </Link>
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
      const displays = thresholds.slice(0, 2)
      const hiddens = thresholds.slice(2)

      return (
        <div className={styles.funding}>
          {displays.map(threshold => {
            return (
              <Tooltip key={threshold.id} title={threshold.title}>
                <span className={styles.token}>
                  <img
                    src={threshold.icon ?? FtFallbackIcon}
                    alt="icon"
                    width="12"
                    height="12"
                    loading="lazy"
                    onError={handleFtImgError}
                  />
                  {threshold.display}
                </span>
              </Tooltip>
            )
          })}
          {hiddens.length ? (
            <div data-hover="stop-propagation">
              <span className={styles.hiddenThresholds}>
                <span className={styles.count}>{`+${hiddens.length}`}</span>
                <div className={styles.items}>
                  {hiddens.map(threshold => {
                    return (
                      <div>
                        <img
                          src={threshold.icon ?? FtFallbackIcon}
                          alt="icon"
                          width="12"
                          height="12"
                          loading="lazy"
                          onError={handleFtImgError}
                        />
                        {threshold.display}
                      </div>
                    )
                  })}
                </div>
              </span>
            </div>
          ) : null}
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
      const amount = parseNumericAbbr(ckb, 2)
      return (
        <Tooltip title={`${localeNumberString(ckb)} CKB`}>
          <span>{`${amount} CKB`}</span>
        </Tooltip>
      )
    },
  },
  {
    key: 'openChannelsCount',
    label: 'open_channels',
    transformer: (v: unknown) => {
      if (typeof v !== 'string') return v

      return localeNumberString(v)
    },
  },
  {
    key: 'timestamp',
    label: 'first_seen_last_update',
    transformer: (_: unknown, n: Fiber.Graph.Node) => {
      const { createdTimestamp, deletedAtTimestamp, lastUpdatedTimestamp } = n

      const firstSeen = createdTimestamp
      const lastSeen = deletedAtTimestamp ?? lastUpdatedTimestamp

      const firstSeenISO = new Date(+firstSeen).toISOString()
      const lastSeenISO = new Date(+lastSeen).toISOString()
      return (
        <div className={styles.times}>
          <time dateTime={firstSeenISO} title={firstSeenISO}>
            <Link1Icon color="var(--primary-color)" />
            {dayjs(+firstSeen).format(TIME_TEMPLATE)}
          </time>
          <time dateTime={lastSeenISO} title={lastSeenISO} data-is-offline={!!deletedAtTimestamp}>
            {deletedAtTimestamp ? <LinkBreak2Icon color="#666" /> : <UpdateIcon color="var(--primary-color)" />}
            {dayjs(+lastSeen).format(TIME_TEMPLATE)}
          </time>
        </div>
      )
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
            <CopyIcon color="#999" />
          </button>
        </span>
      )
    },
  },
  {
    key: 'addresses',
    label: 'addresses_and_isp',
    transformer: (v: unknown, n: Fiber.Graph.Node & { ipInfo: IpInfo | null }) => {
      if (!Array.isArray(v)) return v
      const addr = v[0]
      if (!addr || typeof addr !== 'string') {
        return (
          <Tooltip title="Not Revealed">
            <span>
              <LinkBreak2Icon />
            </span>
          </Tooltip>
        )
      }

      const [, protocol, ip] = addr.split('/')
      const { ipInfo } = n

      return (
        <div className={styles.address}>
          <span>
            <Tooltip title={addr}>
              <span>{`${ip} (${protocol.toUpperCase()})`}</span>
              <button type="button" data-copy-text={v}>
                <CopyIcon color="#999" />
              </button>
            </Tooltip>
            {v.length > 1 ? (
              <Tooltip title={`${v.length - 1} more address(es)`}>
                <span className={styles.more}>
                  <InfoCircledIcon />
                </span>
              </Tooltip>
            ) : null}
          </span>
          {ipInfo ? (
            <Tooltip title={`${ipInfo.isp}@${ipInfo.city}`}>
              <div className={styles.isp}>
                <span>{ipInfo.isp}</span>
                <span>@{ipInfo.city}</span>
              </div>
            </Tooltip>
          ) : null}
        </div>
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
    queryFn: () => explorerService.api.getGraphNodes({ page: +page, pageSize: +pageSize }),
  })

  const list = data?.data.fiberGraphNodes ?? []
  const pageInfo = data?.meta ?? { total: 1, pageSize: PAGE_SIZE }
  const totalPages = Math.ceil(pageInfo.total / pageInfo.pageSize)

  const ips = list
    .map(i => i.addresses[0])
    .filter(a => !!a)
    .map(getIpFromP2pAddr)
    .filter(ip => !!ip) as string[]

  const { data: ipInfos } = useQuery({
    queryKey: ['fiber_graph_ips_info', ips.join(',')],
    queryFn: () => (ips.length ? fetchIpsInfo(ips) : undefined),
    enabled: !!ips.length,
  })

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
        <div className={styles.geo}>
          <h5>{t('fiber.graph.public_fiber_node_world_map')}</h5>
          <GraphNodeIps />
        </div>
        <table>
          <thead>
            <tr data-role="header">
              <td colSpan={fields.length}>
                <h1 className={styles.header}>
                  <span>{t('fiber.graph.public_fiber_nodes')}</span>
                </h1>
              </td>
            </tr>
            <div className={styles.tableSeparator} />
            <tr>
              {fields.map(f => {
                return <th key={f.key}>{t(`fiber.graph.node.${f.label}`)}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {list.map(i => {
              return (
                <tr>
                  {fields.map(f => {
                    const v = i[f.key as keyof typeof i]
                    const primaryAddr = i.addresses[0]
                    let ipInfo = null
                    if (primaryAddr && ipInfos) {
                      const ip = getIpFromP2pAddr(primaryAddr)
                      if (ip) {
                        ipInfo = ipInfos.ips[ip]
                      }
                    }
                    const n = {
                      ...i,
                      ipInfo,
                    }
                    return (
                      <td key={f.key}>
                        <span className={styles.cellLabel}>{t(`fiber.graph.node.${f.label}`)}</span>
                        {f.transformer?.(v, n) ?? v}
                      </td>
                    )
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
