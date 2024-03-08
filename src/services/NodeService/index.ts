import axios from 'axios'
import config from '../../config'

const { BACKUP_NODES: backupNodes } = config

const node = backupNodes[0]

if (!node) {
  throw new Error('NodeService not implemented')
}

export const getTx = async (hash: string) => {
  const body = {
    id: 1,
    jsonrpc: '2.0',
    method: 'get_transaction',
    params: [hash],
  }

  return axios
    .post(node, body)
    .then(res => res.data)
    .catch(() => null)
}
