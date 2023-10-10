import CONFIG from '../config'

export const AppCachedKeys = {
  AppLanguage: `${CONFIG.CHAIN_TYPE}-AppLanguage`,
  Version: `${CONFIG.CHAIN_TYPE}-Version`,
  NewAddrFormat: `is-address-format-new`,
}

export const ChartCachedKeys = {
  APC: `${CONFIG.CHAIN_TYPE}-APC`,
  InflationRate: `${CONFIG.CHAIN_TYPE}-InflationRate`,
  TransactionCount: `${CONFIG.CHAIN_TYPE}-TransactionCount`,
  AddressCount: `${CONFIG.CHAIN_TYPE}-AddressCount`,
  CellCount: `${CONFIG.CHAIN_TYPE}-CellCount`,
  TransactionFee: `${CONFIG.CHAIN_TYPE}-TransactionFee`,
  AddressBalanceRank: `${CONFIG.CHAIN_TYPE}-AddressBalanceRank`,
  BalanceDistribution: `${CONFIG.CHAIN_TYPE}-BalanceDistribution`,
  AverageBlockTime: `${CONFIG.CHAIN_TYPE}-AverageBlockTime`,
  EpochTimeDistribution: `${CONFIG.CHAIN_TYPE}-EpochTimeDistribution`,
  BlockTimeDistribution: `${CONFIG.CHAIN_TYPE}-BlockTimeDistribution`,
  Difficulty: `${CONFIG.CHAIN_TYPE}-Difficulty`,
  HashRate: `${CONFIG.CHAIN_TYPE}-HashRate`,
  UncleRate: `${CONFIG.CHAIN_TYPE}-UncleRate`,
  DifficultyHashRate: `${CONFIG.CHAIN_TYPE}-DifficultyHashRate`,
  DifficultyUncleRateEpoch: `${CONFIG.CHAIN_TYPE}-DifficultyUncleRateEpoch`,
  UncleHashRate: `${CONFIG.CHAIN_TYPE}-UncleHashRate`,
  MinerAddressDistribution: `${CONFIG.CHAIN_TYPE}-MinerAddressDistribution`,
  MinerVersionDistribution: `${CONFIG.CHAIN_TYPE}-MinerVersionDistribution`,
  TotalDeposit: `${CONFIG.CHAIN_TYPE}-TotalDeposit`,
  DailyDeposit: `${CONFIG.CHAIN_TYPE}-DailyDeposit`,
  DepositCirculationRatio: `${CONFIG.CHAIN_TYPE}-DepositCirculationRatio`,
  TotalSupply: `${CONFIG.CHAIN_TYPE}-TotalSupply`,
  SecondaryIssuance: `${CONFIG.CHAIN_TYPE}-SecondaryIssuance`,
  Liquidity: `${CONFIG.CHAIN_TYPE}-Liquidity`,
  NodeDistribution: `${CONFIG.CHAIN_TYPE}-NodeDistribution`,
}
