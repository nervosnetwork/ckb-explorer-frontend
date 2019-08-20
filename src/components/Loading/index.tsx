import React from 'react'
import styled, { keyframes } from 'styled-components'
import LoadingImage from '../../assets/loading.png'

const Animation = keyframes`
  0% {
    background-position:  -10px -10px;
  }
  2.78% {
    background-position:  -10px -10px;
  }
  5.56% {
    background-position: -430px -10px;
  }
  8.33% {
    background-position: -10px -230px;
  }
  11.11% {
    background-position: -430px -230px;
  }
  13.89% {
    background-position: -10px -450px;
  }
  16.67% {
    background-position: -430px -450px;
  }
  19.44% {
    background-position: -850px -10px;
  }
  22.22% {
    background-position: -850px -230px;
  }
  25.00% {
    background-position: -850px -450px;
  }
  27.78% {
    background-position: -10px -670px;
  }
  30.56% {
    background-position: -430px -670px;
  }
  33.33% {
    background-position: -850px -670px;
  }
  36.11% {
    background-position: -10px -890px;
  }
  38.89% {
    background-position: -430px -890px;
  }
  41.67% {
    background-position: -850px -890px;
  }
  44.44% {
    background-position: -1270px -10px;
  }
  47.22% {
    background-position: -1270px -230px;
  }
  50.00% {
    background-position: -1270px -450px;
  }
  52.78% {
    background-position: -1270px -670px;
  }
  55.56% {
    background-position: -1270px -890px;
  }
  58.33% {
    background-position: -10px -1110px;
  }
  61.11% {
    background-position: -430px -1110px;
  }
  63.89% {
    background-position: -850px -1110px;
  }
  66.67% {
    background-position: -1270px -1110px;
  }
  69.44% {
    background-position: -10px -1330px;
  }
  72.22% {
    background-position: -430px -1330px;
  }
  75.00% {
    background-position: -850px -1330px;
  }
  77.78% {
    background-position: -1270px -1330px;
  }
  80.56% {
    background-position: -1690px -10px;
  }
  83.33% {
    background-position: -1690px -230px;
  }
  86.11% {
    background-position: -1690px -450px;
  }
  88.89% {
    background-position: -1690px -670px;
  }
  91.67% {
    background-position: -1690px -890px;
  }
  94.44% {
    background-position: -1690px -1110px;
  }
  97.22% {
    background-position: -1690px -1330px;
  }
  100% {
    background-position: -10px -1690px;
  }
`

const Loading = styled.div`
  width: 400px;
  height: 200px;
  background-repeat: no-repeat;
  background-image: url(${LoadingImage});
  -webkit-animation: ${Animation} 10s steps(1, end) both infinite;
  animation: ${Animation} 10s steps(1, end) both infinite;
`

export default () => {
  console.log('loading')
  return <Loading />
}
