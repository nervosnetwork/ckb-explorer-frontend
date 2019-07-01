import styled from 'styled-components'

export const MainContainer = styled.div`
  @media (max-width: 700px) {
    display: none;
  }
  width: 100%;
  overflow-x: auto;
  margin-top: 10px;
  background: white;
  border: 0px solid white;
  border-radius: 6px;
  box-shadow: 0px 5px 9px #dfdfdf;

  > div {
    width: 1200px;
    margin: 0 auto;
    padding: 38px 83px 41px 83px;
    display: flex;
    flex-direction: column;
  }
`

interface SeparateProps {
  marginTop?: string
  marginBottom?: string
}

export const Separate = styled.span`
  width: 100%;
  height: 1px;
  margin-top: ${({ marginTop }: SeparateProps) => marginTop || '0px'};
  margin-bottom: ${({ marginBottom }: SeparateProps) => marginBottom || '0px'};
  background: rgb(233, 233, 233);
`

export const HashBlockContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .hash {
    font-size: 16px;
    color: rgb(75, 188, 142);
  }

  .block {
    font-size: 16px;
    color: rgb(136, 136, 136);
  }
`

export const InputOutputContainer = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  > img {
    width: 40px;
    height: 40px;
    flex: 1;
  }

  > div {
    flex: 13;
  }

  .input {
    margin-right: 40px;
  }

  .output {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 40px;
  }
`
