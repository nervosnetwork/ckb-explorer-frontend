import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import cytoscape from 'cytoscape'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { scriptToAddress } from '@nervosnetwork/ckb-sdk-utils'
import debounce from 'lodash.debounce'
import classNames from 'classnames'
import { explorerService } from '../../services/ExplorerService'
import { IS_MAINNET } from '../../constants/common'
import { getBtcUtxo, shannonToCkb } from '../../utils/util'
import { ReactComponent as MoreIcon } from '../../assets/more.svg'
import { cytoscapeStyles } from './cytoscapeStyles'
import TxNode from './GraphNode/txNode'
import styles from './styles.module.scss'
import { useGenerateMenuItem } from './GraphNode/cellNode'
import { CellBasicInfo } from '../../utils/transformer'
import Popover from '../Popover'

function generateCellGraph(
  container: HTMLElement,
  cell: {
    capacity: string
    generatedTxHash: string
    consumedTxHash: string
  },
) {
  const cy = cytoscape({
    container,
    zoomingEnabled: false,
    userPanningEnabled: false,
    autoungrabify: true,
    elements: [
      {
        data: {
          id: cell.generatedTxHash,
          type: 'tx',
        },
      },
      {
        data: {
          id: 'cell',
          type: 'cell',
        },
      },
      {
        data: {
          id: `${cell.generatedTxHash}-edge`,
          source: cell.generatedTxHash,
          target: 'cell',
        },
      },
      ...(cell.consumedTxHash
        ? [
            {
              data: {
                id: cell.consumedTxHash,
                type: 'tx',
              },
            },
            {
              data: {
                id: `${cell.consumedTxHash}-edge`,
                source: 'cell',
                target: cell.consumedTxHash,
              },
            },
          ]
        : []),
    ],
    style: [
      // the stylesheet for the graph
      ...cytoscapeStyles,
      {
        selector: 'node[type="cell"]',
        style: {
          width: 16,
          height: 16,
          'background-color': '#00cc9b',
        },
      },
    ],
    layout: {
      name: 'grid',
      rows: 1,
      cols: cell.consumedTxHash ? 3 : 2,
    },
  })
  return cy
}

export const CellGraph = ({
  capacity,
  generatedTxHash,
  consumedTxHash,
  id,
  isGenesisOutput,
  onViewCell,
  onViewTxGraph,
  cellIndex,
  rgbInfo,
  occupiedCapacity,
  status,
}: CellBasicInfo & {
  onViewTxGraph: (txHash: string) => void
  onViewCell: (cell: CellBasicInfo) => void
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [nodesPosition, setNodesPositions] = useState<
    Record<string, cytoscape.BoundingBox12 & cytoscape.BoundingBoxWH>
  >({})
  const refreshGraph = useCallback(() => {
    if (ref.current) {
      const cy = generateCellGraph(ref.current, { capacity, generatedTxHash, consumedTxHash })
      cy.center(cy.$('node[type=cell]'))
      setNodesPositions({
        [generatedTxHash]: cy.getElementById(generatedTxHash).renderedBoundingBox(),
        cell: cy.getElementById('cell').renderedBoundingBox(),
        ...(consumedTxHash
          ? {
              [consumedTxHash]: cy.getElementById(consumedTxHash).renderedBoundingBox(),
            }
          : {}),
      })
    }
  }, [ref, capacity, generatedTxHash, consumedTxHash])
  useEffect(() => {
    refreshGraph()
  }, [refreshGraph])
  useEffect(() => {
    const resizeObserver = new ResizeObserver(debounce(refreshGraph))
    if (ref.current) {
      resizeObserver.observe(ref.current)
    }
    return () => {
      resizeObserver.disconnect()
    }
  }, [refreshGraph])
  const { t } = useTranslation()
  const { data: cell } = useQuery(['lock', id], async () => {
    try {
      const res = await explorerService.api.fetchScript('lock_scripts', `${id}`)
      return res?.attributes
    } catch (e) {
      return undefined
    }
  })
  const address = useMemo(() => (cell ? scriptToAddress(cell as CKBComponents.Script, IS_MAINNET) : undefined), [cell])
  const btcUtxo = useMemo(() => (cell ? getBtcUtxo(cell) : undefined), [cell])

  return (
    <div className={classNames(styles.graphContainer, styles.cellGraph)}>
      <div ref={ref} />
      {[generatedTxHash, consumedTxHash].map(v =>
        v ? (
          <button
            style={{
              left: nodesPosition[v]?.x1,
              top: nodesPosition[v]?.y1,
              height: nodesPosition[v]?.h,
              width: nodesPosition[v]?.w,
            }}
            onClick={() => onViewTxGraph(v)}
            type="button"
            key={v}
          >
            <TxNode txHash={v} />
          </button>
        ) : null,
      )}
      <div
        style={{
          left: nodesPosition.cell?.x1 + 10,
          top: nodesPosition.cell?.y1 + 30,
        }}
        className={styles.cell}
      >
        {`${(+shannonToCkb(capacity)).toLocaleString('en')} CKB`}
        <Popover
          trigger={
            <button type="button" className={styles.more} onClick={e => e.stopPropagation()}>
              <MoreIcon />
            </button>
          }
          portalContainer={ref.current}
        >
          <div onClick={e => e.stopPropagation()}>
            {useGenerateMenuItem({
              t,
              address,
              btcUtxo,
              onViewCell,
              cell: {
                id,
                generatedTxHash,
                consumedTxHash,
                isGenesisOutput,
                capacity,
                occupiedCapacity,
                cellIndex,
                rgbInfo,
                status,
              },
            }).map(item => {
              return <div key={item.key}>{item.label}</div>
            })}
          </div>
        </Popover>
      </div>
    </div>
  )
}
