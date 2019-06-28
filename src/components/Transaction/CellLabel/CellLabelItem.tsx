import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { InputOutput } from '../../../http/response/Transaction'
import { startEndEllipsis } from '../../../utils/string'
import { shannonToCkb } from '../../../utils/util'
import TooltipCellbaseImage from '../../../assets/tooltip_cellbase.png'
import HelpIcon from '../../../assets/qa_help.png'

export const TransactionCellItem = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
  justify-content: space-between;

  .transaction__cell {
    display: flex;
    align-items: center;
    justify-content: left;
    color: rgb(136, 136, 136);
  }

  .transaction__cell__capacity {
    font-size: 16px;
    color: rgb(136, 136, 136);
    margin-left: 15px;
  }
`

const CellHash = styled.code`
  font-size: 16px;
  color: rgb(136, 136, 136)};
`

export const CellHashHighLight = styled(CellHash)`
  font-size: 16px;
  color: rgb(75, 188, 142);
`

export const CellbasePanel = styled.div`
  display: flex;

  .cellbase__content {
    color: #888888;
    font-size: 16px;
    margin-right: 10px;
  }

  .cellbase__help {
    margin-left: 10px;

    > img {
      width: 20px;
      height: 20px;
    }

    &:hover .cellbase__help__content {
      visibility: visible;
    }

    .cellbase__help__content {
      width: 300px;
      height: 150px;
      position: absolute;
      margin-left: -78px;
      padding: 28px 20px 17px 20px;
      white-space: pre-wrap;
      z-index: 1;
      color: white;
      font-weight: 450;
      visibility: hidden;
      font-size: 13px;
      background-image: url(${TooltipCellbaseImage});
      background-repeat: no-repeat;
      background-size: 300px 150px;
    }
  }
`

const Cellbase = ({ blockHeight }: { blockHeight?: number }) => {
  return blockHeight && blockHeight > 0 ? (
    <CellbasePanel>
      <div className="cellbase__content">Cellbase for Block</div>
      <Link to={`/block/${blockHeight}`}>
        <CellHashHighLight>{blockHeight}</CellHashHighLight>
      </Link>
      <div className="cellbase__help">
        <img alt="cellbase help" src={HelpIcon} />
        <div className="cellbase__help__content">
          The cellbase transaction of block N is send to the miner of block N-11 as reward. The reward is consist of
          Base Reward, Commit Reward and Proposal Reward, learn more from our Consensus Protocol
        </div>
      </div>
    </CellbasePanel>
  ) : (
    <span>Cellbase</span>
  )
}

const CellLabelItem = ({
  cell,
  blockNumber,
  address,
}: {
  cell: InputOutput
  blockNumber?: number
  address?: string
}) => {
  const CellbaseAddress = () => {
    return address === cell.address_hash || cell.from_cellbase ? (
      <div className="transaction__cell">
        <CellHash>
          {cell.address_hash ? startEndEllipsis(cell.address_hash) : <Cellbase blockHeight={blockNumber} />}
        </CellHash>
      </div>
    ) : (
      <Link className="transaction__cell__link" to={`/address/${cell.address_hash}`}>
        <CellHashHighLight>{startEndEllipsis(cell.address_hash)}</CellHashHighLight>
      </Link>
    )
  }

  return (
    <TransactionCellItem>
      {cell.address_hash ? (
        <CellbaseAddress />
      ) : (
        <div className="transaction__cell">
          <CellHash>
            {cell.from_cellbase && blockNumber ? <Cellbase blockHeight={blockNumber} /> : 'Unable to decode address'}
          </CellHash>
        </div>
      )}
      {!cell.from_cellbase && <div className="transaction__cell__capacity">{`${shannonToCkb(cell.capacity)} CKB`}</div>}
    </TransactionCellItem>
  )
}

export default CellLabelItem
