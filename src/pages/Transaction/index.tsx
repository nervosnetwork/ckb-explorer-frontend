import React, { useEffect, useContext, useState, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import TransactionHashCard from '../../components/Card/HashCard'
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
  const { transactionState, app } = useContext(AppContext)
  switch (transactionState.status) {
    case 'Error':
      return <Error />
    case 'OK':
      return <TransactionComp dispatch={dispatch} />
    case 'None':
    default:
      return <Loading show={app.loading} />
  }
}

export default ({ dispatch }: React.PropsWithoutRef<StateWithDispatch>) => {
  const { pathname } = useLocation()
  const pathRef = useRef(pathname)
  const { hash } = useParams<{ hash: string }>()
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    setShowLoading(pathname.startsWith('/transaction') && pathRef.current !== pathname)
    getTransactionByHash(hash, dispatch, () => {
      setShowLoading(false)
    })
    getTipBlockNumber(dispatch)
  }, [hash, dispatch, pathname])

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
        <TransactionHashCard
          title={i18n.t('transaction.transaction')}
          hash={hash}
          dispatch={dispatch}
          loading={showLoading}
        />
        <TransactionStateComp dispatch={dispatch} />
      </TransactionDiv>
    </Content>
  )
}
