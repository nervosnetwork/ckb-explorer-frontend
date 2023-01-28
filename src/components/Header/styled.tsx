/* eslint-disable no-nested-ternary */
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import SimpleButton from '../SimpleButton'

export const HeaderPanel = styled.div`
  width: 100%;
  min-height: var(--navbar-height);
  background-color: #040607;
  position: fixed;
  position: -webkit-fixed;
  overflow: visible;
  top: ${(props: { isNotTop?: boolean }) => (props.isNotTop ? '48px' : '0')};
  z-index: 10;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0px 120px;

  @media (max-width: 1440px) {
    padding: 0px 100px;
  }

  @media (max-width: 1200px) {
    padding: 0px 45px;
    top: ${(props: { isNotTop?: boolean }) => (props.isNotTop ? 'var(--navbar-height)' : '0')};
  }

  @media (max-width: 780px) {
    padding: 0px 18px;
    top: ${(props: { isNotTop?: boolean; isEn: boolean }) => (props.isNotTop ? (props.isEn ? '120px' : '100px') : '0')};
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

  .menu__icon__first,
  .menu__icon__second,
  .menu__icon__third {
    width: 18px;
    height: 2px;
    background-color: white;
    margin: 5px 0;
    transition: 0.4s;
  }

  .close .menu__icon__first {
    -webkit-transform: rotate(-45deg) translate(-4px, 5px);
    transform: rotate(-45deg) translate(-4px, 5px);
  }

  .close .menu__icon__second {
    opacity: 0;
  }

  .close .menu__icon__third {
    -webkit-transform: rotate(45deg) translate(-4px, -6px);
    transform: rotate(45deg) translate(-4px, -6px);
  }
`
