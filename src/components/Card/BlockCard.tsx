import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import i18n from '../../utils/i18n'
import { startEndEllipsis } from '../../utils/string'
import { parseSimpleDate } from '../../utils/date'
import { shannonToCkb } from '../../utils/util'
import { localeNumberString } from '../../utils/number'

const CardPanel = styled.div`
  width: 100%;
  height: 273px;
  background-color: white;
  padding: 0px 20px 20px 20px;
  border: 0px solid white;
  border-radius: 3px;
  box-shadow: 1px 1px 3px 0 #dfdfdf;
  display: flex;
  margin-bottom: 5px;
  flex-direction: column;
`

const CardItemPanel = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  margin: 10px 0px 8px 0px;

  > div {
    color: #000000;
    font-size: 13px;
    font-weight: 500;
  }

  .card__value__link {
    height: 16px;
    font-family: Menlo;
  }

  .card__value {
    color: ${(props: { highLight: boolean; name: string }) => (props.highLight ? '#3CC68A' : '#000000')};
    font-size: 13px;
  }

  ::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    top: 125%;
    background-color: ${(props: { highLight: boolean; name: string }) =>
      props.name === i18n.t('home.time') ? '#ffffff' : '#f7f7f7'};
    transform: ${() => `scaleY(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};
  }
`

const CardItem = ({
  name,
  value,
  to,
  highLight = false,
}: {
  name: string
  value: string
  to?: string
  highLight?: boolean
}) => {
  return (
    <CardItemPanel highLight={highLight} name={name}>
      <div>{name}</div>
      {to ? (
        <Link to={to} className="card__value__link">
          <div className="card__value">{value}</div>
        </Link>
      ) : (
        <div className="card__value">{value}</div>
      )}
    </CardItemPanel>
  )
}

const BlockCard = ({ block }: { block: State.Block }) => {
  return (
    <CardPanel>
      <CardItem
        name={`${i18n.t('home.height')}`}
        value={localeNumberString(block.number)}
        to={`/block/${block.number}`}
        highLight
      />
      <CardItem name={`${i18n.t('home.transactions')}`} value={localeNumberString(block.transactions_count)} />
      <CardItem name={`${i18n.t('home.block_reward')}`} value={localeNumberString(shannonToCkb(block.reward))} />
      {block.miner_hash ? (
        <CardItem
          name={`${i18n.t('block.miner')}`}
          value={startEndEllipsis(block.miner_hash, 13)}
          to={`/address/${block.miner_hash}`}
          highLight
        />
      ) : (
        <CardItem name={`${i18n.t('block.miner')}`} value={i18n.t('address.unable_decode_address')} />
      )}
      <CardItem name={`${i18n.t('home.time')}`} value={parseSimpleDate(block.timestamp)} />
    </CardPanel>
  )
}

export default BlockCard
