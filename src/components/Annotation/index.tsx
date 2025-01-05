import { Tooltip } from 'antd'
import styles from './index.module.scss'

const Annotation = ({ content }: { content: string }) => {
  return (
    <Tooltip title={content}>
      <b className={styles.container}>CAVEAT</b>
    </Tooltip>
  )
}

export default Annotation
