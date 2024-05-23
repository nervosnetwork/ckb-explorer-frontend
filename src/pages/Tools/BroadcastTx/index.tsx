import { type FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import formatter from '@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter'
import ToolsContainer from '../ToolsContainer'
import CopyableText from '../../../components/CopyableText'
import styles from './style.module.scss'
import { sendTransaction } from '../../../services/NodeService'

const BroadcastTx: FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<Partial<Record<'hash' | 'error', string>>>({})

  const { t } = useTranslation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation()
    e.preventDefault()

    const inputted = (e.target as HTMLFormElement).tx.value
    if (!inputted) {
      setResult({ error: 'Please enter the transaction data' })
      return
    }

    try {
      setResult({})
      setIsLoading(true)
      let tx = JSON.parse(inputted.trim())
      if ('cellDeps' in tx) {
        // should be converted to snake_case
        tx = formatter.toRawTransaction(tx)
      }
      const r = await sendTransaction(tx)
      if (r.error) {
        throw new Error(r.error.message)
      }
      setResult({ hash: r.result })
    } catch (e) {
      if (e instanceof Error) {
        setResult({ error: e.message })
        return
      }
      setResult({ error: 'Fail to broadcast the transaction' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ToolsContainer>
      <div className={styles.panel}>
        <h3 className={styles.panelTitle}>{t('tools.broadcast_tx')}</h3>
        <form onSubmit={handleSubmit} className={styles.input}>
          <label htmlFor="tx">{t('tools.tx_to_broadcast')}</label>

          <textarea id="tx" placeholder={`${t('tools.please_enter')} ${t('tools.tx_to_broadcast')}`} />

          {!isLoading ? (
            <button type="submit" className={styles.submit}>
              {t('tools.broadcast')}
            </button>
          ) : (
            <div className={styles.loading} />
          )}
        </form>
        {result.hash ? (
          <div className={styles.console}>
            <strong>{`${t('tools.tx_hash')}:`}</strong>
            <a href={`/transaction/${result.hash}`} target="_blank" rel="noopener noreferrer">
              <CopyableText>{result.hash}</CopyableText>
            </a>
          </div>
        ) : null}
        {result.error ? <span className={styles.error}>{result.error}</span> : null}
      </div>
    </ToolsContainer>
  )
}

export default BroadcastTx
