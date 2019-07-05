import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { AxiosResponse } from 'axios'
import AppContext from '../../contexts/App'
import { axiosIns } from '../../http/fetcher'

const MaintainPanel = styled.div`
  width: 100%;
  overflow-x: hidden;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    font-size: 36px;
    font-weight: bold;
    color: #3cc68a;
    margin-top: 20%;

    @media (max-width: 700px) {
      margin-top: 40%;
      font-size: 16px;
      padding: 0 10%;
    }
  }
`

const fetchTipBlockNumber = (replace: any) => {
  return axiosIns
    .get('statistics/tip_block_number')
    .then((res: AxiosResponse) => {
      if (res.status === 200) {
        replace('/')
      }
    })
    .catch(error => {
      console.error(error)
    })
}

export default (props: React.PropsWithoutRef<RouteComponentProps>) => {
  const appContext = useContext(AppContext)
  const { history } = props
  const { replace } = history

  useEffect(() => {
    fetchTipBlockNumber(replace)
  }, [replace])

  return (
    <MaintainPanel>
      <div>{appContext.errorMessage}</div>
    </MaintainPanel>
  )
}
