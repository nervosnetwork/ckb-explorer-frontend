import React, { useEffect, useState, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import TransactionHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import { PageActions, AppActions } from '../../contexts/providers/reducer'
import { getTipBlockNumber } from '../../service/app/address'
import { getTransactionByHash } from '../../service/app/transaction'
import i18n from '../../utils/i18n'
import { TransactionDiv } from './styled'
import TransactionComp from './TransactionComp'
import { useDispatch, useAppState } from '../../contexts/providers'
import Loading from '../../components/Loading'
import Error from '../../components/Error'
import { useTimeoutWithUnmount } from '../../utils/hook'
import { LOADING_WAITING_TIME } from '../../utils/const'

const TransactionStateComp = () => {
  const { transactionState, app } = useAppState()
  switch (transactionState.status) {
    case 'Error':
      return <Error />
    case 'OK':
      return <TransactionComp />
    case 'None':
    default:
      return <Loading show={app.loading} />
  }
}

export default () => {
  const dispatch = useDispatch()
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
        <TransactionHashCard title={i18n.t('transaction.transaction')} hash={hash} loading={showLoading} />
        <TransactionStateComp />
      </TransactionDiv>
    </Content>
  )
}
