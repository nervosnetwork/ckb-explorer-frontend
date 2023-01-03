import { ReactNode } from 'react'
import { QueryStatus } from 'react-query'
import Error from '../Error'
import Loading from '../Loading'

export default ({ status, children }: { status: QueryStatus; children: ReactNode }) => {
  switch (status) {
    case 'error':
      return <Error />
    case 'success':
      return <>{children}</>
    case 'loading':
    case 'idle':
    default:
      return <Loading show />
  }
}
