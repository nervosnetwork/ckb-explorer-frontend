import { DatePicker, InputNumber, Tabs } from 'antd'
import * as cnLocale from 'antd/es/date-picker/locale/zh_CN'
import * as enLocale from 'antd/es/date-picker/locale/en_US'
import { Moment } from 'moment'
import { useState } from 'react'
import classNames from 'classnames'
import { useSearchParams } from '../../utils/hook'
import Content from '../../components/Content'
import styles from './styles.module.scss'
import i18n, { currentLanguage } from '../../utils/i18n'
import 'moment/locale/es-us'
import 'moment/locale/zh-cn'
import { ReactComponent as BlockIcon } from '../../assets/block_icon.svg'
import { ReactComponent as ErrorIcon } from '../../assets/error_icon.svg'
import { ReactComponent as SuccessIcon } from '../../assets/success_icon.svg'
import { exportTransactions } from '../../service/http/fetcher'

const ExportTransactions = () => {
  const { format } = useSearchParams('format')

  const locale = currentLanguage() === 'zh' ? cnLocale : enLocale

  const [tabs, setTabs] = useState<'date' | 'height'>('date')
  const [startDate, setStartDate] = useState<Moment | null>()
  const [endDate, setEndDate] = useState<Moment | null>()

  const [startHeight, setStartHeight] = useState<number | null>()
  const [endHeight, setEndHeight] = useState<number | null>()

  const [hintType, setHintType] = useState<'success' | 'error' | undefined>()
  const [hint, setHint] = useState<string | undefined>()

  const handleTabsChange = (v?: string) => {
    if (v === 'date') {
      setTabs('date')
      setStartHeight(null)
      setEndHeight(null)
    } else if (v === 'height') {
      setTabs('height')
      setStartDate(null)
      setEndDate(null)
    }
    setHintType(undefined)
    setHint(undefined)
  }

  const handleDownload = () => {
    if (tabs === 'date') {
      if (!startDate || !endDate) {
        setHintType('error')
        setHint(i18n.t('export_transactions.please_pick_date'))
        return
      }
      if (endDate.isBefore(startDate)) {
        setHintType('error')
        setHint(i18n.t('export_transactions.error_date_order'))
        return
      }
      setHintType('success')
      setHint(i18n.t('export_transactions.download_processed'))
      exportTransactions({
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        format,
      }).then((resp: Response.Response<string> | null) => {
        if (resp) {
          window.open(resp.data, '_blank')
        }
      })
    }
    if (tabs === 'height') {
      if (!startHeight || !endHeight) {
        setHintType('error')
        setHint(i18n.t('export_transactions.please_input_block_number'))
        return
      }
      if (endHeight < startHeight) {
        setHintType('error')
        setHint(i18n.t('export_transactions.error_block_number_order'))
        return
      }
      if (endHeight > startHeight + 5000) {
        setHintType('error')
        setHint(i18n.t('export_transactions.too_many_blocks'))
        return
      }
      setHintType('success')
      setHint(i18n.t('export_transactions.download_processed'))
      exportTransactions({
        startHeight,
        endHeight,
        format,
      }).then((resp: Response.Response<string> | null) => {
        if (resp) {
          window.open(resp.data, '_blank')
        }
      })
    }
  }

  return (
    <Content>
      <div className="container">
        <div className={styles.title}>
          <span>{i18n.t('export_transactions.download_data')}</span>
          <span>({i18n.t('export_transactions.transactions')})</span>
        </div>
        <div className={styles.description}>
          <div>{i18n.t('export_transactions.description_str')}</div>
        </div>
        <div className={styles.downloadPanel}>
          <div>
            <div>{i18n.t('export_transactions.select_download_options')}</div>
            <div>
              <Tabs
                activeKey={tabs}
                onChange={handleTabsChange}
                items={[
                  {
                    label: i18n.t('export_transactions.date'),
                    key: 'date',
                    children: (
                      <div className={styles.dateOrBlockPanel}>
                        <div>
                          <div>
                            <div>{i18n.t('export_transactions.start_date')}</div>
                            <DatePicker
                              size="large"
                              locale={locale.default}
                              value={startDate}
                              onChange={m => setStartDate(m)}
                            />
                          </div>
                          <div>
                            <div>{i18n.t('export_transactions.end_date')}</div>
                            <DatePicker
                              size="large"
                              locale={locale.default}
                              value={endDate}
                              onChange={m => setEndDate(m)}
                            />
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    label: i18n.t('export_transactions.block_number'),
                    key: 'height',
                    children: (
                      <div className={styles.dateOrBlockPanel}>
                        <div>
                          <div>
                            <div>{i18n.t('export_transactions.from_block')}</div>
                            <InputNumber
                              size="large"
                              prefix={<BlockIcon />}
                              value={startHeight}
                              parser={t => (t ? parseInt(t.replace(/\D+/g, ''), 10) : 0)}
                              onChange={h => setStartHeight(h)}
                            />
                          </div>
                          <div>
                            <div>{i18n.t('export_transactions.to_block')}</div>
                            <InputNumber
                              size="large"
                              prefix={<BlockIcon />}
                              value={endHeight}
                              onChange={h => setEndHeight(h)}
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
          <div>{i18n.t('export_transactions.note_str')}</div>
        </div>
        <div className={styles.hint}>
          <div>
            <div
              className={classNames({
                [styles.successHint]: hintType === 'success',
                [styles.errorHint]: hintType === 'error',
                [styles.noHint]: hintType === undefined,
              })}
            >
              {hintType === 'error' && <ErrorIcon />}
              {hintType === 'success' && <SuccessIcon />}
              <div>{hint}</div>
            </div>
          </div>
        </div>
        <div className={styles.downloadButton}>
          <div>
            <button type="button" onClick={handleDownload}>
              {i18n.t('export_transactions.download')}
            </button>
          </div>
        </div>
      </div>
    </Content>
  )
}

export default ExportTransactions
