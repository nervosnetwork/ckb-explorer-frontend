import styled from 'styled-components'

export const FooterDiv = styled.div`
  width: 100%;
  overflow: hidden;
  background-color: #040607;
  display: flex;
  flex-direction: column;

  .footer__top {
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 700px) {
      padding: 20px 15px;
    }

    .container {
      display: flex;
      flex-wrap: wrap;

      @media (max-width: 700px) {
        flex-direction: column;
        flex-wrap: nowrap;
      }

      .footer__top__logo {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        width: 276px;

        img {
          width: 110px;
          height: auto;

          @media (max-width: 700px) {
            width: 40px;
          }
        }
      }

      .footer__top__items {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        padding-top: 20px;
        padding-bottom: 25px;

        @media (max-width: 700px) {
          padding: 0;
        }

        .footer__top__item {
          display: flex;
          align-items: flex-end;
          margin: 10px 0;

          > div:nth-child(1) {
            font-size: 16px;
            width: 90px;
            font-weight: bold;
            margin-right: 10px;
            color: ${prop => prop.theme.secondary};
          }

          > div:nth-child(2) {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
          }

          @media (max-width: 700px) {
            margin: 5px 0;

            > div:nth-child(1) {
              font-size: 14px;
              width: 80px;
              margin-top: 15px;
            }
          }
        }
      }
    }
  }

  .footer__copyright {
    display: flex;
    padding: 20px;
    align-items: center;
    justify-content: center;
    border-top: 1px solid white;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    color: #e3e3e3;

    @media (max-width: 700px) {
      padding: 10px;
      font-size: 12px;
    }
  }
`

export const FooterItemPanel = styled.a`
  margin-left: 6px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  width: 75px;
  height: auto;

  >div: nth-child(1) {
    width: 32px;
    height: 32px;
    img {
      width: 100%;
      height: auto;
    }
  }
  >div: nth-child(2) {
    color: white;
    font-size: 12px;
    margin-top: 5px;
    text-align: center;
  }

  @media (max-width: 700px) {
    width: 35px;

    >div: nth-child(1) {
      width: 18px;
      height: 18px;
    }
    >div: nth-child(2) {
      font-size: 8px;
      margin-top: 5px;
    }
  }
`
