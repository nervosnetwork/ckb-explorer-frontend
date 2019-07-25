import styled from 'styled-components'

export const TransactionDiv = styled.div.attrs({
  className: 'container',
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
  width: 100%;

  @media (max-width: 700px) {
    margin-top: 30px;
    margin-bottom: 0px;
    padding: 0px 20px 20px 20px;
  }
`

export const TransactionBlockHeightPanel = styled.div`
  color: #3cc68a;
`

export const PanelDiv = styled.div`
  border-radius: 6px;
  box-shadow: 0 5px 9px 0 #dfdfdf;
  background-color: #ffffff;
  > div {
    overflow-x: auto;
  }
`

// export const InputPanelDiv = styled(PanelDiv)`
//   margin-top: 20px;
//   min-height: 88px;
//   padding: 30px 50px;
//   width: 100%;
//   overflow-x: auto;
// `

// export const OutputPanelDiv = styled(PanelDiv)`
//   margin-top: 10px;
//   min-height: 88px;
//   padding: 30px 50px;
//   width: 100%;
//   overflow-x: auto;
// `

// export const InputOutputTable = styled.table`
//   width: 1100px;
//   border-collapse: collapse;
//   thead {
//     tr {
//       height: 58px;
//       border-bottom: 1px solid #4bbc8e;
//       font-size: 20px;
//       font-family: PingFangSC-Medium, sans-serif;
//       color: #4d4d4d;
//       font-weight: 450;
//       td {
//         &:nth-child(1) {
//           width: ${1100 - 150 - 360}px;
//         }
//         &:nth-child(2) {
//           width: 150px;
//           text-align: center;
//         }
//         &:nth-child(3) {
//           width: 360px;
//           text-align: center;
//         }
//       }
//     }
//   }

//   tbody {
//     tr {
//       &.tr-brief {
//         height: 66px;
//         padding-top: 34px;
//         padding-bottom: 10px;
//         &: hover {
//           background-color: #f9f9f9;
//         }
//         td {
//           &: nth-child(1) {
//             width: ${1100 - 150 - 120 * 3}px;
//             font-size: 16px;
//             color: #4bbc8e;
//           }
//           &: nth-child(2) {
//             width: 150px;
//             font-size: 16px;
//             text-align: center;
//             font-weight: bold;
//             color: #888888;
//           }
//           &: nth-child(3),&: nth-child(4),&: nth-child(5) {
//             width: 120px;
//             font-size: 16px;
//             text-align: center;
//             color: #4bbc8e;
//             font-family: PingFangSC-Semibold, sans-serif;
//           }
//         }
//       }

//       &.tr-detail {
//         border-bottom: 2px solid #4bbc8e;
//         &:last-child {
//           border-bottom: 0;
//         }
//         td {
//           .script__input {
//             border: none;
//             width: 100%;
//             max-height: 400px;
//             overflow-y: auto;
//             overflow-wrap: break-word;
//             white-space: pre-wrap;
//             word-break: break-all;
//             padding: 18px 30px 18px 34px;
//             font-size: 16px;
//             color: #888888;
//             font-weight: bold;
//             font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
//             margin-top: 5px;
//             background-color: #f9f9f9;
//             border-radius: 6px 6px;
//           }
//           .tr-detail-td-buttons {
//             display: flex;
//             justify-content: center;
//             > div {
//               width: 150px;
//               height: 40px;
//               margin: 20px 10px 40px 10px;
//               text-align: center;
//               line-height: 40px;
//               border-radius: 2px 2px;
//               &:nth-child(1) {
//                 border: 1px solid #4bbc8e;
//                 background-color: #4bbc8e;
//                 color: white;
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 img {
//                   margin-left: 5px;
//                   width: 21px;
//                   height: 24px;
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }

//   .td-operatable {
//     cursor: pointer;
//     text-align: center;
//     padding-bottom: 4px;
//   }

//   .td-operatable-active {
//     cursor: pointer;
//     text-align: center;
//     padding-bottom: 4px;
//     border-bottom: 2px solid #4bbc8e;
//   }

//   .td-operatable-disabled {
//     color: #888888;
//     text-align: center;
//     cursor: unset;
//   }

//   .address__bold__grey {
//     color: #888888;
//     font-weight: bold;
//   }
// `

// export const WithRowDiv = styled.div`
//   display: flex;
//   flex-wrap: wrap;
// `
