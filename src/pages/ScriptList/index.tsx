import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react'
import { TFunction } from 'i18next'
import classNames from 'classnames'
import { SCRIPT_TAGS } from '../../constants/scripts'
import Content from '../../components/Content'
import styles from './styles.module.scss'
import { explorerService } from '../../services/ExplorerService'
import { usePaginationParamsInPage, useSortParam, useSearchParams } from '../../hooks'
import Pagination from '../../components/Pagination'
import type { ScriptDetail } from '../../models/Script'
import { QueryResult } from '../../components/QueryResult'
import { Card } from '../../components/Card'
import SortButton from '../../components/SortButton'
import Capacity from '../../components/Capacity'
import MultiFilterButton from '../../components/MultiFilterButton'
import { Link } from '../../components/Link'
import SmallLoading from '../../components/Loading/SmallLoading'
import { parseSimpleDate } from '../../utils/date'
import { shannonToCkb } from '../../utils/util'
import { ReactComponent as OwnerLessIcon } from '../../assets/ownerless-icon.svg'
import { ReactComponent as DeprecatedIcon } from '../../assets/deprecated-icon.svg'
import { ReactComponent as OpenSourceIcon } from '../../assets/open-source.svg'
import { ReactComponent as RFCIcon } from '../../assets/rfc-icon.svg'
import { ReactComponent as WebsiteIcon } from '../../assets/website-icon.svg'
import Tooltip from '../../components/Tooltip'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'

type ScriptAttributes = Record<'name' | 'description', string> &
  Partial<Record<'code' | 'rfc' | 'deprecated' | 'website' | 'doc', string>>

type SortField = 'capacity' | 'timestamp'

export const scripts = new Map<string, ScriptAttributes>([
  [
    'secp256k1_blake160',
    {
      name: 'SECP256K1/blake160',
      description: 'SECP256K1/blake160 is the default lock script to verify CKB transaction signature.',
      rfc: 'https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-genesis-script-list/0024-ckb-genesis-script-list.md#secp256k1blake160',
      code: 'https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_sighash_all.c',
    },
  ],
  [
    SCRIPT_TAGS.SECP_MULTISIG,
    {
      name: 'SECP256K1/multisig',
      description: 'SECP256K1/multisig is a script which allows a group of users to sign a single transaction.',
      rfc: 'https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-genesis-script-list/0024-ckb-genesis-script-list.md#secp256k1multisig',
      code: 'https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_multisig_all.c',
    },
  ],
  [
    'secp256k1 / anyone-can-pay (deprecated)',
    {
      name: 'Anyone-Can-Pay Lock',
      description: 'anyone_can_pay allows a recipient to provide cell capacity in asset transfer.',
      rfc: 'https://github.com/nervosnetwork/rfcs/blob/30980b378fdaccc6e9d21a1c6b53363364fb4abc/rfcs/0026-anyone-can-pay/0026-anyone-can-pay.md',
      code: 'https://github.com/nervosnetwork/ckb-production-scripts/tree/deac6801a95596d74e2da8f2f1a6727309d36100',
      deprecated: 'https://github.com/nervosnetwork/rfcs/commit/89049fe771aae277ef729269c3920db60693aede',
    },
  ],
  [
    'secp256k1 / anyone-can-pay',
    {
      name: 'Anyone-Can-Pay Lock',
      description: 'anyone_can_pay allows a recipient to provide cell capacity in asset transfer.',
      rfc: 'https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0026-anyone-can-pay/0026-anyone-can-pay.md',
      code: 'https://github.com/nervosnetwork/ckb-production-scripts/blob/e570c11aff3eca12a47237c21598429088c610d5/c/anyone_can_pay.c',
    },
  ],
  [
    'nervos dao',
    {
      name: 'Nervos DAO',
      description:
        'Nervos DAO is a smart contract with which users can interact the same way as any smart contract on CKB.',
      rfc: 'https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md',
      code: 'https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/dao.c',
    },
  ],
  [
    'sudt',
    {
      name: 'Simple UDT',
      description: 'Simple UDT provides a way for dapp developers to issue custom tokens on Nervos CKB.',
      rfc: 'https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0025-simple-udt/0025-simple-udt.md',
      code: 'https://github.com/nervosnetwork/ckb-production-scripts/blob/e570c11aff3eca12a47237c21598429088c610d5/c/simple_udt.c',
    },
  ],
  [
    'unipass v3',
    {
      name: 'Unipass',
      description: 'UniPass Wallet is a smart contract wallet solution that supports on-chain Email social recovery.',
      website: 'https://www.unipass.id/',
    },
  ],
  [
    'cota',
    {
      name: 'CoTA',
      description: 'A Compact Token Aggregator Standard for Extremely Low Cost NFTs and FTs',
      website: 'https://www.cotadev.io/',
    },
  ],
  [
    'cota_registry',
    {
      name: 'CoTA Registry',
      description: 'A Compact Token Aggregator Standard for Extremely Low Cost NFTs and FTs',
      website: 'https://www.cotadev.io/',
    },
  ],
  [
    'pwlock-k1-acpl',
    {
      name: 'PW Lock',
      description:
        "Forked from CKB's system scripts, and currently supports signature generated by personalSign and signTypedData from ethereum wallets.",
      code: 'https://github.com/lay2dev/pw-lock/',
    },
  ],
  [
    'godwoken_custodian_lock',
    {
      name: 'godwoken_custodian_lock',
      description: 'Rollup uses the custodian lock to hold the deposited assets.',
      code: 'https://github.com/godwokenrises/godwoken/tree/develop/gwos/contracts/custodian-lock',
      website: 'https://github.com/godwokenrises/godwoken/tree/develop/gwos#custodian-lock',
    },
  ],
  [
    'godwoken_deposit_lock',
    {
      name: 'godwoken_deposit_lock',
      description: 'A layer1 user can join the Rollup by creating a deposit cell.',
      code: 'https://github.com/godwokenrises/godwoken/tree/develop/gwos/contracts/deposit-lock',
      website: 'https://github.com/godwokenrises/godwoken/tree/develop/gwos#deposit-lock',
    },
  ],
  [
    'godwoken_withdrawal_lock',
    {
      name: 'godwoken_withdrawal_lock',
      description:
        'Withdrawal cells are generated in the RollupSubmitBlock action according to the block.withdrawals field.',
      code: 'https://github.com/godwokenrises/godwoken/tree/develop/gwos/contracts/withdrawal-lock',
      website: 'https://github.com/godwokenrises/godwoken/tree/develop/gwos#withdrawal-lock',
    },
  ],
  [
    'godwoken_challenge_lock',
    {
      name: 'godwoken_challenge_lock',
      description:
        'When a Godwoken node found that an invalid state exists in the Rollup, the node can send the RollupEnterChallenge action to the Rollup cell and generate a challenging cell.',
      code: 'https://github.com/godwokenrises/godwoken/tree/develop/gwos/contracts/challenge-lock',
      website: 'https://github.com/godwokenrises/godwoken/tree/develop/gwos#challenge-lock',
    },
  ],
  [
    'godwoken_stake_lock',
    {
      name: 'godwoken_stake_lock',
      description: 'A block producer is required to provide a stake cell to perform the RollupSubmitBlock action.',
      code: 'https://github.com/godwokenrises/godwoken/tree/develop/gwos/contracts/stake-lock',
      website: 'https://github.com/godwokenrises/godwoken/tree/develop/gwos#stake-lock',
    },
  ],
  [
    'omni_lock v1',
    {
      name: 'omni_lock v1',
      description:
        'Omnilock is a lock script designed for interoperability. It comes with built-in support for verification of transaction signing methods used in Bitcoin, Ethereum, EOS, and Dogecoin. Omnilock is also extensible, so more verification algorithms can be added in future.',
      rfc: 'https://github.com/nervosnetwork/rfcs/tree/master/rfcs/0042-omnilock',
    },
  ],
  [
    'omni_lock v2',
    {
      name: 'omni_lock v2',
      description:
        'Omnilock is a lock script designed for interoperability. It comes with built-in support for verification of transaction signing methods used in Bitcoin, Ethereum, EOS, and Dogecoin. Omnilock is also extensible, so more verification algorithms can be added in future.',
      rfc: 'https://github.com/nervosnetwork/rfcs/tree/master/rfcs/0042-omnilock',
      code: 'https://github.com/cryptape/omnilock',
    },
  ],
  [
    'godwoken_state_validator',
    {
      name: 'godwoken_state_validator',
      description:
        'State validator is the major script to verify the on-chain Rollup cell. Rollup cell is an identity cell on CKB, it stores the structure GlobalState which represents the layer-2 state.',
      code: 'https://github.com/godwokenrises/godwoken/tree/develop/gwos/contracts/state-validator',
      website: 'https://github.com/godwokenrises/godwoken/tree/develop/gwos#state-validator',
    },
  ],
  [
    'godwoken_eth_account_lock',
    {
      name: 'godwoken_eth_account_lock',
      description: 'A layer-2 lock script, ETH account lock is a script that verifies the layer-2 account signature.',
      code: 'https://github.com/godwokenrises/godwoken/tree/develop/gwos/contracts/eth-account-lock',
      website: 'https://github.com/godwokenrises/godwoken/tree/develop/gwos#eth-account-lock',
    },
  ],
  [
    'JoyID',
    {
      name: 'JoyID',
      description: 'An universal Account Protocol for Web3 Mass-adoption.',
      doc: 'https://docs.joy.id/',
      website: ' https://joy.id/',
    },
  ],
  [
    'xUDT',
    {
      name: 'xUDT',
      description: "Extensible UDT that derived from sUDT's programmability to support a wider range of scenarios",
      code: 'https://github.com/nervosnetwork/ckb-production-scripts/blob/master/c/xudt_rce.c',
      website: 'https://blog.cryptape.com/enhance-sudts-programmability-with-xudt#heading-xudt-cell',
    },
  ],
  [
    'xUDT(final_rls)',
    {
      name: 'xUDT(final_rls)',
      description: "Extensible UDT that derived from sUDT's programmability to support a wider range of scenarios",
      code: 'https://github.com/nervosnetwork/ckb-production-scripts/blob/master/c/xudt_rce.c',
      website: 'https://blog.cryptape.com/enhance-sudts-programmability-with-xudt#heading-xudt-cell',
    },
  ],
  [
    'Spore',
    {
      name: 'Spore',
      description:
        'Spore Protocol infuses digital assets with enduring value backed by tokenomics, redeemable at any time. Ensures true on-chain ownership, privacy, creative freedom and frictionless interaction.',
      rfc: 'https://github.com/sporeprotocol/spore-contract/blob/master/docs/RFC.md',
      code: 'https://github.com/sporeprotocol/spore-contract',
      doc: 'https://docs.spore.pro/',
      website: 'https://spore.pro/',
    },
  ],
  [
    'Force Bridge',
    {
      name: 'Force Bridge',
      description: 'Force Bridge Lock is compiled from the source code of Omnilock when it has not been released yet',
      doc: 'https://github.com/Magickbase/ckb-explorer-public-issues/issues/532#issue-2097393857',
      website: 'https://forcebridge.com/',
    },
  ],
  [
    'RGB++',
    {
      name: 'RGB++',
      description: 'RGB++ Lock',
      doc: 'https://github.com/ckb-cell/RGBPlusPlus-design/blob/main/docs/',
    },
  ],
  [
    'Unique Cell',
    {
      name: 'Unique Cell',
      description:
        'A unique cell can be created on the Nervos CKB through TypeID which makes sure the unique cell cannot be updated or destroyed.',
      code: 'https://github.com/ckb-cell/unique-cell/',
    },
  ],
  [
    'BTC Time Lock',
    {
      name: 'BTC Time Lock',
      description: 'A lock require n confirmations of Bitcoin transaction to unlock the cell.',
      doc: 'https://github.com/ckb-cell/RGBPlusPlus-design/blob/main/docs/lockscript-design-prd-en.md#btc_time_lock',
    },
  ],
  [
    'Nostr',
    {
      name: 'Nostr',
      description: 'The Nostr lock script is designed for interoperability with Nostr.',
      doc: 'https://github.com/cryptape/nostr-binding/blob/main/docs/lightpaper.md',
      code: 'https://github.com/cryptape/nostr-binding/',
    },
  ],
  [
    'Single Use Lock',
    {
      name: 'Single Use Lock',
      description: 'A lock script that can only be used once.',
      code: 'https://github.com/ckb-ecofund/ckb-proxy-locks',
    },
  ],
  [
    'iCKB Logic',
    {
      name: 'iCKB Logic',
      description: 'iCKB Logic tokenizes NervosDAO deposits into the iCKB xUDT token.',
      rfc: 'https://github.com/ickb/proposal',
      code: 'https://github.com/ickb/v1-core/tree/454cfa966052a621c4e8b67001718c29ee8191a2/scripts/contracts/ickb_logic',
      website: 'https://ickb.org/',
    },
  ],
  [
    'WR Owned-Owner',
    {
      name: 'WR Owned-Owner',
      description:
        'WR Owned-Owner enable to create Withdrawals Request from NervosDAO deposits locked with zero length args locks, developed as part of iCKB.',
      rfc: 'https://github.com/ickb/proposal#owned-owner-script',
      code: 'https://github.com/ickb/v1-core/tree/454cfa966052a621c4e8b67001718c29ee8191a2/scripts/contracts/owned_owner',
    },
  ],
  [
    'UDT Limit Order',
    {
      name: 'UDT Limit Order',
      description: 'UDT Limit Order is a general purpose UDT based Limit Order, developed as part of iCKB.',
      rfc: 'https://github.com/ickb/proposal#limit-order-script',
      code: 'https://github.com/ickb/v1-core/tree/454cfa966052a621c4e8b67001718c29ee8191a2/scripts/contracts/limit_order',
    },
  ],
  [
    'Stable++ Pool',
    {
      name: 'Stable++ Pool',
      description: 'Stable++ Pool',
    },
  ],
  [
    'DID',
    {
      name: 'DID',
      description:
        'DID is a blockchain-based, open source, censorship-resistant decentralized account system that provides a globally unique naming system with a .bit suffix that can be used for cryptocurrency transfers, domain name resolution, authentication, and other scenarios.',
      code: 'https://github.com/dotbitHQ/did-contracts',
      website: 'https://did.id/',
    },
  ],
  [
    'Stable++ Intent Lock',
    {
      name: 'Stable++ Intent Lock',
      description: 'Stable++ Lock hosting pledge',
      website: 'https://www.stablepp.xyz/stablecoin',
    },
  ],
  [
    'Stable++ Vault Lock',
    {
      name: 'Stable++ Vault Lock',
      description: 'Stable++ Vault Lock Script',
      website: 'https://www.stablepp.xyz/stablecoin',
    },
  ],
  [
    'Stable++ Asset',
    {
      name: 'Stable++ Asset',
      description: 'Stable++ Asset',
      website: 'https://www.stablepp.xyz/stablecoin',
    },
  ],
  [
    'USDI Asset',
    {
      name: 'USDI Asset',
      description: 'USDI Asset',
      website: 'https://www.interpaystellar.com/',
    },
  ],
  [
    'Fiber Channel',
    {
      name: 'Fiber Channel',
      description: 'Fiber Channel',
      website: 'https://www.ckbfiber.net',
    },
  ],
])

const getfilterList = (t: TFunction) => [
  {
    key: 'lock',
    value: 'lock',
    title: t('scripts.lock_script'),
    to: '/scripts',
  },
  {
    key: 'type',
    value: 'type',
    title: t('scripts.type_script'),
    to: '/scripts',
  },
]

const getNotefilterList = (t: TFunction) => [
  {
    key: 'ownerless_cell',
    value: 'ownerless_cell',
    title: (
      <>
        <OwnerLessIcon />
        {t('scripts.link.ownerless_cell')}
      </>
    ),
    to: '/scripts',
  },
  {
    key: 'deprecated',
    value: 'deprecated',
    title: (
      <>
        <DeprecatedIcon />
        {t('scripts.deprecated')}
      </>
    ),
    to: '/scripts',
  },

  {
    key: 'rfc',
    value: 'rfc',
    title: (
      <>
        <RFCIcon />
        {t('scripts.link.rfc')}
      </>
    ),
    to: '/scripts',
  },
  {
    key: 'website',
    value: 'website',
    title: (
      <>
        <WebsiteIcon />
        {t('scripts.link.website')}
      </>
    ),
    to: '/scripts',
  },
  {
    key: 'open_source',
    value: 'open_source',
    title: (
      <>
        <OpenSourceIcon />
        {t('scripts.link.code')}
      </>
    ),
    to: '/scripts',
  },
]
const ScriptInfo: FC<{ script: ScriptDetail }> = ({ script }) => {
  const { t } = useTranslation()
  const codeHash = script.hashType === null ? script.typeHash : script.dataHash
  const hashType = script.hashType === null ? 'type' : script.hashType

  const fields: { name: string; value: ReactNode }[] = [
    {
      name: t('scripts.capacity_of_referring_cells'),
      value: <Capacity capacity={shannonToCkb(script.totalReferringCellsCapacity)} display="short" />,
    },
    {
      name: t('scripts.timestamp'),
      value: script.deployedBlockTimestamp ? parseSimpleDate(+script.deployedBlockTimestamp) : null,
    },
  ]

  return (
    <Card key={script.typeHash} className={styles.tokensCard}>
      <dl className={styles.tokenInfo}>
        <dt className={styles.title}>Name</dt>
        <dd>
          <Link className={styles.link} to={`/script/${codeHash}/${hashType}`}>
            {script.name}
          </Link>
        </dd>
      </dl>
      <dl className={styles.tokenInfo}>
        <dt className={styles.title}>{t('scripts.script_note')}</dt>
        <dd className={styles.tdNotes}>
          {script.isZeroLock && <OwnerLessIcon />}
          {script.deprecated && <DeprecatedIcon />}
          {script.rfc && (
            <Link to={script.rfc}>
              <RFCIcon />
            </Link>
          )}
          {script.website && (
            <Link to={script.website}>
              <WebsiteIcon />
            </Link>
          )}
          {script.sourceUrl && (
            <Link to={script.sourceUrl}>
              <OpenSourceIcon />
            </Link>
          )}
        </dd>
      </dl>
      <dl className={styles.tokenInfo}>
        <dt className={styles.title}>{t('scripts.script_type')}</dt>
        {script.isTypeScript && <dd className={styles.value}>{t('scripts.type_script')}</dd>}
        {script.isLockScript && <dd className={styles.value}>{t('scripts.lock_script')}</dd>}
      </dl>
      {fields.map(field => (
        <dl className={styles.tokenInfo}>
          <dt className={styles.title}>{field.name}</dt>
          <dd className={styles.value}>{field.value}</dd>
        </dl>
      ))}
    </Card>
  )
}

function ScriptCard({
  query,
}: {
  query: UseQueryResult<{
    data: ScriptDetail[]
    meta: {
      total: number
      pageSize: number
    }
  }>
}) {
  const { t } = useTranslation()
  const { sortBy, orderBy, updateOrderBy, handleSortClick } = useSortParam<SortField>(undefined, 'capacity.desc')

  return (
    <>
      <Card className="p-2!" shadow={false}>
        <div className="flex flex-wrap gap-2">
          <span className={classNames(styles.sortOption, 'gap-1 text-nowrap mr-auto')}>
            {t('scripts.script_type')}
            <MultiFilterButton filterName="script_type" key="" filterList={getfilterList(t)} />
          </span>
          <div className="flex items-center">
            <Select value={sortBy} onValueChange={value => handleSortClick(value as SortField)}>
              <SelectTrigger className="border-r-0! rounded-r-none!">
                <SelectValue placeholder="sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="capacity">{t('scripts.capacity_of_referring_cells')}</SelectItem>
                <SelectItem value="timestamp">{t('scripts.timestamp')}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="rounded-l-none!"
              variant="outline"
              size="icon"
              onClick={() => updateOrderBy(orderBy === 'desc' ? 'asc' : 'desc')}
            >
              {orderBy === 'desc' ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />}
            </Button>
          </div>
        </div>
      </Card>

      <QueryResult
        query={query}
        loadingRender={() => (
          <div className={styles.tokensLoadingPanel}>
            <SmallLoading />
          </div>
        )}
      >
        {data => (
          <div>
            {data?.data.map(script => (
              <ScriptInfo key={script.typeHash} script={script} />
            ))}
          </div>
        )}
      </QueryResult>
    </>
  )
}

const ScriptTable: FC<{
  query: UseQueryResult<{
    data: ScriptDetail[]
    meta: {
      total: number
      pageSize: number
    }
  }>
  sortParam?: ReturnType<typeof useSortParam<SortField>>
}> = ({ query, sortParam }) => {
  const { t } = useTranslation()

  const columns = [
    {
      title: t('scripts.script_name'),
      className: styles.colName,
      key: 'name',
      render: (script: ScriptDetail) => {
        const codeHash = script.hashType === null ? script.typeHash : script.dataHash
        const hashType = script.hashType === null ? 'type' : script.hashType

        return (
          <div className={styles.container}>
            <div className={styles.right}>
              <div className={styles.symbolAndName}>
                <Link className={styles.link} to={`/script/${codeHash}/${hashType}`}>
                  {script.name}
                </Link>
                <div className={styles.codeHash}>
                  {codeHash.slice(0, 10)}...{codeHash.slice(-8)}
                </div>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      title: (
        <div>
          {t('scripts.script_note')}
          <MultiFilterButton filterName="script_note" key="" filterList={getNotefilterList(t)} />
        </div>
      ),
      classNames: styles.colNotes,
      key: 'script_note',
      render: (script: ScriptDetail) => (
        <div className={styles.tdNotes}>
          {script.isZeroLock === true ? (
            <Tooltip trigger={<OwnerLessIcon />} placement="top">
              {t('scripts.link.ownerless_cell')}
            </Tooltip>
          ) : null}
          {script.deprecated === true ? (
            <Tooltip trigger={<DeprecatedIcon />} placement="top">
              {t('scripts.deprecated')}
            </Tooltip>
          ) : null}
          {script.rfc ? (
            <Tooltip
              trigger={
                <Link to={script.rfc} className={styles.rfcAction}>
                  <RFCIcon />
                </Link>
              }
              placement="top"
            >
              {t('scripts.link.rfc')}
            </Tooltip>
          ) : null}
          {script.website ? (
            <Tooltip
              trigger={
                <Link to={script.website} className={styles.websiteAction}>
                  <WebsiteIcon />
                </Link>
              }
              placement="top"
            >
              {t('scripts.link.website')}
            </Tooltip>
          ) : null}
          {script.sourceUrl ? (
            <Tooltip
              trigger={
                <Link to={script.sourceUrl} className={styles.openSourceAction}>
                  <OpenSourceIcon />
                </Link>
              }
              placement="top"
            >
              {t('scripts.link.code')}
            </Tooltip>
          ) : null}
        </div>
      ),
    },
    {
      title: (
        <div>
          {t('scripts.script_type')}
          <MultiFilterButton filterName="script_type" key="" filterList={getfilterList(t)} />
        </div>
      ),
      key: 'script_type',
      className: styles.colTags,
      render: (script: ScriptDetail) => (
        <div className={styles.tags}>
          {script.isTypeScript && <span className={styles.tag}>{t('scripts.type_script')}</span>}
          {script.isLockScript && <span className={styles.tag}>{t('scripts.lock_script')}</span>}
        </div>
      ),
    },
    {
      title: (
        <div>
          {t('scripts.capacity_of_referring_cells')}
          <SortButton field="capacity" sortParam={sortParam} />
        </div>
      ),
      key: 'capacity',
      className: styles.colTransactions,
      render: (script: ScriptDetail) => (
        <Capacity capacity={shannonToCkb(script.totalReferringCellsCapacity)} display="short" />
      ),
    },
    {
      title: (
        <div>
          {t('scripts.timestamp')}
          <SortButton field="timestamp" sortParam={sortParam} />
        </div>
      ),
      key: 'timestamp',
      className: styles.colCreatedTime,
      render: (script: ScriptDetail) => parseSimpleDate(+script.deployedBlockTimestamp),
    },
    {
      key: 'action',
      render: (script: ScriptDetail) => {
        const codeHash = script.hashType === null ? script.typeHash : script.dataHash
        const hashType = script.hashType === null ? 'type' : script.hashType
        return (
          <div>
            <Link className={styles.action} to={`/script/${codeHash}/${hashType}`}>
              {t('scripts.detail')}
            </Link>
          </div>
        )
      },
    },
  ]

  return (
    <table className={styles.tokensTable}>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column.key}>{column.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {query.data?.data.map(script => (
          <tr key={script.typeHash}>
            {columns.map(column => (
              <td key={column.key} className={column.className}>
                {column.render?.(script)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const ScriptList: FC = () => {
  const { t } = useTranslation()
  const { script_type: scriptType } = useSearchParams('script_type') ?? []
  const { script_note: scriptNote } = useSearchParams('script_note') ?? []

  const { currentPage, pageSize: _pageSize, setPage } = usePaginationParamsInPage()
  const sortParam = useSortParam<SortField>(undefined, 'capacity.desc')
  const { sort } = sortParam

  const scriptTypeArr = scriptType ? decodeURIComponent(scriptType).split(',') : []
  const scriptNoteArr = scriptNote ? decodeURIComponent(scriptNote).split(',') : []

  const query = useQuery(['scripts', currentPage, _pageSize, sort, scriptTypeArr, scriptNoteArr], () =>
    explorerService.api.fetchScripts(currentPage, _pageSize, sort ?? undefined, scriptTypeArr, scriptNoteArr),
  )

  const meta = query?.data?.meta ?? { total: 0, pageSize: 10 }
  const pageSize = meta.pageSize ?? _pageSize
  const totalPages = Math.ceil(meta.total / pageSize)

  return (
    <Content>
      <div className={classNames(styles.tokensPanel, 'container')}>
        <div className={styles.title}>{t(`script_list.title`)}</div>
        <div className={styles.cards}>
          <ScriptCard query={query} />
        </div>
        <div className={styles.table}>
          <ScriptTable query={query} sortParam={sortParam} />
        </div>

        <Pagination
          className={styles.pagination}
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>
    </Content>
  )
}

export default ScriptList
