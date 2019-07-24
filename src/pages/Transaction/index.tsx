import React, { useContext, useEffect } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import { AppContext } from '../../contexts/providers/index'

import Content from '../../components/Content'
import SimpleLabel from '../../components/Label'
import i18n from '../../utils/i18n'
import {
  TransactionDiv,
  TransactionOverviewLabel,
  InputPanelDiv,
  OutputPanelDiv,
  InputOutputTable,
  TransactionTitlePanel,
  TransactionCommonContent,
} from './styled'

import BlockHeightIcon from '../../assets/block_height_green.png'
import TimestampIcon from '../../assets/timestamp_green.png'
import TransactionIcon from '../../assets/transaction_fee.png'
import CopyIcon from '../../assets/copy.png'
import StatusIcon from '../../assets/transcation_status.png'
import { parseSimpleDate } from '../../utils/date'

import { copyElementValue, formatConfirmation, shannonToCkb } from '../../utils/util'
import CellCard from '../../components/Card/CellCard'
import ScriptComponent from './Script'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { StateWithDispatch, AppDispatch, AppActions } from '../../contexts/providers/reducer'
import { CellType } from '../../utils/const'
import { getTransactionByHash } from '../../service/app/transaction'

const TransactionTitle = ({ hash, dispatch }: { hash: string; dispatch: AppDispatch }) => {
  return (
    <TransactionTitlePanel>
      <div className="transaction__title">{i18n.t('transaction.transaction')}</div>
      <div className="transaction__content">
        <code id="transaction__hash">{hash}</code>
        <div
          role="button"
          tabIndex={-1}
          onKeyDown={() => {}}
          onClick={() => {
            copyElementValue(document.getElementById('transaction__hash'))
            dispatch({
              type: AppActions.ShowToastMessage,
              payload: {
                text: i18n.t('common.copied'),
                timeout: 3000,
              },
            })
          }}
        >
          <img src={CopyIcon} alt="copy" />
        </div>
      </div>
    </TransactionTitlePanel>
  )
}

const InputOutputTableTitle = ({ transactionType, isCellbase }: { transactionType: string; isCellbase?: boolean }) => {
  return (
    <thead>
      <tr>
        <td colSpan={1}>{transactionType}</td>
        {!isCellbase ? (
          <td>
            <div>Capacity</div>
          </td>
        ) : (
          <td>
            <div />
          </td>
        )}
        <td colSpan={3}>
          <div>{i18n.t('common.detail')}</div>
        </td>
      </tr>
    </thead>
  )
}

export default ({
  dispatch,
  history: { replace },
  match: { params },
}: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps<{ hash: string }>>) => {
  const { hash } = params
  const { transaction, tipBlockNumber } = useContext(AppContext)

  let confirmation = 0
  if (tipBlockNumber && transaction.block_number) {
    confirmation = tipBlockNumber - transaction.block_number + 1
  }

  useEffect(() => {
    getTransactionByHash(hash, replace, dispatch)
  }, [hash, replace, dispatch])

  return (
    <Content>
      <TransactionDiv className="container">
        <TransactionTitle hash={hash} dispatch={dispatch} />
        <TransactionOverviewLabel>{i18n.t('common.overview')}</TransactionOverviewLabel>
        <TransactionCommonContent>
          <div>
            <div>
              <Link
                to={{
                  pathname: `/block/${transaction.block_number}`,
                }}
              >
                <SimpleLabel
                  image={BlockHeightIcon}
                  label={`${i18n.t('block.block_height')}:`}
                  value={localeNumberString(transaction.block_number)}
                  highLight
                />
              </Link>
              <SimpleLabel
                image={TransactionIcon}
                label={`${i18n.t('transaction.transaction_fee')}:`}
                value={`${shannonToCkb(transaction.transaction_fee)} CKB`}
              />
            </div>
            <div>
              <div />
              <div>
                <SimpleLabel
                  image={TimestampIcon}
                  label={`${i18n.t('block.timestamp')}:`}
                  value={parseSimpleDate(transaction.block_timestamp)}
                />
                {confirmation > 0 && (
                  <SimpleLabel
                    image={StatusIcon}
                    label={`${i18n.t('transaction.status')}:`}
                    value={formatConfirmation(confirmation)}
                  />
                )}
              </div>
            </div>
          </div>
        </TransactionCommonContent>

        {isMobile() ? (
          <div>
            {transaction &&
              transaction.display_inputs &&
              transaction.display_inputs.map((input: State.InputOutput, index: number) => {
                const key = index
                return <CellCard type={CellType.Input} cell={input} dispatch={dispatch} key={key} />
              })}
            {transaction &&
              transaction.display_outputs &&
              transaction.display_outputs.map((output: State.InputOutput, index: number) => {
                const key = index
                return <CellCard type={CellType.Output} cell={output} dispatch={dispatch} key={key} />
              })}
          </div>
        ) : (
          <div>
            <InputPanelDiv>
              <InputOutputTable>
                {
                  <InputOutputTableTitle
                    transactionType={i18n.t('transaction.input')}
                    isCellbase={
                      transaction.display_inputs &&
                      transaction.display_inputs[0] &&
                      transaction.display_inputs[0].from_cellbase
                    }
                  />
                }
                <tbody>
                  {transaction &&
                    transaction.display_inputs &&
                    transaction.display_inputs.map((input: State.InputOutput) => {
                      return (
                        input && (
                          <ScriptComponent
                            cellType={CellType.Input}
                            key={input.id}
                            cell={input}
                            appDispatch={dispatch}
                          />
                        )
                      )
                    })}
                </tbody>
              </InputOutputTable>
            </InputPanelDiv>

            <OutputPanelDiv>
              <InputOutputTable>
                <InputOutputTableTitle transactionType={i18n.t('transaction.output')} />
                <tbody>
                  {transaction &&
                    transaction.display_outputs &&
                    transaction.display_outputs.map((output: State.InputOutput) => {
                      return (
                        output && (
                          <ScriptComponent
                            cellType={CellType.Output}
                            key={output.id}
                            cell={output}
                            appDispatch={dispatch}
                          />
                        )
                      )
                    })}
                </tbody>
              </InputOutputTable>
            </OutputPanelDiv>
          </div>
        )}
      </TransactionDiv>
    </Content>
  )
}
