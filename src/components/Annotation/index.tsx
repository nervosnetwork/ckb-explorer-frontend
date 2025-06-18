import Tooltip from '../Tooltip'
import styles from './index.module.scss'

const Annotation = ({ content }: { content: string }) => {
  return <Tooltip trigger={<b className={styles.container}>CAVEAT</b>}>{content}</Tooltip>
}

export default Annotation
