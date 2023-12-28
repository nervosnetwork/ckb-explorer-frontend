import { InputNumber, Tabs } from 'antd'
import DatePicker from 'antd/lib/date-picker'
import * as cnLocale from 'antd/es/date-picker/locale/zh_CN'
import * as enLocale from 'antd/es/date-picker/locale/en_US'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSearchParams, useUpdateSearchParams } from '../../hooks'
import Content from '../../components/Content'
import styles from './styles.module.scss'
import 'dayjs/locale/es-us'
import 'dayjs/locale/zh-cn'
import { ReactComponent as BlockIcon } from './block_icon.svg'
import { ReactComponent as ErrorIcon } from './error_icon.svg'
import { ReactComponent as SuccessIcon } from './success_icon.svg'
import { omit } from '../../utils/object'
import { SupportedExportTransactionType, explorerService } from '../../services/ExplorerService'

const ExportTransactions = () => {
  const [t, { language }] = useTranslation()

  const locale = language === 'zh' ? cnLocale.default : enLocale.default

  const {
    type: typeStr,
    id,
    tab = 'date',
    'start-date': startDateStr,
    'end-date': endDateStr,
    'from-height': fromHeightStr,
    'to-height': toHeightStr,
  } = useSearchParams('type', 'id', 'tab', 'start-date', 'end-date', 'from-height', 'to-height')
  function isTransactionCsvExportType(s?: string): s is SupportedExportTransactionType {
    return !!s && ['address_transactions', 'blocks', 'udts', 'nft'].includes(s)
  }

  const type = isTransactionCsvExportType(typeStr) ? typeStr : 'blocks'

  const startDate = tab === 'date' && startDateStr ? dayjs(startDateStr) : undefined
  const endDate = tab === 'date' && endDateStr ? dayjs(endDateStr) : undefined

  const fromHeight = tab === 'height' && fromHeightStr !== undefined ? parseInt(fromHeightStr, 10) : undefined
  const toHeight = tab === 'height' && toHeightStr !== undefined ? parseInt(toHeightStr, 10) : undefined

  const updateSearchParams = useUpdateSearchParams<
    'type' | 'tab' | 'start-date' | 'end-date' | 'from-height' | 'to-height'
  >()

  if (!['date', 'height'].includes(tab)) {
    updateSearchParams(params => ({ ...params, tab: 'date' }), true)
  }

  if (tab === 'date') {
    const now = dayjs().endOf('day')
    if ((startDate && startDate > now) || (endDate && endDate > now) || (startDate && endDate && startDate > endDate)) {
      updateSearchParams(params => omit(params, ['start-date', 'end-date']), true)
    }
  }

  const [hint, setHint] = useState<{ type: 'success' | 'error' | undefined; msg?: string; extraMsg?: string }>({
    type: undefined,
    msg: undefined,
    extraMsg: undefined,
  })

  const handleTabChange = (tab?: string) => {
    updateSearchParams(params => omit({ ...params, tab }, ['start-date', 'end-date', 'from-height', 'to-height']), true)
    setHint({ type: undefined })
  }

  const disabledStartDate = (current: Dayjs) => {
    return (
      (current && current > dayjs().endOf('day')) || (current && endDate && current >= endDate.endOf('day')) || false
    )
  }

  const disabledEndDate = (current: Dayjs) => {
    return (
      (current && current > dayjs().endOf('day')) ||
      (current && startDate && current <= startDate.endOf('day')) ||
      false
    )
  }

  // disable download button when downloading
  const [isDownloading, setIsDownloading] = useState(false)
  const handleDownload = () => {
    if (tab === 'date') {
      if (!startDate || !endDate) {
        setHint({ type: 'error', msg: 'please_pick_date' })
        return
      }
      if (endDate.isBefore(startDate)) {
        setHint({ type: 'error', msg: 'error_date_order' })
        return
      }
    }
    if (tab === 'height') {
      if (fromHeight === undefined || toHeight === undefined) {
        setHint({ type: 'error', msg: 'please_input_block_number' })
        return
      }
      if (toHeight < fromHeight) {
        setHint({ type: 'error', msg: 'error_block_number_order' })
        return
      }
      if (fromHeight < 0 || toHeight < 0) {
        setHint({ type: 'error', msg: 'block_number_should_be_positive' })
        return
      }
      if (toHeight >= fromHeight + 5000) {
        setHint({ type: 'error', msg: 'too_many_blocks' })
        return
      }
    }
    setHint({ type: 'success', msg: 'download_processed' })
    setIsDownloading(true)
    explorerService.api
      .exportTransactions({
        type,
        id,
        date: tab === 'date' ? { start: startDate, end: endDate } : undefined,
        block: tab === 'height' ? { from: fromHeight!, to: toHeight! } : undefined,
      })
      .then((resp: string | null) => {
        setIsDownloading(false)
        if (!resp) {
          setHint({
            type: 'error',
            msg: 'fetch_processed_export_link_empty',
          })
          return
        }

        const a = document.createElement('a')
        a.href = encodeURI(`data:,${resp.replaceAll('#', '')}`)
        a.download = `exported-txs-${type}${type === 'blocks' ? '' : `-${id}`}-${
          tab === 'date' && startDate ? startDate.format('YYYY-MM-DD') : ''
        }${tab === 'height' ? fromHeight : ''}-${tab === 'date' && endDate ? endDate.format('YYYY-MM-DD') : ''}${
          tab === 'height' ? toHeight : ''
        }.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      })
      .catch(reason => {
        setIsDownloading(false)
        setHint({
          type: 'error',
          msg: 'fetch_processed_export_link_error',
          extraMsg: `: ${reason}`,
        })
      })
  }

  const heightParser = (t?: string) => {
    const res = t ? Math.abs(parseInt(t, 10)) : 0
    return res < 0 ? 0 : res
  }

  const disableDownload =
    isDownloading ||
    (tab === 'date' && (!startDate || !endDate)) ||
    (tab === 'height' && (fromHeight === undefined || toHeight === undefined))

  return (
    <Content>
      <div className={classNames('container', styles.containerPanel)}>
        <div className={styles.title}>
          <span>{t('export_transactions.download_data')}</span>
          <span>({t('export_transactions.transactions')})</span>
        </div>
        <div className={styles.description}>
          <div>{t('export_transactions.description_str')}</div>
        </div>
        <div className={styles.exportPanel}>
          <div className={styles.exportHeader}>
            <div>{t('export_transactions.select_download_options')}</div>
            <div>
              <Tabs
                activeKey={tab}
                onChange={handleTabChange}
                items={[
                  {
                    label: t('export_transactions.date'),
                    key: 'date',
                    children: (
                      <div className={styles.dateOrBlockPanel}>
                        <div className={styles.datePickerPanel}>
                          <div>{t('export_transactions.start_date')}</div>
                          <DatePicker
                            size="large"
                            locale={locale}
                            value={startDate}
                            popupClassName={styles.calendar}
                            disabledDate={disabledStartDate}
                            onChange={d => {
                              updateSearchParams(
                                params =>
                                  d
                                    ? { ...params, 'start-date': d.format('YYYY-MM-DD') }
                                    : omit(params, ['start-date']),
                                true,
                              )
                            }}
                          />
                        </div>
                        <div className={styles.datePickerPanel}>
                          <div>{t('export_transactions.end_date')}</div>
                          <DatePicker
                            size="large"
                            locale={locale}
                            value={endDate}
                            popupClassName={styles.calendar}
                            disabledDate={disabledEndDate}
                            onChange={d =>
                              updateSearchParams(
                                params =>
                                  d ? { ...params, 'end-date': d.format('YYYY-MM-DD') } : omit(params, ['end-date']),
                                true,
                              )
                            }
                          />
                        </div>
                      </div>
                    ),
                  },
                  {
                    label: t('export_transactions.block_number'),
                    key: 'height',
                    children: (
                      <div className={styles.dateOrBlockPanel}>
                        <div className={styles.heightInputPanel}>
                          <div>{t('export_transactions.from_block')}</div>
                          <InputNumber
                            size="large"
                            prefix={<BlockIcon />}
                            value={fromHeight}
                            min={0}
                            parser={heightParser}
                            controls={false}
                            onChange={h =>
                              updateSearchParams(
                                params =>
                                  h ? { ...params, 'from-height': h.toString() } : omit(params, ['from-height']),
                                true,
                              )
                            }
                          />
                        </div>
                        <div className={styles.heightInputPanel}>
                          <div>{t('export_transactions.to_block')}</div>
                          <InputNumber
                            size="large"
                            prefix={<BlockIcon />}
                            min={0}
                            parser={heightParser}
                            value={toHeight}
                            controls={false}
                            onChange={h =>
                              updateSearchParams(
                                params => (h ? { ...params, 'to-height': h.toString() } : omit(params, ['to-height'])),
                                true,
                              )
                            }
                          />
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
          <div className={styles.note}>
            <div>{t('export_transactions.note_str')}</div>
          </div>
          <div className={styles.hint}>
            <div
              className={classNames({
                [styles.successHint]: hint.type === 'success',
                [styles.errorHint]: hint.type === 'error',
                [styles.noHint]: hint.type === undefined,
              })}
            >
              {hint.type === 'error' && <ErrorIcon />}
              {hint.type === 'success' && <SuccessIcon />}
              <div className={styles.hintText}>
                {t(`export_transactions.${hint.msg}`)}
                {hint.extraMsg}
              </div>
            </div>
          </div>
          <div className={styles.downloadButton}>
            <button type="button" disabled={disableDownload} onClick={handleDownload}>
              {t('export_transactions.download')}
            </button>
          </div>
        </div>
      </div>
    </Content>
  )
}

export default ExportTransactions
