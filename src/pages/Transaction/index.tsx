import React, { useEffect, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import AddressHashCard from '../../components/Card/AddressHashCard'
import Content from '../../components/Content'
import { StateWithDispatch, AppDispatch, PageActions, AppActions } from '../../contexts/providers/reducer'
import { getTipBlockNumber } from '../../service/app/address'
import { getTransactionByHash } from '../../service/app/transaction'
import i18n from '../../utils/i18n'
import { TransactionDiv } from './styled'
import TransactionComp from './TransactionComp'
import { AppContext } from '../../contexts/providers'
import Loading from '../../components/Loading'
import Error from '../../components/Error'
import { useTimeoutWithUnmount } from '../../utils/hook'
import { LOADING_WAITING_TIME } from '../../utils/const'

const TransactionStateComp = ({ dispatch }: { dispatch: AppDispatch }) => {
  const { transactionState } = useContext(AppContext)
  switch (transactionState.status) {
    case 'Error':
      return <Error />
    case 'OK':
      return <TransactionComp dispatch={dispatch} />
    case 'None':
    default:
      return <Loading />
  }
}

export default ({
  dispatch,
  match: { params },
}: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps<{ hash: string }>>) => {
  const { hash } = params

  useEffect(() => {
    getTransactionByHash(hash, dispatch)
    getTipBlockNumber(dispatch)
  }, [hash, dispatch])

  useTimeoutWithUnmount(
    () => {
      dispatch({
        type: AppActions.UpdateLoading,
        payload: {
          loading: true,
        },
      })
    },
    () => {
      dispatch({
        type: PageActions.UpdateTransactionStatus,
        payload: {
          status: 'None',
        },
      })
    },
    LOADING_WAITING_TIME,
  )

  return (
    <Content>
      <TransactionDiv className="container">
        <AddressHashCard title={i18n.t('transaction.transaction')} hash={hash} dispatch={dispatch} />
        <TransactionStateComp dispatch={dispatch} />
      </TransactionDiv>
    </Content>
  )
}
