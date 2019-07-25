import {
  fetchTransactionsByBlockHash,
  fetchBlock,
  fetchBlocks,
  fetchBlockList,
  fetchTipBlockNumber,
} from '../http/fetcher'
import { PageActions, AppDispatch, AppActions } from '../../contexts/providers/reducer'
import { storeCachedData } from '../../utils/cached'
import { CachedKeys } from '../../utils/const'

export const getBlockTransactions = (hash: string, page: number, size: number, dispatch: AppDispatch) => {
  fetchTransactionsByBlockHash(hash, page, size).then(response => {
    const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
    dispatch({
      type: PageActions.UpdateBlockTransactions,
      payload: {
        transactions: data,
      },
    })
    if (meta) {
      dispatch({
        type: PageActions.UpdateBlockTotal,
        payload: {
          total: meta.total,
        },
      })
    }
  })
}

export const getBlockPrevNext = (blockNumber: number, dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateBlockPrev,
    payload: {
      prev: blockNumber > 0,
    },
  })
  fetchBlock(`${blockNumber + 1}`)
    .then((wrapper: Response.Wrapper<State.Block>) => {
      dispatch({
        type: PageActions.UpdateBlockNext,
        payload: {
          next: wrapper ? wrapper.attributes.number > 0 : false,
        },
      })
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateBlockNext,
        payload: {
          next: false,
        },
      })
    })
}

// blockParam: block hash or block number
export const getBlock = (blockParam: string, page: number, size: number, dispatch: AppDispatch, replace: any) => {
  fetchBlock(blockParam)
    .then((wrapper: Response.Wrapper<State.Block>) => {
      if (wrapper) {
        const block = wrapper.attributes
        dispatch({
          type: PageActions.UpdateBlock,
          payload: {
            block,
          },
        })
        getBlockPrevNext(block.number, dispatch)
        getBlockTransactions(block.block_hash, page, size, dispatch)
      } else {
        replace(`/search/fail?q=${blockParam}`)
      }
    })
    .catch(() => {
      replace(`/search/fail?q=${blockParam}`)
    })
}

export const getLatestBlocks = (dispatch: AppDispatch) => {
  fetchBlocks().then(response => {
    const { data } = response as Response.Response<Response.Wrapper<State.Block>[]>
    dispatch({
      type: PageActions.UpdateHomeBlocks,
      payload: {
        homeBlocks: data,
      },
    })
  })
}

export const getBlocks = (page: number, size: number, dispatch: AppDispatch) => {
  fetchBlockList(page, size).then(response => {
    const { data, meta } = response as Response.Response<Response.Wrapper<State.Block>[]>
    if (meta) {
      dispatch({
        type: PageActions.UpdateBlockListTotal,
        payload: {
          total: meta.total,
        },
      })
    }
    if (data) {
      dispatch({
        type: PageActions.UpdateBlockList,
        payload: {
          blocks: data,
        },
      })
      storeCachedData(CachedKeys.BlockList, data)
    }
  })
}

export const getTipBlockNumber = (dispatch: AppDispatch) => {
  fetchTipBlockNumber().then((wrapper: Response.Wrapper<State.Statistics>) => {
    if (wrapper) {
      dispatch({
        type: AppActions.UpdateTipBlockNumber,
        payload: {
          tipBlockNumber: parseInt(wrapper.attributes.tip_block_number, 10),
        },
      })
    }
  })
}
