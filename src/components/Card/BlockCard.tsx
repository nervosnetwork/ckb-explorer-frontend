import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import i18n from '../../utils/i18n'
import { startEndEllipsis } from '../../utils/string'
import { parseSimpleDate } from '../../utils/date'
import { shannonToCkb } from '../../utils/util'
import { localeNumberString } from '../../utils/number'

const CardPanel = styled.div`
  width: 88%;
  height: 273px;
  background-color: white;
  padding: 0px 20px 20px 20px;
  border: 0px solid white;
  border-radius: 3px;
  box-shadow: 2px 2px 6px #eaeaea;
  display: flex;
  margin-bottom: 10px;
  margin-left: 6%;
  flex-direction: column;
`

const CardItemPanel = styled.div`
  display: flex;
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
    color: ${(props: { highLight: boolean }) => (props.highLight ? '#3CC68A' : '#888888')};
    font-weight: bold;
    font-size: 13px;
  }

  @media (max-width: 320px) {
    > div {
      font-size: 13px;
    }

    .card__value {
      font-size: 12px;
    }
  }
`

const BlockLine = styled.div`
  position: relative;
  width: 95%;
  height: 1px;
  left: 0px;
  top: 10px;
  border-radius: 3px;
  background-color: #f7f7f7;
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
    <CardItemPanel highLight={highLight}>
      <div>{name}</div>
      {to ? (
        <Link to={to} className="card__value__link">
          <div className="card__value">{value}</div>
        </Link>
      ) : (
        <div className="card__value">{value}</div>
      )}
      <BlockLine hidden={name === i18n.t('home.time')} />
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
