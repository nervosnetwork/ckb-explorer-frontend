import { DatePicker, InputNumber, Tabs } from 'antd'
import * as cnLocale from 'antd/es/date-picker/locale/zh_CN'
import * as enLocale from 'antd/es/date-picker/locale/en_US'
import dayjs from 'dayjs'
import { useState } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSearchParams, useUpdateSearchParams } from '../../utils/hook'
import Content from '../../components/Content'
import styles from './styles.module.scss'
import 'dayjs/locale/es-us'
import 'dayjs/locale/zh-cn'
import { ReactComponent as BlockIcon } from '../../assets/block_icon.svg'
import { ReactComponent as ErrorIcon } from '../../assets/error_icon.svg'
import { ReactComponent as SuccessIcon } from '../../assets/success_icon.svg'
import { exportTransactions } from '../../service/http/fetcher'
import { omit } from '../../utils/object'

const ExportTransactions = () => {
  const [t, { language }] = useTranslation()

  const locale = language === 'zh' ? cnLocale.default : enLocale.default

  const {
    format,
    tab: tabStr,
    'start-date': startDateStr,
    'end-date': endDateStr,
    'from-height': fromHeightStr,
    'to-height': toHeightStr,
  } = useSearchParams('format', 'tab', 'start-date', 'end-date', 'from-height', 'to-height')

  const defaultTab = 'date'

  const tab = tabStr && ['date', 'height'].includes(tabStr) ? tabStr : defaultTab

  const startDate = tab === 'date' && startDateStr ? dayjs(startDateStr) : undefined
  const endDate = tab === 'date' && endDateStr ? dayjs(endDateStr) : undefined

  const fromHeight = tab === 'height' && fromHeightStr ? parseInt(fromHeightStr, 10) : undefined
  const toHeight = tab === 'height' && toHeightStr ? parseInt(toHeightStr, 10) : undefined

  const updateSearchParams = useUpdateSearchParams<
    'format' | 'tab' | 'start-date' | 'end-date' | 'from-height' | 'to-height'
  >()

  const [hint, setHint] = useState<{ type: 'success' | 'error' | undefined; msg?: string }>({
    type: undefined,
    msg: undefined,
  })

  const handleTabChange = (tab?: string) => {
    updateSearchParams(params => omit({ ...params, tab }, ['start-date', 'end-date', 'from-height', 'to-height']), true)
    setHint({ type: undefined })
  }

  const handleDownload = () => {
    if (tab === 'date') {
      if (!startDate || !endDate) {
        setHint({ type: 'error', msg: t('export_transactions.please_pick_date') })
        return
      }
      if (endDate.isBefore(startDate)) {
        setHint({ type: 'error', msg: t('export_transactions.error_date_order') })
        return
      }
    }
    if (tab === 'height') {
      if (!fromHeight || !toHeight) {
        setHint({ type: 'error', msg: t('export_transactions.please_input_block_number') })
        return
      }
      if (toHeight < fromHeight) {
        setHint({ type: 'error', msg: t('export_transactions.error_block_number_order') })
        return
      }
      if (fromHeight <= 0 || toHeight <= 0) {
        setHint({ type: 'error', msg: t('export_transactions.block_number_should_be_positive') })
        return
      }
      if (toHeight > fromHeight + 5000) {
        setHint({ type: 'error', msg: t('export_transactions.too_many_blocks') })
        return
      }
    }
    setHint({ type: 'success', msg: t('export_transactions.download_processed') })
    exportTransactions({ startDate, endDate, fromHeight, toHeight, format }).then(
      (resp: Response.Response<string> | null) => {
        if (resp && !resp.error) {
          window.open(resp.data, '_blank', 'noopener, noreferrer')
        } else {
          setHint({
            type: 'error',
            msg: `${t('export_transactions.fetch_processed_export_link_error')}: ${
              resp && resp?.error ? resp.error.map(r => r.title).join(',') : ''
            }`,
          })
        }
      },
    )
  }

  return (
    <Content>
      <div className="container">
        <div className={styles.title}>
          <span>{t('export_transactions.download_data')}</span>
          <span>({t('export_transactions.transactions')})</span>
        </div>
        <div className={styles.description}>
          <div>{t('export_transactions.description_str')}</div>
        </div>
        <div className={styles.downloadPanel}>
          <div>
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
                        <div>
                          <div>
                            <div>{t('export_transactions.start_date')}</div>
                            <DatePicker
                              size="large"
                              locale={locale}
                              value={startDate}
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
                          <div>
                            <div>{t('export_transactions.end_date')}</div>
                            <DatePicker
                              size="large"
                              locale={locale}
                              value={endDate}
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
                      </div>
                    ),
                  },
                  {
                    label: t('export_transactions.block_number'),
                    key: 'height',
                    children: (
                      <div className={styles.dateOrBlockPanel}>
                        <div>
                          <div>
                            <div>{t('export_transactions.from_block')}</div>
                            <InputNumber
                              size="large"
                              prefix={<BlockIcon />}
                              value={fromHeight}
                              parser={t => (t ? parseInt(t.replace(/\D+/g, ''), 10) : 0)}
                              onChange={h =>
                                updateSearchParams(
                                  params =>
                                    h ? { ...params, 'from-height': h.toString() } : omit(params, ['from-height']),
                                  true,
                                )
                              }
                            />
                          </div>
                          <div>
                            <div>{t('export_transactions.to_block')}</div>
                            <InputNumber
                              size="large"
                              prefix={<BlockIcon />}
                              value={toHeight}
                              onChange={h =>
                                updateSearchParams(
                                  params =>
                                    h ? { ...params, 'to-height': h.toString() } : omit(params, ['to-height']),
                                  true,
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className={styles.note}>
          <div>{t('export_transactions.note_str')}</div>
        </div>
        <div className={styles.hint}>
          <div>
            <div
              className={classNames({
                [styles.successHint]: hint.type === 'success',
                [styles.errorHint]: hint.type === 'error',
                [styles.noHint]: hint.type === undefined,
              })}
            >
              {hint.type === 'error' && <ErrorIcon />}
              {hint.type === 'success' && <SuccessIcon />}
              <div>{hint.msg}</div>
            </div>
          </div>
        </div>
        <div className={styles.downloadButton}>
          <div>
            <button type="button" onClick={handleDownload}>
              {t('export_transactions.download')}
            </button>
          </div>
        </div>
      </div>
    </Content>
  )
}

export default ExportTransactions
