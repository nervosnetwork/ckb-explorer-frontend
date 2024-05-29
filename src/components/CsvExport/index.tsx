import { useTranslation } from 'react-i18next'
import { Link } from '../Link'
import styles from './styles.module.scss'
import { ReactComponent as ExportIcon } from './export_icon.svg'

export function CsvExport({ link }: { link: string }) {
  const [t] = useTranslation()
  return (
    <Link className={styles.exportLink} to={link} target="_blank">
      <div>{t(`export_transactions.csv_export`)}</div>
      <ExportIcon />
    </Link>
  )
}
