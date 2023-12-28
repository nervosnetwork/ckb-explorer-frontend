/* eslint-disable no-nested-ternary */
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import SimpleButton from '../SimpleButton'
import variables from '../../styles/variables.module.scss'

export const HeaderPanel = styled.div`
  width: 100%;
  min-height: var(--navbar-height);
  background-color: #040607;
  overflow: visible;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 120px;

  @media (max-width: ${variables.xxlBreakPoint}) {
    padding: 0 100px;
  }

  @media (max-width: ${variables.extraLargeBreakPoint}) {
    padding: 0 45px;
  }

  @media (max-width: ${variables.mobileBreakPoint}) {
    padding: 0 18px;
  }
`

export const HeaderLogoPanel = styled(Link)`
  display: flex;
  align-items: center;
  margin-top: 2px;

  > img {
    width: 114px;
    height: 30px;
  }
`

export const HeaderEmptyPanel = styled.div`
  flex: 1;
`

export const HeaderMobileMenuPanel = styled(SimpleButton)`
  > img {
    width: 18px;
    height: 18px;
  }

  .menuIconFirst,
  .menuIconSecond,
  .menuIconThird {
    width: 18px;
    height: 2px;
    background-color: white;
    margin: 5px 0;
    transition: 0.4s;
  }

  .close .menuIconFirst {
    transform: rotate(-45deg) translate(-4px, 5px);
  }

  .close .menuIconSecond {
    opacity: 0;
  }

  .close .menuIconThird {
    transform: rotate(45deg) translate(-4px, -6px);
  }
`
