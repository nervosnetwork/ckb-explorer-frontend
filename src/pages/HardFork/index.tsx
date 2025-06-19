/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router'
import { OpenInNewWindowIcon } from '@radix-ui/react-icons'
import BigNumber from 'bignumber.js'
import SquareBackground from '../../components/SquareBackground'
import styles from './styles.module.scss'
import glowingLine from './glowingLine.png'
import { InfiniteMovingCard } from './InfiniteMovingCard'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/Accordion'
import { useCountdown, useEpochCountdown } from '../../hooks'
import { explorerService } from '../../services/ExplorerService'
import { ReactComponent as WarningCircle } from '../../assets/warning_circle.svg'
import FlatCube from './FlatCube'
import { HARDFORK_ESTIMATED_ACTIVATION_TIME } from '../../constants/common'
import comments from './comments'
import { Link } from '../../components/Link'
import confetti from '../../utils/confetti'
import Tooltip from '../../components/Tooltip'

const targetVers = [0, 200] // 0.200.0
const TIME_TEMPLATE = 'YYYY.MM.DD HH:mm:ss'

export default function CountdownPage() {
  const {
    currentEpoch,
    estimatedDate,
    haveDone: isActivated,
  } = useEpochCountdown(HARDFORK_ESTIMATED_ACTIVATION_TIME.epoch)
  const [days, hours, minutes, seconds] = useCountdown(estimatedDate)
  const { t } = useTranslation()

  const { hash } = useLocation()

  const { data: minerVersions } = useQuery({
    queryKey: ['statisticMinerVersionDistribution'],
    queryFn: () => explorerService.api.fetchStatisticMinerVersionDistribution(),
    refetchInterval: 60 * 1000, // 1min
  })

  const activatedBlockQuery = useQuery({
    queryKey: ['blockByEpoch', +HARDFORK_ESTIMATED_ACTIVATION_TIME.epoch],
    queryFn: () => explorerService.api.fetchBlockByEpoch(HARDFORK_ESTIMATED_ACTIVATION_TIME.epoch),
    enabled: isActivated,
  })

  const miners =
    minerVersions?.data.reduce(
      (acc, cur) => {
        acc[0] += cur.blocksCount
        const vers = cur.version.split('.')
        if (+vers[0] > targetVers[0] || +vers[1] >= targetVers[1]) {
          acc[1] += cur.blocksCount
        }
        return acc
      },
      [0, 0] as [number, number],
    ) ?? null

  const minerPercent = miners ? ((miners[1] / miners[0]) * 100).toFixed(2) : '-'

  const utcOffset = dayjs().utcOffset() / 60

  const progress = [
    { label: 'current_epoch', value: BigNumber(currentEpoch).toFormat(2, BigNumber.ROUND_FLOOR) },
    { label: 'target_epoch', value: HARDFORK_ESTIMATED_ACTIVATION_TIME.epoch.toLocaleString('en') },
    isActivated
      ? {
          label: 'activated',
          value: activatedBlockQuery.data ? (
            <Link to={`/block/${activatedBlockQuery.data.blockHash}`}>
              {dayjs(new Date(+activatedBlockQuery.data.timestamp)).format(TIME_TEMPLATE)}
            </Link>
          ) : (
            '...'
          ),
          tooltip: activatedBlockQuery.data
            ? `Block ${Number(activatedBlockQuery.data.number).toLocaleString('en')}`
            : '',
        }
      : {
          label: 'estimated_time',
          value: dayjs(estimatedDate).format(TIME_TEMPLATE),
          tooltip: `UTC ${utcOffset > 0 ? `+ ${utcOffset}` : utcOffset}`,
        },
    { label: 'miner_percent', value: minerPercent },
  ]

  const shuffledComments = useMemo(
    () =>
      comments
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => ({
          ...value,
          content: t(value.content),
        })),
    [t],
  )

  useEffect(() => {
    const id = hash.slice(1)
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  useEffect(() => {
    if (isActivated) {
      confetti()
    }
  }, [isActivated])

  return (
    <div className={styles.countdownPage}>
      <div className={styles.glowingLineContainer}>
        <div className={styles.cubeContainer}>
          <div className={styles.flatCube}>
            <FlatCube />
          </div>
        </div>
        <div className={styles.cubeContainer}>
          <div className={styles.cube3d}>
            <img src="/images/3d_cube.gif" alt="cube3d" />
          </div>
        </div>
        <img className={styles.glowingLine} src={glowingLine} alt="line" />
      </div>

      <div className={styles.squaresBg}>
        <SquareBackground
          speed={0.1}
          squareSize={24}
          direction="down" // up, down, left, right, diagonal
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>

      <main className={styles.mainContainer}>
        <h1 className={styles.mainTitle}>{!isActivated ? 'NEXT HARDFORK OF CKB' : 'CKB Hardfork is activated 🎉'}</h1>
        <div className={styles.countdownSection}>
          {!isActivated && (
            <>
              <p className={styles.comingSoon}>COMING SOON</p>

              <div className={styles.countdownTimer}>
                <div className={styles.timerBlock}>
                  <div className={styles.timerValue}>{days.toString().padStart(2, '0')}</div>
                  <div className={styles.timerLabel}>DAYS</div>
                </div>
                <div className={styles.timerValue}>:</div>
                <div className={styles.timerBlock}>
                  <div className={styles.timerValue}>{hours.toString().padStart(2, '0')}</div>
                  <div className={styles.timerLabel}>HOURS</div>
                </div>
                <div className={styles.timerValue}>:</div>
                <div className={styles.timerBlock}>
                  <div className={styles.timerValue}>{minutes.toString().padStart(2, '0')}</div>
                  <div className={styles.timerLabel}>MINUTES</div>
                </div>
                <div className={styles.timerValue}>:</div>
                <div className={styles.timerBlock}>
                  <div className={styles.timerValue}>{seconds.toString().padStart(2, '0')}</div>
                  <div className={styles.timerLabel}>SECONDS</div>
                </div>
              </div>
            </>
          )}

          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: isActivated
                    ? '100%'
                    : `${Math.max(
                        0,
                        Math.min(
                          100,
                          ((new Date().getTime() - HARDFORK_ESTIMATED_ACTIVATION_TIME.start.getTime()) /
                            (estimatedDate.getTime() - HARDFORK_ESTIMATED_ACTIVATION_TIME.start.getTime())) *
                            100,
                        ),
                      )}%`,
                }}
              />
            </div>
            <div className={styles.progressMarkers}>
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <div className={styles.progressMetrics}>
            {progress.map(({ label, value, tooltip }) => {
              return (
                <div key={label} className={styles.progressMetricItem}>
                  <div>
                    {value}
                    {tooltip ? (
                      <Tooltip trigger={<WarningCircle width={12} height={12} />} placement="top">
                        {tooltip}
                      </Tooltip>
                    ) : null}
                  </div>
                  <div>{t(`hardfork.metrics.${label}`)}</div>
                </div>
              )
            })}
          </div>
        </div>

        <InfiniteMovingCard
          items={shuffledComments.slice(0, shuffledComments.length / 2)}
          direction="left"
          speed="slow"
        />
        <InfiniteMovingCard
          items={shuffledComments.slice(shuffledComments.length / 2)}
          direction="right"
          speed="slow"
        />

        <Accordion type="single" collapsible defaultValue={hash.slice(1)}>
          <AccordionItem value="syscall" id="syscall">
            <AccordionTrigger>VM Syscalls 3: Unix-like process in CKB</AccordionTrigger>
            <AccordionContent>
              {t('hardfork.syscall_desc')}
              <Link
                to="https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0050-vm-syscalls-3/0050-vm-syscalls-3.md"
                className={styles.rfc}
              >
                RFC 0050: VM Syscalls 3
                <OpenInNewWindowIcon />
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="ckb-vm-2" id="ckb-vm-2">
            <AccordionTrigger>CKB-VM V2: More Secure, Efficient, and Scalable</AccordionTrigger>
            <AccordionContent>
              {t('hardfork.ckb_vm_desc')}
              <Link
                to="https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0049-ckb-vm-version-2/0049-ckb-vm-version-2.md"
                className={styles.rfc}
              >
                RFC 0049: CKB-VM Version 2
                <OpenInNewWindowIcon />
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="data-structure" id="data-structure">
            <AccordionTrigger>Data Structure Update: Unlock Softfork Signaling</AccordionTrigger>
            <AccordionContent>
              {t('hardfork.data_structure_desc')}
              <Link
                to="https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0048-remove-block-header-version-reservation-rule/0048-remove-block-header-version-reservation-rule.md"
                className={styles.rfc}
              >
                RFC 0048: Remove Block Header Version Reservation Rule
                <OpenInNewWindowIcon />
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  )
}
