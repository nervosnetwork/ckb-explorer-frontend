import styled from 'styled-components'

export const SearchPanel = styled.div`
  margin-top: 200px;
  margin-bottom: 240px;

  @media (max-width: 750px) {
    margin-top: 120px;
    margin-bottom: 150px;
  }

  .searchFailBar {
    width: 600px;
    margin: 0 auto;

    @media (max-width: 750px) {
      width: 340px;
    }
  }
`

export const SearchContent = styled.div`
  font-size: 14px;
  color: #606060;
  margin: 0 auto;
  margin-top: 20px;
  text-align: center;
  white-space: pre-wrap;
  width: 600px;

  @media (max-width: 750px) {
    width: 340px;
  }

  a {
    color: ${props => props.theme.primary};
    margin-left: 3px;
  }

  a:hover {
    color: ${props => props.theme.primary};
  }

  @media (max-width: 750px) {
    font-size: 12px;
  }

  @media (max-width: 375px) {
    font-size: 11px;
  }

  .searchFailItems {
    font-weight: bold;
    font-size: 16px;

    @media (max-width: 750px) {
      font-size: 12px;
    }

    @media (max-width: 375px) {
      font-size: 11px;
    }
  }
`
