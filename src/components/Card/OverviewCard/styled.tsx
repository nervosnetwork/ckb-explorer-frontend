import styled from 'styled-components'

export const OverviewCardPanel = styled.div`
  width: 100%;
  border-radius: 0px 0px 6px 6px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #ffffff;
  margin-top: 5px;
  padding: 22px 40px 30px 40px;
  background-color: #ffffff;

  /* common */
  color: #000000;
  font-family: Montserrat;
  font-size: 16px;

  @media (max-width: 700px) {
    border-radius: 0px 0px 3px 3px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
    padding: 15px 20px 15px 20px;

    font-size: 13px;
  }
`

export const OverviewContentPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  overflow: auto;

  > span {
    width: 1px;
    height: ${({ length }: { length: number }) => `${length * 40 - 20}px`};
    background: #e2e2e2;
    margin: 10px 0px 10px 0px;
  }

  .overview_content__left_items {
    margin-right: 45px;
    flex: 1;
  }

  .overview_content__right_items {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 45px;
  }
`

export const OverviewItemPanel = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  width: 100%;

  .overview_item__title {
    font-weight: 500;
  }

  .overview_item__value {
    margin-left: 15px;
  }
`

export const OverviewItemShortPanel = styled(OverviewItemPanel)`
  justify-content: space-between;
`
