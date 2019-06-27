import React from 'react'
import { Link } from 'react-router-dom'
import InputOutputIcon from '../../assets/input_arrow_output.png'
import { parseDate } from '../../utils/date'
import { shannonToCkb, formattorConfirmation } from '../../utils/util'
import PaginationList from './PaginationList'
import {
  ConfirmationCapacityContainer,
  HashBlockContainer,
  InputOutputContainer,
  MainContainer,
  Separate,
} from './styled'
import TransactionCell from './Cell'
import { parseNumber } from '../../utils/number'

export const CELL_PAGE_SIZE = 10

const getCapacityChange = (transaction: { display_inputs: [any]; display_outputs: [any] }, address?: string) => {
  if (!transaction) return 0
  let capacity: number = 0
  transaction.display_inputs.forEach(element => {
    if (element.address_hash === address) {
      capacity -= parseNumber(element.capacity)
    }
  })
  transaction.display_outputs.forEach(element => {
    if (element.address_hash === address) {
      capacity += parseNumber(element.capacity)
    }
  })
  return capacity
}

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
            <PaginationList
              data={transaction.display_inputs}
              pageSize={CELL_PAGE_SIZE}
              render={item => <TransactionCell cell={item} address={address} key={item.id} />}
            />
          </div>
          <img src={InputOutputIcon} alt="input and output" />
          <div className="output">
            <PaginationList
              data={transaction.display_outputs}
              pageSize={CELL_PAGE_SIZE}
              render={item => <TransactionCell cell={item} address={address} key={item.id} />}
            />
            {address && <Separate marginTop="10px" marginBottom="20px" />}
            {address && (
              <ConfirmationCapacityContainer increased={changeInCapacity >= 0}>
                <div className="confirmation">{formattorConfirmation(confirmation)}</div>
                <div className="capacity">
                  {`${changeInCapacity >= 0 ? '+' : '-'} ${shannonToCkb(Math.abs(changeInCapacity))} CKB`}
                </div>
              </ConfirmationCapacityContainer>
            )}
          </div>
        </InputOutputContainer>
      </div>
    </MainContainer>
  )
}
