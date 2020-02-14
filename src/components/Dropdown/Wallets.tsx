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
  padding: 0 12px;
`

const WalletsLinePanel = styled.div`
  width: 100%;
  height: 90px;
  background: white;
  display: flex;
`

const WalletsItemPanel = styled.div`
  width: 165px;
  height: 90px;
  display: flex;
  padding-top: 9px;
  margin-left: ${(props: { isOdd: boolean }) => (props.isOdd ? '18px' : '0px')}

  &:hover {
    background: #f1f1f1;
    border-radius: 2px;
  }

  > img {
    width: 20px;
    height: 20px;
  }

  .wallets__item__content {
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`

const WalletsTagPanel = styled.div`
  width: 18px;
  height: 9px;
  text-align: center;
  margin: auto 0;
  font-size: 7px;
  color: #888888;
  border-radius: 2px;
  border: solid 0.5px #888888;
`

interface WalletInfoItem {
  image: any
  title: string
  description: string
  tags: string[]
  url: string
}

const WalletInfoItems: WalletInfoItem[] = [
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
  return <WalletsTagPanel>{tag}</WalletsTagPanel>
}

const WalletsItemComp = ({ wallet, index }: { wallet: WalletInfoItem; index: number }) => {
  return (
    <WalletsItemPanel isOdd={index / 2 === 1}>
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

export default () => {
  return (
    <WalletsPanel>
      <WalletsLinePanel>
        {WalletInfoItems.slice(0, 2).map((wallet, index) => {
          return <WalletsItemComp wallet={wallet} index={index} key={wallet.title} />
        })}
      </WalletsLinePanel>
      <WalletsLinePanel>
        {WalletInfoItems.slice(2, 4).map((wallet, index) => {
          return <WalletsItemComp wallet={wallet} index={index} key={wallet.title} />
        })}
      </WalletsLinePanel>
      <WalletsLinePanel>
        {WalletInfoItems.slice(4).map((wallet, index) => {
          return <WalletsItemComp wallet={wallet} index={index} key={wallet.title} />
        })}
      </WalletsLinePanel>
    </WalletsPanel>
  )
}
