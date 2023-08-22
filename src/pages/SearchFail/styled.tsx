import styled from 'styled-components'

export const SearchPanel = styled.div`
  margin-top: 200px;
  margin-bottom: 240px;

  @media (width <= 750px) {
    margin-top: 120px;
    margin-bottom: 150px;
  }

  .search__fail__bar {
    width: 600px;
    margin: 0 auto;

    @media (width <= 750px) {
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

  @media (width <= 750px) {
    width: 340px;
  }

  a {
    color: ${props => props.theme.primary};
    margin-left: 3px;
  }

  a:hover {
    color: ${props => props.theme.primary};
  }

  @media (width <= 750px) {
    font-size: 12px;
  }

  @media (width <= 375px) {
    font-size: 11px;
  }

  .search__fail__items {
    font-weight: bold;
    font-size: 16px;

    @media (width <= 750px) {
      font-size: 12px;
    }

    @media (width <= 375px) {
      font-size: 11px;
    }
  }
`
