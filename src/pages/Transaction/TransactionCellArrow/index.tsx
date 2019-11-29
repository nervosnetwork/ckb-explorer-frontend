import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CellType } from '../../../utils/const'
import RightHighlightArrow from '../../../assets/right_green_arrow.png'
import RightHighlightBlueArrow from '../../../assets/right_blue_arrow.png'
import RightNormalArrow from '../../../assets/right_grey_arrow.png'
import { isMainnet } from '../../../utils/chain'

const LeftArrowImage = styled.img`
  width: 16px;
  height: 12px;
  margin: 0px 7px 0 0;

  @media (max-width: 700px) {
    margin: ${({ marginTop }: { marginTop: boolean }) => (marginTop ? '0px 10px 0 0' : '0px 10px 0 0')};
  }
`

const RightArrowImage = styled.img`
  width: 16px;
  height: 12px;
  margin: 0px 0 0 7px;

  @media (max-width: 700px) {
    margin: ${({ marginTop }: { marginTop: boolean }) => (marginTop ? '0px 5px 0 7px' : '0px 5px 0 7px')};
  }
`

export default ({
  cell,
  cellType,
  haveMarginTop,
}: {
  cell: State.Cell
  cellType: CellType
  haveMarginTop?: boolean
}) => {
  if (cellType === CellType.Input) {
    return cell.generatedTxHash ? (
      <Link to={`/transaction/${cell.generatedTxHash}`}>
        <LeftArrowImage
          className="transaction__cell_left_arrow"
          src={isMainnet() ? RightHighlightArrow : RightHighlightBlueArrow}
          alt="left arrow"
          marginTop={!!haveMarginTop}
        />
      </Link>
    ) : null
  }
  return cell.status === 'dead' ? (
    <Link to={`/transaction/${cell.consumedTxHash}`}>
      <RightArrowImage
        className="transaction__cell_right_arrow"
        src={isMainnet() ? RightHighlightArrow : RightHighlightBlueArrow}
        alt="right arrow"
        marginTop={!!haveMarginTop}
      />
    </Link>
  ) : (
    <RightArrowImage
      className="transaction__cell_right_arrow"
      src={RightNormalArrow}
      alt="right arrow"
      marginTop={!!haveMarginTop}
    />
  )
}
