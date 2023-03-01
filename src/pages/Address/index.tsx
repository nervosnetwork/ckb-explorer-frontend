import { FC, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import AddressHashCard from '../../components/Card/HashCard'
import Content from '../../components/Content'
import i18n from '../../utils/i18n'
import { AddressContentPanel, AddressLockScriptController, AddressTitleOverviewPanel } from './styled'
import { AddressTransactions, AddressAssetComp } from './AddressComp'
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
import { fetchAddressInfo, fetchTransactionsByAddress } from '../../service/http/fetcher'
import { QueryResult } from '../../components/QueryResult'
import { defaultAddressInfo } from './state'
import { usePaginationParamsInPage } from '../../utils/hook'
import { isAxiosError } from '../../utils/error'

const lockScriptIcon = (show: boolean) => {
  if (show) {
    return isMainnet() ? ArrowUpIcon : ArrowUpBlueIcon
  }
  return isMainnet() ? ArrowDownIcon : ArrowDownBlueIcon
}

const getAddressInfo = ({ liveCellsCount, minedBlocksCount, type, addressHash, lockInfo }: State.Address) => {
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

const AddressTitleOverview: FC<{ address: State.Address }> = ({ address }) => {
  const [showLock, setShowLock] = useState<boolean>(false)

  return (
    <AddressTitleOverviewPanel>
      <OverviewCard items={getAddressInfo(address)} hideShadow>
        <AddressLockScriptController onClick={() => setShowLock(!showLock)}>
          <div>{i18n.t('address.lock_script')}</div>
          <img alt="lock script" src={lockScriptIcon(showLock)} />
        </AddressLockScriptController>
        {showLock && address.lockScript && <Script script={address.lockScript} />}
      </OverviewCard>
    </AddressTitleOverviewPanel>
  )
}

export const Address = () => {
  const { address } = useParams<{ address: string }>()
  const { currentPage, pageSize } = usePaginationParamsInPage()

  const addressInfoQuery = useQuery(['address_info', address], async () => {
    const wrapper = await fetchAddressInfo(address)
    const result: State.Address = {
      ...wrapper.attributes,
      type: wrapper.type === 'lock_hash' ? 'LockHash' : 'Address',
    }
    return result
  })

  const addressTransactionsQuery = useQuery(['address_transactions', address, currentPage, pageSize], async () => {
    try {
      const { data, meta } = await fetchTransactionsByAddress(address, currentPage, pageSize)
      return {
        transactions: data.map(wrapper => wrapper.attributes),
        total: meta ? meta.total : 0,
      }
    } catch (err) {
      const isEmptyAddress = isAxiosError(err) && err.response?.status === 404
      if (isEmptyAddress) {
        return {
          transactions: [],
          total: 0,
        }
      }
      throw err
    }
  })

  return (
    <Content>
      <AddressContentPanel className="container">
        <AddressHashCard
          title={addressInfoQuery.data?.type === 'LockHash' ? i18n.t('address.lock_hash') : i18n.t('address.address')}
          hash={address}
          specialAddress={addressInfoQuery.data?.isSpecial ? addressInfoQuery.data.specialAddress : ''}
          showDASInfoOnHeader={addressInfoQuery.data?.addressHash ?? false}
        >
          <AddressTitleOverview address={addressInfoQuery.data ?? defaultAddressInfo} />
        </AddressHashCard>

        <QueryResult query={addressInfoQuery} delayLoading>
          {data => <AddressAssetComp address={data} />}
        </QueryResult>

        <QueryResult query={addressTransactionsQuery} delayLoading>
          {data => (
            <AddressTransactions
              currentPage={currentPage}
              pageSize={pageSize}
              address={address}
              transactions={data.transactions}
              transactionsTotal={data.total}
              addressInfo={addressInfoQuery.data ?? defaultAddressInfo}
            />
          )}
        </QueryResult>
      </AddressContentPanel>
    </Content>
  )
}

export default Address
