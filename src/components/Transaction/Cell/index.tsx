import React from 'react'
import { Link } from 'react-router-dom'
import { startEndEllipsis } from '../../../utils/string'
import { shannonToCkb } from '../../../utils/util'
import { CellHash, CellHashHighLight, Container } from './styled'
import { localeNumberString } from '../../../utils/number'

export default ({ cell, address }: { cell: any; address?: string }) => {
  const CellbaseAddress = () => {
    return address === cell.address_hash || cell.from_cellbase ? (
      <div className="cell">
        <CellHash>{cell.from_cellbase ? 'Cellbase' : startEndEllipsis(cell.address_hash)}</CellHash>
      </div>
    ) : (
      <Link className="link" to={`/address/${cell.address_hash}`}>
        <CellHashHighLight>{startEndEllipsis(cell.address_hash)}</CellHashHighLight>
      </Link>
    )
  }

  return (
    <Container>
      {cell.address_hash ? (
        <CellbaseAddress />
      ) : (
        <div className="cell">
          <CellHash>{cell.from_cellbase ? 'Cellbase' : 'Unable to decode address'}</CellHash>
        </div>
      )}
      {!cell.from_cellbase && (
        <div className="capacity">{`${localeNumberString(shannonToCkb(cell.capacity))} CKB`}</div>
      )}
    </Container>
  )
}
