import axios, { AxiosResponse } from 'axios'
import ErrorTexts from './errors'

const baseURL = 'http://localhost:3000/'

const axiosIns = axios.create({
  baseURL,
})

interface Params {
  [index: string]: string | number
}

export const fetchBlocks = () =>
  axiosIns
    .get('blocks')
    .then((res: AxiosResponse) => res.data)
    .catch(() => {
      throw new Error(ErrorTexts.CACHE_SERVER_NOT_AVAILABLE)
    })

export const fetchBlockByHash = (params: Params) =>
  axiosIns
    .get('blocks', {
      params,
    })
    .then((res: AxiosResponse) => res.data)
    .catch(() => {
      throw new Error(ErrorTexts.CACHE_SERVER_NOT_AVAILABLE)
    })
