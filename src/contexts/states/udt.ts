export const initUDTState: State.UDTState = {
  udt: {
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
  },
  transactions: [],
  total: 0,
  status: 'None',
  filterStatus: 'None',
}

export default initUDTState
