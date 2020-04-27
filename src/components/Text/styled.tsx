import styled from 'styled-components'

export const HighLightPanel = styled.div`
  color: ${props => props.theme.primary};
  font-size: 14px;

  @media (max-width: 750px) {
    font-size: 13px;
  }

  a {
    color: ${props => props.theme.primary};
    margin-top: 3px;

    @media (max-width: 750px) {
      margin-top: 1px;
    }
  }

  a:hover {
    color: ${props => props.theme.primary};
  }
`
