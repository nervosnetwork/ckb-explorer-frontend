import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './styles.module.scss'
import { ReactComponent as ExportIcon } from '../../assets/export_icon.svg'
import { SupportedExportTransactionType } from '../../services/ExplorerService'

export function CsvExport({ type, id }: { type: SupportedExportTransactionType; id?: string }) {
  const [t] = useTranslation()
  return (
    <Link
      className={styles.exportLink}
      to={`/export-transactions?type=${type}${id ? `&id=${id}` : ''}`}
      target="_blank"
    >
      <div>{t(`export_transactions.csv_export`)}</div>
      <ExportIcon />
    </Link>
  )
}
