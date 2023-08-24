import { FC } from 'react'
import { localeNumberString } from '../../../utils/number'
import { shannonToCkb } from '../../../utils/util'
import i18n from '../../../utils/i18n'
import DecimalCapacity from '../../../components/DecimalCapacity'
import { handleBigNumber } from '../../../utils/string'
import {
  DepositorRankCardPanel,
  DepositorRankPanel,
  DepositorRankTitle,
  DepositorSeparate,
  DepositorRankItem,
} from './styled'
import { ItemCardData, ItemCardGroup } from '../../../components/Card/ItemCard'
import AddressText from '../../../components/AddressText'
import styles from './index.module.scss'
import { useIsMobile } from '../../../utils/hook'

const AddressTextCol = ({ address }: { address: string }) => {
  return (
    <AddressText
      linkProps={{
        className: styles.addressTextCol,
        to: `/address/${address}`,
      }}
    >
      {address}
    </AddressText>
  )
}

const DepositorCardGroup: FC<{ depositors: (State.NervosDaoDepositor & { rank: number })[] }> = ({ depositors }) => {
  const items: ItemCardData<State.NervosDaoDepositor & { rank: number }>[] = [
    {
      title: i18n.t('nervos_dao.dao_title_rank'),
      render: depositor => depositor.rank,
    },
    {
      title: i18n.t('nervos_dao.dao_title_address'),
      render: depositor => <AddressTextCol address={depositor.addressHash} />,
    },
    {
      title: i18n.t('nervos_dao.dao_title_deposit_capacity'),
      render: depositor => <DecimalCapacity value={localeNumberString(shannonToCkb(depositor.daoDeposit))} />,
    },
    {
      title: i18n.t('nervos_dao.dao_title_deposit_time'),
      render: depositor => handleBigNumber(depositor.averageDepositTime, 1),
    },
  ]

  return <ItemCardGroup items={items} dataSource={depositors} getDataKey={(_, idx) => idx} />
}

export default ({ depositors, filter }: { depositors: State.NervosDaoDepositor[]; filter?: string }) => {
  const rankedDepositors = depositors.map((depositor, index) => ({
    ...depositor,
    rank: index + 1,
  }))

  const filteredDepositors = filter ? rankedDepositors.filter(d => d.addressHash === filter) : rankedDepositors

  return useIsMobile() ? (
    <DepositorRankCardPanel>
      <DepositorCardGroup depositors={filteredDepositors} />
    </DepositorRankCardPanel>
  ) : (
    <DepositorRankPanel>
      <DepositorRankTitle>
        <div>{i18n.t('nervos_dao.dao_title_rank')}</div>
        <div>{i18n.t('nervos_dao.dao_title_address')}</div>
        <div>{i18n.t('nervos_dao.dao_title_deposit_capacity')}</div>
        <div>{i18n.t('nervos_dao.dao_title_deposit_time')}</div>
      </DepositorRankTitle>
      <DepositorSeparate />
      {filteredDepositors.map(depositor => (
        <DepositorRankItem key={depositor.addressHash}>
          <div>{depositor.rank}</div>
          <AddressTextCol address={depositor.addressHash} />
          <div>
            <DecimalCapacity value={localeNumberString(shannonToCkb(depositor.daoDeposit))} />
          </div>
          <div>{handleBigNumber(depositor.averageDepositTime, 1)}</div>
        </DepositorRankItem>
      ))}
    </DepositorRankPanel>
  )
}
