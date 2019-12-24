import React, { useContext } from 'react'
import { Tooltip } from 'antd'
import { AppContext } from '../../contexts/providers'
import { localeNumberString } from '../../utils/number'
import { shannonToCkb } from '../../utils/util'
import i18n from '../../utils/i18n'
import { isMobile } from '../../utils/screen'
import OverviewCard from '../../components/Card/OverviewCard'
import DecimalCapacity from '../../components/DecimalCapacity'
import { adaptPCEllipsis } from '../../utils/string'
import CopyTooltipText from '../../components/Tooltip/CopyTooltipText'
import { AppDispatch } from '../../contexts/providers/reducer'
import {
  AddressPanel,
  DepositorRankCardPanel,
  DepositorRankPanel,
  DepositorRankTitle,
  DepositorSeparate,
  DepositorRankItem,
} from './styled'

const AddressText = ({ address, dispatch }: { address: string; dispatch: AppDispatch }) => {
  const addressText = adaptPCEllipsis(address, 10, 40)
  if (addressText.includes('...')) {
    return (
      <Tooltip placement="top" title={<CopyTooltipText content={address} dispatch={dispatch} />}>
        <AddressPanel to={`/address/${address}`}>
          <span className="address">{addressText}</span>
        </AddressPanel>
      </Tooltip>
    )
  }
  return (
    <AddressPanel to={`/address/${address}`}>
      <span className="address">{addressText}</span>
    </AddressPanel>
  )
}

const depositRanks = (depositor: State.NervosDaoDepositor, index: number, dispatch: AppDispatch) => {
  const daoDeposit = localeNumberString(shannonToCkb(depositor.daoDeposit))
  return [
    {
      title: i18n.t('nervos_dao.dao_title_rank'),
      content: index + 1,
    },
    {
      title: i18n.t('nervos_dao.dao_title_address'),
      content: <AddressText address={depositor.addressHash} dispatch={dispatch} />,
    },
    {
      title: i18n.t('nervos_dao.dao_title_deposit_capacity'),
      content: <DecimalCapacity value={daoDeposit} />,
    },
  ]
}

export default ({ dispatch }: { dispatch: AppDispatch }) => {
  const { nervosDaoState } = useContext(AppContext)
  const { depositors = [] } = nervosDaoState

  return isMobile() ? (
    <DepositorRankCardPanel>
      {depositors.map((depositor: State.NervosDaoDepositor, index: number) => {
        return <OverviewCard key={depositors.indexOf(depositor)} items={depositRanks(depositor, index, dispatch)} />
      })}
    </DepositorRankCardPanel>
  ) : (
    <DepositorRankPanel>
      <DepositorRankTitle>
        <div>{i18n.t('nervos_dao.dao_title_rank')}</div>
        <div>{i18n.t('nervos_dao.dao_title_address')}</div>
        <div>{i18n.t('nervos_dao.dao_title_deposit_capacity')}</div>
      </DepositorRankTitle>
      <DepositorSeparate />
      {depositors.map((depositor: State.NervosDaoDepositor, index: number) => {
        return (
          <DepositorRankItem key={depositor.addressHash}>
            <div>{index + 1}</div>
            <AddressText address={depositor.addressHash} dispatch={dispatch} />
            <div>
              <DecimalCapacity value={localeNumberString(shannonToCkb(depositor.daoDeposit))} />
            </div>
          </DepositorRankItem>
        )
      })}
    </DepositorRankPanel>
  )
}
