import { FC, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import classNames from 'classnames'
import LogoIcon from './ckb_logo.png'
import MenusComp, { MoreMenu } from './MenusComp'
import { SearchComp } from './SearchComp'
import BlockchainComp from './BlockchainComp'
import { useMediaQuery } from '../../hooks'
import styles from './index.module.scss'
import MaintainAlert from './MaintainAlert'
import NodeAlert from './CKBNodeComp/NodeAlert'

import Sheet from './Sheet'
import { createGlobalState, useGlobalState } from '../../utils/state'
import MobileMenu from './MobileMenu'
import { useCKBNode } from '../../hooks/useCKBNode'
import { Link } from '../Link'
import SimpleButton from '../SimpleButton'

const LogoComp = () => (
  <Link className={styles.headerLogoPanel} to="/">
    <img src={LogoIcon} alt="logo" />
  </Link>
)

const MobileMenuComp: FC<{ mobileMenuVisible: boolean; setMobileMenuVisible: (value: boolean) => void }> = ({
  mobileMenuVisible,
  setMobileMenuVisible,
}) => {
  return (
    <SimpleButton className={styles.headerMobileMenuPanel} onClick={() => setMobileMenuVisible(!mobileMenuVisible)}>
      <div className={mobileMenuVisible ? 'close' : ''}>
        <div className="menuIconFirst" />
        <div className="menuIconSecond" />
        <div className="menuIconThird" />
      </div>
    </SimpleButton>
  )
}

const globalShowHeaderSearchBarCounter = createGlobalState<number>(0)

export function useShowSearchBarInHeader(show: boolean) {
  const [, setCounter] = useGlobalState(globalShowHeaderSearchBarCounter)

  useEffect(() => {
    if (!show) return

    setCounter(counter => counter + 1)
    return () => setCounter(counter => counter - 1)
  }, [show, setCounter])
}

export function useIsShowSearchBarInHeader() {
  const [counter] = useGlobalState(globalShowHeaderSearchBarCounter)
  return counter > 0
}

export default () => {
  const isMobile = useMediaQuery(`(max-width: 1023px)`)
  const { isActivated } = useCKBNode()
  const { pathname } = useLocation()
  const history = useHistory()
  // TODO: This hard-coded implementation is not ideal, but currently the header is loaded before the page component,
  // so we can only handle it this way temporarily, otherwise there will be flickering during loading.
  const defaultSearchBarVisible = pathname !== '/' && pathname !== '/search/fail'
  const isShowSearchBar = useIsShowSearchBarInHeader()
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)

  useEffect(() => {
    const unregister = history.listen(() => {
      setMobileMenuVisible(false)
    })

    return () => unregister()
  }, [history])

  return (
    <div
      className={classNames(styles.stickyContainer, {
        [styles.expanded]: isMobile && mobileMenuVisible,
      })}
    >
      <div className={styles.headerPanel}>
        <LogoComp />
        {!isMobile && (
          <>
            <div className={styles.autoExpand}>
              <div className={styles.content}>
                <MenusComp isMobile={isMobile} />
              </div>
              <div className={styles.expandable}>{(defaultSearchBarVisible || isShowSearchBar) && <SearchComp />}</div>
            </div>
            <BlockchainComp />
            <MoreMenu />
          </>
        )}
        {isMobile && (
          <>
            <div className={styles.headerEmptyPanel} />
            <MobileMenuComp mobileMenuVisible={mobileMenuVisible} setMobileMenuVisible={setMobileMenuVisible} />
          </>
        )}
      </div>
      <MaintainAlert />
      {isActivated ? <NodeAlert /> : null}
      <Sheet />
      {mobileMenuVisible && isMobile && <MobileMenu hideMobileMenu={() => setMobileMenuVisible(false)} />}
    </div>
  )
}
