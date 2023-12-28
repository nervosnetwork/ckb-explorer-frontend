import styled from 'styled-components'
import variables from '../../../styles/variables.module.scss'

export const LeftArrowImage = styled.img`
  width: 16px;
  height: auto;
  margin: 0 5px 3px 0;

  @media (max-width: ${variables.mobileBreakPoint}) {
    width: 12px;
    margin: 0 10px 0 0;
  }
`

export const RightArrowImage = styled.img`
  width: 15px;
  height: 15px;
  height: auto;
  margin: 1px 0 0 7px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    width: 12px;
    height: 12px;
    margin: 0 5px 0 7px;
  }
`
