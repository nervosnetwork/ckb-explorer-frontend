import { AppDispatch } from '../../contexts/reducer'
import { AppActions } from '../../contexts/actions'
import { fetchTipBlockNumber } from '../http/fetcher'

export const getTipBlockNumber = (dispatch: AppDispatch) => {
  fetchTipBlockNumber().then((wrapper: Response.Wrapper<State.Statistics> | null) => {
    if (wrapper) {
      dispatch({
        type: AppActions.UpdateTipBlockNumber,
        payload: {
          tipBlockNumber: parseInt(wrapper.attributes.tipBlockNumber, 10),
        },
      })
    }
  })
}
