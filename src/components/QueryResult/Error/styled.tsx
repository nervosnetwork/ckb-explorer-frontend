import styled from 'styled-components'
import variables from '../../../styles/variables.module.scss'

export const ErrorPanel = styled.div`
  width: 100%;
  margin: 112px 0 203px;
  text-align: center;

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin: 120px 0 130px;
  }

  > img {
    width: 1038px;
    max-width: 100%;
    margin: 0 auto;

    @media (max-width: ${variables.mobileBreakPoint}) {
      width: 282px;
      height: 130px;
    }
  }
`
