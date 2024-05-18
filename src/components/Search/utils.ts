import { SearchResultType, AggregateSearchResult } from '../../services/ExplorerService'
import { TYPE_ID_CODE_HASH } from '../../constants/common'

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
      return `/address/${attributes.lockHash}`

    case SearchResultType.UDT:
      if (attributes.udtType === 'omiga_inscription') {
        return `/inscription/${attributes.typeHash}`
      }
      if (attributes.udtType === 'sudt') {
        return `/sudt/${attributes.typeHash}`
      }
      if (attributes.udtType === 'xudt') {
        return `/xudt/${attributes.typeHash}`
      }
      break

    case SearchResultType.TokenCollection:
      return `/nft-collections/${attributes.sn}`

    case SearchResultType.BtcTx:
      return `/transaction/${attributes.ckbTransactionHash}`

    case SearchResultType.DID:
      return `/address/${attributes.address}`

    case SearchResultType.BtcAddress:
      return `/address/${attributes.addressHash}`

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
  if (type === SearchResultType.DID) {
    return attributes.did
  }
  if (type === SearchResultType.BtcAddress) {
    return attributes.addressHash
  }
}
