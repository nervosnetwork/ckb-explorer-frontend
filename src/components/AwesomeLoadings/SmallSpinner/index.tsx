import styles from './styles.module.scss'
import { ReactComponent as SmallSpinner } from '../../../assets/small-spinner.svg'

const Loading = () => {
  return <SmallSpinner className={styles.container} />
}
export default Loading
