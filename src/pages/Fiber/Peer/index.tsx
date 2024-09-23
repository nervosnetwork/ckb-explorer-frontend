import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CopyIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons'
import { Tooltip } from 'antd'
import Content from '../../../components/Content'
import { explorerService } from '../../../services/ExplorerService'
import { useSetToast } from '../../../components/Toast'
// import type { Fiber } from '../../../services/ExplorerService/fetcher'
// import { shannonToCkb } from '../../../utils/util'
// import { localeNumberString } from '../../../utils/number'
// import { parseNumericAbbr } from '../../../utils/chart'
import styles from './index.module.scss'
import Loading from '../../../components/Loading'

const Peer = () => {
  const [t] = useTranslation()
  const { id } = useParams<{ id: string }>()
  const setToast = useSetToast()

  const { data, isLoading } = useQuery({
    queryKey: ['fiber', 'peer', id],
    queryFn: () => {
      return explorerService.api.getFiberPeerDetail(id)
    },
    enabled: !!id,
  })
  if (isLoading) {
    return <Loading show />
  }

  if (!data) {
    return <div>Fiber Peer Not Found</div>
  }
  const peer = data.data
  const channels = peer.fiberChannels

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
        <div>
          <dl>
            <dt>{t('fiber.peer.peer_id')}</dt>
            <dd>
              {peer.peerId}
              <button type="button" data-copy-text={peer.peerId}>
                <CopyIcon />
              </button>
            </dd>
          </dl>
          <dl>
            <dt>{t('fiber.peer.rpc_addr')}</dt>
            <dd>
              <Tooltip title={peer.rpcListeningAddr}>
                <span>{peer.rpcListeningAddr}</span>
              </Tooltip>
              <button type="button" data-copy-text={peer.rpcListeningAddr}>
                <CopyIcon />
              </button>
              <a href={peer.rpcListeningAddr} title={peer.rpcListeningAddr} target="_blank" rel="noopener noreferrer">
                <OpenInNewWindowIcon />
              </a>
            </dd>
          </dl>
          <dl>
            <dt>{t('fiber.peer.open_time')}</dt>
            <dd>
              <small>Coming soon</small>
            </dd>
          </dl>
          <dl>
            <dt>{t('fiber.peer.update_time')}</dt>
            <dd>
              <small>Coming soon</small>
            </dd>
          </dl>
        </div>
        <div>
          <div>{`${t('fiber.peer.channels')}(${channels.length})`}</div>
          <table>
            <thead>
              <tr>
                <th>{t('fiber.channel.channel_id')}</th>
                <th>{t('fiber.channel.state')}</th>
              </tr>
            </thead>
            <tbody>
              {channels.map(c => {
                return (
                  <tr key={c.channelId}>
                    <td>
                      <Tooltip title={c.channelId}>
                        <Link to={`/fiber/channels/${c.channelId}`} className="monospace">
                          {`${c.channelId.slice(0, 10)}...${c.channelId.slice(-10)}`}
                        </Link>
                      </Tooltip>
                    </td>
                    <td>{c.stateName}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Content>
  )
}

export default Peer
