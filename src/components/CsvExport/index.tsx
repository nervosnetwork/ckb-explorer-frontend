import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './styles.module.scss'
import { ReactComponent as ExportIcon } from '../../assets/export_icon.svg'

export function CsvExport({ type, address, nft }: { type: string; address?: string; nft?: string }) {
  const [t] = useTranslation()
  return (
    <Link
      className={styles.exportLink}
      to={`/export-transactions?type=${type}${address ? `&address=${address}` : ''}${nft ? `&nft=${nft}` : ''}`}
      target="_blank"
    >
      <div>{t(`export_transactions.csv_export`)}</div>
      <ExportIcon />
    </Link>
  )
}
