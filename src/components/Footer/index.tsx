import { ReactNode, memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SubmitTokenInfo } from '../SubmitTokenInfo'
import { ReactComponent as XIcon } from './footer_X.svg'
import { ReactComponent as MediumIcon } from './footer_medium.svg'
import { ReactComponent as TelegramIcon } from './footer_telegram.svg'
import { ReactComponent as RedditIcon } from './footer_reddit.svg'
import { ReactComponent as YoutubeIcon } from './footer_youtube.svg'
import { ReactComponent as ForumIcon } from './footer_forum.svg'
import { ReactComponent as Discord } from './footer_discord.svg'
import { getCurrentYear } from '../../utils/date'
import { FooterMenuPanel, FooterItemPanel, FooterImageItemPanel, FooterPanel } from './styled'
import styles from './index.module.scss'

interface FooterLinkItem {
  label?: string
  url?: string
  icon?: ReactNode
}

interface FooterLink {
  name: string
  items: FooterLinkItem[]
}

const FooterItem = ({ item }: { item: FooterLinkItem }) => {
  const { label, url } = item
  return (
    <FooterItemPanel key={label} href={url} rel="noopener noreferrer" target="_blank">
      {item.label}
    </FooterItemPanel>
  )
}

const FooterImageItem = ({ item }: { item: FooterLinkItem }) => {
  const { label, url, icon: IconComponent } = item

  return (
    <FooterImageItemPanel key={label} href={url} rel="noopener noreferrer" target="_blank">
      {IconComponent}
      <span>{label}</span>
    </FooterImageItemPanel>
  )
}

export default memo(() => {
  const [t] = useTranslation()
  const [isTokenFormDisplayed, setIsTokenFormDisplayed] = useState<boolean>(false)
  const Footers = useMemo<FooterLink[]>(
    () => [
      {
        name: t('footer.nervos_foundation'),
        items: [
          {
            label: t('footer.about_us'),
            url: 'https://www.nervos.org/',
          },
        ],
      },
      {
        name: t('footer.developer'),
        items: [
          {
            label: t('footer.docs'),
            url: 'https://docs.nervos.org',
          },
          {
            label: t('footer.gitHub'),
            url: 'https://github.com/nervosnetwork',
          },
          {
            label: t('footer.whitepaper'),
            url: 'https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0002-ckb/0002-ckb.md',
          },
          {
            label: t('footer.faucet'),
            url: 'https://faucet.nervos.org/',
          },
          {
            label: t('footer.api-doc'),
            url: 'https://ckb-explorer.readme.io/reference/transaction',
          },
        ],
      },
      {
        name: t('footer.community'),
        items: [
          {
            label: t('footer.discord'),
            icon: <Discord />,
            url: 'https://discord.com/invite/FKh8Zzvwqa',
          },
          {
            label: t('footer.X'),
            icon: <XIcon />,
            url: 'https://x.com/nervosnetwork',
          },
          {
            label: t('footer.blog'),
            icon: <MediumIcon />,
            url: 'https://medium.com/nervosnetwork',
          },
          {
            label: t('footer.telegram'),
            icon: <TelegramIcon />,
            url: 'https://t.me/nervosnetwork',
          },
          {
            label: t('footer.reddit'),
            icon: <RedditIcon />,
            url: 'https://www.reddit.com/r/NervosNetwork/',
          },
          {
            label: t('footer.youtube'),
            icon: <YoutubeIcon />,
            url: 'https://www.youtube.com/channel/UCONuJGdMzUY0Y6jrPBOzH7A',
          },
          {
            label: t('footer.forum'),
            icon: <ForumIcon />,
            url: 'https://talk.nervos.org/',
          },
        ],
      },
    ],
    [t],
  )

  const onSubmitToken = () => {
    setIsTokenFormDisplayed(true)
  }

  return (
    <FooterPanel>
      <FooterMenuPanel>
        <div className="footerFoundation">
          <div className="footerTitle">{Footers[0].name}</div>
          {Footers[0].items.map(item => (
            <FooterItem item={item} key={item.label} />
          ))}
        </div>
        <div className="footerDeveloper">
          <div className="footerTitle">{Footers[1].name}</div>
          {Footers[1].items
            .filter(item => item.label !== undefined)
            .map(item => (
              <FooterItem item={item} key={item.label} />
            ))}
          <button type="button" onClick={onSubmitToken} className={styles.tokenFormBtn}>
            {t('udt.submit_token_info')}
          </button>
        </div>
        <div className="footerCommunity">
          {Footers[2].items.map(item => (
            <FooterImageItem item={item} key={item.label} />
          ))}
        </div>
      </FooterMenuPanel>
      <div className="footerCopyright">
        <span>{`Copyright © ${getCurrentYear()} Nervos Foundation. `}</span>
        <span>All Rights Reserved.</span>
      </div>
      {isTokenFormDisplayed ? <SubmitTokenInfo onClose={() => setIsTokenFormDisplayed(false)} /> : null}
    </FooterPanel>
  )
})
