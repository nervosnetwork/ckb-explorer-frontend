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

enum DecodeMethod {
  LittleEndian = 'little-endian',
  HexNumber = 'hex-number',
  Utf8 = 'utf-8',
  Address = 'address',
  TokenInfo = 'token-info',
  XudtData = 'xudt-data',
  Spore = 'spore',
  JSON = 'json',
}

const WIDTH = 500

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

const leToNum = (v: string) => {
  const bytes = v.slice(2).match(/\w{2}/g)
  if (!bytes) return ''
  const val = `0x${bytes.reverse().join('')}`
  if (Number.isNaN(+val)) {
    throw new Error('Invalid little-endian')
  }
  return new BigNumber(val).toFormat()
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
  const res: Partial<Record<'amount' | 'data', string>> = {
    amount: leToNum(amount),
  }
  const data = v.slice(34)
  if (data) {
    res.data = data
  }
  return res
}

const Decoder = () => {
  const [selection, setSelection] = useState<{
    text: string
    position: Record<'x' | 'y', number>
    index: number
  } | null>(null)
  const [decodeMethod, setDecodeMethod] = useState<DecodeMethod>(DecodeMethod.LittleEndian)
  const timerRef = useRef<NodeJS.Timer | null>(null)

  const { t } = useTranslation()

  const setToast = useSetToast()

  useEffect(() => {
    const handleSelectChange = () => {
      if (timerRef.current) clearTimeout(timerRef.current)

      timerRef.current = setTimeout(() => {
        const selection = window.getSelection()
        if (!selection || selection.isCollapsed) {
          setSelection(null)
          setDecodeMethod(DecodeMethod.LittleEndian)
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
        if (rect.width > WIDTH) {
          x = rect.right - WIDTH
        } else if (rect.right + WIDTH > window.innerWidth) {
          x = window.innerWidth - WIDTH - 20
        }
        setSelection({
          text: selectionText,
          position: {
            x,
            y: rect.bottom + window.pageYOffset + 4,
          },
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
    const elm = e.target

    if (elm instanceof HTMLLIElement) {
      const { value } = elm.dataset
      if (!value) return
      setDecodeMethod(value as DecodeMethod)
    }
  }

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const { detail } = e.currentTarget.dataset
    if (!detail) return
    navigator.clipboard.writeText(detail).then(() => {
      setToast({ message: t('common.copied') })
    })
  }

  const decoded = useMemo(() => {
    if (!selection?.text) return ''

    const v = prefixHex(selection.text)

    try {
      switch (decodeMethod) {
        case DecodeMethod.Utf8: {
          if (Number.isNaN(+v)) {
            throw new Error('Invalid hex string')
          }
          return hexToUtf8(v)
        }
        case DecodeMethod.HexNumber: {
          if (Number.isNaN(+v)) {
            throw new Error('Invalid hex number')
          }
          return new BigNumber(v).toFormat()
        }
        case DecodeMethod.TokenInfo: {
          return JSON.stringify(hexToTokenInfo(v), null, 2)
        }
        case DecodeMethod.XudtData: {
          return JSON.stringify(hexToXudtData(v), null, 2)
        }
        case DecodeMethod.LittleEndian: {
          return leToNum(v)
        }
        case DecodeMethod.Address: {
          return JSON.stringify(addressToScript(v), null, 2)
        }
        case DecodeMethod.Spore: {
          const data = parseSporeCellData(v)
          if (data.contentType === 'application/json') {
            data.content = JSON.parse(hexToUtf8(`0x${data.content}`))
          }
          return JSON.stringify(data, null, 2)
        }
        case DecodeMethod.JSON: {
          const raw = JSON.parse(v)
          if (!raw) return ''
          return JSON.stringify(raw, null, 2)
        }
        default: {
          throw new Error('Invalid decode method')
        }
      }
    } catch (e) {
      return t(`decoder.fail-to-decode`, { decode: t(`decoder.${decodeMethod}`) })
    }
  }, [decodeMethod, selection, t])

  if (!selection) return null
  return createPortal(
    <div
      className={styles.container}
      style={{ maxWidth: WIDTH, left: selection.position.x, top: selection.position.y }}
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
        <pre>{decoded}</pre>
        <button type="button" className={styles.copy} onClick={handleCopy} data-detail={decoded}>
          <CopyIcon />
        </button>
        <div className={styles.count}>
          {t('decoder.select-x-from-y', { x: selection.text.length, y: selection.index })}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default Decoder
