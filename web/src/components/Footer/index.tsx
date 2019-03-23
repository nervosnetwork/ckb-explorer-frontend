import React from 'react'
import styled from 'styled-components'
import LogoIcon from '../../logo.png'

import AboutIcon from '../../asserts/footer_About.png'
import FAQIcon from '../../asserts/footer_FAQ.png'
import APIIcon from '../../asserts/footer_API.png'
import GithubIcon from '../../asserts/footer_Github.png'
import WhitepaperIcon from '../../asserts/footer_Whitepaper.png'
import TwitterIcon from '../../asserts/footer_Twitter.png'
import BlogIcon from '../../asserts/footer_Blog.png'
import TelegramIcon from '../../asserts/footer_Telegram.png'
import RedditIcon from '../../asserts/footer_Reddit.png'
import YoutubeIcon from '../../asserts/footer_Youtube.png'
import ForumIcon from '../../asserts/footer_Forum.png'

const FooterDiv = styled.div`
  width: 100%;
  overflow: hidden;
  background-color: #18325d;
  display: flex;
  flex-direction: column;
  .footer--top,
  .footer--bottom {
    display: flex;
    padding: 20px;
    align-items: center;
    justify-content: center;
  }
  .footer--top {
    min-height: ${(props: { width: number }) => (467 * props.width) / 1920}px;
    .container {
      display: flex;
      flex-wrap: wrap;
      .footer--top--orgs,
      .footer--top--logo {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
      }
      .footer--top--orgs {
        .footer--top--orgs--item {
          opacity: 0.9;
          &:hover {
            opacity: 1;
          }
          .footer--top--orgs--item--link {
            text-decoration: none;
            &:hover {
              transform: scale(1.1, 1.1);
            }
          }
        }
      }
    }
  }
  .footer--bottom {
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
        url: '#',
      },
      {
        label: 'FAQ',
        icon: FAQIcon,
        url: '#',
      },
    ],
  },
  {
    name: 'Developer',
    items: [
      {
        label: 'API',
        icon: APIIcon,
        url: '#',
      },
      {
        label: 'Github',
        icon: GithubIcon,
        url: '#',
      },
      {
        label: 'Whitepaper',
        icon: WhitepaperIcon,
        url: '#',
      },
    ],
  },
  {
    name: 'Community',
    items: [
      {
        label: 'Twitter',
        icon: TwitterIcon,
        url: '#',
      },
      {
        label: 'Blog',
        icon: BlogIcon,
        url: '#',
      },
      {
        label: 'Telegram',
        icon: TelegramIcon,
        url: '#',
      },
      {
        label: 'Reddit',
        icon: RedditIcon,
        url: '#',
      },
      {
        label: 'Youtube',
        icon: YoutubeIcon,
        url: '#',
      },
      {
        label: 'Forum',
        icon: ForumIcon,
        url: '#',
      },
    ],
  },
]

export default () => {
  return (
    <FooterDiv width={window.innerWidth}>
      <div className="footer--top">
        <div className="container">
          <div
            className="footer--top--logo"
            style={{
              width: 153 * 2 + 121,
            }}
          >
            <div
              style={{
                textAlign: 'center',
              }}
            >
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
            </div>
          </div>
          <div
            className="footer--top--orgs"
            style={{
              flex: 1,
            }}
          >
            <div>
              {orgs.map((item: any) => {
                return (
                  <div
                    className="footer--top--orgs--item"
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
                            href={link.url}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="footer--top--orgs--item--link"
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
      <div className="footer--bottom">© CKB Explorer is a project of the Nervos Foundation. All Rights Reserved.</div>
    </FooterDiv>
  )
}
