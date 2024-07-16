import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import cytoscape, { Position, type ElementDefinition, type GridLayoutOptions, type NodeSingular } from 'cytoscape'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Cell } from '../../models/Cell'
import styles from './styles.module.scss'
import { explorerService, type Response } from '../../services/ExplorerService'
import { PAGE_SIZE } from '../../constants/common'
import CellNode from './GraphNode/cellNode'
import TxNode from './GraphNode/txNode'
import { cytoscapeStyles } from './cytoscapeStyles'
import { CellBasicInfo } from '../../utils/transformer'

const INPUT_MORE_ID = 'input_more'
const OUTPUT_MORE_ID = 'output_more'
const generateCellNodeId = (cell: Cell) => `${cell.generatedTxHash}-${cell.cellIndex}`

function getLayoutConfig({
  inputsTotal,
  outputsTotal,
  hasMoreInput,
  hasMoreOutput,
}: {
  inputsTotal: number
  outputsTotal: number
  hasMoreInput?: boolean
  hasMoreOutput?: boolean
}): GridLayoutOptions {
  const iLen = inputsTotal + (hasMoreInput ? 1 : 0)
  const oLen = outputsTotal + (hasMoreOutput ? 1 : 0)
  const gridRows = Math.max(iLen, oLen)
  return {
    name: 'grid',
    rows: gridRows,
    cols: 3,
    padding: 10,
    avoidOverlap: true,
    avoidOverlapPadding: 70,
    position(node: NodeSingular) {
      const { type, index, id } = node?.data()
      switch (type) {
        case 'input':
          return {
            row: index + (gridRows - iLen) / 2,
            col: 0,
          }
        case 'output':
          return {
            row: index + (gridRows - oLen) / 2,
            col: 2,
          }
        case 'tx':
          return {
            row: (gridRows - 1) / 2,
            col: 1,
          }
        case 'more':
          if (id === INPUT_MORE_ID) {
            return {
              row: index + (gridRows - iLen) / 2,
              col: 0,
            }
          }
          return {
            row: index + (gridRows - oLen) / 2,
            col: 2,
          }
        default:
          return {
            row: 0,
            col: 0,
          }
      }
    },
    transform(node: NodeSingular, position: Position) {
      const { type, index, id } = node?.data()
      let transformYDistance = 0
      if (type === 'input' || id === INPUT_MORE_ID) {
        transformYDistance = ((iLen - 1) / 2.0 - index) * 80
      } else if (type === 'output' || id === OUTPUT_MORE_ID) {
        transformYDistance = ((oLen - 1) / 2.0 - index) * 80
      }
      return {
        x: position.x,
        y: position.y + transformYDistance,
      }
    },
  }
}

function generateCellNodes({
  cells,
  nodeType,
  txHash,
  total,
  hasMore,
  cyInstance,
}: {
  cells: Cell[]
  nodeType: 'input' | 'output'
  txHash: string
  total?: number
  hasMore?: boolean
  cyInstance?: cytoscape.Core
}): ElementDefinition[] {
  const nodesLen = (total ?? cells.length) + (hasMore ? 1 : 0)
  const existNodesLen = cyInstance?.nodes(`node[type="${nodeType}"]`).length ?? 0
  const isInputNode = nodeType === 'input'
  const moreId = isInputNode ? INPUT_MORE_ID : OUTPUT_MORE_ID
  const classes = isInputNode ? 'left' : 'right'
  return [
    ...cells
      .map((i, index) => [
        {
          data: {
            id: generateCellNodeId(i),
            type: nodeType,
            index: existNodesLen + index,
          },
        },
        {
          data: {
            id: `${i.generatedTxHash}-${i.cellIndex}-edge`,
            ...(isInputNode
              ? {
                  source: generateCellNodeId(i),
                  target: txHash,
                }
              : {
                  target: generateCellNodeId(i),
                  source: txHash,
                }),
          },
          classes: nodesLen > 1 ? classes : '',
        },
      ])
      .flat(),
    ...(hasMore
      ? [
          {
            data: {
              id: moreId,
              type: 'more',
              index: total ?? cells.length,
            },
          },
          {
            data: {
              id: `${moreId}-edge`,
              ...(isInputNode
                ? {
                    source: moreId,
                    target: txHash,
                  }
                : {
                    target: moreId,
                    source: txHash,
                  }),
            },
            classes,
          },
        ]
      : []),
  ]
}

function generateTxGraph({
  container,
  inputs,
  outputs,
  txHash,
  hasMoreInput,
  hasMoreOutput,
}: {
  container: HTMLElement
  inputs: Cell[]
  outputs: Cell[]
  txHash: string
  hasMoreInput?: boolean
  hasMoreOutput?: boolean
}) {
  return cytoscape({
    container,
    zoomingEnabled: false,
    autoungrabify: true,
    elements: [
      {
        data: {
          id: txHash,
          type: 'tx',
        },
      },
      ...generateCellNodes({
        cells: inputs,
        nodeType: 'input',
        txHash,
        hasMore: hasMoreInput,
      }),
      ...generateCellNodes({
        cells: outputs,
        nodeType: 'output',
        txHash,
        hasMore: hasMoreOutput,
      }),
    ],
    style: [
      // the stylesheet for the graph
      ...cytoscapeStyles,
      {
        selector: 'node[type="input"]',
        style: {
          height: 30,
        },
      },
      {
        selector: 'node[type="output"]',
        style: {
          height: 30,
        },
      },
      {
        selector: 'node[type="more"]',
        style: {
          height: 30,
        },
      },
      {
        selector: 'edge.right',
        style: {
          'curve-style': 'taxi',
          'taxi-direction': 'horizontal',
          'taxi-turn': 60,
          'taxi-turn-min-distance': 5,
        },
      },
      {
        selector: 'edge.left',
        style: {
          'curve-style': 'taxi',
          'taxi-direction': 'rightward',
          'taxi-turn': 120,
          'taxi-turn-min-distance': 5,
        },
      },
    ],
    layout: getLayoutConfig({ inputsTotal: inputs.length, outputsTotal: outputs.length, hasMoreInput, hasMoreOutput }),
  })
}

const emptyList: Response.Response<Cell[]> = {
  data: [],
  meta: {
    total: 0,
    pageSize: PAGE_SIZE,
  },
}

export interface UXTOTxGraph {
  txHash: string
}

export const TxGraph = ({
  txHash,
  onViewCellGraph,
  modalRef,
  onViewCell,
}: {
  txHash: string
  onViewCellGraph: (param: CellBasicInfo) => void
  modalRef?: HTMLDivElement | null
  onViewCell: (cell: CellBasicInfo) => void
}) => {
  const cyRef = useRef<cytoscape.Core | undefined>()
  const {
    data: displayInputs,
    fetchNextPage: fetchMoreInput,
    hasNextPage: hasMoreInput,
    isLoading: isLoadingInput,
  } = useInfiniteQuery(
    ['transaction_inputs', txHash],
    async ({ pageParam = 1 }) => {
      try {
        const res = await explorerService.api.fetchCellsByTxHash(txHash, 'inputs', { no: pageParam, size: PAGE_SIZE })
        return {
          data: res.data,
          nextPage: pageParam + 1,
          fetchedTotal: (pageParam - 1) * PAGE_SIZE + res.data.length,
          total: res.meta?.total,
        }
      } catch (e) {
        return {
          data: emptyList.data,
          nextPage: pageParam + 1,
          fetchedTotal: (pageParam - 1) * PAGE_SIZE,
          total: (pageParam - 1) * PAGE_SIZE,
        }
      }
    },
    {
      getNextPageParam: lastPage => {
        if (lastPage.total && lastPage.fetchedTotal >= lastPage.total) return undefined
        return lastPage.nextPage
      },
    },
  )

  const {
    data: displayOutputs,
    fetchNextPage: fetchMoreOutput,
    hasNextPage: hasMoreOutput,
    isLoading: isLoadingOutput,
  } = useInfiniteQuery(
    ['transaction_outputs', txHash],
    async ({ pageParam = 1 }) => {
      try {
        const res = await explorerService.api.fetchCellsByTxHash(txHash, 'outputs', { no: pageParam, size: PAGE_SIZE })
        return {
          data: res.data,
          nextPage: pageParam + 1,
          fetchedTotal: (pageParam - 1) * PAGE_SIZE + res.data.length,
          total: res.meta?.total,
        }
      } catch (e) {
        return {
          data: emptyList.data,
          nextPage: pageParam + 1,
          fetchedTotal: (pageParam - 1) * PAGE_SIZE,
          total: (pageParam - 1) * PAGE_SIZE,
        }
      }
    },
    {
      getNextPageParam: lastPage => {
        if (lastPage.total && lastPage.fetchedTotal >= lastPage.total) return undefined
        return lastPage.nextPage
      },
    },
  )

  const ref = useRef<HTMLDivElement | null>(null)
  const [nodesPosition, setNodesPositions] = useState<
    Record<string, cytoscape.BoundingBox12 & cytoscape.BoundingBoxWH>
  >({})
  const inputs = useMemo(() => displayInputs?.pages.flatMap(v => v.data) ?? [], [displayInputs?.pages])
  const outputs = useMemo(() => displayOutputs?.pages.flatMap(v => v.data) ?? [], [displayOutputs?.pages])
  const refreshNodesPositions = useCallback(() => {
    if (!cyRef.current) return
    const positions: Record<string, cytoscape.BoundingBox12 & cytoscape.BoundingBoxWH> = {}
    cyRef.current.nodes().forEach(v => {
      const id = v.data('id')
      positions[id] = v.renderedBoundingBox()
    })
    setNodesPositions(positions)
  }, [setNodesPositions, cyRef])
  const refreshGraph = useCallback(() => {
    if (ref.current && !isLoadingInput && !isLoadingOutput) {
      if (!cyRef.current) {
        cyRef.current = generateTxGraph({
          container: ref.current,
          inputs,
          outputs,
          txHash,
          hasMoreInput,
          hasMoreOutput,
        })
        cyRef.current.center(cyRef.current.$('node[type=tx]'))
        cyRef.current?.on('tapdrag', () => {
          refreshNodesPositions()
        })
        refreshNodesPositions()
      }
    }
  }, [
    ref,
    txHash,
    inputs,
    outputs,
    isLoadingInput,
    isLoadingOutput,
    hasMoreInput,
    hasMoreOutput,
    refreshNodesPositions,
  ])
  const addNodes = useCallback(
    ({
      addCells,
      total,
      nodeType,
      hasMore,
    }: {
      addCells: Cell[]
      total: number
      nodeType: 'input' | 'output'
      hasMore?: boolean
    }) => {
      if (!cyRef.current) return
      const isInputNode = nodeType === 'input'
      const nodes = cyRef.current.nodes()
      cyRef.current.remove(`#${isInputNode ? INPUT_MORE_ID : OUTPUT_MORE_ID}`)
      cyRef.current.add(
        generateCellNodes({
          cells: addCells,
          nodeType,
          txHash,
          total,
          hasMore,
          cyInstance: cyRef.current,
        }),
      )
      const layout = cyRef.current.makeLayout(
        getLayoutConfig({
          inputsTotal: isInputNode ? total : nodes.filter('node[type="input"]').length,
          outputsTotal: isInputNode ? nodes.filter('node[type="output"]').length : total,
          hasMoreInput: isInputNode ? hasMore : !!nodes.filter(`#${INPUT_MORE_ID}`).length,
          hasMoreOutput: isInputNode ? !!nodes.filter(`#${OUTPUT_MORE_ID}`).length : hasMore,
        }),
      )
      layout?.run()
      refreshNodesPositions()
    },
    [refreshNodesPositions, txHash],
  )
  useEffect(() => {
    refreshGraph()
  }, [refreshGraph])
  const fetchMoreOutputAndRender = useCallback(async () => {
    const { data } = await fetchMoreOutput()
    const latestFetchedData = data?.pages?.at(-1)
    if (!latestFetchedData) return
    addNodes({
      addCells: latestFetchedData.data,
      nodeType: 'output',
      total: latestFetchedData.fetchedTotal ?? 0,
      hasMore: latestFetchedData.fetchedTotal !== latestFetchedData.total,
    })
  }, [fetchMoreOutput, addNodes])
  const fetchMoreInputAndRender = useCallback(async () => {
    const { data } = await fetchMoreInput()
    const latestFetchedData = data?.pages?.at(-1)
    if (!latestFetchedData) return
    addNodes({
      addCells: latestFetchedData.data,
      nodeType: 'input',
      total: latestFetchedData.fetchedTotal ?? 0,
      hasMore: latestFetchedData.fetchedTotal !== latestFetchedData.total,
    })
  }, [fetchMoreInput, addNodes])
  return (
    <div className={styles.graphContainer}>
      <div ref={ref} />
      {inputs.map(v => {
        const id = generateCellNodeId(v)
        return (
          <button
            type="button"
            style={{
              left: nodesPosition[id]?.x1,
              top: nodesPosition[id]?.y1,
              height: nodesPosition[id]?.h,
              transform: `translateX(calc(${nodesPosition[id]?.w}px - 100%))`,
            }}
            disabled={v.fromCellbase}
            onClick={() => onViewCellGraph(v)}
            key={id}
          >
            <CellNode
              {...v}
              status="dead"
              isGenesisOutput={v.fromCellbase}
              modalRef={modalRef}
              onViewCell={onViewCell}
            />
          </button>
        )
      })}
      {outputs.map(v => {
        const id = generateCellNodeId(v)
        return (
          <button
            type="button"
            style={{
              left: nodesPosition[id]?.x1,
              top: nodesPosition[id]?.y1,
              height: nodesPosition[id]?.h,
            }}
            onClick={() => onViewCellGraph(v)}
            key={id}
          >
            <CellNode {...v} modalRef={modalRef} onViewCell={onViewCell} />
          </button>
        )
      })}
      <div
        style={{
          left: nodesPosition[txHash]?.x1,
          top: nodesPosition[txHash]?.y1,
          height: nodesPosition[txHash]?.h,
          width: nodesPosition[txHash]?.w,
        }}
      >
        <TxNode txHash={txHash} modalRef={modalRef} />
      </div>
      {hasMoreInput ? (
        <button
          type="button"
          style={{
            left: nodesPosition[INPUT_MORE_ID]?.x1,
            top: nodesPosition[INPUT_MORE_ID]?.y1,
            height: nodesPosition[INPUT_MORE_ID]?.h,
            transform: `translateX(calc(${nodesPosition[INPUT_MORE_ID]?.w}px - 100%))`,
          }}
          onClick={fetchMoreInputAndRender}
          className={styles.showMore}
        >
          ...
        </button>
      ) : null}
      {hasMoreOutput ? (
        <button
          type="button"
          style={{
            left: nodesPosition[OUTPUT_MORE_ID]?.x1,
            top: nodesPosition[OUTPUT_MORE_ID]?.y1,
            height: nodesPosition[OUTPUT_MORE_ID]?.h,
          }}
          onClick={fetchMoreOutputAndRender}
          className={styles.showMore}
        >
          ...
        </button>
      ) : null}
    </div>
  )
}

export default TxGraph
