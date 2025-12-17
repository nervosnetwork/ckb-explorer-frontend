import { useTranslation } from 'react-i18next'
import styles from './styles.module.scss'
import { ReactComponent as InfoICon } from './info.svg'

const Notification = () => {
  const { t } = useTranslation()
  const url = 'https://discord.gg/TcFdtES68c'
  return (
    <div className={styles.container}>
      <InfoICon className={styles.icon} />
      <div className={styles.content}>
        {t('notes.titlepre', { url })}
        <a href={url} target="_blank" rel="noreferrer" className={styles.link}>
          {url}
        </a>
        {t('notes.titlenext')}
      </div>
    </div>
  )
}

export default Notification
