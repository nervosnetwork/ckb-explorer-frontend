import React from 'react'
import { Link } from 'react-router-dom'

import styled from 'styled-components'
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

const FooterDiv = styled.div`
  width: 100%;
  overflow: hidden;
  background-color: #424242;
  display: flex;
  flex-direction: column;

  .footer__top {
    display: flex;
    padding: 20px 12px;
    align-items: center;
    justify-content: center;
    min-height: 145px;

    .container {
      display: flex;
      flex-wrap: wrap;

      @media (max-width: 700px) {
        flex-direction: column;
        flex-wrap: nowrap;
      }

      .footer__top__logo {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        width: 276px;

        img {
          width: 110px;
          height: auto;

          @media (max-width: 700px) {
            width: 40px;
          }
        }
      }

      .footer__top__items {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;

        .footer__top__item {
          opacity: 0.8;
          display: flex;
          align-items: center;
          margin-top: 25px;
          margin-bottom: 25px;

          > div:nth-child(1) {
            font-size: 16px;
            width: 90px;
            font-weight: bold;
            margin-right: 10px;
            color: #3cc68a;
          }

          > div:nth-child(2) {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
          }

          @media (max-width: 700px) {
            margin-top: 15px;
            margin-bottom: 15px;

            > div:nth-child(1) {
              font-size: 14px;
              width: 80px;
              margin-top: 15px;
            }
          }
        }
      }
    }
  }

  .footer__copyright {
    display: flex;
    padding: 20px;
    align-items: center;
    justify-content: center;
    border-top: 1px solid white;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    color: #e3e3e3;

    @media (max-width: 700px) {
      padding: 10px;
      font-size: 12px;
    }
  }
`

const FooterItemPanel = styled.a`
  margin-left: 6px;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  width: 70px;
  height: auto;

  >div: nth-child(1) {
    width: 32px;
    height: 32px;
    img {
      width: 100%;
      height: auto;
    }
  }
  >div: nth-child(2) {
    color: white;
    font-size: 12px;
    margin-top: 7px;
    text-align: center;
  }

  @media (max-width: 700px) {
    width: 35px;

    >div: nth-child(1) {
      width: 18px;
      height: 18px;
    }
    >div: nth-child(2) {
      font-size: 8px;
      margin-top: 5px;
    }
  }
`

const footers = [
  {
    name: i18n.t('footer.nervos_foundation'),
    items: [
      {
        label: i18n.t('footer.aboutus'),
        icon: AboutIcon,
        url: 'https://www.nervos.org/',
      },
      {
        label: i18n.t('footer.faq'),
        icon: FAQIcon,
        url: 'https://www.nervos.org/faq.html',
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
              {footers.map((item: any) => {
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
}
