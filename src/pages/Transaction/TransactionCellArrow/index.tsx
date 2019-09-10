import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CellType } from '../../../utils/const'
import LeftArrow from '../../../assets/left_arrow.png'
import RightHighlightArrow from '../../../assets/right_green_arrow.png'
import RightNormalArrow from '../../../assets/right_grey_arrow.png'

const LeftArrowImage = styled.img`
  width: 16px;
  height: 12px;
  margin: 0 7px 0 0;

  @media (max-width: 700px) {
    margin: 4px 10px 0 0;
  }
`

const RightArrowImage = styled.img`
  width: 16px;
  height: 12px;
  margin: 5px 0 0 7px;

  @media (max-width: 700px) {
    margin: 5px 5px 0 7px;
  }
`

export default ({ cell, cellType }: { cell: State.Cell; cellType: CellType }) => {
  if (cellType === CellType.Input) {
    return cell.generatedTxHash ? (
      <Link to={`/transaction/${cell.generatedTxHash}`}>
        <LeftArrowImage className="transaction__cell_left_arrow" src={LeftArrow} alt="left arrow" />
      </Link>
    ) : null
  }
  return cell.status === 'dead' ? (
    <Link to={`/transaction/${cell.consumedTxHash}`}>
      <RightArrowImage className="transaction__cell_right_arrow" src={RightHighlightArrow} alt="right arrow" />
    </Link>
  ) : (
    <RightArrowImage className="transaction__cell_right_arrow" src={RightNormalArrow} alt="right arrow" />
  )
}
