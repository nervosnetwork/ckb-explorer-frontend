import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { InputOutput } from '../../http/response/Transaction'
import { startEndEllipsis } from '../../utils/string'
import { shannonToCkb } from '../../utils/util'

const CardPanel = styled.div`
  width: 88%;
  background-color: white;
  padding: 20px;
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
  margin-top: 10px;

  .card__name {
    color: #888888;
    font-size: 15px;
    margin-right: 8px;
  }

  .card__value {
    color: ${(props: { highLight: boolean }) => (props.highLight ? '#3CC68A' : '#888888')};
    font-size: 14px;
  }

  @media (max-width: 320px) {
    .card__name {
      font-size: 13px;
    }

    .card__value {
      font-size: 12px;
    }
  }
`

enum CellType {
  Input,
  Output,
}

const CardLabelItem = ({
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
      <div className="card__name">{name}</div>
      {to ? (
        <Link to={to}>
          <code className="card__value">{value}</code>
        </Link>
      ) : (
        <div className="card__value">{value}</div>
      )}
    </CardItemPanel>
  )
}

const CellAddressCapacityItem = ({ type, cell }: { type: CellType; cell: InputOutput }) => {
  const name = type === CellType.Input ? 'Input' : 'Output'

  if (cell.from_cellbase) {
    return <CardLabelItem name={name} value="Cellbase" />
  }
  if (cell.address_hash) {
    return (
      <div key={cell.id}>
        <CardLabelItem
          name="Input"
          value={`${startEndEllipsis(cell.address_hash, 16)}`}
          to={`/address/${cell.address_hash}`}
          highLight
        />
        <CardLabelItem name="Capacity" value={`${shannonToCkb(cell.capacity)}`} />
      </div>
    )
  }
  return (
    <div key={cell.id}>
      <CardLabelItem name={name} value="Unable to decode address" />
      <CardLabelItem name="Capacity" value={`${shannonToCkb(cell.capacity)}`} />
    </div>
  )
}

const CellCard = ({ type, cell }: { type: CellType; cell: InputOutput }) => {
  return (
    <CardPanel>
      <CellAddressCapacityItem type={type} cell={cell} />
    </CardPanel>
  )
}

export default CellCard
