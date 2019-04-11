import React, { useState, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import AppContext from '../../contexts/App'

import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import SimpleLabel from '../../components/Label'
import {
  TransactionDiv,
  TransactionOverviewLabel,
  PanelDiv,
  InputOutputTable,
  TransactionTitlePanel,
  TransactionCommonContent,
} from './styled'

import BlockHeightIcon from '../../asserts/block_height_green.png'
import TimestampIcon from '../../asserts/timestamp_green.png'
import TransactionIcon from '../../asserts/transaction_green.png'
import VersionIcon from '../../asserts/version.png'
import CopyGreenIcon from '../../asserts/copy_green.png'
import CopyIcon from '../../asserts/copy.png'
import { parseSimpleDate } from '../../utils/date'

import { TransactionData, Cell } from './mock'

const operationItems = ['Lock Script', 'Type Script', 'Data']

const RowData = ({
  type,
  data,
  whichToLoad = null,
  updateCellData,
}: {
  type: 'input' | 'output'
  data: any
  whichToLoad?: 'Lock Script' | 'Type Script' | 'Data' | null
  updateCellData: Function
}) => {
  const appContext = useContext(AppContext)

  return (
    <>
      <tr className="tr-brief">
        <td>{`#${data[`${type}_id`]}`}</td>
        <td>{data.address_hash}</td>
        <td>{data.capacity}</td>
        {operationItems.map((item: string) => {
          let className = 'td-operatable'
          if (data.open === item) {
            className += ' td-operatable-active '
          }
          return (
            <td key={item}>
              <div
                role="button"
                tabIndex={-1}
                className={className}
                onKeyPress={() => {}}
                onClick={() => {
                  const newData = {
                    ...data,
                  }
                  if (newData.open === item) {
                    newData.open = null
                  } else {
                    newData.open = item
                    newData[item] = Cell.data
                  }
                  updateCellData(type, data[`${type}_id`], newData)
                }}
              >
                {item}
              </div>
            </td>
          )
        })}
      </tr>
      {whichToLoad ? (
        <tr className="tr-detail">
          <td />
          <td colSpan={5}>
            <textarea
              id={`textarea-${type}${+'-'}${data[`${type}_id`]}`}
              defaultValue={JSON.stringify(Cell.data, null, 4)}
            />
            <div className="tr-detail-td-buttons">
              <div
                role="button"
                tabIndex={-1}
                className="td-operatable"
                onKeyPress={() => {}}
                onClick={() => {
                  // keep handle
                }}
              >
                {'Default'}
              </div>
              <div
                role="button"
                tabIndex={-1}
                className="td-operatable"
                onKeyPress={() => {}}
                onClick={() => {
                  // keep handle
                }}
              >
                {'UTF-8'}
              </div>
              <div
                role="button"
                tabIndex={-1}
                className="td-operatable"
                onKeyPress={() => {}}
                onClick={() => {
                  const textarea = document.getElementById(
                    `textarea-${type}${+'-'}${data[`${type}_id`]}`,
                  ) as HTMLTextAreaElement
                  textarea.select()
                  document.execCommand('copy')
                  appContext.toastMessage('copy success', 3000)
                }}
              >
                <div>Copy</div>
                <img src={CopyGreenIcon} alt="copy" />
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  )
}

const TransactionTitle = ({ hash, onClick }: { hash: string; onClick: any }) => {
  return (
    <TransactionTitlePanel>
      <div className="transaction__title">Transaction</div>
      <div className="transaction__content">
        <div id="transaction__hash">{hash}</div>
        <div role="button" tabIndex={-1} onKeyDown={() => {}} onClick={onClick}>
          <img src={CopyIcon} alt="copy" />
        </div>
      </div>
    </TransactionTitlePanel>
  )
}
export default (props: React.PropsWithoutRef<RouteComponentProps<{ hash: string }>>) => {
  const { match } = props
  const { params } = match
  const { hash } = params

  const appContext = useContext(AppContext)
  const [transaction, setTransaction] = useState(TransactionData.data)
  const updateCellData = (type: 'string', id: number, newData: any) => {
    setTransaction((state: any) => {
      const newState: any = {
        ...state,
      }
      newState[`display_${type}s`].forEach((item: any, i: number) => {
        if (item[`${type}_id`] === id) {
          newState[`display_${type}s`][i] = newData
        }
      })
      return newState
    })
  }
  return (
    <Page>
      <Header />
      <Content>
        <TransactionDiv className="container">
          <TransactionTitle
            hash={hash}
            onClick={() => {
              const transactionDiv = document.getElementById('transaction__hash')
              if (transactionDiv) {
                const div = document.createRange()
                div.setStartBefore(transactionDiv)
                div.setEndAfter(transactionDiv)
                window.getSelection().addRange(div)
                document.execCommand('copy')
                appContext.toastMessage('copy success', 3000)
              }
            }}
          />
          <TransactionOverviewLabel>Overview</TransactionOverviewLabel>
          <TransactionCommonContent>
            <div>
              <SimpleLabel image={BlockHeightIcon} label="Block Height:" value={transaction.block_number} />
              <SimpleLabel image={TransactionIcon} label="Transaction Fee:" value={transaction.transaction_fee} />
            </div>
            <span className="block__content__separate" />
            <div>
              <SimpleLabel
                image={TimestampIcon}
                label="Timestamp:"
                value={parseSimpleDate(transaction.block_timestamp)}
              />
              <SimpleLabel image={VersionIcon} label="Version:" value={parseSimpleDate(transaction.version)} />
            </div>
          </TransactionCommonContent>

          <PanelDiv
            style={{
              marginTop: 20,
              minHeight: 88,
              padding: '30px 50px',
            }}
          >
            <div>
              <InputOutputTable>
                <thead>
                  <tr>
                    <td colSpan={2}>Input</td>
                    <td>
                      <div>Capcity</div>
                    </td>
                    <td colSpan={3}>
                      <div>Detail</div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {TransactionData &&
                    transaction.display_inputs.map((input: any) => {
                      return (
                        <RowData
                          type="input"
                          key={input.input_id}
                          data={input}
                          whichToLoad={input.open || null}
                          updateCellData={updateCellData}
                        />
                      )
                    })}
                </tbody>
              </InputOutputTable>
            </div>
          </PanelDiv>

          <PanelDiv
            style={{
              marginTop: 10,
              minHeight: 88,
              padding: '30px 50px',
            }}
          >
            <div>
              <InputOutputTable>
                <thead>
                  <tr>
                    <td colSpan={2}>Output</td>
                    <td>
                      <div>Capcity</div>
                    </td>
                    <td colSpan={3}>
                      <div>Detail</div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {TransactionData &&
                    transaction.display_outputs.map((ouput: any) => {
                      return (
                        <RowData
                          type="output"
                          key={ouput.output_id}
                          data={ouput}
                          whichToLoad={ouput.open || null}
                          updateCellData={updateCellData}
                        />
                      )
                    })}
                </tbody>
              </InputOutputTable>
            </div>
          </PanelDiv>
        </TransactionDiv>
      </Content>
      <Footer />
    </Page>
  )
}
