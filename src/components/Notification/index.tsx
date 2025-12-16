import styles from './styles.module.scss'
import { ReactComponent as InfoICon } from './info.svg'

const Notification = () => {
  const url = 'https://discord.gg/TcFdtES68c'
  return (
    <div className={styles.container}>
      <InfoICon />
      <div>
        旧版浏览器1月底将停止服务，使用原浏览器 API 的伙伴请尽快通过{' '}
        <a href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
        对接新的API，避免业务受影响。
      </div>
    </div>
  )
}

export default Notification
