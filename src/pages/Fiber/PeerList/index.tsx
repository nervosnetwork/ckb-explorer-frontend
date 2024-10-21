import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { CopyIcon, InfoCircledIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons'
import Content from '../../../components/Content'
import { useSetToast } from '../../../components/Toast'
import { explorerService } from '../../../services/ExplorerService'
import type { Fiber } from '../../../services/ExplorerService/fetcher'
import { shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import { parseNumericAbbr } from '../../../utils/chart'
import styles from './index.module.scss'
import AddPeerForm from './AddPeerForm'
import Pagination from '../Pagination'
import { PAGE_SIZE } from '../../../constants/common'
import { useSearchParams } from '../../../hooks'

const fields = [
  {
    key: 'name',
    label: 'name',
    transformer: (v: unknown, i: Fiber.Peer.ItemInList) => {
      if (typeof v !== 'string') return v
      return (
        <Tooltip title={v}>
          <div className={styles.name}>
            <Link to={`/fiber/peers/${i.peerId}`}>{v}</Link>
          </div>
        </Tooltip>
      )
    },
  },
  {
    key: 'channelsCount',
    label: 'channels_count',
    transformer: (v: unknown) => {
      if (typeof v !== 'number') return v
      return localeNumberString(v)
    },
  },
  {
    key: 'totalLocalBalance',
    label: 'total_local_balance',
    transformer: (v: unknown) => {
      if (typeof v !== 'string' || Number.isNaN(+v)) return v
      const ckb = shannonToCkb(v)
      const amount = parseNumericAbbr(ckb)
      return (
        <div className={styles.balance}>
          <Tooltip title={`${localeNumberString(ckb)} CKB`}>
            <span>{`${amount} CKB`}</span>
          </Tooltip>
          <small>Share: coming soon</small>
        </div>
      )
    },
  },
  {
    key: 'firstChannelOpenedAt',
    label: 'open_time',
    transformer: () => {
      return <small>Coming soon</small>
    },
  },
  {
    key: 'lastChannelUpdatedAt',
    label: 'update_time',
    transformer: () => {
      return <small>Coming soon</small>
    },
  },
  {
    key: 'peerId',
    label: 'peer_id',
    transformer: (v: unknown) => {
      if (typeof v !== 'string') return v
      return (
        <span className={styles.peerId}>
          <Tooltip title={v}>
            <Link to={`/fiber/peers/${v}`} className="monospace">
              {v.length > 16 ? `${v.slice(0, 8)}...${v.slice(-8)}` : v}
            </Link>
          </Tooltip>
          <button type="button" data-copy-text={v}>
            <CopyIcon />
          </button>
        </span>
      )
    },
  },
  {
    key: 'rpcListeningAddr',
    label: 'rpc_addr',
    transformer: (v: unknown) => {
      if (!Array.isArray(v)) return v
      const rpcAddr = v[0]
      if (!rpcAddr || typeof rpcAddr !== 'string') return v
      return (
        <span className={styles.rpc}>
          <Tooltip title={rpcAddr}>
            <span>{rpcAddr}</span>
          </Tooltip>
          <button type="button" data-copy-text={v}>
            <CopyIcon />
          </button>
          <a href={rpcAddr} title={rpcAddr} target="_blank" rel="noopener noreferrer">
            <OpenInNewWindowIcon />
          </a>
          {v.length > 1 ? (
            <Tooltip title={`${v.length - 1} more rpc address(es)`}>
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

const PeerList = () => {
  const [t] = useTranslation()
  const setToast = useSetToast()
  const { page = 1, page_size: pageSize = PAGE_SIZE } = useSearchParams('page', 'page_size')

  const { data, refetch: refetchList } = useQuery({
    queryKey: ['fiber', 'peers', +page, +pageSize],
    queryFn: () => explorerService.api.getFiberPeerList(+page, +pageSize),
  })

  const list = data?.data.fiberPeers ?? []
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
          <span>CKB Fiber Peers</span>

          <AddPeerForm onSuccess={() => refetchList()} />
        </h1>
        <table>
          <thead>
            <tr>
              {fields.map(f => {
                return <th key={f.key}>{t(`fiber.peer.${f.label}`)}</th>
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

export default PeerList
