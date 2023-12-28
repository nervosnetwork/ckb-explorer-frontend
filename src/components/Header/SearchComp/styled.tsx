import styled from 'styled-components'
import variables from '../../../styles/variables.module.scss'

export const HeaderSearchPanel = styled.div`
  display: flex;
  align-items: center;
  margin: 0 40px 0 64px;

  @media (max-width: ${variables.largeBreakPoint}) {
    margin: 0 16px 0 24px;
  }

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin: 40px 56px;
  }
`

export const HeaderSearchBarPanel = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;

  > img {
    width: 18px;
    height: 18px;
  }
`
