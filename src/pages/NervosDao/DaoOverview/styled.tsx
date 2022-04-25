import styled from 'styled-components'

export const DaoOverviewPanel = styled.div`
  width: 100%;
  border-radius: 6px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #ffffff;
  margin-top: 5px;
  padding: 10px 20px;
  background-color: #ffffff;
  display: flex;
  color: #000000;
  font-size: 16px;

  @media (max-width: 1200px) {
    flex-direction: column;
  }

  @media (max-width: 750px) {
    box-shadow: 1px 1px 3px 0 #dfdfdf;
    padding: 5px 0 15px 0;
    font-size: 13px;
    flex-direction: column;
  }

  .dao__overview__separate {
    width: 1px;
    height: auto;
    background: #eaeaea;
    margin-left: 2%;

    @media (max-width: 1200px) {
      width: 100%;
      height: 1px;
      background: #eaeaea;
      margin-left: 0;
    }

    @media (max-width: 750px) {
      width: 100%;
      height: 1px;
      background: #eaeaea;
      margin-left: 0;
    }
  }
`

export const DaoOverviewLeftPanel = styled.div`
  display: flex;
  flex-direction: row;
  flex: 54;

  @media (max-width: 750px) {
    margin: 0 16px;
    flex-direction: column;
  }

  > div {
    display: flex;
    flex-direction: column;
    flex: 1;

    @media (max-width: 750px) {
      flex-direction: row;
    }
  }

  .dao__overview__middle__separate {
    width: 1px;
    height: 130px;
    background: #eaeaea;
    margin: 10px 16px;

    @media (max-width: 750px) {
      width: 100%;
      height: 1px;
      background: #eaeaea;
      margin: 0;
    }
  }

  .dao__overview__left_column_separate {
    width: 1px;
    height: auto;
    margin: 3% 0;
    background: #eaeaea;

    @media (max-width: 750px) {
      display: none;
    }
  }
`

export const DaoOverviewRightPanel = styled.div`
  display: flex;
  flex-direction: row;
  flex: 44;

  @media (max-width: 1200px) {
    margin-top: 12px;
  }

  @media (max-width: 750px) {
    margin: 5px 0;
  }
`

export const DaoOverviewPieChartPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1200px) {
    align-items: flex-end;
    padding-right: 10px;
  }

  .nervos__dao__overview_pie_title {
    font-size: 14px;
    color: #555555;

    @media (max-width: 1200px) {
      margin-right: 22%;
    }

    @media (max-width: 750px) {
      font-size: 12px;
      margin: 8px 22% 8px 0;
    }
  }
`

export const DaoOverviewPieItemsPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;

  > div {
    width: auto;
  }

  @media (max-width: 750px) {
    justify-content: flex-start;
  }
`

export const DaoOverviewLeftItemPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  &:hover {
    background: #f8f9fa;
  }

  .dao__overview__item__container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .dao__overview__item_top {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;

    .dao__overview__item_title {
      color: #5e5e5e;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: ${(props: { hasTooltip?: boolean }) => (props.hasTooltip ? 'default' : 'text')};

      @media (max-width: 1440px) {
        max-width: ${(props: { symbol?: string; hasChange?: boolean; hasTooltip?: boolean }) =>
          props.hasChange ? '130px' : '200px'};
      }

      @media (max-width: 1200px) {
        max-width: 200px;
      }

      @media (max-width: 750px) {
        font-size: 12px;
        max-width: ${(props: { hasChange?: boolean }) => (props.hasChange ? '90px' : '200px')};
      }
    }

    > img {
      width: ${(props: { symbol?: string }) => (props.symbol === 'zero' ? '10px' : '7px')};
      height: ${(props: { symbol?: string }) => (props.symbol === 'zero' ? '7px' : '10px')};
      margin-left: 5px;
      margin-right: 3px;
    }

    .dao__overview__item_change {
      font-size: 12px;
      font-weight: bold;
      color: ${(props: { symbol?: string; theme: any }) =>
        props.symbol === 'negative' ? '#FF464F' : props.theme.primary};
      cursor: default;

      @media (max-width: 750px) {
        font-size: 10px;
      }
    }
  }

  .dao__overview__item_content {
    color: #000000;
    font-size: 16px;
    font-weight: bold;
    margin: 10px 0;

    @media (max-width: 750px) {
      font-size: 14px;
    }
  }

  .dao__overview__bottom__line {
    width: 100%;
    height: 1px;
    background: #eaeaea;
  }
`

export const NervosDaoPieItemPanel = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  @media (max-width: 1200px) {
    margin: 10px 0;
  }

  @media (max-width: 750px) {
    margin: 5px 0;
  }

  .nervos__dao__overview_pie_icon {
    width: 9px;
    height: 9px;
    margin-right: 10px;
    border-radius: 9px;
  }

  > div {
    > span {
      font-size: 12px;
      color: #5e5e5e;
      font-weight: bold;

      @media (max-width: 750px) {
        font-size: 10px;
      }
    }
    > div {
      font-size: 16px;
      color: #000000;

      @media (max-width: 750px) {
        font-size: 12px;
      }
    }
  }
`

export const NervosDaoPieCapacityPanel = styled.div`
  width: 180px;
  text-align: right;

  @media (max-width: 750px) {
    width: 130px;
  }
`
