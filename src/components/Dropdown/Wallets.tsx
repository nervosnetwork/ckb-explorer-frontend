import React from 'react'
import styled from 'styled-components'
import WalletABCIcon from '../../assets/wallet_abc.png'
import WalletImTokenIcon from '../../assets/wallet_imtoken.png'
import WalletHooIcon from '../../assets/wallet_hoo.png'
import WalletCoboIcon from '../../assets/wallet_cobo.png'
import WalletNeuronIcon from '../../assets/wallet_neuron.png'
import WalletBitpieIcon from '../../assets/wallet_bitpie.png'
import i18n from '../../utils/i18n'

const WalletsPanel = styled.div`
  width: 372px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 12px 0 12px;
  border-radius: 3px;
  box-shadow: 1px 1px 3px 0 #dfdfdf;
  position: fixed;
  position: -webkit-fixed;
  z-index: 1000;
  left: ${(props: { left: number; top: number }) => props.left}px;
  top: ${(props: { left: number; top: number }) => props.top}px;
`

const WalletsSeparatePanel = styled.div`
  display: flex;
  .wallets__separate__left {
    width: 165px;
    height: 1px;
    background: #b3b3b3;
  }

  .wallets__separate__right {
    width: 165px;
    height: 1px;
    margin-left: 18px;
    background: #b3b3b3;
  }
`

const WalletsLinePanel = styled.div`
  width: 100%;
  background: white;
  display: flex;
`

const WalletsItemPanel = styled.a`
  width: 165px;
  display: flex;
  padding: ${(props: { isLast?: boolean; isOdd: boolean }) => (props.isLast ? '9px 8px 10px 8px' : '9px 8px 20px 8px')};
  margin-left: ${(props: { isOdd: boolean }) => (props.isOdd ? '18px' : '0px')}

  &:hover {
    background: #f1f1f1;
    border-radius: 2px;
  }

  > img {
    width: 20px;
    height: 20px;
    margin-top: 2px;
  }

  .wallets__item__content {
    margin-left: 12px;
    width: 117px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .wallets__item__title {
      font-size: 12px;
      height: 14px;
      line-height: 14px;
      color: #000000;
    }

    .wallets__item__description {
      font-size: 8px;
      margin-top: 3px;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      color: #888888;
    }

    .wallets__item__tags {
      display: flex;
      margin-top: 7px;
    }
  }
`

const WalletsTagPanel = styled.div`
  padding: 0px 3px;
  height: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  border: solid 0.5px #888888;
  margin-right: 5px;

  > span {
    font-size: 7px;
    height: 7px;
    line-height: 7px;
    color: #888888;
  }
`

const WalletsMemoPanel = styled.div`
  font-size: 9px;
  color: #888888;
  width: 100%;
  margin-bottom: 10px;
  text-align: center;
  letter-spacing: 0px;
  word-spacing: 2px;
`

interface WalletInfoItem {
  image: any
  title: string
  description: string
  tags: string[]
  url: string
}

export const WalletInfoItems: WalletInfoItem[] = [
  {
    image: WalletABCIcon,
    title: i18n.t('navbar.wallet_abc'),
    description: i18n.t('navbar.wallet_abc_description'),
    tags: ['iOS', 'Android', 'HTML'],
    url: 'https://abcwallet.com/',
  },
  {
    image: WalletBitpieIcon,
    title: i18n.t('navbar.wallet_bitpie'),
    description: i18n.t('navbar.wallet_bitpie_description'),
    tags: ['iOS', 'Android'],
    url: 'https://bitpie.com/',
  },
  {
    image: WalletCoboIcon,
    title: i18n.t('navbar.wallet_cobo'),
    description: i18n.t('navbar.wallet_cobo_description'),
    tags: ['iOS', 'Android'],
    url: 'https://cobo.com/',
  },
  {
    image: WalletHooIcon,
    title: i18n.t('navbar.wallet_hoo'),
    description: i18n.t('navbar.wallet_hoo_description'),
    tags: ['iOS', 'Android'],
    url: 'https://hoo.com/',
  },
  {
    image: WalletImTokenIcon,
    title: i18n.t('navbar.wallet_imtoken'),
    description: i18n.t('navbar.wallet_imtoken_description'),
    tags: ['iOS', 'Android'],
    url: 'https://token.im/?locale=en-us',
  },
  {
    image: WalletNeuronIcon,
    title: i18n.t('navbar.wallet_neuron'),
    description: i18n.t('navbar.wallet_neuron_description'),
    tags: ['macOS', 'Windows', 'Linux'],
    url: 'https://github.com/nervosnetwork/neuron/releases',
  },
]

const WalletsTagComp = ({ tag }: { tag: string }) => {
  return (
    <WalletsTagPanel>
      <span>{tag}</span>
    </WalletsTagPanel>
  )
}

const WalletsItemComp = ({ wallet, index, isLast }: { wallet: WalletInfoItem; index: number; isLast?: boolean }) => {
  return (
    <WalletsItemPanel isOdd={index % 2 === 1} href={wallet.url} target="_blank" isLast={isLast}>
      <img alt={wallet.title} src={wallet.image} />
      <div className="wallets__item__content">
        <div className="wallets__item__title">{wallet.title}</div>
        <div className="wallets__item__description">{wallet.description}</div>
        <div className="wallets__item__tags">
          {wallet.tags.map(tag => (
            <WalletsTagComp tag={tag} key={tag} />
          ))}
        </div>
      </div>
    </WalletsItemPanel>
  )
}

export default ({ setShowWallets, left, top }: { setShowWallets: Function; left: number; top: number }) => {
  return (
    <WalletsPanel
      left={left}
      top={top}
      onMouseLeave={() => {
        setShowWallets(false)
      }}
    >
      <WalletsLinePanel>
        {WalletInfoItems.slice(0, 2).map((wallet, index) => {
          return <WalletsItemComp wallet={wallet} index={index} key={wallet.title} />
        })}
      </WalletsLinePanel>
      <WalletsSeparatePanel>
        <div className="wallets__separate__left" />
        <div className="wallets__separate__right" />
      </WalletsSeparatePanel>
      <WalletsLinePanel>
        {WalletInfoItems.slice(2, 4).map((wallet, index) => {
          return <WalletsItemComp wallet={wallet} index={index} key={wallet.title} />
        })}
      </WalletsLinePanel>
      <WalletsSeparatePanel>
        <div className="wallets__separate__left" />
        <div className="wallets__separate__right" />
      </WalletsSeparatePanel>
      <WalletsLinePanel>
        {WalletInfoItems.slice(4).map((wallet, index) => {
          return <WalletsItemComp wallet={wallet} index={index} key={wallet.title} isLast />
        })}
      </WalletsLinePanel>
      <WalletsMemoPanel>{i18n.t('navbar.wallets_memo')}</WalletsMemoPanel>
    </WalletsPanel>
  )
}
