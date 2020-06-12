import styled from 'styled-components'

export const SearchPanel = styled.div`
  margin-top: 211px;
  margin-bottom: 266px;

  @media (max-width: 750px) {
    margin-top: 120px;
    margin-bottom: 150px;
  }

  .search__fail__bar {
    width: 96%;
    margin: 0 2%;
  }
`

export const SearchContent = styled.div`
  font-size: 14px;
  color: #606060;
  margin: 0 auto;
  margin-top: 39px;
  text-align: center;
  white-space: pre-wrap;

  a {
    color: ${props => props.theme.primary};
    margin-left: 3px;
  }

  a:hover {
    color: ${props => props.theme.primary};
  }

  @media (max-width: 750px) {
    width: 96%;
    font-size: 12px;
    margin: 18px 2%;
  }

  @media (max-width: 375px) {
    font-size: 11px;
  }

  .search__fail__items {
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
