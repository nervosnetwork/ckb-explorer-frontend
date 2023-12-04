// This seems to be an unexpected inspection prompt. It may be a bug in the inspection logic. Disable it temporarily.
/* eslint-disable react/no-unused-prop-types */
import { ComponentProps, FC, ReactElement, isValidElement, useMemo } from 'react'
import classNames from 'classnames'
import { CardCell, CardCellProps } from './CardCell'
import styles from './CardCellsLayout.module.scss'
import { useBoolean, useIsMobile } from '../../utils/hook'
import { ReactComponent as DownArrowIcon } from './down_arrow.svg'

type LayoutType = 'left-right' | 'leftSingle-right' | 'list'
type LayoutSlot = 'left' | 'right' | 'item'

type CardCellInfo$WithoutSlot = ReactElement<unknown> | CardCellProps
type CardCellInfo$WithSlot<S extends LayoutSlot = LayoutSlot> = { slot: S; cell: CardCellInfo$WithoutSlot }
export type CardCellInfo<S extends LayoutSlot = LayoutSlot> = CardCellInfo$WithSlot<S> | CardCellInfo$WithoutSlot

function isCardCellInfoWithSlot(info: CardCellInfo): info is CardCellInfo$WithSlot {
  return typeof info === 'object' && info != null && 'slot' in info
}

function renderCell(info: CardCellInfo$WithoutSlot) {
  if (isValidElement<unknown>(info)) return info
  return <CardCell {...info} />
}

interface CardCellsLayoutProps$Common {
  defaultDisplayCountInMobile?: number
  borderTop?: boolean
}

interface CardCellsLayoutProps$LeftRight extends CardCellsLayoutProps$Common {
  type: 'left-right'
  cells: CardCellInfo<'left' | 'right'>[]
}

interface CardCellsLayoutProps$LeftSingleRight extends CardCellsLayoutProps$Common {
  type: 'leftSingle-right'
  cells: CardCellInfo<'left' | 'right'>[]
}

interface CardCellsLayoutProps$List extends CardCellsLayoutProps$Common {
  type: 'list'
  cells: CardCellInfo<'item'>[]
}

type CardCellsLayoutProps = ComponentProps<'div'> &
  (CardCellsLayoutProps$LeftRight | CardCellsLayoutProps$LeftSingleRight | CardCellsLayoutProps$List)

const CardCellsLayout$LeftRightOrLeftSingleRight: FC<
  { displayCount: number } & (CardCellsLayoutProps$LeftRight | CardCellsLayoutProps$LeftSingleRight)
> = ({ type, cells, displayCount }) => {
  const { leftCells, rightCells } = useMemo(() => {
    const leftCells: CardCellInfo$WithoutSlot[] = []
    const rightCells: CardCellInfo$WithoutSlot[] = []

    let currentSlot: LayoutSlot | null = null
    for (const info of cells) {
      const infoWithSlot: CardCellInfo$WithSlot = isCardCellInfoWithSlot(info)
        ? info
        : { slot: getNextSlot(type, currentSlot), cell: info }

      const { slot, cell } = infoWithSlot
      const container = slot === 'left' ? leftCells : rightCells
      container.push(cell)
      currentSlot = slot
    }

    if (leftCells.length >= displayCount) {
      leftCells.splice(displayCount)
      rightCells.splice(0)
    } else if (leftCells.length + rightCells.length > displayCount) {
      rightCells.splice(displayCount - leftCells.length)
    }

    return { leftCells, rightCells }

    function getNextSlot(layout: LayoutType, slot?: LayoutSlot | null): LayoutSlot {
      if (layout === 'leftSingle-right') return 'right'

      switch (slot) {
        case 'left':
          return 'right'
        case 'right':
          return 'left'
        default:
          return 'left'
      }
    }
  }, [cells, displayCount, type])

  return (
    <>
      {type === 'left-right' ? (
        <div className={styles.left}>{leftCells.map(renderCell)}</div>
      ) : (
        <div className={styles.leftSingle}>{renderCell(leftCells[0])}</div>
      )}

      <div className={styles.right}>{rightCells.map(renderCell)}</div>
    </>
  )
}

const CardCellsLayout$List: FC<{ displayCount: number } & CardCellsLayoutProps$List> = ({ cells, displayCount }) => {
  const finalCells = useMemo(
    () => cells.slice(0, displayCount).map(info => (isCardCellInfoWithSlot(info) ? info.cell : info)),
    [cells, displayCount],
  )

  return <div className={styles.list}>{finalCells.map(renderCell)}</div>
}

export const CardCellsLayout: FC<CardCellsLayoutProps> = ({
  type,
  cells,
  defaultDisplayCountInMobile = 10,
  borderTop,
  ...elProps
}) => {
  const isMobile = useIsMobile()
  const showExpandCtl = isMobile && cells.length > defaultDisplayCountInMobile
  const [isExpanded, expandCtl] = useBoolean(false)
  const displayCount = isMobile && !isExpanded ? defaultDisplayCountInMobile : Infinity

  return (
    <div
      {...elProps}
      className={classNames(
        styles.cardCellsLayout,
        {
          [styles.borderTop]: borderTop,
        },
        elProps.className,
      )}
    >
      {(type === 'left-right' || type === 'leftSingle-right') && (
        <CardCellsLayout$LeftRightOrLeftSingleRight type={type} cells={cells} displayCount={displayCount} />
      )}
      {type === 'list' && <CardCellsLayout$List type={type} cells={cells} displayCount={displayCount} />}

      {showExpandCtl && (
        <div className={styles.expand} onPointerDown={() => expandCtl.toggle()} role="button" tabIndex={0}>
          <DownArrowIcon className={classNames({ [styles.isExpanded ?? '']: isExpanded })} />
        </div>
      )}
    </div>
  )
}
