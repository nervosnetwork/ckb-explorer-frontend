import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CopyIcon } from '@radix-ui/react-icons'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import Content from '../../../components/Content'
import { useSetToast } from '../../../components/Toast'
import Loading from '../../../components/Loading'
import { explorerService } from '../../../services/ExplorerService'
import styles from './index.module.scss'
import { shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import FiberPeerInfo from './fiber'

const TIME_TEMPLATE = 'YYYY/MM/DD hh:mm:ss'

const Channel = () => {
  const [t] = useTranslation()
  const { id } = useParams<{ id: string }>()
  const setToast = useSetToast()

  const { data, isLoading } = useQuery({
    queryKey: ['fiber', 'channels', id],
    queryFn: () => {
      return explorerService.api.getFiberChannel(id)
    },
    enabled: !!id,
  })

  if (isLoading) {
    return <Loading show />
  }

  if (!data) {
    return <div>Fiber Peer Not Found</div>
  }
  const channel = data.data

  const handleCopy = (e: React.SyntheticEvent) => {
    const elm = e.target
    if (!(elm instanceof HTMLElement)) return
    const { copyText } = elm.dataset
    if (!copyText) return
    e.stopPropagation()
    e.preventDefault()
    navigator?.clipboard.writeText(copyText).then(() => setToast({ message: t('common.copied') }))
  }

  const totalBalance = BigNumber(channel.localBalance).plus(BigNumber(channel.remoteBalance))
  const totalTLCBalance = BigNumber(channel.offeredTlcBalance).plus(BigNumber(channel.receivedTlcBalance))

  return (
    <Content>
      <div className={styles.container} onClick={handleCopy}>
        <div>
          <dl>
            <dt>{t('fiber.channel.channel_id')}</dt>
            <dd className={styles.id}>
              <span>{channel.channelId}</span>
              <button type="button" data-copy-text={channel.channelId}>
                <CopyIcon />
              </button>
            </dd>
          </dl>
          <dl>
            <dt>{t('fiber.channel.state')}</dt>
            <dd>{channel.stateName}</dd>
          </dl>

          <dl>
            <dt>{t('fiber.channel.balance')}</dt>
            <dd>{`${localeNumberString(
              shannonToCkb(totalBalance.toFormat({ groupSeparator: '' })),
            )} CKB(Total) | ${localeNumberString(
              shannonToCkb(totalTLCBalance.toFormat({ groupSeparator: '' })),
            )} CKB(TLC)`}</dd>
          </dl>
          <dl>
            <dt>{t('fiber.channel.open_time')}</dt>
            <dd>
              <time dateTime={channel.createdAt}>{dayjs(channel.createdAt).format(TIME_TEMPLATE)}</time>
            </dd>
          </dl>
          <dl>
            <dt>{t('fiber.channel.update_time')}</dt>
            <dd>
              <time dateTime={channel.updatedAt}>{dayjs(channel.updatedAt).format(TIME_TEMPLATE)}</time>
            </dd>
          </dl>
          {channel.shutdownAt ? (
            <dl>
              <dt>{t('fiber.channel.shutdown_time')}</dt>
              <dd>
                <time dateTime={channel.shutdownAt}>{dayjs(channel.shutdownAt).format(TIME_TEMPLATE)}</time>
              </dd>
            </dl>
          ) : null}
          <div className={styles.peers}>
            <div className={styles.local}>
              <dl>
                <dt>Fiber Peer</dt>
                <dd className={styles.fiberNode}>
                  <FiberPeerInfo peer={channel.localPeer} />
                </dd>
              </dl>

              <dl>
                <dt>{t('fiber.channel.balance')}</dt>
                <dd>{`${localeNumberString(shannonToCkb(channel.localBalance))} CKB`}</dd>
              </dl>

              <dl>
                <dt>{t('fiber.channel.tlc_balance')}</dt>
                <dd>{`${localeNumberString(shannonToCkb(channel.offeredTlcBalance))} CKB`}</dd>
              </dl>
            </div>

            <div className={styles.remote}>
              <dl>
                <dt>Fiber Peer</dt>
                <dd>
                  <FiberPeerInfo peer={channel.remotePeer} />
                </dd>
              </dl>

              <dl>
                <dt>{t('fiber.channel.balance')}</dt>
                <dd>{`${localeNumberString(shannonToCkb(channel.remoteBalance))} CKB`}</dd>
              </dl>

              <dl>
                <dt>{t('fiber.channel.tlc_balance')}</dt>
                <dd>{`${localeNumberString(shannonToCkb(channel.receivedTlcBalance))} CKB`}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className={styles.transactions}>
          <h3>Open | Close Transactions</h3>
          <div>Coming soon</div>
        </div>
      </div>
    </Content>
  )
}

export default Channel
