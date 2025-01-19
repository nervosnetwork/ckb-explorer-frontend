import { ReactNode, memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SubmitTokenInfo } from '../SubmitTokenInfo'
import { ReactComponent as XIcon } from './footer_X.svg'
import { ReactComponent as MediumIcon } from './footer_medium.svg'
import { ReactComponent as TelegramIcon } from './footer_telegram.svg'
import { ReactComponent as RedditIcon } from './footer_reddit.svg'
import { ReactComponent as YoutubeIcon } from './footer_youtube.svg'
import { ReactComponent as ForumIcon } from './footer_forum.svg'
import { ReactComponent as Discord } from './footer_discord.svg'
import { ReactComponent as Open } from './open.svg'
import { getCurrentYear } from '../../utils/date'
import styles from './index.module.scss'

interface FooterLinkItem {
  label: string
  url: string
  icon?: ReactNode
}

const Footers: { name: string; items: FooterLinkItem[] }[] = [
  {
    name: 'nervos_foundation',
    items: [
      {
        label: 'about_us',
        url: 'https://www.nervos.org/',
      },
      {
        label: 'media_kit',
        url: 'https://www.nervos.org/media-kit',
      },
    ],
  },
  {
    name: 'developer',
    items: [
      {
        label: 'docs',
        url: 'https://docs.nervos.org',
      },
      {
        label: 'gitHub',
        url: 'https://github.com/nervosnetwork',
      },
      {
        label: 'whitepaper',
        url: 'https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0002-ckb/0002-ckb.md',
      },
      {
        label: 'faucet',
        url: 'https://faucet.nervos.org/',
      },
      {
        label: 'api-doc',
        url: 'https://ckb-explorer.readme.io/reference/transaction',
      },
      {
        label: 'community_nodes',
        url: 'https://docs.nervos.org/docs/getting-started/blockchain-networks#public-networks',
      },
    ],
  },
  {
    name: 'community',
    items: [
      {
        label: 'knowledge_base',
        url: 'https://www.nervos.org/knowledge-base',
      },
      {
        label: 'network',
        url: '/charts/node-geo-distribution',
      },
    ],
  },
  {
    name: 'platform',
    items: [
      {
        label: 'discord',
        icon: <Discord />,
        url: 'https://discord.com/invite/FKh8Zzvwqa',
      },
      {
        label: 'X',
        icon: <XIcon />,
        url: 'https://x.com/nervosnetwork',
      },
      {
        label: 'blog',
        icon: <MediumIcon />,
        url: 'https://medium.com/nervosnetwork',
      },
      {
        label: 'telegram',
        icon: <TelegramIcon />,
        url: 'https://t.me/nervosnetwork',
      },
      {
        label: 'reddit',
        icon: <RedditIcon />,
        url: 'https://www.reddit.com/r/NervosNetwork/',
      },
      {
        label: 'youtube',
        icon: <YoutubeIcon />,
        url: 'https://www.youtube.com/channel/UCONuJGdMzUY0Y6jrPBOzH7A',
      },
      {
        label: 'forum',
        icon: <ForumIcon />,
        url: 'https://talk.nervos.org/',
      },
    ],
  },
]

export default memo(() => {
  const [t] = useTranslation()
  const [isTokenFormDisplayed, setIsTokenFormDisplayed] = useState<boolean>(false)

  const onSubmitToken = () => {
    setIsTokenFormDisplayed(true)
  }

  const lists = Footers

  return (
    <div className={styles.container}>
      <div className={styles.navigations}>
        {lists.map(list => {
          return (
            <div key={list.name} className={styles.section}>
              {list.name !== 'platform' ? <div className={styles.title}>{t(`footer.${list.name}`)}</div> : null}
              <div className={styles.linkList} data-is-grid={list.name === 'platform'}>
                {list.items.map(item => {
                  if (item.icon) {
                    return (
                      <a
                        className={styles.iconLink}
                        href={item.url}
                        rel="noopener noreferrer"
                        key={item.label}
                        title={t(`footer.${item.label}`)}
                        target="_blank"
                      >
                        {item.icon}
                        {t(`footer.${item.label}`)}
                      </a>
                    )
                  }
                  return (
                    <a
                      href={item.url}
                      rel="noopener noreferrer"
                      key={item.label}
                      title={t(`footer.${item.label}`)}
                      target="_blank"
                    >
                      {t(`footer.${item.label}`)}
                    </a>
                  )
                })}
              </div>
              {list.name === 'community' ? (
                <button type="button" onClick={onSubmitToken} className={styles.tokenFormBtn}>
                  {t('udt.submit_token_info')}
                </button>
              ) : null}
            </div>
          )
        })}
      </div>

      <div className={styles.annotation}>
        <a href="https://www.magickbase.com" target="_blank" rel="noreferrer">
          Powered by Magickbase <Open width={16} />
        </a>
        <div>
          <span>{`Copyright © ${getCurrentYear()} Nervos Foundation. `}</span>
          <span>All Rights Reserved.</span>
        </div>
      </div>

      {isTokenFormDisplayed ? <SubmitTokenInfo onClose={() => setIsTokenFormDisplayed(false)} /> : null}
    </div>
  )
})
