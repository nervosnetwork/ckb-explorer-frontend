import React, { useEffect, useContext, useRef } from 'react'
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

  const savedCallback = useRef(() => {
    if (transactionState.status === 'None') {
      dispatch({
        type: PageActions.UpdateTransactionStatus,
        payload: {
          status: 'KeepNone',
        },
      })
    }
  })

  useEffect(() => {
    const listener = setTimeout(savedCallback.current, LOADING_WAITING_TIME)

    getTransactionByHash(hash, dispatch, () => {
      if (listener) clearTimeout(listener)
    })
    getTipBlockNumber(dispatch)

    return () => {
      if (listener) clearTimeout(listener)
      dispatch({
        type: PageActions.UpdateTransactionStatus,
        payload: {
          status: 'None',
        },
      })
    }
  }, [hash, dispatch])

  return (
    <Content>
      <TransactionDiv className="container">
        <AddressHashCard title={i18n.t('transaction.transaction')} hash={hash} dispatch={dispatch} />
        <TransactionStateComp dispatch={dispatch} />
      </TransactionDiv>
    </Content>
  )
}
