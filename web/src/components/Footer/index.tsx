import React from 'react'
import { Link } from 'react-router-dom'

import styled from 'styled-components'
import LogoIcon from '../../logo.png'

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
  background-color: #18325d;
  display: flex;
  flex-direction: column;
  a {
    text-decoration: none;
  }
  .footer__top,
  .footer__bottom {
    display: flex;
    padding: 20px;
    align-items: center;
    justify-content: center;
  }
  .footer__top {
    min-height: ${(props: { width: number }) => (467 * props.width) / 1920}px;
    .container {
      display: flex;
      flex-wrap: wrap;
      .footer__top__orgs,
      .footer__top__logo {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        width: ${153 * 2 + 121}px;
      }
      .footer__top__logo {
        img {
          width: ${(props: { width: number }) => (370 * props.width) / 1920}px;
          height: auto;
          &:hover {
            transform: scale(1.1, 1.1);
          }
        }
      }
      .footer__top__orgs {
        flex: 1;
        .footer__top__orgs__item {
          opacity: 0.8;
          display: flex;
          align-items: center;
          margin-top: 25px;
          margin-bottom: 25px;
          &:hover {
            opacity: 1;
          }
          > div:nth-child(1) {
            font-size: 20px;
            width: 100px;
            margin-right: 33px;
            color: rgb(75 188 142);
          }
          > div:nth-child(2) {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
          }
          .footer__top__orgs__item__link {
            margin-left: 25px;
            margin-top: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            &:hover {
              transform: scale(1.1, 1.1);
            }
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
              width: 80px;
              margin-top: 7px;
              text-align: center;
            }
          }
        }
      }
    }
  }
  .footer__bottom {
    min-height: ${(props: { width: number }) => (102 * props.width) / 1920}px;
    border-top: 1px solid white;
    font-family: Helvetica;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    color: #e3e3e3;
  }
`
const orgs = [
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
          <div className="footer__top__orgs">
            <div>
              {orgs.map((item: any) => {
                return (
                  <div key={item.name} className="footer__top__orgs__item">
                    <div>{item.name}</div>
                    <div>
                      {item.items.map((link: any) => {
                        return (
                          <a
                            key={link.label}
                            href={link.url}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="footer__top__orgs__item__link"
                          >
                            <div>
                              <img src={link.icon} alt="orgItemLogo" />
                            </div>
                            <div>{link.label}</div>
                          </a>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">{`Copyright © ${getCurrentYear()} Nervos Foundation. All Rights Reserved.`}</div>
    </FooterDiv>
  )
}
