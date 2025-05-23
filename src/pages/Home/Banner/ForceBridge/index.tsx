import { motion } from 'framer-motion'

import styles from './index.module.scss'
import GodwokenImage from './godwoken.png'
import ForceBridgeImage from './forcebridge.png'

const ForceBridge = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.endContent}>
          <motion.div
            initial={{ opacity: 0.5, transform: 'scale(0.1)' }}
            whileInView={{ opacity: 1, transform: 'scale(1)' }}
            transition={{
              delay: 0,
              duration: 0.3,
              ease: 'easeInOut',
            }}
            className={styles.endAnimation}
          />
          <div className={styles.endContentWrapper}>
            <div className={styles.title}>
              <div className={styles.title1}>End of an Era:</div>
              <div className={styles.title2}>Force Bridge Sunset</div>
            </div>
            <div className={styles.description}>
              Withdraw your assets via Godwoken Bridge and Force Bridge before the deadline.
            </div>
            <a
              href="https://sunset.forcebridge.com/"
              target="_blank"
              rel="noreferrer noopener"
              className={styles.announcementBtn}
            >
              Check the announcement
            </a>
          </div>
        </div>
        <div className={styles.exitContent}>
          <div className={styles.exitBackground} />
          <div className={styles.neonText}>
            E<span className={styles.neonTextFade}>X</span>I<span className={styles.neonTextFade}>T</span>
          </div>
          <div className={styles.exitTextWrapper}>
            <motion.a
              className={styles.exitText}
              initial={{ opacity: 0.5, transform: 'translateX(100%)' }}
              whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
              transition={{
                delay: 0,
                duration: 0.5,
                ease: 'easeInOut',
              }}
              href="https://sunset.forcebridge.com/force-bridge"
              target="_blank"
              rel="noreferrer noopener"
            >
              <img
                src={ForceBridgeImage}
                alt="forcebridge"
                className={styles.exitImage}
                style={{ width: '24px', transform: 'skewY(30deg)' }}
              />
              <span>Force Bridge Exit Ends: Nov 30, 2025</span>
            </motion.a>
            <motion.a
              className={styles.exitText}
              initial={{ opacity: 0.5, transform: 'translateX(100%)' }}
              whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
              transition={{
                delay: 0,
                duration: 0.5,
                ease: 'easeInOut',
              }}
              style={{
                marginLeft: 'auto',
              }}
              href="https://sunset.forcebridge.com/godwoken-v1"
              target="_blank"
              rel="noreferrer noopener"
            >
              <img
                src={GodwokenImage}
                alt="godwoken"
                className={styles.exitImage}
                style={{ width: '20px', transform: 'skewY(20deg)' }}
              />
              <span>Godwoken Exit Ends: Oct 31, 2025</span>
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForceBridge
