import styled from 'styled-components'

export default styled.div`
  width: 100%;
  border-radius: 6px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #ffffff;
  height: 80px;
  padding: 0px 0px 24px 0px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;

  @media (max-width: 700px) {
    height: 50px;
    padding: 0px 0px 17px 0px;
    border-radius: 3px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
  }

  .address_hash__title {
    margin-left: 40px;
    font-family: Montserrat;
    font-size: 30px;
    font-weight: 500;
    color: #000000;
    height: 36px;

    @media (max-width: 700px) {
      font-size: 15px;
      margin-left: 20px;
      height: 16px;
    }
  }

  #address_hash__hash {
    margin-left: 20px;
    font-family: Montserrat;
    font-size: 20px;
    color: #000000;
    height: 24px;

    @media (max-width: 700px) {
      font-size: 14px;
      margin-left: 10px;
      height: 16px;
      font-weight: 500;
    }
  }

  .address_hash__copy_iocn {
    width: 21px;
    height: 24px;
    cursor: pointer;
    margin-left: 20px;

    > img {
      width: 100%;
      height: 100%;
    }

    @media (max-width: 700px) {
      margin-left: 10px;
      width: 16px;
      height: 18px;
    }
  }
`
