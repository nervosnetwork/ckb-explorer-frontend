import React from 'react'
import { Link } from 'react-router-dom'
import InputOutputIcon from '../../assets/input_arrow_output.png'
import { parseDate } from '../../utils/date'
import PaginationList from './PaginationList'
import { HashBlockContainer, InputOutputContainer, MainContainer, Separate } from './styled'
import TransactionCell from './TransactionCell'
import ConfirmationCapacityContainer from './ConfirmationCapacity'
import { getCapacityChange } from '../../utils/util'

const CELL_PAGE_SIZE = 10

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
              <ConfirmationCapacityContainer
                confirmation={confirmation}
                capacity={getCapacityChange(transaction, address)}
              />
            )}
          </div>
        </InputOutputContainer>
      </div>
    </MainContainer>
  )
}

export { ConfirmationCapacityContainer, PaginationList }
