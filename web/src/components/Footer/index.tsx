import React from 'react'
import { Link } from 'react-router-dom'

import styled from 'styled-components'
import LogoIcon from '../../asserts/ckb_footer_logo.png'

import AboutIcon from '../../asserts/footer_about.png'
import FAQIcon from '../../asserts/footer_faq.png'
import APIIcon from '../../asserts/footer_api.png'
import GithubIcon from '../../asserts/footer_github.png'
import WhitepaperIcon from '../../asserts/footer_whitepaper.png'
import TwitterIcon from '../../asserts/footer_twitter.png'
import BlogIcon from '../../asserts/footer_blog.png'
import TelegramIcon from '../../asserts/footer_telegram.png'
import RedditIcon from '../../asserts/footer_reddit.png'
import YoutubeIcon from '../../asserts/footer_youtube.png'
import ForumIcon from '../../asserts/footer_forum.png'
import { getCurrentYear } from '../../utils/date'

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
    min-height: ${(props: { width: number }) => (380 * props.width) / 1920}px;

    .container {
      display: flex;
      flex-wrap: wrap;

      .footer__top__logo {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        width: 300px;

        img {
          width: ${(props: { width: number }) => (160 * props.width) / 1920}px;
          height: auto;
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
    min-height: ${(props: { width: number }) => (102 * props.width) / 1920}px;
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
  margin-left: 12px;
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
    width: 30px;

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
    name: 'Nervos Foundation',
    items: [
      {
        label: 'About Us',
        icon: AboutIcon,
        url: 'https://www.nervos.org/',
      },
      {
        label: 'FAQ',
        icon: FAQIcon,
        url: 'https://www.nervos.org/faq.html',
      },
    ],
  },
  {
    name: 'Developer',
    items: [
      {
        label: 'API',
        icon: APIIcon,
        url: 'https://github.com/nervosnetwork/ckb/blob/develop/rpc/README.md',
      },
      {
        label: 'GitHub',
        icon: GithubIcon,
        url: 'https://github.com/nervosnetwork',
      },
      {
        label: 'Whitepaper',
        icon: WhitepaperIcon,
        url: 'https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0002-ckb/0002-ckb.md',
      },
    ],
  },
  {
    name: 'Community',
    items: [
      {
        label: 'Twitter',
        icon: TwitterIcon,
        url: 'https://twitter.com/nervosnetwork',
      },
      {
        label: 'Blog',
        icon: BlogIcon,
        url: 'https://medium.com/nervosnetwork',
      },
      {
        label: 'Telegram',
        icon: TelegramIcon,
        url: 'https://t.me/nervosnetwork',
      },
      {
        label: 'Reddit',
        icon: RedditIcon,
        url: 'https://www.reddit.com/r/NervosNetwork/',
      },
      {
        label: 'YouTube',
        icon: YoutubeIcon,
        url: 'https://www.youtube.com/channel/UCONuJGdMzUY0Y6jrPBOzH7A',
      },
      {
        label: 'Forum',
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
    <FooterDiv width={window.innerWidth}>
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
