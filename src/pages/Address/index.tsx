import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import Loading from '../../components/Loading'
import AddressHashCard from '../../components/Card/HashCard'
import Error from '../../components/Error'
import Content from '../../components/Content'
import { useAppState, useDispatch } from '../../contexts/providers/index'
import { PageActions, AppActions } from '../../contexts/actions'
import { getAddressInformation, getTransactionsByAddress } from '../../service/app/address'
import { PageParams, LOADING_WAITING_TIME } from '../../constants/common'
import i18n from '../../utils/i18n'
import { parsePageNumber } from '../../utils/string'
import { AddressContentPanel, AddressLockScriptController, AddressTitleOverviewPanel } from './styled'
import { AddressTransactions, AddressAssetComp } from './AddressComp'
import { useTimeoutWithUnmount } from '../../utils/hook'
import ArrowUpIcon from '../../assets/arrow_up.png'
import ArrowDownIcon from '../../assets/arrow_down.png'
import ArrowUpBlueIcon from '../../assets/arrow_up_blue.png'
import ArrowDownBlueIcon from '../../assets/arrow_down_blue.png'
import { isMainnet } from '../../utils/chain'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import { localeNumberString } from '../../utils/number'
import { parseSimpleDateNoSecond } from '../../utils/date'
import Script from '../../components/Script'
import AddressText from '../../components/AddressText'
import styles from './styles.module.scss'

const lockScriptIcon = (show: boolean) => {
  if (show) {
    return isMainnet() ? ArrowUpIcon : ArrowUpBlueIcon
  }
  return isMainnet() ? ArrowDownIcon : ArrowDownBlueIcon
}

const getAddressInfo = (addressState: State.AddressState) => {
  const {
    address: { liveCellsCount, minedBlocksCount, type, addressHash, lockInfo },
  } = addressState
  const items: OverviewItemData[] = [
    {
      title: i18n.t('address.live_cells'),
      content: localeNumberString(liveCellsCount),
    },
    {
      title: i18n.t('address.block_mined'),
      content: localeNumberString(minedBlocksCount),
    },
  ]

  if (type === 'LockHash') {
    if (!addressHash) {
      items.push({
        title: i18n.t('address.address'),
        content: i18n.t('address.unable_decode_address'),
      })
    } else {
      items.push({
        title: i18n.t('address.address'),
        contentWrapperClass: styles.addressWidthModify,
        content: <AddressText>{addressHash}</AddressText>,
      })
    }
  }
  if (lockInfo && lockInfo.epochNumber !== '0' && lockInfo.estimatedUnlockTime !== '0') {
    const estimate = Number(lockInfo.estimatedUnlockTime) > new Date().getTime() ? i18n.t('address.estimated') : ''
    items.push({
      title: i18n.t('address.lock_until'),
      content: `${lockInfo.epochNumber} ${i18n.t('address.epoch')} (${estimate} ${parseSimpleDateNoSecond(
        lockInfo.estimatedUnlockTime,
      )})`,
    })
  }
  return items
}

const AddressTitleOverview = () => {
  const [showLock, setShowLock] = useState<boolean>(false)
  const {
    addressState,
    addressState: {
      address: { lockScript = undefined },
    },
  } = useAppState()
  return (
    <AddressTitleOverviewPanel>
      <OverviewCard items={getAddressInfo(addressState)} hideShadow>
        <AddressLockScriptController onClick={() => setShowLock(!showLock)}>
          <div>{i18n.t('address.lock_script')}</div>
          <img alt="lock script" src={lockScriptIcon(showLock)} />
        </AddressLockScriptController>
        {showLock && lockScript && <Script script={lockScript} />}
      </OverviewCard>
    </AddressTitleOverviewPanel>
  )
}

const AddressAssetCompState = () => {
  const { addressState, app } = useAppState()
  switch (addressState.addressStatus) {
    case 'Error':
      return <Error />
    case 'OK':
      return <AddressAssetComp />
    case 'None':
    default:
      return <Loading show={app.loading} />
  }
}

const AddressStateTransactions = ({
  currentPage,
  pageSize,
  address,
}: {
  currentPage: number
  pageSize: number
  address: string
}) => {
  const { addressState, app } = useAppState()
  switch (addressState.transactionsStatus) {
    case 'Error':
      return <Error />
    case 'OK':
      return <AddressTransactions currentPage={currentPage} pageSize={pageSize} address={address} />
    case 'InProgress':
    case 'None':
    default:
      return <Loading show={app.secondLoading} />
  }
}

export const Address = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { search } = useLocation()
  const { address } = useParams<{ address: string }>()
  const parsed = queryString.parse(search)
  const {
    addressState,
    addressState: { addressStatus, transactionsStatus },
  } = useAppState()

  const currentPage = parsePageNumber(parsed.page, PageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, PageParams.PageSize)

  useEffect(() => {
    getAddressInformation(address, dispatch)
  }, [address, dispatch])

  useEffect(() => {
    if (pageSize > PageParams.MaxPageSize) {
      history.replace(`/address/${address}?page=${currentPage}&size=${PageParams.MaxPageSize}`)
    }
    getTransactionsByAddress(address, currentPage, pageSize, dispatch)
  }, [address, currentPage, pageSize, dispatch, history])

  useTimeoutWithUnmount(
    () => {
      dispatch({
        type: AppActions.UpdateLoading,
        payload: {
          loading: addressStatus === 'None' || addressStatus === 'InProgress',
        },
      })
      dispatch({
        type: AppActions.UpdateSecondLoading,
        payload: {
          secondLoading: transactionsStatus === 'None' || transactionsStatus === 'InProgress',
        },
      })
    },
    () => {
      dispatch({
        type: PageActions.UpdateAddressStatus,
        payload: {
          addressStatus: 'None',
        },
      })
      dispatch({
        type: PageActions.UpdateAddressTransactionsStatus,
        payload: {
          transactionsStatus: 'None',
        },
      })
    },
    LOADING_WAITING_TIME,
  )

  return (
    <Content>
      <AddressContentPanel className="container">
        <AddressHashCard
          title={addressState.address.type === 'LockHash' ? i18n.t('address.lock_hash') : i18n.t('address.address')}
          hash={address}
          specialAddress={addressState.address.isSpecial ? addressState.address.specialAddress : ''}
          showDASInfoOnHeader
        >
          <AddressTitleOverview />
        </AddressHashCard>
        <AddressAssetCompState />
        <AddressStateTransactions currentPage={currentPage} pageSize={pageSize} address={address} />
      </AddressContentPanel>
    </Content>
  )
}

export default Address
