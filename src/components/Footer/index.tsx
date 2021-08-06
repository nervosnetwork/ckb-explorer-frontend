import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TwitterIcon from '../../assets/footer_twitter.png'
import TwitterHoverIcon from '../../assets/footer_twitter_hover.png'
import TwitterAggronHoverIcon from '../../assets/footer_twitter_aggron_hover.png'
import MediumIcon from '../../assets/footer_medium.png'
import MediumHoverIcon from '../../assets/footer_medium_hover.png'
import MediumAggronHoverIcon from '../../assets/footer_medium_aggron_hover.png'
import TelegramIcon from '../../assets/footer_telegram.png'
import TelegramHoverIcon from '../../assets/footer_telegram_hover.png'
import TelegramAggronHoverIcon from '../../assets/footer_telegram_aggron_hover.png'
import RedditIcon from '../../assets/footer_reddit.png'
import RedditHoverIcon from '../../assets/footer_reddit_hover.png'
import RedditAggronHoverIcon from '../../assets/footer_reddit_aggron_hover.png'
import YoutubeIcon from '../../assets/footer_youtube.png'
import YoutubeHoverIcon from '../../assets/footer_youtube_hover.png'
import YoutubeAggronHoverIcon from '../../assets/footer_youtube_aggron_hover.png'
import ForumIcon from '../../assets/footer_forum.png'
import ForumHoverIcon from '../../assets/footer_forum_hover.png'
import ForumAggronHoverIcon from '../../assets/footer_forum_aggron_hover.png'
import { getCurrentYear } from '../../utils/date'
import { FooterMenuPanel, FooterItemPanel, FooterImageItemPanel, FooterPanel } from './styled'
import { isMobile } from '../../utils/screen'
import { isMainnet } from '../../utils/chain'
import { udtSubmitEmail } from '../../utils/util'

interface FooterLinkItem {
  label?: string
  url?: string
  icon?: any
  hoverIcon?: any
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
  const { label, url, icon, hoverIcon } = item
  const [isHover, setIsHover] = useState(false)
  return (
    <FooterImageItemPanel
      key={label}
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      onMouseOver={() => {
        setIsHover(true)
      }}
      onMouseLeave={() => {
        setIsHover(false)
      }}
    >
      <img src={isHover ? hoverIcon : icon} alt="footer icon" />
      <span>{label}</span>
    </FooterImageItemPanel>
  )
}

export default () => {
  const [t] = useTranslation()
  const Footers: FooterLink[] = useMemo(
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
            label: t('udt.submit_token_info'),
            url: udtSubmitEmail(),
          },
        ],
      },
      {
        name: t('footer.community'),
        items: [
          {
            label: t('footer.twitter'),
            icon: TwitterIcon,
            hoverIcon: isMainnet() ? TwitterHoverIcon : TwitterAggronHoverIcon,
            url: 'https://twitter.com/nervosnetwork',
          },
          {
            label: t('footer.blog'),
            icon: MediumIcon,
            hoverIcon: isMainnet() ? MediumHoverIcon : MediumAggronHoverIcon,
            url: 'https://medium.com/nervosnetwork',
          },
          {
            label: t('footer.telegram'),
            icon: TelegramIcon,
            hoverIcon: isMainnet() ? TelegramHoverIcon : TelegramAggronHoverIcon,
            url: 'https://t.me/nervosnetwork',
          },
          {
            label: t('footer.reddit'),
            icon: RedditIcon,
            hoverIcon: isMainnet() ? RedditHoverIcon : RedditAggronHoverIcon,
            url: 'https://www.reddit.com/r/NervosNetwork/',
          },
          {
            label: t('footer.youtube'),
            icon: YoutubeIcon,
            hoverIcon: isMainnet() ? YoutubeHoverIcon : YoutubeAggronHoverIcon,
            url: 'https://www.youtube.com/channel/UCONuJGdMzUY0Y6jrPBOzH7A',
          },
          {
            label: t('footer.forum'),
            icon: ForumIcon,
            hoverIcon: isMainnet() ? ForumHoverIcon : ForumAggronHoverIcon,
            url: 'https://talk.nervos.org/',
          },
        ],
      },
    ],
    [t],
  )
  return (
    <FooterPanel>
      <FooterMenuPanel>
        <div className="footer__foundation">
          <div className="footer__title">{Footers[0].name}</div>
          {Footers[0].items.map((item: any) => (
            <FooterItem item={item} key={item.label} />
          ))}
        </div>
        <div className="footer__developer">
          <div className="footer__title">{Footers[1].name}</div>
          {Footers[1].items
            .filter(item => item.label !== undefined)
            .map((item: any) => (
              <FooterItem item={item} key={item.label} />
            ))}
        </div>
        <div className="footer__community">
          {isMobile() ? (
            <div>
              {Footers[2].items.map((item: any) => (
                <FooterImageItem item={item} key={item.label} />
              ))}
            </div>
          ) : (
            <>
              <div>
                {Footers[2].items.slice(0, 3).map((item: any) => (
                  <FooterImageItem item={item} key={item.label} />
                ))}
              </div>
              <div>
                {Footers[2].items.slice(3).map((item: any) => (
                  <FooterImageItem item={item} key={item.label} />
                ))}
              </div>
            </>
          )}
        </div>
      </FooterMenuPanel>
      <div className="footer__copyright">
        <span>{`Copyright © ${getCurrentYear()} Nervos Foundation. `}</span>
        <span>All Rights Reserved.</span>
      </div>
    </FooterPanel>
  )
}
