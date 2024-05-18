import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import paramsFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter'
import resultFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/resultFormatter'
import { ReactComponent as CopyIcon } from '../../../assets/copy_icon.svg'
import styles from './transaction.module.scss'
import { useSetToast } from '../../../components/Toast'

const Transaction = () => {
  const [camelCase, setCamelCase] = useState({ value: '', error: '' })
  const [snakeCase, setSnakeCase] = useState({ value: '', error: '' })

  const setToast = useSetToast()
  const { t } = useTranslation()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const elm = e.currentTarget
    const { value, id } = elm

    switch (id) {
      case 'camel-case': {
        setCamelCase({ value, error: '' })
        setSnakeCase({ value: '', error: '' })
        break
      }
      case 'snake-case': {
        setSnakeCase({ value, error: '' })
        setCamelCase({ value: '', error: '' })
        break
      }
      default: {
        // ignore
      }
    }
  }

  const handleConvert = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const elm = e.currentTarget
    const { target } = elm.dataset

    switch (target) {
      case 'to-camel-case': {
        if (!snakeCase.value) return
        try {
          const v = JSON.parse(snakeCase.value)
          if (typeof v !== 'object') {
            throw new Error('Invalid Object')
          }
          setCamelCase({
            value: JSON.stringify(resultFormatter.toTransaction(v)),
            error: '',
          })
        } catch (e) {
          if (e instanceof Error) {
            const error = e.message
            setSnakeCase(v => ({ ...v, error }))
            break
          }
          setSnakeCase(v => ({ ...v, error: 'Unknown error' }))
        }
        break
      }
      case 'to-snake-case': {
        if (!camelCase.value) return
        try {
          const v = JSON.parse(camelCase.value)
          if (typeof v !== 'object') {
            throw new Error('Invalid Object')
          }
          setSnakeCase({
            value: JSON.stringify(paramsFormatter.toRawTransaction(v)),
            error: '',
          })
        } catch (e) {
          if (e instanceof Error) {
            const error = e.message
            setCamelCase(v => ({ ...v, error }))
            break
          }
          setSnakeCase(v => ({ ...v, error: 'Unknown error' }))
        }
        break
      }
      default: {
        // ignore
      }
    }
  }

  const handleCopy = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const elm = e.currentTarget
    const { target } = elm.dataset
    let value = ''
    switch (target) {
      case 'snake-case': {
        value = snakeCase.value
        break
      }
      case 'camel-case': {
        value = camelCase.value
        break
      }
      default: {
        // ignore
      }
    }
    if (!value) return
    navigator.clipboard.writeText(value).then(
      () => {
        setToast({ message: t('common.copied') })
      },
      error => {
        console.error(error)
      },
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label htmlFor="snake-case">Snake Case</label>
        <div className={styles.content}>
          <textarea
            id="snake-case"
            value={snakeCase.value}
            onChange={handleChange}
            placeholder={t('tools.tx_in_snake_case')}
          />
          <CopyIcon className={styles.copy} data-target="snake-case" onClick={handleCopy} />
        </div>
        <div className={styles.error}>{snakeCase.error}</div>
      </div>
      <div className={styles.actions}>
        <button type="button" data-target="to-camel-case" onClick={handleConvert}>
          To camel case ↓
        </button>
        <button type="button" data-target="to-snake-case" onClick={handleConvert}>
          To snake case ↑
        </button>
      </div>
      <div className={styles.field}>
        <label htmlFor="camel-case">Camel Case</label>
        <div className={styles.content}>
          <textarea
            id="camel-case"
            value={camelCase.value}
            onChange={handleChange}
            placeholder={t('tools.tx_in_camel_case')}
          />
          <CopyIcon className={styles.copy} data-target="camel-case" onClick={handleCopy} />
        </div>
        <div className={styles.error}>{camelCase.error}</div>
      </div>
    </div>
  )
}

export default Transaction
