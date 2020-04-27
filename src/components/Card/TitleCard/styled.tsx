import styled from 'styled-components'

export const TitleCardPanel = styled.div`
  width: 100%;
  background-color: #ffffff;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (max-width: 750px) {
    height: 40px;
  }

  .title__card__content {
    color: #000000;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;

    @media (max-width: 750px) {
      font-size: 20px;
      margin-bottom: 8px;
    }
  }

  .title__card__separate {
    background: #eaeaea;
    width: 100%;
    height: 1px;
  }
`
