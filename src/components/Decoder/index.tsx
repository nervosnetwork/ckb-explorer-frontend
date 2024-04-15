import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import BigNumber from 'bignumber.js'
import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { hexToUtf8 } from '../../utils/string'
import { useSetToast } from '../Toast'
import { ReactComponent as CopyIcon } from '../../assets/copy_icon.svg'
import styles from './styles.module.scss'
import { parseSporeCellData } from '../../utils/spore'
import { parseBtcTimeLockArgs } from '../../utils/rgbpp'

enum DecodeMethod {
  LittleEndian = 'little-endian',
  HexNumber = 'hex-number',
  Utf8 = 'utf-8',
  Address = 'address',
  TokenInfo = 'token-info',
  XudtData = 'xudt-data',
  BTCTimeLock = 'btc-time-lock',
  Spore = 'spore',
  JSON = 'json',
}

const DIALOG_SIZE = 500
const TEXT_LIMIT = 4096

const prefixHex = (str: string) => {
  let s = str.toLowerCase()
  if (s.startsWith('ckb') || s.startsWith('ckt')) return s
  if (s.startsWith('0x')) return s
  if (s.startsWith('x')) {
    s = s.slice(1)
  }
  if (s.length % 2 === 1) {
    s += '0'
  }
  return `0x${s}`
}

const leToBe = (v: string) => {
  // to big endian
  const bytes = v.slice(2).match(/\w{2}/g)
  if (!bytes) return ''
  const be = `0x${bytes.reverse().join('')}`
  if (Number.isNaN(+be)) {
    throw new Error('Invalid little-endian')
  }
  return be
}

const hexToTokenInfo = (v: string) => {
  const decimal = v.slice(0, 4)
  const nameLen = `0x${v.slice(4, 6)}`
  const name = `0x${v.slice(6, 6 + +nameLen * 2)}`
  const symbolLen = `0x${v.slice(6 + +nameLen * 2, 6 + +nameLen * 2 + 2)}`
  const symbol = `0x${v.slice(6 + +nameLen * 2 + 2, 6 + +nameLen * 2 + 2 + +symbolLen * 2)}`
  return {
    name: hexToUtf8(name),
    symbol: hexToUtf8(symbol),
    decimal: +decimal,
  }
}

const hexToXudtData = (v: string) => {
  const amount = v.slice(0, 34)
  const res: Partial<Record<'AMOUNT' | 'DATA', string>> = {
    AMOUNT: new BigNumber(leToBe(amount)).toFormat({ groupSeparator: '' }),
  }
  const data = v.slice(34)
  if (data) {
    res.DATA = data
  }
  return res
}

const jsonToList = (json: Record<string, any>) =>
  Object.entries(json).reduce((acc, cur) => `${acc}\n${cur[0]}: ${cur[1]}`, '')

const Decoder = () => {
  const [selection, setSelection] = useState<{
    text: string
    position: Record<'x' | 'y', number>
    index: number
  } | null>(null)
  const [decodeMethod, setDecodeMethod] = useState<DecodeMethod>(DecodeMethod.LittleEndian)
  const debounceTimerRef = useRef<NodeJS.Timer | null>(null)
  const modeCacheTimerRef = useRef<NodeJS.Timer | null>(null)

  const { t } = useTranslation()

  const setToast = useSetToast()

  useEffect(() => {
    const handleSelectChange = () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      if (modeCacheTimerRef.current) clearTimeout(modeCacheTimerRef.current)

      debounceTimerRef.current = setTimeout(() => {
        const selection = window.getSelection()
        if (!selection || selection.isCollapsed) {
          setSelection(null)
          modeCacheTimerRef.current = setTimeout(() => {
            setDecodeMethod(DecodeMethod.LittleEndian)
          }, 10_000)
          return
        }
        const selectionText = selection.toString().trim()
        const elm = selection.anchorNode?.parentElement
        if (!selectionText || !elm) return
        if (!elm.closest('[data-is-decodable=true]')) {
          return
        }

        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        let x = rect.left + window.pageXOffset
        if (rect.width > DIALOG_SIZE) {
          x = rect.right - DIALOG_SIZE
        } else if (rect.right + DIALOG_SIZE > window.innerWidth) {
          x = window.innerWidth - DIALOG_SIZE - 20
        }
        const y = rect.bottom
        setSelection({
          text: selectionText,
          position: { x, y },
          index: range.startOffset,
        })
      }, 16)
    }
    window.document.addEventListener('selectionchange', handleSelectChange)
    return () => {
      window.document.removeEventListener('selectionchange', handleSelectChange)
    }
  }, [])

  const handleDecodeMethodChange = (e: React.SyntheticEvent<HTMLUListElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (modeCacheTimerRef.current) clearTimeout(modeCacheTimerRef.current)
    const elm = e.target

    if (elm instanceof HTMLLIElement) {
      const { value } = elm.dataset
      if (!value) return
      setDecodeMethod(value as DecodeMethod)
    }
  }

  const decoded: { display: string; copy: string | object | null } = useMemo(() => {
    if (!selection?.text) return { display: '', copy: null }

    const v = prefixHex(selection.text)

    if (v === '0x') {
      return {
        display: '',
        copy: null,
      }
    }

    if (v.length > TEXT_LIMIT + 2) {
      return {
        display: t('decoder.text-too-long', { limit: TEXT_LIMIT }),
        copy: null,
      }
    }

    try {
      switch (decodeMethod) {
        case DecodeMethod.Utf8: {
          if (Number.isNaN(+v)) {
            throw new Error('Invalid hex string')
          }
          const str = hexToUtf8(v)
          return { display: str, copy: str }
        }
        case DecodeMethod.HexNumber: {
          if (Number.isNaN(+v)) {
            throw new Error('Invalid hex number')
          }
          const num = new BigNumber(v)
          return { display: num.toFormat(), copy: num.toFormat({ groupSeparator: '' }) }
        }
        case DecodeMethod.TokenInfo: {
          const info = hexToTokenInfo(v)
          return { display: jsonToList(info), copy: info }
        }
        case DecodeMethod.XudtData: {
          const info = hexToXudtData(v)
          const tmp = {
            ...info,
            AMOUNT: info.AMOUNT ? new BigNumber(info.AMOUNT).toFormat() : info.AMOUNT,
          }
          return { display: jsonToList(tmp), copy: info }
        }
        case DecodeMethod.LittleEndian: {
          const be = leToBe(v)
          const int = new BigNumber(be)
          return {
            display: `HEX: ${be}\nINT: ${int.toFormat()}`,
            copy: {
              HEX: be,
              INT: int.toFormat({ groupSeparator: '' }),
            },
          }
        }
        case DecodeMethod.BTCTimeLock: {
          const res = parseBtcTimeLockArgs(v)
          const json = { ...res, script: JSON.stringify(res.script, null, 2) }
          return {
            display: jsonToList(json),
            copy: json,
          }
        }
        case DecodeMethod.Address: {
          const script = addressToScript(v)
          return { display: JSON.stringify(script, null, 2), copy: script }
        }
        case DecodeMethod.Spore: {
          const data = parseSporeCellData(v)
          if (data.contentType === 'application/json') {
            data.content = JSON.stringify(JSON.parse(hexToUtf8(`0x${data.content}`)), null, 2)
          }
          return { display: jsonToList(data), copy: data }
        }
        case DecodeMethod.JSON: {
          const raw: object = JSON.parse(hexToUtf8(v))
          if (!raw) return { display: '', copy: null }
          return { display: JSON.stringify(raw, null, 2), copy: raw }
        }
        default: {
          throw new Error('Invalid decode method')
        }
      }
    } catch (e) {
      return { display: t(`decoder.fail-to-decode`, { decode: t(`decoder.${decodeMethod}`) }), copy: null }
    }
  }, [decodeMethod, selection, t])

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const elm = e.target
    if (!(elm instanceof HTMLElement)) return
    const { detail } = elm.dataset
    if (!detail) return
    navigator.clipboard.writeText(detail).then(() => {
      setToast({ message: t('common.copied') })
    })
  }

  if (!selection) return null
  return createPortal(
    <div
      className={styles.container}
      style={{
        maxWidth: DIALOG_SIZE,
        maxHeight: DIALOG_SIZE,
        left: selection.position.x,
        top: selection.position.y,
      }}
      data-role="decoder"
    >
      <div className={styles.head}>
        <span>{t('decoder.view-data-as')}</span>
        <div className={styles.select}>
          <label>{t(`decoder.${decodeMethod}`)}</label>
          <ul onClick={handleDecodeMethodChange} onKeyUp={handleDecodeMethodChange}>
            {Object.values(DecodeMethod).map(m => (
              <li key={m} data-value={m} data-is-active={m === decodeMethod}>
                {t(`decoder.${m}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.body}>
        <pre>{decoded.display}</pre>
        {typeof decoded.copy === 'string' ? (
          <button type="button" className={styles.copy} onClick={handleCopy} data-detail={decoded.copy}>
            <CopyIcon />
          </button>
        ) : null}
        {decoded.copy && typeof decoded.copy !== 'string' ? (
          <button type="button" className={styles.copy} onClick={handleCopy} data-detail={JSON.stringify(decoded.copy)}>
            <CopyIcon />
            <ul>
              <li data-detail={JSON.stringify(decoded.copy)}>All</li>
              {Object.entries(decoded.copy || {}).map(([key, value]) => {
                return (
                  <li key={key} data-detail={value}>
                    {key}
                  </li>
                )
              })}
            </ul>
          </button>
        ) : null}
        <div className={styles.count}>
          {t('decoder.select-x-from-y', { x: selection.text.length, y: selection.index })}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default Decoder
