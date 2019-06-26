import React from 'react'
import { Link } from 'react-router-dom'
import InputOutputIcon from '../../assets/input_arrow_output.png'
import { parseDate } from '../../utils/date'
import { shannonToCkb } from '../../utils/util'
import CellContainer from './CellList'
import {
  ConfirmationCapacityContainer,
  HashBlockContainer,
  InputOutputContainer,
  MainContainer,
  Separate,
} from './styled'
import { CELL_PAGE_SIZE } from './utils/const'
import { formattorConfirmation, getCapacityChange } from './utils/utils'
import { localeNumberString } from '../../utils/number'

export default ({
  transaction,
  address,
  isBlock = false,
  confirmation,
}: {
  transaction: any
  address?: string
  isBlock?: boolean
  confirmation?: number
}) => {
  const changeInCapacity = getCapacityChange(transaction, address)
  return (
    <MainContainer>
      <div>
        <HashBlockContainer>
          <Link to={`/transaction/${transaction.transaction_hash}`}>
            <code className="hash">{transaction.transaction_hash}</code>
          </Link>
          {!isBlock && (
            <div className="block">
              {`(Block ${transaction.block_number})  ${parseDate(transaction.block_timestamp)}`}
            </div>
          )}
        </HashBlockContainer>
        <Separate marginTop="30px" />
        <InputOutputContainer>
          <div className="input">
            <CellContainer cells={transaction.display_inputs} address={address} pageSize={CELL_PAGE_SIZE} />
          </div>
          <img src={InputOutputIcon} alt="input and output" />
          <div className="output">
            <CellContainer cells={transaction.display_outputs} address={address} pageSize={CELL_PAGE_SIZE} />
            {address && <Separate marginTop="10px" marginBottom="20px" />}
            {address && (
              <ConfirmationCapacityContainer increased={changeInCapacity >= 0}>
                <div className="confirmation">{formattorConfirmation(confirmation)}</div>
                <div className="capacity">
                  {`${changeInCapacity >= 0 ? '+' : '-'} ${localeNumberString(
                    shannonToCkb(Math.abs(changeInCapacity)),
                  )} CKB`}
                </div>
              </ConfirmationCapacityContainer>
            )}
          </div>
        </InputOutputContainer>
      </div>
    </MainContainer>
  )
}
