import React, { useState, useContext } from 'react'
import AppContext from '../../contexts/App'

import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import { PanelDiv, BriefInfoDiv, InputOutPutTable, WithRowDiv } from './styled'

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
  d,
  isLast = false,
  whichToLoad = null,
  updateCellData,
}: {
  type: 'input' | 'output'
  d: any
  isLast?: boolean
  whichToLoad?: 'Lock Script' | 'Type Script' | 'Data' | null
  updateCellData: Function
}) => {
  const appContext = useContext(AppContext)

  return (
    <>
      <tr className="tr-brief">
        <td
          style={{
            width: 50,
            fontSize: 18,
            color: '#888888',
          }}
        >
          {`#${d[`${type}_id`]}`}
        </td>
        <td
          style={{
            width: 1100 - 50 - 150 - 100 * 3,
            fontSize: 16,
            color: '#4bbc8e',
          }}
        >
          {d.address_hash}
        </td>
        <td
          style={{
            width: 150,
            fontSize: 16,
            color: '#888888',
          }}
        >
          {d.capacity}
        </td>
        {operationItems.map((item: string) => {
          let className = 'td-operatable'
          if (d.open === item) {
            className += ' td-operatable-active '
          }
          return (
            <td
              key={item}
              style={{
                width: 100,
                fontSize: 16,
                color: '#4bbc8e',
                fontWeight: 'bold',
              }}
            >
              <div
                role="button"
                tabIndex={-1}
                className={className}
                onKeyPress={() => {}}
                onClick={() => {
                  const newD = {
                    ...d,
                  }
                  if (newD.open === item) {
                    newD.open = null
                  } else {
                    newD.open = item
                    newD[item] = cellData
                  }
                  updateCellData(type, d[`${type}_id`], newD)
                }}
              >
                {item}
              </div>
            </td>
          )
        })}
      </tr>
      {whichToLoad ? (
        <tr
          className="tr-detail"
          style={{
            borderBottom: !isLast ? '2px solid #4bbc8e' : 0,
          }}
        >
          <td />
          <td colSpan={5}>
            <textarea
              id={`textarea-${type}${+'-'}${d[`${type}_id`]}`}
              style={{
                border: 'none',
                width: '100%',
                padding: '18px 30px 18px 34px',
                fontSize: 16,
                color: '#888888',
                height: 170,
                backgroundColor: '#f9f9f9',
                borderRadius: '6px 6px',
              }}
            >
              {JSON.stringify(cell.data, null, 4)}
            </textarea>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                role="button"
                tabIndex={-1}
                className="td-operatable"
                style={{
                  border: '1px solid #4bbc8e',
                  color: '#4bbc8e',
                  borderRadius: '2px 2px',
                  width: 150,
                  height: 40,
                  margin: '20px 10px 40px 10px',
                  textAlign: 'center',
                  lineHeight: '40px',
                }}
                onKeyPress={() => {}}
                onClick={() => {}}
              >
                {'Default'}
              </div>
              <div
                role="button"
                tabIndex={-1}
                className="td-operatable"
                style={{
                  border: '1px solid #888888',
                  color: '#888888',
                  borderRadius: '2px 2px',
                  width: 150,
                  height: 40,
                  margin: '20px 10px 40px 10px',
                  textAlign: 'center',
                  lineHeight: '40px',
                }}
                onKeyPress={() => {}}
                onClick={() => {}}
              >
                {'UTF-8'}
              </div>
              <div
                role="button"
                tabIndex={-1}
                className="td-operatable"
                style={{
                  border: '1px solid #4bbc8e',
                  backgroundColor: '#4bbc8e',
                  color: 'white',
                  borderRadius: '2px 2px',
                  width: 150,
                  height: 40,
                  margin: '20px 10px 40px 10px',
                  textAlign: 'center',
                  lineHeight: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onKeyPress={() => {}}
                onClick={() => {
                  const textarea = document.getElementById(
                    `textarea-${type}${+'-'}${d[`${type}_id`]}`,
                  ) as HTMLTextAreaElement
                  textarea.select()
                  document.execCommand('copy')
                  appContext.toastMessage('copy success', 3000)
                }}
              >
                <div>Copy</div>
                <img
                  src={CopyGreenIcon}
                  style={{
                    marginLeft: 5,
                    width: 21,
                    height: 24,
                  }}
                  alt="copy"
                />
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
      newState[`display_${type}s`].forEach((d: any, i: number) => {
        if (d[`${type}_id`] === id) {
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
        <div
          className="container"
          style={{
            paddingTop: 100,
            paddingBottom: 200,
          }}
        >
          <div
            style={{
              textAlign: 'center',
              fontSize: 40,
              fontFamily: 'PingFang-SC-Heavy',
              fontWeight: 900,
            }}
          >
            {'Transcations'}
          </div>
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              color: '#888888',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              id="transaction__hash"
              style={{
                height: 56,
                lineHeight: '56px',
              }}
            >
              {transactionData && transactionData.transaction_hash}
            </div>
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
          </div>
          <div
            style={{
              textAlign: 'center',
              marginTop: 100,
              fontSize: 50,
              fontFamily: 'PingFang-SC-Heavy',
              fontWeight: 900,
            }}
          >
            {'Overview'}
          </div>
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
            <div
              style={{
                overflowX: 'auto',
              }}
            >
              <InputOutPutTable>
                <thead>
                  <tr>
                    <td colSpan={2}>Input</td>
                    <td
                      style={{
                        width: 150,
                      }}
                    >
                      <div>Capcity</div>
                    </td>
                    <td
                      colSpan={3}
                      style={{
                        width: 300,
                      }}
                    >
                      <div>Detail</div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {transactionData &&
                    transactionData.display_inputs.map((d: any, i: number) => {
                      return (
                        <RowData
                          type="input"
                          key={d.input_id}
                          d={d}
                          isLast={i === transactionData.display_inputs.length - 1}
                          whichToLoad={d.open || null}
                          updateCellData={updateCellData}
                        />
                      )
                    })}
                </tbody>
              </InputOutPutTable>
            </div>
          </PanelDiv>

          <PanelDiv
            style={{
              marginTop: 10,
              minHeight: 88,
              padding: '30px 50px',
            }}
          >
            <div
              style={{
                overflowX: 'auto',
              }}
            >
              <InputOutPutTable>
                <thead>
                  <tr>
                    <td colSpan={2}>Output</td>
                    <td
                      style={{
                        width: 150,
                      }}
                    >
                      <div>Capcity</div>
                    </td>
                    <td
                      colSpan={3}
                      style={{
                        width: 300,
                      }}
                    >
                      <div>Detail</div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {transactionData &&
                    transactionData.display_outputs.map((d: any, i: number) => {
                      return (
                        <RowData
                          type="output"
                          key={d.output_id}
                          d={d}
                          isLast={i === transactionData.display_outputs.length - 1}
                          whichToLoad={d.open || null}
                          updateCellData={updateCellData}
                        />
                      )
                    })}
                </tbody>
              </InputOutPutTable>
            </div>
          </PanelDiv>
        </div>
      </Content>
      <Footer />
    </Page>
  )
}
