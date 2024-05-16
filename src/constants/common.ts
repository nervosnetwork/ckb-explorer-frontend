import config from '../config'

export const BLOCK_POLLING_TIME = 4000
export const MAX_CONFIRMATION = 1000
export const BLOCKCHAIN_ALERT_POLLING_TIME = 10000
export const FLUSH_CHART_CACHE_POLLING_TIME = 300000 // 5 minutes
export const LOADING_WAITING_TIME = 500
export const DELAY_BLOCK_NUMBER = 11
export const PAGE_CELL_COUNT = 200
export const NEXT_HARD_FORK_EPOCH = 5414
export const EPOCH_HOURS = 4
export const ONE_DAY_SECOND = 24 * 60 * 60
export const ONE_DAY_MILLISECOND = ONE_DAY_SECOND * 1000
export const ONE_YEAR_MILLISECOND = ONE_DAY_MILLISECOND * 365
export const ONE_HOUR_SECOND = 60 * 60
export const ONE_HOUR_MILLISECOND = ONE_HOUR_SECOND * 1000
export const ONE_MINUTE_SECOND = 60
export const EPOCHS_PER_HALVING = 8760
export const THEORETICAL_EPOCH_TIME = 1000 * 60 * 60 * 4 // 4 hours
export const PAGE_SIZE = 10
export const MIN_DEPOSIT_AMOUNT = 102
export const MAX_DECIMAL_DIGITS = 8

export const IS_MAINNET = config.CHAIN_TYPE === 'mainnet'

export function getPrimaryColor() {
  return IS_MAINNET ? '#00CC9B' : '#9A2CEC'
}

export function getSecondaryColor() {
  return IS_MAINNET ? '#00CC9B' : '#9A2CEC'
}

export const TOKEN_EMAIL_ADDRESS = 'ckb-explorer@nervosnet.com'
export const TOKEN_EMAIL_SUBJECT = 'Submit Token Info'
export const TOKEN_EMAIL_BODY = `
Title: Submit Token Information%0a%0d
---------- Submit NRC 721 Factory Information ----------%0a%0d

Information:%0a%0d
   Deployment Tx Hash: %0a%0d
   Contract Source Code: %0a%0d
   Other Info:%0a%0d
`

export const REPORT_EMAIL_ADDRESS = 'ckb-explorer@nervosnet.com'
export const REPORT_EMAIL_SUBJECT = 'Submit Token Info'
export const REPORT_EMAIL_BODY_EN = `
MagiCKBase Team,%0a%0d



I am writing this email to notify you about an issue regarding the contact email address listed on your browser for our organization [incorrect/no longer available]. Here is the correct email address information (* indicates required fields):%0a%0d



New Email Address*: [Your new email address]%0a%0d

Organization/Company: [Your organization/company name, if applicable]%0a%0d

NFT Issuer Address with Signature Information for "Request to Change Email Address": [If applicable]%0a%0d



Alternate Email Address: [Your alternate email address, if any]%0a%0d

——————————————————————————————————————————%0a%0d

This template can be adjusted as necessary for your specific requirements. Before sending your email, please ensure to provide all the required information so that the MagickBase team can process your request swiftly and accurately.
`

export const REPORT_EMAIL_BODY_ZH = `
MagiCKBase 团队，%0a%0d



写此邮件是为了通知您关于我们在您的浏览器上列出的联系邮件地址 [错误/不再可用]。%0a%0d

以下是我们的正确邮件地址信息（“*”为必填项。）：%0a%0d



新邮件地址*：[新的邮件地址]%0a%0d

组织/公司：[您的组织/公司名称，如果有]%0a%0d

NFT issuer 地址对“请求修改电邮地址”的签名信息：[如果有]%0a%0d



替代电子邮件地址：[替代电子邮件地址，如果有]%0a%0d

——————————————————————————————————————————%0a%0d

此模板可根据具体情况进行适当调整。在发送邮件时，请确保提供所有必要的信息，以便区块链浏览器的工作人员可以迅速且准确地处理您的请求。
`

export const HttpErrorCode = {
  NOT_FOUND_ADDRESS: 1010,
}

export const SearchFailType = {
  CHAIN_ERROR: 'chain_error',
}

export enum CellType {
  Input = 'input',
  Output = 'output',
}

export enum DataType {
  LockScript = 'lock_script',
  TypeScript = 'type_script',
  Data = 'data',
}

export enum PageParams {
  PageNo = 1,
  PageSize = 10,
  MaxPageSize = 100,
}

export enum ListPageParams {
  PageNo = 1,
  PageSize = 25,
  MaxPageSize = 100,
}

export const ChartColor = {
  areaColor: '#31EEB3',
  colors: ['#5824FB', '#31EEB3', '#484E4E'],
  moreColors: ['#5824FB', '#66CC99', '#FBB04C', '#525860'],
  totalSupplyColors: ['#5824FB', '#31EEB3', '#484E4E'],
  daoColors: ['#5824FB', '#31EEB3', '#484E4E'],
  secondaryIssuanceColors: ['#484E4E', '#5824FB', '#31EEB3'],
  liquidityColors: ['#5824FB', '#484E4E', '#31EEB3'],
}
export type ChartColorConfig = typeof ChartColor

export enum ChainName {
  Mainnet = 'mirana',
  Testnet = 'pudge',
}

export enum LayoutLiteProfessional {
  Lite = 'lite',
  Professional = 'professional',
}
export enum HashType {
  DATA = 'data',
  TYPE = 'type',
  DATA1 = 'data1',
  DATA2 = 'data2',
}

export const MAINNET_URL = `https://${config.BASE_URL}`
export const TESTNET_URL = `https://${ChainName.Testnet}.${config.BASE_URL}`

export const TYPE_ID_CODE_HASH = '0x00000000000000000000000000000000000000000000000000545950455f4944'

export const NERVOS_DAO_RFC_URL =
  'https://www.github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md'
