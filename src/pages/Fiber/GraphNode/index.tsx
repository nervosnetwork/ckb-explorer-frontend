import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CopyIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons'
import { Tooltip } from 'antd'
import QRCode from 'qrcode'
import dayjs from 'dayjs'
import Content from '../../../components/Content'
import { explorerService } from '../../../services/ExplorerService'
import { useSetToast } from '../../../components/Toast'
import styles from './index.module.scss'
import Loading from '../../../components/Loading'
import { shannonToCkb } from '../../../utils/util'
import { parseNumericAbbr } from '../../../utils/chart'
import { localeNumberString } from '../../../utils/number'
import GraphChannelList from '../../../components/GraphChannelList'

const TIME_TEMPLATE = 'YYYY/MM/DD hh:mm:ss'

const GraphNode = () => {
  const [t] = useTranslation()
  const [addr, setAddr] = useState('')
  const { id } = useParams<{ id: string }>()
  const qrRef = useRef<HTMLCanvasElement | null>(null)

  const setToast = useSetToast()

  const { data, isLoading } = useQuery({
    queryKey: ['fiber', 'graph', 'node', id],
    queryFn: () => {
      return explorerService.api.getGraphNodeDetail(id)
    },
    enabled: !!id,
  })

  const node = data?.data

  const connectId = addr

  const handleAddrSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const r = e.currentTarget.value
    if (r) {
      setAddr(r)
    }
  }

  useEffect(() => {
    const firstAddr = node?.addresses[0]
    if (firstAddr) {
      setAddr(firstAddr)
    }
  }, [node, setAddr])

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

  if (!node) {
    return <div>Fiber Peer Not Found</div>
  }
  const channels = node.fiberGraphChannels

  const ckb = shannonToCkb(node.autoAcceptMinCkbFundingAmount)
  const amount = parseNumericAbbr(ckb)

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
            {node.alias ? (
              <dl>
                <dt>{t('fiber.graph.alias')}</dt>
                <dd className={styles.alias}>
                  <span>{node.alias}</span>
                  <button type="button" data-copy-text={node.alias}>
                    <CopyIcon />
                  </button>
                </dd>
              </dl>
            ) : null}
            <dl>
              <dt>{t('fiber.graph.node.id')}</dt>
              <dd className={styles.id}>
                <span>{node.nodeId}</span>
                <button type="button" data-copy-text={node.nodeId}>
                  <CopyIcon />
                </button>
              </dd>
            </dl>
            <dl>
              <dt>
                <label htmlFor="addr">{t('fiber.graph.node.addresses')}</label>
              </dt>
              <dd>
                <select name="addr" id="addr" onChange={handleAddrSelect}>
                  {node.addresses.map(ra => {
                    return (
                      <option value={ra} key={ra}>
                        {ra}
                      </option>
                    )
                  })}
                </select>
                <button type="button" data-copy-text={node.addresses}>
                  <CopyIcon />
                </button>
                <a href={addr} title={addr} target="_blank" rel="noopener noreferrer">
                  <OpenInNewWindowIcon />
                </a>
              </dd>
            </dl>
            <dl>
              <dt>{t('fiber.graph.node.first_seen')}</dt>
              <dd>{dayjs(+node.timestamp).format(TIME_TEMPLATE)}</dd>
            </dl>
            <dl>
              <dt>{t('fiber.graph.node.chain_hash')}</dt>
              <dd>{node.chainHash}</dd>
            </dl>
            <dl>
              <dt>{t('fiber.graph.node.auto_accept_min_ckb_funding_amount')}</dt>
              <dd>
                <Tooltip title={`${localeNumberString(ckb)} CKB`}>
                  <span>{`${amount} CKB`}</span>
                </Tooltip>
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
            <GraphChannelList list={channels} />
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

export default GraphNode
