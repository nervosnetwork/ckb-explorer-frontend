import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CopyIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons'
import QRCode from 'qrcode'
import Content from '../../../components/Content'
import { explorerService } from '../../../services/ExplorerService'
import { useSetToast } from '../../../components/Toast'
import styles from './index.module.scss'
import Loading from '../../../components/Loading'
import Tooltip from '../../../components/Tooltip'

const Peer = () => {
  const [t] = useTranslation()
  const [rpcAddr, setRpcAddr] = useState('')
  const { id } = useParams<{ id: string }>()
  const qrRef = useRef<HTMLCanvasElement | null>(null)

  const setToast = useSetToast()

  const { data, isLoading } = useQuery({
    queryKey: ['fiber', 'peers', id],
    queryFn: () => {
      return explorerService.api.getFiberPeerDetail(id)
    },
    enabled: !!id,
  })

  const peer = data?.data

  const connectId = peer && rpcAddr ? `${peer.peerId}@${rpcAddr}` : null

  const handleRpcAddrSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const r = e.currentTarget.value
    if (r) {
      setRpcAddr(r)
    }
  }

  useEffect(() => {
    const firstRpcAddr = peer?.rpcListeningAddr[0]
    if (firstRpcAddr) {
      setRpcAddr(firstRpcAddr)
    }
  }, [peer, setRpcAddr])

  useEffect(() => {
    const cvs = qrRef.current
    if (!cvs || !connectId) return
    QRCode.toCanvas(
      cvs,
      connectId,
      {
        margin: 5,
        errorCorrectionLevel: 'H',
        width: 144,
      },
      err => {
        if (err) {
          console.error(err)
        }
      },
    )
  }, [qrRef, connectId])

  if (isLoading) {
    return <Loading show />
  }

  if (!peer) {
    return <div>Fiber Peer Not Found</div>
  }
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
        <div className={styles.overview}>
          <div className={styles.fields}>
            <dl>
              <dt>{t('fiber.peer.peer_id')}</dt>
              <dd className={styles.id}>
                <span>{peer.peerId}</span>
                <button type="button" data-copy-text={peer.peerId}>
                  <CopyIcon />
                </button>
              </dd>
            </dl>
            <dl>
              <dt>
                <label htmlFor="rpc-addr">{t('fiber.peer.rpc_addr')}</label>
              </dt>
              <dd>
                <select name="rpc-addr" id="rpc-addr" onChange={handleRpcAddrSelect}>
                  {peer.rpcListeningAddr.map(ra => {
                    return (
                      <option value={ra} key={ra}>
                        {ra}
                      </option>
                    )
                  })}
                </select>
                <button type="button" data-copy-text={peer.rpcListeningAddr}>
                  <CopyIcon />
                </button>
                <a href={rpcAddr} title={rpcAddr} target="_blank" rel="noopener noreferrer">
                  <OpenInNewWindowIcon />
                </a>
              </dd>
            </dl>
            {connectId ? (
              <dl>
                <dt>{t('fiber.peer.connect_id')}</dt>
                <dd className={styles.connectId}>
                  <Tooltip trigger={<span>{connectId}</span>}>{connectId}</Tooltip>
                  <button type="button" data-copy-text={connectId}>
                    <CopyIcon />
                  </button>
                </dd>
              </dl>
            ) : null}
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
          {connectId ? (
            <div>
              <canvas ref={qrRef} className={styles.qrcode} />
            </div>
          ) : null}
        </div>
        <div className={styles.activities}>
          <div className={styles.channels}>
            <h3>{`${t('fiber.peer.channels')}(${channels.length})`}</h3>
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
                        <Tooltip
                          trigger={
                            <Link to={`/fiber/channels/${c.channelId}`} className="monospace">
                              {`${c.channelId.slice(0, 10)}...${c.channelId.slice(-10)}`}
                            </Link>
                          }
                        >
                          {c.channelId}
                        </Tooltip>
                      </td>
                      <td>{c.stateName}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className={styles.transactions}>
            <h3>Open | Close Transactions</h3>
            <small>Coming soon</small>
          </div>
        </div>
      </div>
    </Content>
  )
}

export default Peer
