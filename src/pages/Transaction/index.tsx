import React, { useEffect, useState, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import TransactionHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import { PageActions, AppActions } from '../../contexts/actions'
import { getTipBlockNumber } from '../../service/app/address'
import { getTransactionByHash } from '../../service/app/transaction'
import i18n from '../../utils/i18n'
import { TransactionDiv as TransactionPanel } from './styled'
import TransactionComp, { TransactionOverview } from './TransactionComp'
import { useDispatch, useAppState } from '../../contexts/providers'
import Loading from '../../components/Loading'
import Error from '../../components/Error'
import { useTimeoutWithUnmount } from '../../utils/hook'
import { LOADING_WAITING_TIME, PAGE_CELL_COUNT } from '../../utils/const'
import { isMobile } from '../../utils/screen'

const TransactionStateComp = () => {
  const { transactionState, app } = useAppState()
  switch (transactionState.status) {
    case 'Error':
      return <Error />
    case 'OK':
      return <TransactionComp />
    case 'InProgress':
    case 'None':
    default:
      return <Loading show={app.loading} />
  }
}

const anchorAction = (hash: string, txHash: string) => {
  let anchor = hash
  if (anchor) {
    anchor = anchor.replace('#', '')
    let outputIndex = Number(anchor)
    if (Number.isNaN(outputIndex) || outputIndex < 0 || outputIndex >= PAGE_CELL_COUNT) {
      outputIndex = 0
    }
    const anchorElement = document.getElementById(`output_${outputIndex}_${txHash}`) as HTMLElement
    if (anchorElement) {
      anchorElement.style.cssText += 'background: #f5f5f5'
      anchorElement.scrollIntoView()
      window.scrollBy(0, isMobile() ? -48 : -66)
    }
  }
}

export default () => {
  const dispatch = useDispatch()
  const { pathname, hash } = useLocation()
  const pathRef = useRef(pathname)
  const { hash: txHash } = useParams<{ hash: string }>()
  const [showTitleLoading, setShowTitleLoading] = useState(false)
  const {
    transactionState: {
      transaction: { displayOutputs },
      status,
    },
  } = useAppState()

  useEffect(() => {
    if (pathname.startsWith('/transaction') && pathRef.current !== pathname) {
      setShowTitleLoading(status === 'InProgress')
    }
  }, [status, pathname, dispatch])

  useEffect(() => {
    getTransactionByHash(txHash, dispatch)
    getTipBlockNumber(dispatch)
  }, [txHash, dispatch])

  useEffect(() => {
    if (status === 'OK' && displayOutputs.length > 0) {
      anchorAction(hash, txHash)
    }
  }, [hash, status, displayOutputs, txHash])

  useTimeoutWithUnmount(
    () => {
      dispatch({
        type: AppActions.UpdateLoading,
        payload: {
          loading: status === 'None' || status === 'InProgress',
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
      <TransactionPanel className="container">
        <TransactionHashCard title={i18n.t('transaction.transaction')} hash={txHash} loading={showTitleLoading}>
          <TransactionOverview />
        </TransactionHashCard>
        <TransactionStateComp />
      </TransactionPanel>
    </Content>
  )
}
