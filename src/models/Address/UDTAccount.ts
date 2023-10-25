export interface SUDT {
  symbol: string
  decimal: string
  amount: string
  typeHash: string
  udtIconFile: string
  uan?: string
  udtType: 'sudt'
  collection: undefined
  cota: undefined
}

export interface MNFT {
  symbol: string
  decimal: string
  amount: string
  typeHash: string
  udtIconFile: string
  udtType: 'm_nft_token'
  uan: undefined
  collection: {
    typeHash: string
  }
  cota: undefined
}

export interface NRC721 {
  symbol: string
  amount: string // token id in fact
  typeHash: string
  udtIconFile: string // base uri with token id in fact
  udtType: 'nrc_721_token'
  uan: undefined
  collection: {
    typeHash: string
  }
  cota: undefined
}

export interface CoTA {
  symbol: string
  amount: string
  typeHash: string
  udtIconFile: string // base uri with token id in fact
  udtType: 'cota'
  uan: undefined
  collection: undefined
  cota: {
    cotaId: number
    tokenId: number
  }
}

export interface Spore {
  symbol?: string
  amount: string
  typeHash: string
  udtIconFile: string
  udtType: 'spore_cell'
  collection: {
    typeHash: string | null
  }
  uan: undefined
  cota: undefined
}

export type UDTAccount = SUDT | MNFT | NRC721 | CoTA | Spore
