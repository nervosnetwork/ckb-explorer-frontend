import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { CopyIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons'
import Content from '../../../components/Content'
import { useSetToast } from '../../../components/Toast'
import { explorerService } from '../../../services/ExplorerService'
import type { Fiber } from '../../../services/ExplorerService/fetcher'
import { shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import { parseNumericAbbr } from '../../../utils/chart'
import styles from './index.module.scss'

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
        <Tooltip title={`${localeNumberString(ckb)} CKB`}>
          <span>{`${amount} CKB`}</span>
        </Tooltip>
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
            <Link to={`/fiber/peers/${v}`}>{`${v.slice(0, 8)}...${v.slice(-8)}`}</Link>
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
      if (typeof v !== 'string') return v
      return (
        <span className={styles.rpc}>
          <Tooltip title={v}>
            <span>{v}</span>
          </Tooltip>
          <button type="button" data-copy-text={v}>
            <CopyIcon />
          </button>
          <a href={v} title={v} target="_blank" rel="noopener noreferrer">
            <OpenInNewWindowIcon />
          </a>
        </span>
      )
    },
  },
]

const PeerList = () => {
  const [t] = useTranslation()
  const setToast = useSetToast()

  const { data } = useQuery({
    queryKey: ['fiber', 'peers'],
    queryFn: () => explorerService.api.getFiberPeerList(),
  })

  const list = data?.data.fiberPeers ?? []
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
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div className={styles.container} onClick={handleCopy}>
        <table>
          <thead>
            {fields.map(f => {
              return <th key={f.key}>{t(`fiber.peer.${f.label}`)}</th>
            })}
          </thead>
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
          </tbody>
        </table>
      </div>
    </Content>
  )
}

export default PeerList
