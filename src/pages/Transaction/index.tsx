import { useEffect, useState, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import TransactionHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import { getTipBlockNumber } from '../../service/app/address'
import { getTransactionByHash, handleTransactionStatus } from '../../service/app/transaction'
import i18n from '../../utils/i18n'
import { TransactionDiv as TransactionPanel } from './styled'
import TransactionComp, { TransactionOverview } from './TransactionComp'
import { useDispatch, useAppState } from '../../contexts/providers'
import Loading from '../../components/Loading'
import Error from '../../components/Error'
import { useDelayLoading, useIsMobile } from '../../utils/hook'
import { LOADING_WAITING_TIME, PAGE_CELL_COUNT } from '../../constants/common'

const TransactionStateComp = () => {
  const {
    transactionState: { status },
  } = useAppState()
  const loading = useDelayLoading(LOADING_WAITING_TIME, status === 'None' || status === 'InProgress')

  switch (status) {
    case 'Error':
      return <Error />
    case 'OK':
      return <TransactionComp />
    case 'InProgress':
    case 'None':
    default:
      return <Loading show={loading} />
  }
}

const anchorAction = (hash: string, txHash: string, count: number, isMobile: boolean) => {
  let anchor = hash
  if (anchor) {
    anchor = anchor.replace('#', '')
    let outputIndex = Number(anchor)
    if (Number.isNaN(outputIndex) || outputIndex < 0 || outputIndex >= PAGE_CELL_COUNT) {
      outputIndex = 0
    }
    for (let index = 0; index < count; index++) {
      const anchorElement = document.getElementById(`output_${index}_${txHash}`) as HTMLElement
      if (anchorElement) {
        if (index === outputIndex) {
          anchorElement.style.cssText += 'background: #f5f5f5'
          anchorElement.scrollIntoView()
          window.scrollBy(0, isMobile ? -48 : -66)
        } else {
          anchorElement.style.cssText += 'background: #00000000'
        }
      }
    }
  }
}

export default () => {
  const isMobile = useIsMobile()
  const dispatch = useDispatch()
  const { pathname, hash } = useLocation()
  const pathRef = useRef(pathname)
  const { hash: txHash } = useParams<{ hash: string }>()
  const [showTitleLoading, setShowTitleLoading] = useState(false)
  const {
    transactionState: {
      transaction: { displayOutputs, blockTimestamp, txStatus },
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
      anchorAction(hash, txHash, displayOutputs.length, isMobile)
    }
  }, [hash, status, displayOutputs, txHash, isMobile])

  useEffect(() => {
    return () => handleTransactionStatus(dispatch, 'None')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Content>
      <TransactionPanel className="container">
        <TransactionHashCard title={i18n.t('transaction.transaction')} hash={txHash} loading={showTitleLoading}>
          {txStatus !== 'committed' || blockTimestamp > 0 ? <TransactionOverview /> : null}
        </TransactionHashCard>
        <TransactionStateComp />
      </TransactionPanel>
    </Content>
  )
}
