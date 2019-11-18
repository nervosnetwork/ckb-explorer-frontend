import React, { useContext } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { AppContext } from '../../contexts/providers'
import { localeNumberString } from '../../utils/number'
import { shannonToCkb } from '../../utils/util'
import i18n from '../../utils/i18n'
import { isMobile } from '../../utils/screen'
import OverviewCard from '../../components/Card/OverviewCard'
import DecimalCapacity from '../../components/DecimalCapacity'
import { adaptPCEllipsis } from '../../utils/string'

const DepositorRankPanel = styled.div`
  width: 100%;
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

  > div {
    text-align: center;
  }

  >div: nth-child(1) {
    width: 10%;
  }
  >div: nth-child(2) {
    width: 65%;
  }
  >div: nth-child(3) {
    width: 25%;
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

  @media (max-width: 1000px) {
    font-size: 14px;
  }

  > div {
    text-align: center;
  }

  >div: nth-child(1) {
    width: 10%;
  }
  >div: nth-child(2) {
    width: 65%;
  }
  >div: nth-child(3) {
    width: 25%;
  }
`
const AddressPanel = styled(Link)`
  color: ${props => props.theme.primary};
  width: 60%;
  text-align: center;

  @media (max-width: 700px) {
    width: 100%;
    text-align: start;
  }

  :hover {
    color: ${props => props.theme.primary};
  }
`

const AddressText = ({ address }: { address: string }) => {
  return (
    <AddressPanel to={`/address/${address}`}>
      <span className="address">{address}</span>
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
      content: daoDeposit.includes('.') ? (
        <DecimalCapacity value={daoDeposit} />
      ) : (
        `${daoDeposit} ${i18n.t('common.ckb_unit')}`
      ),
    },
  ]
}

export default () => {
  const { nervosDaoState } = useContext(AppContext)
  const { depositors = [] } = nervosDaoState

  return isMobile() ? (
    <DepositorRankCardPanel>
      {depositors.map((depositor: State.NervosDaoDepositor, index: number) => {
        return <OverviewCard key={depositors.indexOf(depositor)} items={depositRanks(depositor, index)} />
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
            <AddressText address={adaptPCEllipsis(depositor.addressHash, 10, 40)} />
            <div>
              <DecimalCapacity value={localeNumberString(shannonToCkb(depositor.daoDeposit))} />
            </div>
          </DepositorRankItem>
        )
      })}
    </DepositorRankPanel>
  )
}
