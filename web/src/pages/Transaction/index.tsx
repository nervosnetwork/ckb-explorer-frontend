import React, { useState, useContext } from 'react'
import AppContext from '../../contexts/App'

import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import {
  TransactionDiv,
  TransactionTitleDiv,
  TransactionHashDiv,
  TransactionOverviewLabel,
  PanelDiv,
  BriefInfoDiv,
  InputOutputTable,
  WithRowDiv,
} from './styled'

import BlockHeightIcon from '../../asserts/block_height_green.png'
import TimestampIcon from '../../asserts/timestamp_green.png'
import TransactionIcon from '../../asserts/transaction_green.png'
import VersionIcon from '../../asserts/version.png'
import CopyGreenIcon from '../../asserts/copy_green.png'
import CopyIcon from '../../asserts/copy.png'

import { transaction, cell } from './mock'

const cellData = cell.data
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
                    newData[item] = cellData
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
              defaultValue={JSON.stringify(cell.data, null, 4)}
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

export default () => {
  const [transactionData, setTransactionData] = useState(transaction.data)
  const updateCellData = (type: 'string', id: number, newData: any) => {
    setTransactionData((state: any) => {
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
  const appContext = useContext(AppContext)

  return (
    <Page>
      <Header />
      <Content>
        <TransactionDiv className="container">
          <TransactionTitleDiv>Transcations</TransactionTitleDiv>
          <TransactionHashDiv>
            <div id="transaction__hash">{transactionData && transactionData.transaction_hash}</div>
            <div
              role="button"
              tabIndex={-1}
              onKeyDown={() => {}}
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
            >
              <img
                alt="copy"
                style={{
                  marginLeft: 18,
                  width: 21,
                  height: 24,
                }}
                src={CopyIcon}
              />
            </div>
          </TransactionHashDiv>
          <TransactionOverviewLabel>Overview</TransactionOverviewLabel>
          <BriefInfoDiv width={window.innerWidth}>
            <div>
              <WithRowDiv>
                <img className="brief__img" src={BlockHeightIcon} alt="block_height" />
                <div className="brief__key">Block :</div>
                <div
                  className="brief__value"
                  style={{
                    color: '#4bbc8e',
                  }}
                >
                  {transactionData && transactionData.block_number}
                </div>
              </WithRowDiv>
              <WithRowDiv
                style={{
                  marginTop: 20,
                }}
              >
                <img className="brief__img" src={TransactionIcon} alt="transaction_fee" />
                <div className="brief__key">Transaction fee :</div>
                <div className="brief__value">{transactionData && transactionData.transaction_fee}</div>
              </WithRowDiv>
            </div>
            <div>
              <WithRowDiv>
                <img className="brief__img" src={TimestampIcon} alt="timestamp" />
                <div className="brief__key">Timestamp :</div>
                <div className="brief__value">{transactionData && transactionData.block_timestamp}</div>
              </WithRowDiv>
              <WithRowDiv
                style={{
                  marginTop: 20,
                }}
              >
                <img className="brief__img" src={VersionIcon} alt="version" />
                <div className="brief__key">Version :</div>
                <div className="brief__value">{transactionData && transactionData.version}</div>
              </WithRowDiv>
            </div>
          </BriefInfoDiv>

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
                  {transactionData &&
                    transactionData.display_inputs.map((input: any) => {
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
                  {transactionData &&
                    transactionData.display_outputs.map((ouput: any) => {
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
