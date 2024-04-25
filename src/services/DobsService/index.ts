import config from '../../config'

const { DOBS_SERVICE_URL: dobsServiceUrl } = config

export const getDobs = async (sporeIds: string[]): Promise<Dob[] | null> => {
  if (!dobsServiceUrl) return null

  return fetch(`${dobsServiceUrl}/api/dobs/0`, {
    method: 'POST',
    body: JSON.stringify({ ids: sporeIds.join(',') }),
  })
    .then(res => res.json())
    .then(res => res.dobs)
    .catch(() => null)
}

export interface Dob {
  asset?: string
  media_type: string
  'prev.bg': string | undefined
  'prev.bgcolor': string | undefined
  'prev.type': string
  protocol: string
  [key: string]: string | undefined
}
