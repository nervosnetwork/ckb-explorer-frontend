import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import LogoIcon from '../../assets/ckb_footer_logo.png'
import AboutIcon from '../../assets/footer_about.png'
import FAQIcon from '../../assets/footer_faq.png'
import APIIcon from '../../assets/footer_api.png'
import GithubIcon from '../../assets/footer_github.png'
import WhitepaperIcon from '../../assets/footer_whitepaper.png'
import TwitterIcon from '../../assets/footer_twitter.png'
import BlogIcon from '../../assets/footer_blog.png'
import TelegramIcon from '../../assets/footer_telegram.png'
import RedditIcon from '../../assets/footer_reddit.png'
import YoutubeIcon from '../../assets/footer_youtube.png'
import ForumIcon from '../../assets/footer_forum.png'
import { getCurrentYear } from '../../utils/date'
import i18n from '../../utils/i18n'
import { FooterDiv, FooterItemPanel } from './styled'

const Footers = [
  {
    name: i18n.t('footer.nervos_foundation'),
    items: [
      {
        label: i18n.t('footer.about_us'),
        icon: AboutIcon,
        url: 'https://www.nervos.org/',
      },
      {
        label: i18n.t('footer.faq'),
        icon: FAQIcon,
        url: 'https://www.nervos.org/faq',
      },
    ],
  },
  {
    name: i18n.t('footer.developer'),
    items: [
      {
        label: i18n.t('footer.api'),
        icon: APIIcon,
        url: 'https://github.com/nervosnetwork/ckb/blob/develop/rpc/README.md',
      },
      {
        label: i18n.t('footer.gitHub'),
        icon: GithubIcon,
        url: 'https://github.com/nervosnetwork',
      },
      {
        label: i18n.t('footer.whitepaper'),
        icon: WhitepaperIcon,
        url: 'https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0002-ckb/0002-ckb.md',
      },
    ],
  },
  {
    name: i18n.t('footer.community'),
    items: [
      {
        label: i18n.t('footer.twitter'),
        icon: TwitterIcon,
        url: 'https://twitter.com/nervosnetwork',
      },
      {
        label: i18n.t('footer.blog'),
        icon: BlogIcon,
        url: 'https://medium.com/nervosnetwork',
      },
      {
        label: i18n.t('footer.telegram'),
        icon: TelegramIcon,
        url: 'https://t.me/nervosnetwork',
      },
      {
        label: i18n.t('footer.reddit'),
        icon: RedditIcon,
        url: 'https://www.reddit.com/r/NervosNetwork/',
      },
      {
        label: i18n.t('footer.youtube'),
        icon: YoutubeIcon,
        url: 'https://www.youtube.com/channel/UCONuJGdMzUY0Y6jrPBOzH7A',
      },
      {
        label: i18n.t('footer.forum'),
        icon: ForumIcon,
        url: 'https://talk.nervos.org/',
      },
    ],
  },
]

const FooterItem = (link: any) => {
  return (
    <FooterItemPanel key={link.label} href={link.url} rel="noopener noreferrer" target="_blank">
      <div>
        <img src={link.icon} alt="orgItemLogo" />
      </div>
      <div>{link.label}</div>
    </FooterItemPanel>
  )
}

export default () => {
  return useMemo(() => {
    // normally rerender will not occur with useMemo
    return (
      <FooterDiv>
        <div className="footer__top">
          <div className="container">
            <div className="footer__top__logo">
              <Link to="/">
                <img src={LogoIcon} alt="logo" />
              </Link>
            </div>
            <div className="footer__top__items">
              <div>
                {Footers.map((item: any) => {
                  return (
                    <div key={item.name} className="footer__top__item">
                      <div>{item.name}</div>
                      <div>
                        {item.items.map((link: any) => {
                          return FooterItem(link)
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="footer__copyright">{`Copyright © ${getCurrentYear()} Nervos Foundation. All Rights Reserved.`}</div>
      </FooterDiv>
    )
  }, [])
}
