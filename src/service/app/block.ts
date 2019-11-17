import { fetchTransactionsByBlockHash, fetchBlock, fetchBlocks, fetchBlockList } from '../http/fetcher'
import { PageActions, AppDispatch, AppActions } from '../../contexts/providers/reducer'

const handleResponseStatus = (dispatch: AppDispatch, isOK: boolean) => {
  dispatch({
    type: PageActions.UpdateBlockStatus,
    payload: {
      status: isOK ? 'OK' : 'Error',
    },
  })
  dispatch({
    type: AppActions.UpdateLoading,
    payload: {
      loading: false,
    },
  })
}

export const getBlockTransactions = (hash: string, page: number, size: number, dispatch: AppDispatch) => {
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
      if (meta) {
        dispatch({
          type: PageActions.UpdateBlockTotal,
          payload: {
            total: meta.total,
          },
        })
      }
      handleResponseStatus(dispatch, true)
    })
    .catch(() => {
      handleResponseStatus(dispatch, false)
    })
}

// blockParam: block hash or block number
export const getBlock = (blockParam: string, page: number, size: number, dispatch: AppDispatch) => {
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
        handleResponseStatus(dispatch, false)
      }
    })
    .catch(() => {
      handleResponseStatus(dispatch, false)
    })
}

// home page
export const getLatestBlocks = (dispatch: AppDispatch) => {
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
    }
  })
}

// block list page
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
      const blocks = data.map((wrapper: Response.Wrapper<State.Block>) => {
        return wrapper.attributes
      })
      dispatch({
        type: PageActions.UpdateBlockList,
        payload: {
          blocks,
        },
      })
    }
  })
}
