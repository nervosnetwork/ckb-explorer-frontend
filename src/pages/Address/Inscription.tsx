import classNames from 'classnames'
import styles from './inscription.module.scss'
import { Link } from '../../components/Link'

const Inscription = ({
  href,
  udtLabel,
  mintingStatus,
  content,
}: {
  content: Record<string, string>
  href: string
  mintingStatus?: string
  udtLabel: string
}) => {
  return (
    <Link to={href} className={styles.container}>
      <h5>
        <span className="monospace">{udtLabel}</span>
        <span className="monospace">{mintingStatus}</span>
      </h5>
      <div className={styles.content}>
        {'{'}
        {Object.entries(content).map(([key, value]) => (
          <div className={classNames('monospace', styles.jsonValue)}>
            <div className={classNames('monospace', styles.title)}>{key}:</div>
            <div className={classNames('monospace', styles.value)}>{value}</div>
          </div>
        ))}
        {'}'}
      </div>
    </Link>
  )
}

export default Inscription
