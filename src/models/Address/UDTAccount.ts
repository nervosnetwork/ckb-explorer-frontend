import { Script } from '../Script'

export interface XUDT {
  symbol: string
  decimal: string
  amount: string
  typeHash: string
  udtIconFile: string
  udtType: 'xudt' | 'xudt_compatible'
}

export interface SUDT {
  symbol: string
  decimal: string
  amount: string
  typeHash: string
  udtIconFile: string
  udtType: 'sudt'
}

export interface MNFT {
  symbol: string
  amount: string
  udtIconFile: string
  udtType: 'm_nft_token'
  collection: {
    typeHash: string
  }
}

export interface NRC721 {
  symbol: string
  amount: string // token id in fact
  udtIconFile: string // base uri with token id in fact
  udtType: 'nrc_721_token'
  collection: {
    typeHash: string
  }
}

export interface CoTA {
  symbol: string
  udtIconFile: string // base uri with token id in fact
  udtType: 'cota'
  cota: {
    cotaId: number
    tokenId: number
  }
}

export interface Spore {
  symbol?: string
  amount: string
  udtIconFile: string
  udtType: 'spore_cell' | 'did_cell'
  collection: {
    typeHash: string | null
  }
  udtTypeScript: Script
}

export interface OmigaInscription {
  amount: string
  decimal: string
  expectedSupply: string
  mintStatus: string
  symbol: string
  typeHash: string
  udtAmount: string
  udtType: 'omiga_inscription'
}

export type UDTAccount = XUDT | SUDT | MNFT | NRC721 | CoTA | Spore | OmigaInscription
export type FT = XUDT | SUDT
export type NFT = MNFT | NRC721 | Spore
