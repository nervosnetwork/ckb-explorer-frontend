import dayjs from 'dayjs'
import { DayPicker } from 'react-day-picker'
import { Calendar } from 'lucide-react'
import 'react-day-picker/src/style.css'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs'
import Popover from '../Popover'

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
  const [t] = useTranslation()
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

  const [hint, setHint] = useState<{ type: 'success' | 'error' | undefined; msg?: string; extraMsg?: string }>({
    type: undefined,
    msg: undefined,
    extraMsg: undefined,
  })

  const handleTabChange = (tab: string) => {
    setTab(tab)
    setHint({ type: undefined })
  }

  const disabledStartDate = (current: Date) => {
    return (
      (current && dayjs(current).isAfter(dayjs().endOf('day'))) ||
      (current && endDate && dayjs(current).isAfter(dayjs(endDate).endOf('day'))) ||
      false
    )
  }

  const disabledEndDate = (current: Date) => {
    return (
      (current && dayjs(current).isAfter(dayjs().endOf('day'))) ||
      (current && startDate && dayjs(current).isBefore(dayjs(startDate).endOf('day'))) ||
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
              <Tabs style={{ alignItems: 'center', width: '100%' }} value={tab} onValueChange={handleTabChange}>
                <TabsList style={{ width: '50%' }}>
                  <TabsTrigger value="date">{t('export_transactions.date')}</TabsTrigger>
                  <TabsTrigger value="height">{t('export_transactions.block_number')}</TabsTrigger>
                </TabsList>
                <TabsContent value="date" style={{ width: '100%' }}>
                  <div className={styles.dateOrBlockPanel}>
                    <div className={styles.datePickerPanel}>
                      <div>{t('export_transactions.start_date')}</div>
                      <Popover
                        forceClick
                        trigger={
                          <div className={styles.datePickerTrigger}>
                            <Calendar className={styles.datePickerIcon} />
                            <span>{startDate ? dayjs(startDate).format('YYYY-MM-DD') : ''}</span>
                          </div>
                        }
                      >
                        <DayPicker
                          animate
                          mode="single"
                          captionLayout="dropdown"
                          selected={startDate ? dayjs(startDate).toDate() : undefined}
                          disabled={disabledStartDate}
                          onSelect={d => setStartDate(d ? dayjs(d).valueOf() : undefined)}
                        />
                      </Popover>
                    </div>
                    <div className={styles.datePickerPanel}>
                      <div>{t('export_transactions.end_date')}</div>
                      <Popover
                        forceClick
                        trigger={
                          <div className={styles.datePickerTrigger}>
                            <Calendar className={styles.datePickerIcon} />
                            <span>{endDate ? dayjs(endDate).format('YYYY-MM-DD') : ''}</span>
                          </div>
                        }
                      >
                        <DayPicker
                          animate
                          mode="single"
                          captionLayout="dropdown"
                          selected={endDate ? dayjs(endDate).toDate() : undefined}
                          disabled={disabledEndDate}
                          onSelect={d => {
                            setEndDate(d ? dayjs(d).endOf('D').valueOf() : undefined)
                          }}
                        />
                      </Popover>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="height">
                  <div className={styles.dateOrBlockPanel}>
                    <div className={styles.heightInputPanel}>
                      <div>{t('export_transactions.from_block')}</div>
                      <div className={styles.inputContainer}>
                        <BlockIcon />
                        <input
                          className={classNames(styles.inputContent)}
                          type="number"
                          style={{ width: '100%' }}
                          min={0}
                          value={fromHeight}
                          onChange={e => {
                            const h = e.target.value
                            if (h === '' || h === undefined) {
                              return
                            }
                            const height = heightParser(h)
                            setFromHeight(height)
                          }}
                        />
                      </div>
                    </div>
                    <div className={styles.heightInputPanel}>
                      <div>{t('export_transactions.to_block')}</div>
                      <div className={styles.inputContainer}>
                        <BlockIcon />
                        <input
                          className={classNames(styles.inputContent)}
                          type="number"
                          style={{ width: '100%' }}
                          min={0}
                          value={toHeight}
                          onChange={e => {
                            const h = e.target.value
                            if (h === '' || h === undefined) {
                              return
                            }
                            const height = heightParser(h)
                            setToHeight(height)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
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
