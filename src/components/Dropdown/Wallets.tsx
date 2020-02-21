import React from 'react'
import styled from 'styled-components'
import WalletABCIcon from '../../assets/wallet_abc.png'
import WalletImTokenIcon from '../../assets/wallet_imtoken.png'
import WalletHooIcon from '../../assets/wallet_hoo.png'
import WalletCoboIcon from '../../assets/wallet_cobo.png'
import WalletNeuronIcon from '../../assets/wallet_neuron.png'
import WalletBitpieIcon from '../../assets/wallet_bitpie.png'
import WalletRenrenbitIcon from '../../assets/wallet_renrenbit.png'
import TagAndroidIcon from '../../assets/tag_android.png'
import TagiOSIcon from '../../assets/tag_ios.png'
import TagHtmlIcon from '../../assets/tag_html.png'
import TagMacIcon from '../../assets/tag_mac.png'
import TagWindowsIcon from '../../assets/tag_windows.png'
import TagLinuxIcon from '../../assets/tag_linux.png'
import i18n from '../../utils/i18n'

const WalletsPanel = styled.div`
  width: 616px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 10px;
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
    width: 192px;
    height: 1px;
    background: #b3b3b3;
  }

  .wallets__separate__middle {
    width: 192px;
    height: 1px;
    margin-left: 10px;
    background: #b3b3b3;
  }

  .wallets__separate__right {
    width: 192px;
    height: 1px;
    margin-left: 10px;
    background: #b3b3b3;
  }
`

const WalletsLinePanel = styled.div`
  width: 100%;
  background: white;
  display: flex;
  margin-top: 10px;
  margin-bottom: ${(props: { isLast?: boolean }) => (props.isLast ? '0px' : '10px')};
`

const WalletsItemPanel = styled.a`
  width: 192px;
  display: flex;
  padding: 10px;
  margin-left: ${(props: { isFirst: boolean }) => (props.isFirst ? '0px' : '10px')};

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
    width: 150px;
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
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.17;
      letter-spacing: normal;
      margin-top: 3px;
      overflow: hidden;
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
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;

  > img {
    height: 9px;
    width: auto;
  }
`

const WalletsMemoPanel = styled.div`
  font-size: 12px;
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
    tags: [TagiOSIcon, TagAndroidIcon, TagHtmlIcon],
    url: 'https://abcwallet.com/',
  },
  {
    image: WalletBitpieIcon,
    title: i18n.t('navbar.wallet_bitpie'),
    description: i18n.t('navbar.wallet_bitpie_description'),
    tags: [TagiOSIcon, TagAndroidIcon],
    url: 'https://bitpie.com/',
  },
  {
    image: WalletCoboIcon,
    title: i18n.t('navbar.wallet_cobo'),
    description: i18n.t('navbar.wallet_cobo_description'),
    tags: [TagiOSIcon, TagAndroidIcon],
    url: 'https://cobo.com/',
  },
  {
    image: WalletHooIcon,
    title: i18n.t('navbar.wallet_hoo'),
    description: i18n.t('navbar.wallet_hoo_description'),
    tags: [TagiOSIcon, TagAndroidIcon],
    url: 'https://hoo.com/',
  },
  {
    image: WalletImTokenIcon,
    title: i18n.t('navbar.wallet_imtoken'),
    description: i18n.t('navbar.wallet_imtoken_description'),
    tags: [TagiOSIcon, TagAndroidIcon],
    url: 'https://token.im/?locale=en-us',
  },
  {
    image: WalletNeuronIcon,
    title: i18n.t('navbar.wallet_neuron'),
    description: i18n.t('navbar.wallet_neuron_description'),
    tags: [TagMacIcon, TagWindowsIcon, TagLinuxIcon],
    url: 'https://github.com/nervosnetwork/neuron/releases',
  },
  {
    image: WalletRenrenbitIcon,
    title: i18n.t('navbar.wallet_renrenbit'),
    description: i18n.t('navbar.wallet_renrenbit_description'),
    tags: [TagiOSIcon, TagAndroidIcon],
    url: ' https://www.renrenbit.com/?lang=en#/',
  },
]

const WalletsTagComp = ({ tag }: { tag: any }) => {
  return (
    <WalletsTagPanel>
      <img src={tag} alt="wallet tag icon" />
    </WalletsTagPanel>
  )
}

const WalletsSeparateComp = () => {
  return (
    <WalletsSeparatePanel>
      <div className="wallets__separate__left" />
      <div className="wallets__separate__middle" />
      <div className="wallets__separate__right" />
    </WalletsSeparatePanel>
  )
}

const WalletsItemComp = ({ wallet, index }: { wallet: WalletInfoItem; index: number }) => {
  return (
    <WalletsItemPanel isFirst={index === 0} href={wallet.url} target="_blank">
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
        {WalletInfoItems.slice(0, 3).map((wallet, index) => {
          return <WalletsItemComp wallet={wallet} index={index} key={wallet.title} />
        })}
      </WalletsLinePanel>
      <WalletsSeparateComp />
      <WalletsLinePanel>
        {WalletInfoItems.slice(3, 6).map((wallet, index) => {
          return <WalletsItemComp wallet={wallet} index={index} key={wallet.title} />
        })}
      </WalletsLinePanel>
      <WalletsSeparateComp />
      <WalletsLinePanel isLast>
        {WalletInfoItems.slice(6).map((wallet, index) => {
          return <WalletsItemComp wallet={wallet} index={index} key={wallet.title} />
        })}
      </WalletsLinePanel>
      <WalletsMemoPanel>{i18n.t('navbar.wallets_memo')}</WalletsMemoPanel>
    </WalletsPanel>
  )
}
