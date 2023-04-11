import styled from 'styled-components'

export const BlockListPanel = styled.div`
  @media (min-width: 750px) {
    margin-top: 25px;
    margin-bottom: 40px;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 6px 0 rgba(77, 77, 77, 0.21);
  }

  @media (max-width: 750px) {
    margin-top: 0px;
    padding: 0px 20px 0px 20px;

    .block__green__background {
      margin-left: -20px;
      height: 61px;
      width: calc(100% + 40px);
      background-color: ${props => props.theme.primary};
      z-index: 1;
    }
  }

  .block_list__pagination {
    display: flex;
    flex-direction: row;
    margin-top: 4px;
    width: 100%;
    background-color: white;
    border-radius: 0 0 6px 6px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.12);

    > div {
      border-radius: 0;
      box-shadow: none;
    }
    > a {
      padding-right: 40px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      color: var(--primary-color);
      cursor: pointer;

      > div:first-child {
        margin-right: 8px;
      }
    }

    @media (max-width: 842px) {
      flex-direction: column;
      height: 96px;

      > div:first-child {
        margin-bottom: 0;
      }

      > a {
        height: 40px;
        background-color: white;
        border-radius: 0 0 6px 6px;
        padding-right: 20px;
        margin: 0 12px;
        border-top: 1px solid #f0f0f0;

        @media (max-width: 750px) {
          padding: 0;
        }
      }
    }
    @media (max-width: 750px) {
      margin-top: 5px;
    }
  }
`

export const ContentTitle = styled.div`
  font-size: 50px;
  color: black;
  margin: 0 auto;
  text-align: center;

  @media (max-width: 750px) {
    font-size: 26px;
  }

  &:after {
    content: '';
    background: ${props => props.theme.primary};
    height: 4px;
    width: 197px;
    display: block;
    margin: 0 auto;

    @media (max-width: 750px) {
      width: 80px;
    }
  }
`

export const ContentTable = styled.div`
  @media (max-width: 750px) {
    margin-top: -41px;
    z-index: 2;
  }
`

export const HighLightValue = styled.div`
  color: ${props => props.theme.primary};
  font-size: 13px;
  height: 16px;
  min-width: 0;
`

export const BlockRewardContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (max-width: 750px) {
    align-items: flex-end;
    justify-content: flex-start;
  }

  :after {
    display: inline;
    content: '+';
    color: #7f7d7d;
    font-size: 13px;
  }
`

export const BlockRewardPanel = styled.div`
  margin-right: 8px;
  display: flex;
  justify-content: center;
`
