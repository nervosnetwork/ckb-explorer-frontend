import { useEffect, useMemo, useState } from 'react'
import {
  DEPLOY_TIME_LEFT,
  NEXT_HARD_FORK_EPOCH,
  ONE_DAY_SECOND,
  ONE_HOUR_SECOND,
  ONE_MINUTE_SECOND,
} from '../../constants/common'
import { useInterval } from '../../utils/hook'
import i18n from '../../utils/i18n'
import styles from './index.module.scss'

export default ({ miranaHardForkSecondsLeft, appWidth }: { miranaHardForkSecondsLeft: number; appWidth: number }) => {
  const [tmpMiranaHardForkSecondsLeft, setTmpMiranaHardForkSecondsLeft] = useState(miranaHardForkSecondsLeft)
  useEffect(() => {
    setTmpMiranaHardForkSecondsLeft(miranaHardForkSecondsLeft)
  }, [miranaHardForkSecondsLeft])
  useInterval(
    () => {
      setTmpMiranaHardForkSecondsLeft(cur => cur - 1)
    },
    1000,
    [tmpMiranaHardForkSecondsLeft],
  )

  const [days, hours, minutes, seconds] = useMemo(() => {
    const days = Math.floor(tmpMiranaHardForkSecondsLeft / ONE_DAY_SECOND)
    const hours = Math.floor((tmpMiranaHardForkSecondsLeft % ONE_DAY_SECOND) / ONE_HOUR_SECOND)
    const minutes = Math.floor((tmpMiranaHardForkSecondsLeft % ONE_HOUR_SECOND) / ONE_MINUTE_SECOND)
    const seconds = Math.floor(tmpMiranaHardForkSecondsLeft % ONE_MINUTE_SECOND)
    return [days, hours, minutes, seconds]
  }, [tmpMiranaHardForkSecondsLeft])

  const [moonWidth, setMoonWidth] = useState(480)
  useEffect(() => {
    if (appWidth < 750) {
      setMoonWidth(400)
    }
  }, [appWidth, setMoonWidth])
  const [coverWidth, setCoverWidth] = useState(0)
  useEffect(() => {
    setCoverWidth(((miranaHardForkSecondsLeft - DEPLOY_TIME_LEFT) / DEPLOY_TIME_LEFT) * moonWidth)
  }, [miranaHardForkSecondsLeft, moonWidth])

  if (miranaHardForkSecondsLeft <= 0) {
    return (
      <div className={styles.Root} data-alive>
        <div className={styles.AliveMirana} />
        <div>{i18n.t('common.miranaAlive')}</div>
      </div>
    )
  }

  return (
    <div className={styles.Root}>
      <div className={styles.Moon}>
        <div className={styles.MoonOriginal} />
        <div
          className={styles.MoonConver}
          style={{
            width: `calc(53% - ${306 + coverWidth}px)`,
          }}
        />
      </div>
      <div className={styles.Epoch}>
        <span>MIRANA</span>
        <div>
          {i18n.t('blockchain.epoch')}&nbsp;
          {NEXT_HARD_FORK_EPOCH}
          <br />
          {i18n.t('common.minaraTime')}
          <br />
          1:00 UTC
        </div>
      </div>
      <div className={styles.CountDown}>
        <div className={styles.Item}>
          <div>{days.toString().padStart(2, '0')}</div>
          <div>{i18n.t('common.days')}</div>
        </div>
        <div className={styles.Item}>
          <div>{hours.toString().padStart(2, '0')}</div>
          <div>{i18n.t('common.hours')}</div>
        </div>
        <div className={styles.Item}>
          <div>{minutes.toString().padStart(2, '0')}</div>
          <div>{i18n.t('common.minutes')}</div>
        </div>
        <div className={styles.Item}>
          <div>{seconds.toString().padStart(2, '0')}</div>
          <div>{i18n.t('common.seconds')}</div>
        </div>
      </div>
    </div>
  )
}
