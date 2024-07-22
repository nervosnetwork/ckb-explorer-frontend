import { useContext, createContext, useState, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { isMainnet } from '../utils/chain'
import { NodeService } from '../services/NodeService'

const NODE_CONNECT_MODE_KEY = 'node_connect_mode'
const NODE_CONNECTED_ENDPOINT = 'node_connected_endpoint'
const NODE_ENDPOINTS = 'node_endpoint_record'

const loadEndpoints = (): Record<string, string> => {
  const item = localStorage.getItem(NODE_ENDPOINTS)
  try {
    return item ? JSON.parse(item) : {}
  } catch {
    return {}
  }
}

const saveEndpoints = (nodes: Record<string, string>) => {
  localStorage.setItem(NODE_ENDPOINTS, JSON.stringify(nodes))
}

export interface CKBNode {
  alias: string
  url: string
}

export interface ICKBNodeContext {
  nodes: Map<string, string>
  nodeService: NodeService
  isActivated: boolean
  addNode: (node: CKBNode) => boolean
  removeNode: (url: string) => void
  editNode: (key: string, node: CKBNode) => boolean
  switchNode: (url: string) => Promise<void>
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
  const { t } = useTranslation()
  const connectedEndpoint = localStorage.getItem(NODE_CONNECTED_ENDPOINT) ?? defaultEndpoint
  const [nodeService, setNodeService] = useState(new NodeService(connectedEndpoint))
  const [nodes, setNodes] = useState<Map<string, string>>(new Map(Object.entries(loadEndpoints())))
  const [isActivated, _setIsActivated] = useState(localStorage.getItem(NODE_CONNECT_MODE_KEY) === 'true')

  // eslint-disable-next-line no-console
  console.log('loadEndpoints', loadEndpoints())

  // eslint-disable-next-line no-console
  console.log('nodes', nodes)

  const setIsActivated = (value: boolean) => {
    localStorage.setItem(NODE_CONNECT_MODE_KEY, value.toString())
    _setIsActivated(value)
  }

  const addNode = (node: CKBNode) => {
    if (nodes.has(node.url)) return false
    if ([...nodes.values()].some(alias => alias === node.alias)) return false

    setNodes(pre => {
      const temp = new Map(pre)
      temp.set(node.url, node.alias)
      saveEndpoints(Object.fromEntries(temp.entries()))
      return temp
    })

    return true
  }

  const removeNode = (key: string) => {
    setNodes(pre => {
      const temp = new Map(pre)
      temp.delete(key)
      saveEndpoints(Object.fromEntries(temp.entries()))
      return temp
    })
  }

  const editNode = (key: string, node: CKBNode) => {
    if (!nodes.has(key)) return false
    if (key !== node.url && nodes.has(node.url)) return false
    if (nodes.get(key) !== node.alias && [...nodes.values()].some(alias => alias === node.alias)) return false

    setNodes(pre => {
      const temp = new Map(pre)
      temp.delete(key)
      temp.set(node.url, node.alias)
      saveEndpoints(Object.fromEntries(temp.entries()))
      return temp
    })

    return true
  }

  const switchNode = async (url: string) => {
    const service = new NodeService(url)
    const res = await service.rpc.getBlockchainInfo().catch(() => {
      throw new Error(t('node.connect_failed'))
    })

    if ((res.chain === 'ckb' && !isMainnet()) || (res.chain === 'ckt' && isMainnet())) {
      throw new Error(t('node.invalid_network'))
    }

    localStorage.setItem(NODE_CONNECTED_ENDPOINT, url)
    setNodeService(service)
  }

  return (
    <CKBNodeContext.Provider
      value={{
        nodes: new Map([[defaultEndpoint, t('node.default_node')], ...nodes.entries()]),
        addNode,
        removeNode,
        editNode,
        switchNode,
        nodeService,
        isActivated,
        setIsActivated,
      }}
    >
      {children}
    </CKBNodeContext.Provider>
  )
}
