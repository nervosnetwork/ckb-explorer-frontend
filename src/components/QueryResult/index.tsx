import { ReactElement } from 'react'
import { UseQueryResult } from 'react-query'
import { LOADING_WAITING_TIME } from '../../constants/common'
import Error from '../Error'
import Loading from '../Loading'
import { useDelayLoading } from '../../utils/hook'

export function QueryResult<TData, TError>({
  query,
  children,
  delayLoading,
  errorRender,
  loadingRender,
}: {
  query: UseQueryResult<TData, TError>
  children: (data: TData) => ReactElement
  delayLoading?: boolean
  errorRender?: (err: TError) => ReactElement
  loadingRender?: (show: boolean) => ReactElement
}): ReactElement {
  const delayedLoading = useDelayLoading(LOADING_WAITING_TIME, true)

  switch (query.status) {
    case 'error':
      return errorRender ? errorRender(query.error) : <Error />
    case 'success':
      return children(query.data)
    case 'idle':
    case 'loading':
    default:
      return loadingRender ? (
        loadingRender(delayLoading ? delayedLoading : true)
      ) : (
        <Loading show={delayLoading ? delayedLoading : true} />
      )
  }
}
