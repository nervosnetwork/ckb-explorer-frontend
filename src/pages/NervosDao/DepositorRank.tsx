import React, { useContext } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { AppContext } from '../../contexts/providers'
import { localeNumberString } from '../../utils/number'
import { shannonToCkb } from '../../utils/util'
import i18n from '../../utils/i18n'
import { isMobile } from '../../utils/screen'
import OverviewCard from '../../components/Card/OverviewCard'

const DepositorRankPanel = styled.div`
  width: 1200px;
  background: white;
  padding: 20px 40px;
`

const DepositorRankCardPanel = styled.div`
  width: 100%;
`

const DepositorRankTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  height: 40px;

  div {
    text-align: center;
  }

  div: nth-child(1) {
    width: 20%;
  }
  div: nth-child(2) {
    width: 60%;
  }
  div: nth-child(3) {
    width: 20%;
  }
`

const DepositorSeparate = styled.div`
  background: #e2e2e2;
  height: 1px;
  width: 100%;
  margin-bottom: 10px;
`

const DepositorRankItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  height: 40px;

  div {
    text-align: center;
    width: 20%;
  }
`
const AddressPanel = styled(Link)`
  color: ${props => props.theme.primary};
  width: 60%;
  text-align: center;
`

const AddressText = ({ address }: { address: string }) => {
  return (
    <AddressPanel to={`/address/${address}`}>
      <span className="address">{address}</span>
    </AddressPanel>
  )
}

export default () => {
  const { nervosDaoState } = useContext(AppContext)
  const { depositors = [] } = nervosDaoState

  const depositRanks = (depositor: State.NervosDaoDepositor) => {
    return [
      {
        title: i18n.t('nervos_dao.dao_title_rank'),
        content: depositors.indexOf(depositor) + 1,
      },
      {
        title: i18n.t('nervos_dao.dao_title_address'),
        content: <AddressText address={depositor.addressHash} />,
      },
      {
        title: i18n.t('nervos_dao.dao_title_deposit_capacity'),
        content: `${localeNumberString(shannonToCkb(depositor.daoDeposit))} CKB`,
      },
    ]
  }

  return isMobile() ? (
    <DepositorRankCardPanel>
      {depositors.map((depositor: State.NervosDaoDepositor) => {
        return <OverviewCard key={depositors.indexOf(depositor)} items={depositRanks(depositor)} />
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
          <DepositorRankItem>
            <div>{index + 1}</div>
            <AddressText address={depositor.addressHash} />
            <div>{`${localeNumberString(shannonToCkb(depositor.daoDeposit))} CKB`}</div>
          </DepositorRankItem>
        )
      })}
    </DepositorRankPanel>
  )
}
