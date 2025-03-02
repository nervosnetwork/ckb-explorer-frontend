/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import { useTranslation } from 'react-i18next'
import Squares from './Squares'
import styles from './styles.module.scss'
import glowingLine from './glowingLine.png'
import { InfiniteMovingCard } from './InfiniteMovingCard'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/Accordion'
import { useCountdown } from '../../hooks'

export default function CountdownPage() {
  const [days, hours, minutes, seconds, countdown] = useCountdown(new Date('2025-02-02T00:00:00'))
  const [isEnd, setIsEnd] = useState(false)
  const { t } = useTranslation()

  const comments = [
    {
      name: 'Nervos CKB Docs',
      avatars: 'https://docs.nervos.org/img/logo-dark.png',
      content: t('hardfork.comment1'),
      date: '',
      link: 'https://docs.nervos.org/docs/history-and-hard-forks/intro-to-hard-fork',
    },
    {
      name: 'Nervos CKB Docs',
      avatars: 'https://docs.nervos.org/img/logo-dark.png',
      content: t('hardfork.comment2'),
      date: '',
      link: 'https://docs.nervos.org/docs/history-and-hard-forks/intro-to-hard-fork',
    },
    {
      name: 'Nervos CKB Docs',
      avatars: 'https://docs.nervos.org/img/logo-dark.png',
      content: t('hardfork.comment3'),
      date: '',
      link: 'https://docs.nervos.org/docs/history-and-hard-forks/intro-to-hard-fork',
    },
    {
      name: 'doitian',
      avatars: 'https://avatars.githubusercontent.com/u/35768?v=4',
      content: t('hardfork.comment4'),
      date: '',
      link: 'https://github.com/nervosnetwork/ckb/issues/4806#issuecomment-2673768017',
    },
    {
      name: 'doitian',
      avatars: 'https://avatars.githubusercontent.com/u/35768?v=4',
      content: t('hardfork.comment5'),
      date: '',
      link: 'https://github.com/nervosnetwork/ckb/issues/4806#issuecomment-2673786997',
    },
    {
      name: 'doitian',
      avatars: 'https://avatars.githubusercontent.com/u/35768?v=4',
      content: t('hardfork.comment6'),
      date: '',
      link: 'https://github.com/nervosnetwork/ckb/issues/4806#issuecomment-2673786997',
    },
    {
      name: 'gpBlockchain',
      avatars: 'https://avatars.githubusercontent.com/u/3198439?v=4',
      content: t('hardfork.comment7'),
      date: '',
      link: 'https://github.com/nervosnetwork/ckb/issues/4806#issuecomment-2677703878',
    },
    {
      name: 'CKB Consensus Change',
      avatars: 'https://www.svgrepo.com/show/243051/docs.svg',
      content: t('hardfork.comment8'),
      date: '',
      link: 'https://github.com/nervosnetwork/rfcs/blob/3a6ae4fa5d59b6e33fa7bd563d336706d135c0d8/rfcs/0053-ckb-hardfork/0053-ckb-hardfork.md',
    },
    {
      name: 'CKB Consensus Change',
      avatars: 'https://www.svgrepo.com/show/243051/docs.svg',
      content: t('hardfork.comment9'),
      date: '',
      link: 'https://github.com/nervosnetwork/rfcs/blob/3a6ae4fa5d59b6e33fa7bd563d336706d135c0d8/rfcs/0053-ckb-hardfork/0053-ckb-hardfork.md',
    },
    {
      name: 'CKB Consensus Change',
      avatars: 'https://www.svgrepo.com/show/243051/docs.svg',
      content: t('hardfork.comment10'),
      date: '',
      link: 'https://github.com/nervosnetwork/rfcs/blob/3a6ae4fa5d59b6e33fa7bd563d336706d135c0d8/rfcs/0053-ckb-hardfork/0053-ckb-hardfork.md',
    },
    {
      name: 'CKB Consensus Change',
      avatars: 'https://www.svgrepo.com/show/243051/docs.svg',
      content: t('hardfork.comment11'),
      date: '',
      link: 'https://github.com/nervosnetwork/rfcs/blob/3a6ae4fa5d59b6e33fa7bd563d336706d135c0d8/rfcs/0053-ckb-hardfork/0053-ckb-hardfork.md',
    },
    {
      name: 'CKB Consensus Change',
      avatars: 'https://www.svgrepo.com/show/243051/docs.svg',
      content: t('hardfork.comment12'),
      date: '',
      link: 'https://github.com/nervosnetwork/rfcs/blob/3a6ae4fa5d59b6e33fa7bd563d336706d135c0d8/rfcs/0053-ckb-hardfork/0053-ckb-hardfork.md',
    },
    {
      name: 'CKB Consensus Change',
      avatars: 'https://www.svgrepo.com/show/243051/docs.svg',
      content: t('hardfork.comment13'),
      date: '',
      link: 'https://github.com/nervosnetwork/rfcs/blob/3a6ae4fa5d59b6e33fa7bd563d336706d135c0d8/rfcs/0053-ckb-hardfork/0053-ckb-hardfork.md',
    },
    {
      name: 'CKB Consensus Change',
      avatars: 'https://www.svgrepo.com/show/243051/docs.svg',
      content: t('hardfork.comment14'),
      date: '',
      link: 'https://github.com/nervosnetwork/rfcs/blob/3a6ae4fa5d59b6e33fa7bd563d336706d135c0d8/rfcs/0053-ckb-hardfork/0053-ckb-hardfork.md',
    },
  ]

  const shuffledComments = useMemo(
    () =>
      comments
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value),
    [],
  )

  const handleConfetti = () => {
    const end = Date.now() + 3 * 1000 // 3 seconds
    const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']

    const frame = () => {
      if (Date.now() > end) return
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      })

      requestAnimationFrame(frame)
    }

    frame()
  }

  useEffect(() => {
    if (isEnd) return
    if (countdown < 0) {
      setIsEnd(true)
      return () => handleConfetti()
    }
  }, [countdown, isEnd, setIsEnd])

  return (
    <div className={styles.countdownPage}>
      <div className={styles.glowingLineContainer}>
        <img className={styles.glowingLine} src={glowingLine} alt="line" />
      </div>

      <div className={styles.squaresBg}>
        <Squares
          speed={0.1}
          squareSize={24}
          direction="down" // up, down, left, right, diagonal
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>

      <main className={styles.mainContainer}>
        <h1 className={styles.mainTitle}>
          {countdown <= 3 ? 'NEXT HARDFORK OF CKB' : 'CKB Network Hardfork is completed 🎉'}
        </h1>
        <div className={styles.countdownSection}>
          {countdown > 3 && (
            <>
              <p className={styles.comingSoon}>COMING SOON</p>

              <div className={styles.countdownTimer}>
                <div className={styles.timerBlock}>
                  <div className={styles.timerValue}>{days.toString().padStart(2, '0')}</div>
                  <div className={styles.timerLabel}>DAYS</div>
                </div>
                <div className={styles.timerBlock}>
                  <div className={styles.timerValue}>{hours.toString().padStart(2, '0')}</div>
                  <div className={styles.timerLabel}>HOURS</div>
                </div>
                <div className={styles.timerBlock}>
                  <div className={styles.timerValue}>{minutes.toString().padStart(2, '0')}</div>
                  <div className={styles.timerLabel}>MINUTES</div>
                </div>
                <div className={styles.timerBlock}>
                  <div className={styles.timerValue}>{seconds.toString().padStart(2, '0')}</div>
                  <div className={styles.timerLabel}>SECONDS</div>
                </div>
              </div>
            </>
          )}

          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '25%' }} />
            </div>
            <div className={styles.progressMarkers}>
              <span style={{ opacity: 0 }}>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span style={{ opacity: 0 }}>100%</span>
            </div>
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

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>CKB-VM V2</AccordionTrigger>
            <AccordionContent>{t('hardfork.ckb_vm_desc')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Spawn: Direct Cross-Script Calling</AccordionTrigger>
            <AccordionContent>{t('hardfork.spawn_desc')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Fee Estimator</AccordionTrigger>
            <AccordionContent>{t('hardfork.fee_estimator_desc')}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  )
}
