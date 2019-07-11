import React, { useReducer } from 'react'
import AppContext, { initApp, AppError } from '../contexts/App'

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'updateError':
      return {
        ...state,
        appErrors: state.appErrors.map((error: AppError) => {
          if (action.payload.appError.type === error.type) {
            return action.payload.appError
          }
          return error
        }),
      }
    default:
      return state
  }
}

// const methods = (setApp: any) => {
//   return {
//     resize: (appWidth: number, appHeight: number) => {
//       setApp((state: any) => {
//         return {
//           ...state,
//           appWidth,
//           appHeight,
//         }
//       })
//     },
//     showLoading: () => {
//       setApp((state: any) => {
//         return {
//           ...state,
//           show: true,
//         }
//       })
//     },
//     hideLoading: () => {
//       setApp((state: any) => {
//         return {
//           ...state,
//           show: false,
//         }
//       })
//     },
//     showModal: (ui: any, uiProps: any) => {
//       setApp((state: any) => {
//         return {
//           ...state,
//           modal: {
//             ui,
//             uiProps,
//           },
//         }
//       })
//     },
//     hideModal: () => {
//       setApp((state: any) => {
//         const newApp = {
//           ...state,
//         }
//         delete newApp.modal
//         return newApp
//       })
//     },
//     toastMessage: (text: string, timeout: number = 2000) => {
//       setApp((state: any) => {
//         return {
//           ...state,
//           toast: {
//             id: new Date().getTime(),
//             text,
//             timeout,
//           },
//         }
//       })
//     },
//     updateAppErrors: (appError: AppError) => {
//       setApp((state: any) => {
//         return {
//           ...state,
//           appErrors: state.appErrors.map((error: AppError) => {
//             if (appError.type === error.type) {
//               return appError
//             }
//             return error
//           })
//         }
//       })
//     }
//   }

// }

const withProviders = (Comp: React.ComponentType) => () => {
  // const [app, setApp] = useState(initApp)
  const [state, dispatch] = useReducer(reducer, initApp)
  // const appValue = methods(setApp)
  return (
    <AppContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      <Comp />
    </AppContext.Provider>
  )
}

export default withProviders
