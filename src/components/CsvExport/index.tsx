import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './styles.module.scss'
import { ReactComponent as ExportIcon } from './export_icon.svg'
import { SupportedExportTransactionType } from '../../services/ExplorerService'

export function CsvExport({
  type,
  id,
  isViewOriginal,
}: {
  type: SupportedExportTransactionType
  id?: string
  isViewOriginal?: boolean
}) {
  const [t] = useTranslation()
  return (
    <Link
      className={styles.exportLink}
      to={`/export-transactions?type=${type}${id ? `&id=${id}` : ''}${isViewOriginal ? '&view=original' : ''}`}
      target="_blank"
    >
      <div>{t(`export_transactions.csv_export`)}</div>
      <ExportIcon />
    </Link>
  )
}
