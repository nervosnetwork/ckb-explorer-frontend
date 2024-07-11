import { InputNumber, Tabs } from 'antd'
import DatePicker from 'antd/lib/date-picker'
import * as cnLocale from 'antd/es/date-picker/locale/zh_CN'
import * as enLocale from 'antd/es/date-picker/locale/en_US'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import Content from '../Content'
import styles from './styles.module.scss'
import 'dayjs/locale/es-us'
import 'dayjs/locale/zh-cn'
import { ReactComponent as BlockIcon } from './block_icon.svg'
import { ReactComponent as ErrorIcon } from './error_icon.svg'
import { ReactComponent as SuccessIcon } from './success_icon.svg'

interface ExportPageProps {
  csvFileName?: string
  note?: string
  defaultParams?: {
    startDate?: number
    endDate?: number
    fromHeight?: number
    toHeight?: number
    tab?: string
  }
  handleParamsChanged?: (params: {
    startDate?: number
    endDate?: number
    fromHeight?: number
    toHeight?: number
    tab?: string
  }) => void
  fetchCSVData: (params: {
    startDate?: number
    endDate?: number
    fromHeight?: number
    toHeight?: number
    tab: string
  }) => Promise<string>
}

export const ExportPage: React.FC<ExportPageProps> = ({
  defaultParams = {},
  handleParamsChanged = () => {},
  fetchCSVData,
  csvFileName = 'exported-txs',
  note,
}) => {
  const [t, { language }] = useTranslation()
  const [startDate, setStartDate] = useState<number | undefined>(
    defaultParams?.startDate ?? dayjs('2020-01-01').valueOf(),
  )
  const [endDate, setEndDate] = useState<number | undefined>(defaultParams?.endDate ?? dayjs().valueOf())
  const [fromHeight, setFromHeight] = useState<number | undefined>(defaultParams?.fromHeight)
  const [toHeight, setToHeight] = useState<number | undefined>(defaultParams?.toHeight)
  const [tab, setTab] = useState<string>(defaultParams?.tab ?? 'date')

  useEffect(() => {
    handleParamsChanged({
      startDate,
      endDate,
      fromHeight,
      toHeight,
      tab,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, fromHeight, toHeight, tab])

  const locale = language === 'zh' ? cnLocale.default : enLocale.default

  const [hint, setHint] = useState<{ type: 'success' | 'error' | undefined; msg?: string; extraMsg?: string }>({
    type: undefined,
    msg: undefined,
    extraMsg: undefined,
  })

  const handleTabChange = (tab: string) => {
    setTab(tab)
    setHint({ type: undefined })
  }

  const disabledStartDate = (current: Dayjs) => {
    return (
      (current && current > dayjs().endOf('day')) ||
      (current && endDate && current >= dayjs(endDate).endOf('day')) ||
      false
    )
  }

  const disabledEndDate = (current: Dayjs) => {
    return (
      (current && current > dayjs().endOf('day')) ||
      (current && startDate && current <= dayjs(startDate).endOf('day')) ||
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
      if (dayjs(endDate).isBefore(startDate)) {
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
    fetchCSVData({
      startDate,
      endDate,
      fromHeight,
      toHeight,
      tab,
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
        a.download = `${csvFileName}-${tab === 'date' && startDate ? dayjs(startDate).format('YYYY-MM-DD') : ''}${
          tab === 'height' ? fromHeight : ''
        }-${tab === 'date' && endDate ? dayjs(endDate).format('YYYY-MM-DD') : ''}${
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
                            value={dayjs(startDate)}
                            popupClassName={styles.calendar}
                            disabledDate={disabledStartDate}
                            onChange={d => setStartDate(d ? d.valueOf() : undefined)}
                          />
                        </div>
                        <div className={styles.datePickerPanel}>
                          <div>{t('export_transactions.end_date')}</div>
                          <DatePicker
                            size="large"
                            locale={locale}
                            value={dayjs(endDate)}
                            popupClassName={styles.calendar}
                            disabledDate={disabledEndDate}
                            onChange={d => setEndDate(d ? d.endOf('D').valueOf() : undefined)}
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
                            onChange={h => setFromHeight(h ?? undefined)}
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
                            onChange={h => setToHeight(h ?? undefined)}
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
            <div>{note ?? t('export_transactions.note_str')}</div>
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
