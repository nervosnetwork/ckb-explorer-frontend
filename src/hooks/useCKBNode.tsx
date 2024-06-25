import { useContext, createContext, useState, PropsWithChildren } from 'react'
import { NodeService } from '../services/NodeService'

const NODE_CONNECT_MODE_KEY = 'node_connect_mode'

export interface ICKBNodeContext {
  nodeService: NodeService
  isActivated: boolean
  setIsActivated: (isActivated: boolean) => void
}

export const CKBNodeContext = createContext<ICKBNodeContext | undefined>(undefined)

export const useCKBNode = (): ICKBNodeContext => {
  const context = useContext(CKBNodeContext)
  if (!context) {
    throw new Error('No CKBNodeContext.Provider found when calling useCKBNode.')
  }
  return context
}

interface CKBNodeProviderProps {
  defaultEndpoint: string
}

export const CKBNodeProvider = ({ children, defaultEndpoint }: PropsWithChildren<CKBNodeProviderProps>) => {
  const nodeService = new NodeService(defaultEndpoint)
  const [isActivated, _setIsActivated] = useState(localStorage.getItem(NODE_CONNECT_MODE_KEY) === 'true')

  const setIsActivated = (value: boolean) => {
    localStorage.setItem(NODE_CONNECT_MODE_KEY, value.toString())
    _setIsActivated(value)
  }

  return (
    <CKBNodeContext.Provider value={{ nodeService, isActivated, setIsActivated }}>{children}</CKBNodeContext.Provider>
  )
}
