export const initUDTState: State.UDTState = {
  udt: {
    symbol: '',
    fullName: '',
    totalAmount: '0',
    addressesCount: '0',
    decimal: '0',
    iconFile: '',
  },
  transactions: [],
  total: 0,
  status: 'None',
  filterStatus: 'None',
}

export default initUDTState
