import { fetchTransactionsByBlockHash, fetchBlock, fetchBlocks, fetchBlockList } from '../http/fetcher'
import { PageActions, AppDispatch, AppDispatchType } from '../../contexts/providers/reducer'
import { storeCachedData, fetchCachedData } from '../../utils/cached'
import { CachedKeys } from '../../utils/const'
import { FetchStatus } from '../../contexts/states'

type BlockTransactionType = { transactions?: State.Transaction[]; total?: number; status?: FetchStatus }

export const getBlockTransactions = (
  hash: string,
  page: number,
  size: number,
  dispatch: AppDispatchType<BlockTransactionType>,
) => {
  fetchTransactionsByBlockHash(hash, page, size)
    .then(response => {
      const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
      dispatch({
        type: PageActions.UpdateBlockTransactions,
        payload: {
          transactions: data.map((wrapper: Response.Wrapper<State.Transaction>) => {
            return wrapper.attributes
          }),
        },
      })
      dispatch({
        type: PageActions.UpdateBlockStatus,
        payload: {
          status: 'OK',
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
    .catch(() => {
      dispatch({
        type: PageActions.UpdateBlockStatus,
        payload: {
          status: 'Error',
        },
      })
    })
}

// blockParam: block hash or block number
export const getBlock = (
  blockParam: string,
  page: number,
  size: number,
  dispatch: AppDispatchType<{ block?: State.Block; status?: FetchStatus }>,
) => {
  fetchBlock(blockParam)
    .then((wrapper: Response.Wrapper<State.Block> | null) => {
      if (wrapper) {
        const block = wrapper.attributes
        dispatch({
          type: PageActions.UpdateBlock,
          payload: {
            block,
          },
        })
        getBlockTransactions(block.blockHash, page, size, dispatch)
      } else {
        dispatch({
          type: PageActions.UpdateBlockStatus,
          payload: {
            status: 'Error',
          },
        })
      }
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateBlockStatus,
        payload: {
          status: 'Error',
        },
      })
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
  fetchBlocks().then((wrappers: Response.Wrapper<State.Block>[] | null) => {
    if (wrappers) {
      const blocks = wrappers.map((wrapper: Response.Wrapper<State.Block>) => {
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
  const cachedBlocks = fetchCachedData<State.Block[]>(CachedKeys.BlockList)
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
      const blocks = data.map((wrapper: Response.Wrapper<State.Block>) => {
        return wrapper.attributes
      })
      dispatch({
        type: PageActions.UpdateBlockList,
        payload: {
          blocks,
        },
      })
      storeCachedData(CachedKeys.BlockList, blocks)
    }
  })
}
