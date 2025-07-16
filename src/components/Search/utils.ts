import { explorerService, Response, SearchResultType, type AggregateSearchResult } from '../../services/ExplorerService'
import { getReverseAddresses } from '../../services/DidService'
import { ethToCKb as DidEthToCkb } from '../../utils/did'
import { addPrefixForHash, containSpecialChar } from '../../utils/string'
import { HttpErrorCode, SearchFailType, TYPE_ID_CODE_HASH } from '../../constants/common'
import { isChainTypeError } from '../../utils/chain'
import { isRequestError } from '../../utils/error'
import { isValidBTCAddress } from '../../utils/bitcoin'

export const getURLByAggregateSearchResult = (result: AggregateSearchResult) => {
  const { type, attributes } = result
  switch (type) {
    // 1. when query by type_id, first it will use type_id as args to find type script, then use this type script's script_hash as code_hash to find script
    // 2. when query by code_hash, it will directly query script by code_hash
    case SearchResultType.TypeScript:
      if (attributes.codeHash === TYPE_ID_CODE_HASH) {
        return `/script/${attributes.scriptHash}/${attributes.hashType}`
      }
      return `/script/${attributes.codeHash}/${attributes.hashType}`

    case SearchResultType.LockScript:
      return `/script/${attributes.codeHash}/${attributes.hashType}`

    case SearchResultType.Block:
      return `/block/${attributes.blockHash}`

    case SearchResultType.Transaction:
      return `/transaction/${attributes.transactionHash}`

    case SearchResultType.Address:
      return `/address/${attributes.addressHash}`

    case SearchResultType.LockHash:
      return `/address/${attributes.addressHash}`

    case SearchResultType.UDT:
      if (attributes.udtType === 'omiga_inscription') {
        return `/inscription/${attributes.typeHash}`
      }
      if (attributes.udtType === 'sudt') {
        return `/sudt/${attributes.typeHash}`
      }
      if (['xudt', 'xudt_compatible'].includes(attributes.udtType)) {
        return `/xudt/${attributes.typeHash}`
      }
      break

    case SearchResultType.TokenCollection:
      if (attributes.standard === 'spore') {
        return `/dob-collections/${attributes.sn}`
      }
      return `/nft-collections/${attributes.sn}`

    case SearchResultType.TokenItem:
      return `/nft-info/${attributes.tokenCollection.sn}/${attributes.tokenId}`

    case SearchResultType.BtcTx:
      return `/transaction/${attributes.ckbTransactionHash}`

    case SearchResultType.DID:
      return `/address/${attributes.address}`

    case SearchResultType.BtcAddress:
      return `/address/${attributes.addressHash}`

    case SearchResultType.FiberGraphNode:
      return `/fiber/graph/node/${attributes.nodeId}`

    default:
      break
  }
}

export const getDisplayNameByAggregateSearchResult = (result: AggregateSearchResult) => {
  const { type, attributes } = result
  if (type === SearchResultType.Block) {
    return attributes.number
  }
  if (type === SearchResultType.Transaction) {
    return attributes.transactionHash
  }
  if (type === SearchResultType.Address) {
    return attributes.addressHash
  }
  if (type === SearchResultType.LockHash) {
    return attributes.lockHash
  }
  if (type === SearchResultType.UDT) {
    return attributes.symbol ?? attributes.fullName
  }
  if (type === SearchResultType.TypeScript) {
    return attributes.scriptHash
  }
  if (type === SearchResultType.LockScript) {
    return attributes.codeHash
  }
  if (type === SearchResultType.BtcTx) {
    return attributes.transactionHash
  }
  if (type === SearchResultType.TokenCollection) {
    return attributes.name
  }
  if (type === SearchResultType.TokenItem) {
    return attributes.name ?? attributes.tokenCollection.name
  }
  if (type === SearchResultType.DID) {
    return attributes.did
  }
  if (type === SearchResultType.BtcAddress) {
    return attributes.addressHash
  }
  if (type === SearchResultType.FiberGraphNode) {
    return attributes.peerId
  }
}

export const ALLOW_SEARCH_TYPES = [
  SearchResultType.Address,
  SearchResultType.Block,
  SearchResultType.BtcTx,
  SearchResultType.LockHash,
  SearchResultType.LockScript,
  SearchResultType.Transaction,
  SearchResultType.TypeScript,
  SearchResultType.TokenCollection,
  SearchResultType.TokenItem,
  SearchResultType.UDT,
  SearchResultType.DID,
  SearchResultType.BtcAddress,
  SearchResultType.FiberGraphNode,
]

export async function fetchAggregateSearchResult(searchValue: string): Promise<AggregateSearchResult[]> {
  let results = await explorerService.api
    .fetchAggregateSearchResult(addPrefixForHash(searchValue))
    .then(res => res.data)
    .catch(() => [] as AggregateSearchResult[])

  if (/\w*\.bit$/.test(searchValue)) {
    // search .bit name
    const list = await getReverseAddresses(searchValue)
    const ETH_COIN_TYPE = '60'
    const ethAddr = list?.find(item => item.key_info.coin_type === ETH_COIN_TYPE)
    if (ethAddr) {
      const ckbAddr = DidEthToCkb(ethAddr.key_info.key)
      results = [
        ...results,
        {
          id: Math.random(),
          type: SearchResultType.DID,
          attributes: {
            did: searchValue,
            address: ckbAddr,
          },
        },
      ]
    }
  }

  return results
}

export const getURLBySearchValue = async (searchValue: string) => {
  // check whether is btc address
  if (isValidBTCAddress(searchValue)) {
    return `/address/${searchValue}`
  }
  if (/\w*\.bit$/.test(searchValue)) {
    // search .bit name
    const list = await getReverseAddresses(searchValue)
    const ETH_COIN_TYPE = '60'
    const ethAddr = list?.find(item => item.key_info.coin_type === ETH_COIN_TYPE)
    if (ethAddr) {
      const ckbAddr = DidEthToCkb(ethAddr.key_info.key)
      return `/address/${ckbAddr}`
    }
  }
  // TODO: Is this replace needed?
  const query = addPrefixForHash(searchValue).replace(',', '')
  if (!query || containSpecialChar(query)) {
    return `/search/fail?q=${query}`
  }
  if (isChainTypeError(query)) {
    return `/search/fail?type=${SearchFailType.CHAIN_ERROR}&q=${query}`
  }

  try {
    const data = await fetchAggregateSearchResult(addPrefixForHash(query))
    return getURLByAggregateSearchResult(data[0])
  } catch (error) {
    if (
      isRequestError(error) &&
      error.response?.data &&
      error.response.status === 404 &&
      (error.response.data as Response.Error[]).find(
        (errorData: Response.Error) => errorData.code === HttpErrorCode.NOT_FOUND_ADDRESS,
      )
    ) {
      return `/address/${query}`
    }

    return `/search/fail?q=${query}`
  }
}
