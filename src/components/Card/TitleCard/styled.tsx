import styled from 'styled-components'

export default styled.div`
  width: 100%;
  border-radius: 6px 6px 0px 0px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #ffffff;
  height: 50px;
  margin-top: 20px;
  padding: 15px 0px;
  color: #000000;
  font-family: Montserrat;
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
  text-align: center;

  @media (max-width: 700px) {
    margin-top: 10px;
    padding: 10px 0px;
    height: 40px;
    font-size: 16px;
    border-radius: 3px 3px 0px 0px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
  }
`
