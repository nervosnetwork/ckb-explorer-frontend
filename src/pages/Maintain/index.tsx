import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { AxiosResponse } from 'axios'
import { AppContext } from '../../contexts/providers/index'
import { axiosIns } from '../../service/http/fetcher'
import MaintainImage from '../../assets/maintain.png'
import i18n from '../../utils/i18n'
import { StateWithDispatch } from '../../contexts/providers/reducer'

const MaintainPanel = styled.div`
  width: 100%;
  overflow-x: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > img {
    width: 780px;
    height: 484px;
    display: block;
    margin-top: 220px;

    @media (max-width: 700px) {
      width: 220px;
      height: 136px;
      margin-top: 120px;
    }
  }

  > div {
    font-size: 26px;
    font-weight: bold;
    color: #606060;
    margin-top: 20px;
    margin-bottom: 250px;

    @media (max-width: 700px) {
      font-size: 12px;
      marin-top: 10px;
      margin-bottom: 150px;
      padding: 0 40px;
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

export default ({ history: { replace } }: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps>) => {
  const { app } = useContext(AppContext)

  useEffect(() => {
    fetchTipBlockNumber(replace)
  }, [replace])

  return (
    <MaintainPanel>
      <img src={MaintainImage} alt="maintain" />
      <div>{app.appErrors[2].message[0] || i18n.t('error.maintain')}</div>
    </MaintainPanel>
  )
}
