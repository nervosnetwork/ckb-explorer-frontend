import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import axios, { AxiosResponse } from 'axios'
import AppContext from '../../contexts/App'
import CONFIG from '../../config'

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

const baseURL = `${CONFIG.API_URL}/api/v1/`
const axiosIns = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  },
  data: null,
})

const fetchGenesisBlock = (replace: any) => {
  return axiosIns
    .get('blocks/0')
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
    fetchGenesisBlock(replace)
  }, [replace])

  return (
    <MaintainPanel>
      <div>{appContext.errorMessage}</div>
    </MaintainPanel>
  )
}
