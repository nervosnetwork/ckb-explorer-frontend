import { OpenInNewWindowIcon } from '@radix-ui/react-icons'
import { IS_MAINNET } from '../../constants/common'
import { claimTestToken } from '../../services/UtilityService'
import Popover from '../Popover'
import { useSetToast } from '../Toast'
import { ReactComponent as FaucetIcon } from './faucet.svg'

import styles from './index.module.scss'

export const CLAIMABLE_TEST_TOKENS = [
  {
    symbol: 'CKB',
  },
  {
    symbol: 'USDI',
    tokenId: '0x07ac97b5ff3df4b49f59a59f4d80d33d22c1263a57467c512c93b9c29b7a0de3',
    link: '/xudt/0x07ac97b5ff3df4b49f59a59f4d80d33d22c1263a57467c512c93b9c29b7a0de3',
  },
]

export const FaucetMenu = ({ address, tokenId }: { address?: string; tokenId?: string }) => {
  const setToast = useSetToast()

  const handleClaim = async (address?: string, token?: string) => {
    if (!address) {
      console.error('Address is required')
      return
    }
    if (!token) {
      console.error('Token is required')
      return
    }
    try {
      switch (token) {
        case 'CKB': {
          setToast({ message: `Submitted a claim for the CKB Test Token.` })
          const res: { data: { attributes: { capacity: string } } } = await claimTestToken(address, 'ckb')
          setToast({ message: `Claimed: ${(+res.data.attributes.capacity).toLocaleString('en')} CKB Successfully` })
          break
        }
        case 'USDI': {
          setToast({ message: `Submitted a claim for the USDI Test Token.` })
          await claimTestToken(address, 'usdi')
          setToast({ message: 'Claimed 1,000 USDI Successfully' })
          break
        }
        default: {
          // ignore
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        setToast({ message: e.message, type: 'warning' })
      } else {
        setToast({ message: 'Claim Failed' })
      }
    }
  }

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const elm = e.currentTarget

    if (!(elm instanceof HTMLButtonElement)) return

    const { token, action } = elm.dataset
    if (action === 'claim') {
      await handleClaim(address, token)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const elm = e.target as HTMLFormElement
    const addr = elm.address.value
    const token = CLAIMABLE_TEST_TOKENS.find(t => t.tokenId === tokenId)?.symbol
    await handleClaim(addr, token)
  }

  if (IS_MAINNET) return null

  if (CLAIMABLE_TEST_TOKENS.some(token => token.tokenId && token.tokenId === tokenId)) {
    return (
      <Popover trigger={<FaucetIcon />}>
        <div>
          <form onSubmit={handleFormSubmit} className={styles.form}>
            <input name="address" placeholder="address" type="text" />
            <button type="submit">Claim</button>
          </form>
        </div>
      </Popover>
    )
  }

  if (address) {
    return (
      <Popover trigger={<FaucetIcon />} contentStyle={{ padding: 0 }}>
        <div className={styles.container}>
          {CLAIMABLE_TEST_TOKENS.map(token => {
            return (
              <div key={token.symbol} className={styles.item}>
                <button
                  type="button"
                  data-token={token.symbol}
                  data-action="claim"
                  onClick={handleClick}
                >{`${token.symbol} Test Token`}</button>
                {token.link ? (
                  <a href={token.link} target="_blank" rel="noopener noreferrer">
                    <OpenInNewWindowIcon />
                  </a>
                ) : null}
              </div>
            )
          })}
        </div>
      </Popover>
    )
  }
  return null
}
