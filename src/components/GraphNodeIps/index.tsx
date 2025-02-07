import { useQuery } from '@tanstack/react-query'
import { explorerService } from '../../services/ExplorerService'
import { fetchIpsInfo } from '../../services/UtilityService'
import NodesMap, { isValidIpPoint, type IpPoint } from './NodesMap'

const IP_REGEXP = /\/ip4\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/

const getIpFromP2pAddr = (p2pAddr: string) => {
  const match = p2pAddr.match(IP_REGEXP)
  if (match) {
    return match[1]
  }
  return null
}

const GraphNodeIps = () => {
  const { data: nodes } = useQuery({
    queryKey: ['fiber_graph_node_addresses'],
    queryFn: explorerService.api.getGraphNodeIPs,
    refetchInterval: 60 * 1000 * 10, // 10 minutes
  })

  const ips =
    (nodes?.data
      .map(i => i.addresses)
      .flat()
      .map(getIpFromP2pAddr)
      .filter(ip => !!ip) as string[]) ?? []

  const { data: ipInfos } = useQuery({
    queryKey: ['fiber_graph_ips_info', ips.join(',')],
    queryFn: () => (ips.length ? fetchIpsInfo(ips) : undefined),
    enabled: !!ips.length,
  })

  const list =
    nodes?.data
      ?.map(node => {
        const ips = node.addresses.map(getIpFromP2pAddr)

        const infos = ips
          .map(ip => {
            const ipInfo = ipInfos?.ips[ip as keyof typeof ipInfos.ips]
            return {
              ...ipInfo,
              ip,
              connections: node.connections,
              id: node.nodeId,
            }
          })
          .filter(p => isValidIpPoint(p)) as IpPoint[]
        return infos
      })
      .flat() ?? []

  return <NodesMap ips={list} />
}

export default GraphNodeIps
