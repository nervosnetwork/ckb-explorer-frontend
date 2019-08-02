import { fetchTransactionsByBlockHash, fetchBlock, fetchBlocks, fetchBlockList } from '../http/fetcher'
import { PageActions, AppDispatch } from '../../contexts/providers/reducer'
import { storeCachedData, fetchCachedData } from '../../utils/cached'
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
        getBlockTransactions(block.block_hash, page, size, dispatch)
      } else {
        replace(`/search/fail?q=${blockParam}`)
      }
    })
    .catch(() => {
      replace(`/search/fail?q=${blockParam}`)
    })
}

// home page
export const getLatestBlocks = (dispatch: AppDispatch) => {
  const cachedBlocks = fetchCachedData<State.Block[]>(CachedKeys.Blocks)
  if (cachedBlocks) {
    dispatch({
      type: PageActions.UpdateHomeBlocks,
      payload: {
        homeBlocks: cachedBlocks,
      },
    })
  }
  fetchBlocks().then(response => {
    const { data } = response as Response.Response<Response.Wrapper<State.Block>[]>
    if (data) {
      const blocks = data.map((wrapper: Response.Wrapper<State.Block>) => {
        return wrapper.attributes
      })
      dispatch({
        type: PageActions.UpdateHomeBlocks,
        payload: {
          homeBlocks: blocks,
        },
      })
      storeCachedData(CachedKeys.Blocks, blocks)
    }
  })
}

// block list page
export const getBlocks = (page: number, size: number, dispatch: AppDispatch) => {
  const cachedBlocks = fetchCachedData<Response.Wrapper<State.Block>[]>(CachedKeys.BlockList)
  if (cachedBlocks) {
    dispatch({
      type: PageActions.UpdateBlockList,
      payload: {
        blocks: cachedBlocks,
      },
    })
  }
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
