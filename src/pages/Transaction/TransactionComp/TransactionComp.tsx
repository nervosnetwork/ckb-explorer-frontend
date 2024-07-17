import { useQuery } from '@tanstack/react-query'
import { useHistory, useLocation } from 'react-router-dom'
import type { Response } from '../../../services/ExplorerService/types'
import TransactionCellList from '../TransactionCellList'
import { Cell } from '../../../models/Cell'
import { Transaction } from '../../../models/Transaction'
import { explorerService } from '../../../services/ExplorerService'
import Loading from '../../../components/Loading'
import Pagination from '../../../components/Pagination'
import { PAGE_SIZE } from '../../../constants/common'
import { useSearchParams } from '../../../hooks'

const handleCellbaseInputs = (inputs: Cell[], outputs: Cell[], inputsConsumedTxHash: string) => {
  if (inputs[0] && inputs[0].fromCellbase && outputs[0] && outputs[0].baseReward) {
    const resultInputs = inputs
    resultInputs[0] = {
      ...resultInputs[0],
      baseReward: outputs[0].baseReward,
      secondaryReward: outputs[0].secondaryReward,
      commitReward: outputs[0].commitReward,
      proposalReward: outputs[0].proposalReward,
    }
    return resultInputs.map(v => ({ ...v, consumedTxHash: inputsConsumedTxHash }))
  }
  return inputs.map(v => ({ ...v, consumedTxHash: inputsConsumedTxHash }))
}

const emptyList: Response.Response<Cell[]> = {
  data: [],
  meta: {
    total: 0,
    pageSize: PAGE_SIZE,
  },
}

const PRESET_PAGE_SIZES = [5, 10, 15]

export const TransactionComp = ({
  transaction: { transactionHash: txHash, blockNumber, isCellbase },
}: {
  transaction: Transaction
}) => {
  const {
    page_of_inputs = '1',
    page_of_outputs = '1',
    page_size = `${PAGE_SIZE}`,
  } = useSearchParams('page_of_inputs', 'page_of_outputs', 'page_size')
  const { pathname, search } = useLocation()

  const history = useHistory()

  const inputsPage = page_of_inputs && Number.isNaN(+page_of_inputs) ? 1 : +page_of_inputs
  const outputsPage = page_of_outputs && Number.isNaN(+page_of_outputs) ? 1 : +page_of_outputs
  const pageSize = Number.isNaN(+page_size) ? PAGE_SIZE : +page_size

  const { data: displayInputs = emptyList, isFetching: isInputsLoading } = useQuery(
    ['transaction_inputs', txHash, inputsPage, pageSize],
    () => explorerService.api.fetchCellsByTxHash(txHash, 'inputs', { no: inputsPage, size: pageSize }),
  )

  const { data: displayOutputs = emptyList, isFetching: isOutputsLoading } = useQuery(
    ['transaction_outputs', txHash, outputsPage, pageSize],
    () =>
      explorerService.api
        .fetchCellsByTxHash(txHash, 'outputs', { no: outputsPage, size: pageSize })
        .catch(() => emptyList),
  )

  const inputs = handleCellbaseInputs(displayInputs.data, displayOutputs.data, txHash)
  const inputsPageCount = displayInputs.meta ? Math.ceil(displayInputs.meta.total / displayInputs.meta.pageSize) : 1
  const outputsPageCount = displayOutputs.meta ? Math.ceil(displayOutputs.meta.total / displayOutputs.meta.pageSize) : 1

  const handlePageChange = (type: 'inputs' | 'outputs') => (page: number, size?: number) => {
    const pageField = `page_of_${type}`
    const searchParams = new URLSearchParams(search)
    if (size) {
      searchParams.set('page_size', `${size}`)
      searchParams.delete('page_of_inputs')
      searchParams.delete('page_of_outputs')
    } else {
      searchParams.set(pageField, `${page}`)
    }
    const url = `${pathname}?${searchParams.toString()}`
    history.push(url)
  }

  /// [0, 11] block doesn't show block reward and only cellbase show block reward
  return (
    <>
      <div className="transactionInputs">
        <Loading show={isInputsLoading} />
        <TransactionCellList
          total={displayInputs.meta?.total}
          inputs={inputs}
          startIndex={(inputsPage - 1) * pageSize}
          showReward={Number(blockNumber) - 11 > 0 && isCellbase}
          txHash={txHash}
        />
        <div style={{ height: 4 }} />
        <Pagination
          currentPage={inputsPage}
          totalPages={inputsPageCount}
          onChange={handlePageChange('inputs')}
          pageSize={pageSize}
          presetPageSizes={PRESET_PAGE_SIZES}
        />
      </div>
      <div className="transactionOutputs">
        <Loading show={isOutputsLoading} />
        <TransactionCellList
          total={displayOutputs.meta?.total}
          outputs={displayOutputs.data}
          startIndex={(outputsPage - 1) * pageSize}
          txHash={txHash}
        />
        <div style={{ height: 4 }} />
        <Pagination
          currentPage={outputsPage}
          totalPages={outputsPageCount}
          onChange={handlePageChange('outputs')}
          pageSize={pageSize}
          presetPageSizes={PRESET_PAGE_SIZES}
        />
      </div>
    </>
  )
}
