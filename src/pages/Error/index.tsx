import React from 'react'
import { useTranslation } from 'react-i18next'
import Content from '../../components/Content'
import PCErrorImage from './error.png'
import MobileErrorImage from './Mobile_error.png'
import { useIsMobile } from '../../hooks'
import styles from './index.module.scss'
import { Link } from '../../components/Link'

export default ({
  errorMessage,
  errorDescription,
}: {
  errorMessage?: string
  errorDescription?: React.ErrorInfo['componentStack']
}) => {
  const isMobile = useIsMobile()
  const [t] = useTranslation()

  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <Content>
      <div className={styles.container}>
        {(errorMessage || errorDescription) && (
          <>
            <img className={styles.notErrorImage} src={isMobile ? MobileErrorImage : PCErrorImage} alt="error" />
            <div className={styles.pageCrashedTip}>{t('error.page_crashed_tip')}</div>
            <Link className={styles.backHome} to="/">
              {t('error.back_home')}
            </Link>
            {!isProduction && (
              <pre className={styles.pageCrashedError}>
                {errorMessage}
                {errorDescription}
              </pre>
            )}
          </>
        )}
      </div>
    </Content>
  )
}
