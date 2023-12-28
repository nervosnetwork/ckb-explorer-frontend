import styled from 'styled-components'
import variables from '../../../styles/variables.module.scss'

export const SmallLoadingPanel = styled.div`
  margin: 15px 0;
  text-align: center;

  .loadingWhite {
    opacity: 0.8;
  }

  > img {
    width: 135px;
    height: 39px;
  }

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin: 8px 0;

    > img {
      width: 68px;
      height: 20px;
    }
  }
`
