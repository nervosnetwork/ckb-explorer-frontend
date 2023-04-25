import { DatePicker, InputNumber, Tabs } from 'antd'
import * as cnLocale from 'antd/es/date-picker/locale/zh_CN'
import * as enLocale from 'antd/es/date-picker/locale/en_US'
import dayjs from 'dayjs'
import { useState } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import type { RangePickerProps } from 'antd/es/date-picker'
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
    type,
    address,
    nft,
    tab = 'date',
    'start-date': startDateStr,
    'end-date': endDateStr,
    'from-height': fromHeightStr,
    'to-height': toHeightStr,
  } = useSearchParams('type', 'address', 'nft', 'tab', 'start-date', 'end-date', 'from-height', 'to-height')

  const startDate = tab === 'date' && startDateStr ? dayjs(startDateStr) : undefined
  const endDate = tab === 'date' && endDateStr ? dayjs(endDateStr) : undefined

  const fromHeight =
    tab === 'height' && fromHeightStr && /^(0|[1-9]\d*)$/.test(fromHeightStr) ? parseInt(fromHeightStr, 10) : 0
  const toHeight = tab === 'height' && toHeightStr && /^(0|[1-9]\d*)$/.test(toHeightStr) ? parseInt(toHeightStr, 10) : 0

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

  const disabledStartDate: RangePickerProps['disabledDate'] = current => {
    return (
      (current && current > dayjs().endOf('day')) || (current && endDate && current >= endDate.endOf('day')) || false
    )
  }

  const disabledEndDate: RangePickerProps['disabledDate'] = current => {
    return (
      (current && current > dayjs().endOf('day')) ||
      (current && startDate && current <= startDate.endOf('day')) ||
      false
    )
  }

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
      if ((!fromHeight && fromHeight !== 0) || (!toHeight && toHeight !== 0)) {
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
      if (toHeight > fromHeight + 5000) {
        setHint({ type: 'error', msg: 'too_many_blocks' })
        return
      }
    }
    setHint({ type: 'success', msg: 'download_processed' })
    exportTransactions({ startDate, endDate, fromHeight, toHeight, type, address, nft })
      .then((resp: Response.Response<string> | null) => {
        if (!resp || !resp.data) {
          setHint({
            type: 'error',
            msg: 'fetch_processed_export_link_empty',
          })
          return
        }
        if (resp.error) {
          setHint({
            type: 'error',
            msg: 'fetch_processed_export_link_error',
            extraMsg: `: ${resp && resp?.error ? resp.error.map(r => r.title).join(',') : ''}`,
          })
        }
        window.open(resp.data, '_blank', 'noopener, noreferrer')
      })
      .catch(reason => {
        setHint({
          type: 'error',
          msg: 'fetch_processed_export_link_error',
          extraMsg: `: ${reason}`,
        })
      })
  }

  const heightParser = (t?: string) => {
    const res = t ? parseInt(t.replace(/[^-\d]/g, ''), 10) : 0
    return res < 0 ? 0 : res
  }

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
              <div>
                {t(`export_transactions.${hint.msg}`)}
                {hint.extraMsg}
              </div>
            </div>
          </div>
          <div className={styles.downloadButton}>
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
