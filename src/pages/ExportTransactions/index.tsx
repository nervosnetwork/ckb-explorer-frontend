import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useSearchParams, useUpdateSearchParams } from '../../hooks'
import { ExportPage } from '../../components/ExportPage'
import { SupportedExportTransactionType, explorerService } from '../../services/ExplorerService'

const ExportTransactions = () => {
  const { t } = useTranslation()
  const {
    type: typeStr,
    id,
    tab = 'date',
    'start-date': startDateStr,
    'end-date': endDateStr,
    'from-height': fromHeightStr,
    'to-height': toHeightStr,
    view,
  } = useSearchParams('type', 'id', 'tab', 'start-date', 'end-date', 'from-height', 'to-height', 'view')
  const isViewOriginal = view === 'original'

  function isTransactionCsvExportType(s?: string): s is SupportedExportTransactionType {
    return !!s && ['address_transactions', 'blocks', 'udts', 'nft', 'omiga_inscriptions'].includes(s)
  }

  const type = isTransactionCsvExportType(typeStr) ? typeStr : 'blocks'

  const startDate = tab === 'date' && startDateStr ? dayjs(startDateStr) : undefined
  const endDate = tab === 'date' && endDateStr ? dayjs(endDateStr) : undefined

  const fromHeight = tab === 'height' && fromHeightStr !== undefined ? parseInt(fromHeightStr, 10) : undefined
  const toHeight = tab === 'height' && toHeightStr !== undefined ? parseInt(toHeightStr, 10) : undefined

  const updateSearchParams = useUpdateSearchParams<
    'type' | 'tab' | 'start-date' | 'end-date' | 'from-height' | 'to-height'
  >()

  return (
    <ExportPage
      title={`(${t('export_transactions.transactions')})`}
      fetchCSVData={params =>
        explorerService.api.exportTransactions({
          type,
          id,
          date: params.tab === 'date' ? { start: dayjs(params.startDate), end: dayjs(params.endDate) } : undefined,
          block: params.tab === 'height' ? { from: params.fromHeight!, to: params.toHeight! } : undefined,
          isViewOriginal,
        })
      }
      csvFileName={`exported-txs-${type}${type === 'blocks' ? '' : `-${id}`}`}
      defaultParams={{
        tab,
        startDate: startDate?.valueOf(),
        endDate: endDate?.valueOf(),
        fromHeight,
        toHeight,
      }}
      handleParamsChanged={params => {
        updateSearchParams(
          p => ({
            ...p,
            tab: params.tab,
            ...(params.tab === 'date'
              ? {
                  'start-date': params.startDate ? dayjs(params.startDate).format('YYYY-MM-DD') : undefined,
                  'end-date': params.endDate ? dayjs(params.endDate).format('YYYY-MM-DD') : undefined,
                }
              : {}),
            ...(params.tab === 'height'
              ? {
                  'from-height': params.fromHeight ? params.fromHeight.toString() : undefined,
                  'to-height': params.toHeight ? params.toHeight.toString() : undefined,
                }
              : {}),
          }),
          true,
        )
      }}
    />
  )
}

export default ExportTransactions
