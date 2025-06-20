import { useState, memo } from 'react'
import classNames from 'classnames'
import { useQuery } from '@tanstack/react-query'
import { ChainName, MAINNET_URL, ONE_DAY_MILLISECOND, TESTNET_URL } from '../../../constants/common'
import { explorerService } from '../../../services/ExplorerService'
import { cacheService } from '../../../services/CacheService'
import { useChainName } from '../../../hooks/useCKBNode'
import Popover from '../../Popover'
import { ReactComponent as ArrowIcon } from '../MenusComp/arrow.svg'

const handleVersion = (nodeVersion: string) => {
  if (nodeVersion && nodeVersion.indexOf('(') !== -1) {
    return `v${nodeVersion.slice(0, nodeVersion.indexOf('('))}`
  }
  return nodeVersion
}

export default memo(() => {
  const query = useQuery(
    ['node_version'],
    async () => {
      const { version } = await explorerService.api.fetchNodeVersion()
      cacheService.set<string>('node_version', version, { expireTime: ONE_DAY_MILLISECOND })
      return version
    },
    {
      keepPreviousData: true,
      initialData: () => cacheService.get<string>('node_version'),
    },
  )
  const nodeVersion = query.data ?? ''
  const [open, setOpen] = useState(false)

  const chainName = useChainName()

  return (
    <Popover
      onOpenChange={setOpen}
      open={open}
      showArrow={false}
      contentStyle={{
        padding: 4,
        minWidth: 'var(--radix-popper-anchor-width)',
        width: 'fit-content',
      }}
      trigger={
        <div className="flex flex-col md:mx-0 md:mt-0 md:mr-[50px] mx-[56px] mt-[22px]">
          <div className="flex items-center justify-between text-primary uppercase">
            <span className="leading-[1]">{chainName}</span>
            <ArrowIcon className={classNames('h-[10px] ml-1 rotate-180')} />
          </div>
          <div className="text-[8px] text-primary">{handleVersion(nodeVersion)}</div>
        </div>
      }
    >
      <div className="flex flex-col gap-1 capitalize">
        <a className="py-1 px-2 hover:bg-[#f4f4f5]! rounded-sm" href={MAINNET_URL}>
          {`${ChainName.Mainnet} Mainnet`}
        </a>
        <a className="py-1 px-2 hover:bg-[#f4f4f5]! rounded-sm" href={TESTNET_URL}>
          {`${ChainName.Testnet} Testnet`}
        </a>
      </div>
    </Popover>
  )
})
