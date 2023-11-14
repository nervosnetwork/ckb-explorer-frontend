import { useTranslation } from 'react-i18next'
import Content from '../../components/Content'
import PCErrorImage from './error.png'
import MobileErrorImage from './Mobile_error.png'
import { useIsMobile } from '../../utils/hook'
import styles from './index.module.scss'

export default ({ errorMessage, errorDescription }: { errorMessage?: string; errorDescription?: string }) => {
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
            <a className={styles.backHome} href="/">
              {t('error.back_home')}
            </a>
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
