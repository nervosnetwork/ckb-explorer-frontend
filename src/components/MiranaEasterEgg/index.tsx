import { useEffect, useMemo, useRef, useState } from 'react'
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

const percentProprotyMobile = {
  width: 266,
  basePercent: `50%`,
  baseWidth: 133,
}
const percentProproty = {
  width: 480,
  basePercent: `53%`,
  baseWidth: 306,
}

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

  const [moonPercentProproty, setMoonPercentProproty] = useState(
    appWidth < 750 ? percentProprotyMobile : percentProproty,
  )
  const lastAppWidth = useRef(appWidth)
  useEffect(() => {
    if (lastAppWidth.current !== appWidth) {
      if (appWidth < 750) {
        setMoonPercentProproty(percentProprotyMobile)
      } else {
        setMoonPercentProproty(percentProproty)
      }
    }
  }, [appWidth, setMoonPercentProproty])
  const [coverWidth, setCoverWidth] = useState(0)
  useEffect(() => {
    setCoverWidth(((miranaHardForkSecondsLeft - DEPLOY_TIME_LEFT) / DEPLOY_TIME_LEFT) * moonPercentProproty.width)
  }, [miranaHardForkSecondsLeft, moonPercentProproty])

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
            width: `calc(${moonPercentProproty.basePercent} - ${moonPercentProproty.baseWidth + coverWidth}px)`,
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
