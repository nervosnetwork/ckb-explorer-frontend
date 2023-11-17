import { useResizeDetector } from 'react-resize-detector'
import { FC, HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'
import { assert } from '../../utils/error'
import { createTextWidthMeasurer } from '../../utils/string'

const EllipsisMiddle: FC<
  HTMLAttributes<HTMLDivElement> & {
    /** This item will be used as text when text is empty. */
    children?: string
    /** When this item is not empty, ignore the value of `children`. */
    text?: string
    /** Any key that represents the use of a different font. */
    fontKey?: string | number | boolean
    minStartLen?: number
    minEndLen?: number
    onTruncateStateChange?: (isTruncated: boolean) => void
    useTextWidthForPlaceholderWidth?: boolean
  }
> = ({
  text,
  children,
  fontKey,
  minStartLen = 0,
  minEndLen = 0,
  onTruncateStateChange,
  useTextWidthForPlaceholderWidth,
  ...divProps
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { width: resizedWidth } = useResizeDetector({
    targetRef: ref,
    handleHeight: false,
  })
  const [parts, setParts] = useState<string[]>([''])
  const [originTextWidth, setOriginTextWidth] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    const width = resizedWidth ?? ref.current.clientWidth

    const fullText = text ?? children ?? ''
    const measureText = createTextWidthMeasurer(ref.current)

    const fullWidth = measureText(fullText)
    setOriginTextWidth(fullWidth)
    if (fullWidth <= width) {
      setParts([fullText])
      onTruncateStateChange?.(false)
      return
    }

    const ellipsis = '...'
    const remainingChars = Array.from(fullText)
    const leftPart = remainingChars.splice(0, minStartLen)
    const rightPart = remainingChars.splice(remainingChars.length - minEndLen, minEndLen)
    let currentWidth = measureText([leftPart, ellipsis, rightPart].flat().join(''))
    let nextDirectionIsLeft = true

    if (currentWidth > width) {
      while (currentWidth > width) {
        if (leftPart.length === 0) nextDirectionIsLeft = false
        if (rightPart.length === 0 && !nextDirectionIsLeft) break

        const char = nextDirectionIsLeft ? leftPart.pop() : rightPart.shift()
        assert(char)
        const charWidth = measureText(char)
        currentWidth -= charWidth
        nextDirectionIsLeft = !nextDirectionIsLeft
      }
    } else {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const char = nextDirectionIsLeft ? remainingChars.shift() : remainingChars.pop()
        assert(char)
        const charWidth = measureText(char)

        if (currentWidth + charWidth > width) {
          break
        }

        if (nextDirectionIsLeft) {
          leftPart.push(char)
        } else {
          rightPart.unshift(char)
        }
        currentWidth += charWidth
        nextDirectionIsLeft = !nextDirectionIsLeft
      }
    }

    setParts([leftPart.join(''), ellipsis, rightPart.join('')])
    onTruncateStateChange?.(true)
  }, [
    children,
    // Active trigger recalculation
    fontKey,
    minEndLen,
    minStartLen,
    onTruncateStateChange,
    ref,
    resizedWidth,
    text,
  ])

  const { style, ...restDivProps } = divProps
  const combinedStyle = useMemo(
    () =>
      useTextWidthForPlaceholderWidth && originTextWidth !== 0
        ? {
            width: Math.ceil(originTextWidth),
            // When the parent element itself has a width that is computationally
            // independent of the child element, this constraint takes effect.
            maxWidth: '100%',
            ...style,
          }
        : style,
    [originTextWidth, style, useTextWidthForPlaceholderWidth],
  )

  return (
    <div ref={ref} style={combinedStyle} {...restDivProps}>
      {parts.join('')}
    </div>
  )
}

export default EllipsisMiddle
