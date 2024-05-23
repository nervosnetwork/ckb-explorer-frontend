import { InputNumber } from 'antd'
import { useState } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSearchParams, useUpdateSearchParams } from '../../hooks'
import Content from '../../components/Content'
import styles from './styles.module.scss'
import { ReactComponent as BlockIcon } from './block_icon.svg'
import { ReactComponent as ErrorIcon } from './error_icon.svg'
import { ReactComponent as SuccessIcon } from './success_icon.svg'
import { omit } from '../../utils/object'
import { explorerService } from '../../services/ExplorerService'

const XudtExport = () => {
  const [t] = useTranslation()

  const { id, height: _blockHeight } = useSearchParams('id', 'height')

  const blockHeight = _blockHeight !== undefined ? parseInt(_blockHeight, 10) : undefined

  const updateSearchParams = useUpdateSearchParams<
    'type' | 'tab' | 'start-date' | 'end-date' | 'from-height' | 'to-height'
  >()

  const [hint, setHint] = useState<{ type: 'success' | 'error' | undefined; msg?: string; extraMsg?: string }>({
    type: undefined,
    msg: undefined,
    extraMsg: undefined,
  })

  // disable download button when downloading
  const [isDownloading, setIsDownloading] = useState(false)
  const handleDownload = () => {
    if (blockHeight === undefined) {
      setHint({ type: 'error', msg: 'please_input_block_number' })
      return
    }

    if (id === undefined) {
      setHint({ type: 'error', msg: 'udt_not_found' })
      return
    }

    setHint({ type: 'success', msg: 'download_processed' })
    setIsDownloading(true)
    explorerService.api
      .fetchXudtHoders({
        id,
        number: blockHeight,
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
        a.download = `exported-xudt-holders-${id}-block-${blockHeight}.csv`
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

  const disableDownload = isDownloading || blockHeight === undefined

  return (
    <Content>
      <div className={classNames('container', styles.containerPanel)}>
        <div className={styles.title}>
          <span>{t('export_transactions.download_data')}</span>
          <span>({t('export_transactions.holders_by_block')})</span>
        </div>
        <div className={styles.description}>
          <div>{t('export_transactions.description_str')}</div>
        </div>
        <div className={styles.exportPanel}>
          <div className={styles.exportHeader}>
            <div className={styles.exportTitle}>{t('export_transactions.holders_by_block_title')}</div>
            <div className={styles.exportDescription}>{t('export_transactions.holders_by_block_des')}</div>
            <div className={styles.dateOrBlockPanel}>
              <div className={styles.heightInputPanel}>
                <div className={styles.textCernter}>{t('export_transactions.block_height')}</div>
                <InputNumber
                  size="large"
                  prefix={<BlockIcon />}
                  min={0}
                  parser={heightParser}
                  value={blockHeight}
                  controls={false}
                  onChange={h =>
                    updateSearchParams(
                      params => (h ? { ...params, height: h.toString() } : omit(params, ['to-height'])),
                      true,
                    )
                  }
                />
              </div>
            </div>
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

export default XudtExport
