import { ComponentProps, FC, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { useResizeDetector } from 'react-resize-detector'
import { createTextWidthMeasurer } from '../../utils/string'
import styles from './HighlightText.module.scss'

interface HighlightTextProps extends ComponentProps<'span'> {
  text: string
  keyword: string
}

const ELLIPSIS = '...'

export const HighlightText: FC<HighlightTextProps> = ({ text, keyword, ...props }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const { width: resizedWidth } = useResizeDetector({
    targetRef: ref,
    handleHeight: false,
  })
  const [leftPart, setLeftPart] = useState('')
  const [rightPart, setRightPart] = useState('')
  const [highlightPart, setHighlightPart] = useState('')
  const [originTextWidth, setOriginTextWidth] = useState(0)

  useEffect(() => {
    if (!ref.current || !text || !keyword) return
    const minSideLen = 3
    const wrapperWidth = resizedWidth ?? ref.current.clientWidth
    const measureText = createTextWidthMeasurer(ref.current)
    const fullWidth = measureText(text)
    setOriginTextWidth(fullWidth)
    const keywordIndex = text.toUpperCase().indexOf(keyword.toUpperCase())
    const postfix = '  '
    let leftTruncationIndex = minSideLen
    let rightTruncationIndex = -minSideLen
    let maxKeywordWidth = keyword.length

    const calculatePart = (leftTruncationIndex: number, rightTruncationIndex: number, maxKeywordWidth: number) => {
      if (keywordIndex === -1) {
        if (leftTruncationIndex >= text.length + rightTruncationIndex) {
          return {
            left: text,
            highlight: '',
            right: '',
          }
        }

        return {
          left: text.slice(0, leftTruncationIndex) + ELLIPSIS,
          highlight: '',
          right: text.slice(rightTruncationIndex),
        }
      }
      return {
        left:
          keywordIndex - 1 <= leftTruncationIndex
            ? text.slice(0, keywordIndex)
            : text.slice(0, leftTruncationIndex) + ELLIPSIS + text.slice(keywordIndex - 1, keywordIndex),
        highlight: text.slice(keywordIndex, keywordIndex + maxKeywordWidth),
        right:
          keywordIndex + maxKeywordWidth + 1 >= text.length + rightTruncationIndex
            ? text.slice(keywordIndex + maxKeywordWidth)
            : text.slice(keywordIndex + maxKeywordWidth, keywordIndex + maxKeywordWidth + 1) +
              ELLIPSIS +
              text.slice(rightTruncationIndex),
      }
    }

    if (keywordIndex === -1) {
      if (fullWidth <= wrapperWidth) {
        setLeftPart(text)
        setHighlightPart('')
        setRightPart('')
        return
      }

      let { left, right } = calculatePart(leftTruncationIndex, rightTruncationIndex, maxKeywordWidth)
      let currentWidth = measureText(left + right + postfix)
      let leftDirection = true

      while (currentWidth < wrapperWidth) {
        if (leftDirection) {
          leftTruncationIndex++
        } else {
          rightTruncationIndex--
        }

        ;({ left, right } = calculatePart(leftTruncationIndex, rightTruncationIndex, maxKeywordWidth))
        currentWidth = measureText(left + right + postfix)
        leftDirection = !leftDirection
      }

      setLeftPart(left)
      setRightPart(right)
      setHighlightPart('')
      return
    }

    if (fullWidth <= wrapperWidth) {
      setLeftPart(text.slice(0, keywordIndex))
      setHighlightPart(text.slice(keywordIndex, keywordIndex + keyword.length))
      setRightPart(text.slice(keywordIndex + keyword.length))
      return
    }

    let { left, right, highlight } = calculatePart(leftTruncationIndex, rightTruncationIndex, maxKeywordWidth)
    let currentWidth = measureText(left + highlight + right + postfix)

    if (currentWidth < wrapperWidth) {
      let leftDirection = true
      do {
        if (leftDirection) {
          leftTruncationIndex++
        } else {
          rightTruncationIndex--
        }

        ;({ left, right, highlight } = calculatePart(leftTruncationIndex, rightTruncationIndex, maxKeywordWidth))
        currentWidth = measureText(left + highlight + right + postfix)
        leftDirection = !leftDirection
      } while (currentWidth < wrapperWidth)

      setLeftPart(left)
      setHighlightPart(highlight)
      setRightPart(right)
      return
    }

    do {
      maxKeywordWidth--

      if (maxKeywordWidth < 4) {
        break
      }

      ;({ left, right, highlight } = calculatePart(leftTruncationIndex, rightTruncationIndex, maxKeywordWidth))
      currentWidth = measureText(left + highlight + right + postfix)
    } while (currentWidth > wrapperWidth)

    setLeftPart(left)
    setHighlightPart(highlight)
    setRightPart(right)
  }, [ref, text, keyword, resizedWidth])

  return (
    <span
      ref={ref}
      {...props}
      style={{ maxWidth: Math.ceil(originTextWidth), ...props.style }}
      className={classNames(styles.highlightText, props.className)}
    >
      {leftPart !== '' && leftPart}
      {highlightPart !== '' && <span className={styles.highlight}>{highlightPart}</span>}
      {rightPart !== '' && rightPart}
    </span>
  )
}
