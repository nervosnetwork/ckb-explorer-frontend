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
      }
      .footer__top__logo {
        img {
          &:hover {
            transform: scale(1.1, 1.1);
          }
        }
      }
      .footer__top__orgs {
        .footer__top__orgs__item {
          opacity: 0.8;
          &:hover {
            opacity: 1;
          }
          .footer__top__orgs__item__link {
            text-decoration: none;
            &:hover {
              transform: scale(1.1, 1.1);
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
        url: 'https://github.com/nervosnetwork/ckb/blob/develop/rpc/doc.md',
      },
      {
        label: 'Github',
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
        label: 'Youtube',
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
          <div
            className="footer__top__logo"
            style={{
              width: 153 * 2 + 121,
              textAlign: 'center',
            }}
          >
            <Link to="/">
              <img
                src={LogoIcon}
                alt="logo"
                style={{
                  width: 121,
                  height: 121,
                }}
              />
              <div
                style={{
                  marginTop: 25,
                  color: '#46ab81',
                  fontSize: 22,
                  fontWeight: 'bold',
                }}
              >
                {'CKB Testnet Explorer'}
              </div>
            </Link>
          </div>
          <div
            className="footer__top__orgs"
            style={{
              flex: 1,
            }}
          >
            <div>
              {orgs.map((item: any) => {
                return (
                  <div
                    key={item.name}
                    className="footer__top__orgs__item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: 25,
                      marginBottom: 25,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 20,
                        width: 100,
                        marginRight: 33,
                        color: 'rgb(75 188 142)',
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                      }}
                    >
                      {item.items.map((link: any) => {
                        return (
                          <a
                            key={link.label}
                            href={link.url}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="footer__top__orgs__item__link"
                            style={{
                              marginLeft: 25,
                              marginTop: 15,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                              }}
                            >
                              <img
                                src={link.icon}
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                }}
                                alt="orgItemLogo"
                              />
                            </div>
                            <div
                              style={{
                                color: 'white',
                                width: 80,
                                marginTop: 7,
                                textAlign: 'center',
                              }}
                            >
                              {link.label}
                            </div>
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
      <div className="footer__bottom">© CKB Explorer is a project of the Nervos Foundation. All Rights Reserved.</div>
    </FooterDiv>
  )
}
