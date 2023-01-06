import { useAppState } from '../../../contexts/providers'
import { localeNumberString } from '../../../utils/number'
import { shannonToCkb } from '../../../utils/util'
import i18n from '../../../utils/i18n'
import { isMobile } from '../../../utils/screen'
import DecimalCapacity from '../../../components/DecimalCapacity'
import { handleBigNumber } from '../../../utils/string'
import {
  DepositorRankCardPanel,
  DepositorRankPanel,
  DepositorRankTitle,
  DepositorSeparate,
  DepositorRankItem,
} from './styled'
import ItemCard from '../../../components/Card/ItemCard'
import AddressText from '../../../components/AddressText'
import styles from './index.module.scss'

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

const depositRanks = (depositor: State.NervosDaoDepositor, index: number) => {
  const daoDeposit = localeNumberString(shannonToCkb(depositor.daoDeposit))
  return [
    {
      title: i18n.t('nervos_dao.dao_title_rank'),
      content: index + 1,
    },
    {
      title: i18n.t('nervos_dao.dao_title_address'),
      content: <AddressTextCol address={depositor.addressHash} />,
    },
    {
      title: i18n.t('nervos_dao.dao_title_deposit_capacity'),
      content: <DecimalCapacity value={daoDeposit} />,
    },
    {
      title: i18n.t('nervos_dao.dao_title_deposit_time'),
      content: handleBigNumber(depositor.averageDepositTime, 1),
    },
  ]
}

export default () => {
  const {
    nervosDaoState: { depositors = [] },
  } = useAppState()

  return isMobile() ? (
    <DepositorRankCardPanel>
      {depositors.map((depositor: State.NervosDaoDepositor, index: number) => (
        <ItemCard key={depositors.indexOf(depositor)} items={depositRanks(depositor, index)} />
      ))}
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
      {depositors.map((depositor: State.NervosDaoDepositor, index: number) => (
        <DepositorRankItem key={depositor.addressHash}>
          <div>{index + 1}</div>
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
