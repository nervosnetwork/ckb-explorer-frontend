import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const HeaderPanel = styled.div`
  width: 100%;
  min-height: 64px;
  background-color: #040607;
  position: fixed;
  position: -webkit-fixed;
  overflow: visible;
  top: 0;
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
  }

  @media (max-width: 750px) {
    padding: 0px 18px;
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

export const HeaderMobileMenuPanel = styled.div`
  > img {
    width: 18px;
    height: 18px;
  }
`
