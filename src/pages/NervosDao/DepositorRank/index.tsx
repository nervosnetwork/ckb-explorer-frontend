import { Tooltip } from 'antd'
import { useAppState } from '../../../contexts/providers'
import { localeNumberString } from '../../../utils/number'
import { deprecatedAddrToNewAddr, shannonToCkb } from '../../../utils/util'
import i18n from '../../../utils/i18n'
import { isMobile } from '../../../utils/screen'
import DecimalCapacity from '../../../components/DecimalCapacity'
import { adaptPCEllipsis, handleBigNumber, adaptMobileEllipsis } from '../../../utils/string'
import CopyTooltipText from '../../../components/Text/CopyTooltipText'
import {
  AddressPanel,
  DepositorRankCardPanel,
  DepositorRankPanel,
  DepositorRankTitle,
  DepositorSeparate,
  DepositorRankItem,
} from './styled'
import ItemCard from '../../../components/Card/ItemCard'

const AddressText = ({ address }: { address: string }) => {
  const addressText = adaptPCEllipsis(address, 10, 40)
  if (addressText.includes('...')) {
    return (
      <Tooltip placement="top" title={<CopyTooltipText content={address} />}>
        <AddressPanel to={`/address/${address}`} className="monospace">
          {addressText}
        </AddressPanel>
      </Tooltip>
    )
  }
  return (
    <AddressPanel to={`/address/${address}`} className="monospace">
      {addressText}
    </AddressPanel>
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
      content: <AddressText address={depositor.addressHash} />,
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
    app: { hasFinishedHardFork },
  } = useAppState()

  const depositorList = !hasFinishedHardFork
    ? depositors.map(d => ({
        ...d,
        addressHash: deprecatedAddrToNewAddr(d.addressHash),
      }))
    : depositors

  return isMobile() ? (
    <DepositorRankCardPanel>
      {depositorList
        .map(depositor => ({
          ...depositor,
          addressHash: adaptMobileEllipsis(depositor.addressHash, 8),
        }))
        .map((depositor: State.NervosDaoDepositor, index: number) => (
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
      {depositorList.map((depositor: State.NervosDaoDepositor, index: number) => (
        <DepositorRankItem key={depositor.addressHash}>
          <div>{index + 1}</div>
          <AddressText address={depositor.addressHash} />
          <div>
            <DecimalCapacity value={localeNumberString(shannonToCkb(depositor.daoDeposit))} />
          </div>
          <div>{handleBigNumber(depositor.averageDepositTime, 1)}</div>
        </DepositorRankItem>
      ))}
    </DepositorRankPanel>
  )
}
