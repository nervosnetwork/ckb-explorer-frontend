import { useTranslation } from 'react-i18next'
import styles from './styles.module.scss'
import { ReactComponent as InfoICon } from './info.svg'

const Notification = () => {
  const { t } = useTranslation()

  const url = 'https://discord.gg/TcFdtES68c'
  //   const translatedText = t('notes.title', { url })
  return (
    <div className={styles.container}>
      <InfoICon />
      {/* <div dangerouslySetInnerHTML={{ __html: translatedText }} /> */}
      <div>
        {t('notes.titlepre', { url })}
        <a href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
        {t('notes.titlenext')}
      </div>
    </div>
  )
}

export default Notification
