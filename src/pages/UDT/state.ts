import { UDT, OmigaInscriptionCollection, MintStatus } from '../../models/UDT'

export const defaultUDTInfo: UDT = {
  symbol: '',
  fullName: '',
  totalAmount: '0',
  addressesCount: '0',
  decimal: '0',
  iconFile: '',
  published: false,
  description: '',
  h24CkbTransactionsCount: '0',
  createdAt: '0',
  typeHash: '',
  issuerAddress: '',
  typeScript: {
    args: '',
    codeHash: '',
    hashType: '',
  },
  udtType: 'sudt',
}

export const defaultOmigaInscriptionInfo: OmigaInscriptionCollection = {
  ...defaultUDTInfo,
  mintStatus: MintStatus.Closed,
  mintLimit: '0',
  expectedSupply: '0',
  inscriptionInfoId: '',
}
