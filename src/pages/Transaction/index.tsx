import React, { useEffect, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import AddressHashCard from '../../components/Card/AddressHashCard'
import Content from '../../components/Content'
import { StateWithDispatch, AppDispatch, PageActions } from '../../contexts/providers/reducer'
import { getTipBlockNumber } from '../../service/app/address'
import { getTransactionByHash } from '../../service/app/transaction'
import i18n from '../../utils/i18n'
import { TransactionDiv } from './styled'
import TransactionComp from './TransactionComp'
import { AppContext } from '../../contexts/providers'
import Loading from '../../components/Loading'
import Error from '../../components/Error'
import { LOADING_WAITING_TIME } from '../../utils/const'
import { useTimeout } from '../../utils/hook'

const TransactionStateComp = ({ dispatch }: { dispatch: AppDispatch }) => {
  const { transactionState } = useContext(AppContext)
  switch (transactionState.status) {
    case 'Error':
      return <Error message={i18n.t('transaction.transaction_not_found')} />
    case 'OK':
      return <TransactionComp dispatch={dispatch} />
    case 'KeepNone':
      return <Loading />
    case 'None':
    default:
      return null
  }
}

export default ({
  dispatch,
  match: { params },
}: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps<{ hash: string }>>) => {
  const { hash } = params
  const { transactionState } = useContext(AppContext)

  useEffect(() => {
    getTransactionByHash(hash, dispatch)
    getTipBlockNumber(dispatch)

    return () => {
      dispatch({
        type: PageActions.UpdateTransactionStatus,
        payload: {
          status: 'None',
        },
      })
    }
  }, [hash, dispatch])

  useTimeout(() => {
    if (transactionState.status === 'None') {
      dispatch({
        type: PageActions.UpdateTransactionStatus,
        payload: {
          status: 'KeepNone',
        },
      })
    }
  }, LOADING_WAITING_TIME)

  return (
    <Content>
      <TransactionDiv className="container">
        <AddressHashCard title={i18n.t('transaction.transaction')} hash={hash} dispatch={dispatch} />
        <TransactionStateComp dispatch={dispatch} />
      </TransactionDiv>
    </Content>
  )
}
