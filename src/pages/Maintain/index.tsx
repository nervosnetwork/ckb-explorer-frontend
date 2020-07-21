import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { AxiosResponse } from 'axios'
import { useAppState } from '../../contexts/providers/index'
import { axiosIns } from '../../service/http/fetcher'
import PCMaintainImage from '../../assets/pc_maintain.png'
import MobileMaintainImage from '../../assets/mobile_maintain.png'
import PCBlueMaintainImage from '../../assets/blue_pc_maintain.png'
import MobileBlueMaintainImage from '../../assets/blue_mobile_maintain.png'
import i18n from '../../utils/i18n'
import { isMobile } from '../../utils/screen'
import { isMainnet } from '../../utils/chain'

const MaintainPanel = styled.div`
  width: 100%;
  overflow-x: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > img {
    width: 1038px;
    height: 480px;
    display: block;
    margin-top: 220px;

    @media (max-width: 750px) {
      width: 282px;
      height: 130px;
      margin-top: 120px;
    }
  }

  > div {
    font-size: 26px;
    font-weight: bold;
    color: #606060;
    margin-top: 20px;
    margin-bottom: 250px;

    @media (max-width: 750px) {
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

const getMaintainImage = () => {
  if (isMainnet()) {
    return isMobile() ? MobileMaintainImage : PCMaintainImage
  }
  return isMobile() ? MobileBlueMaintainImage : PCBlueMaintainImage
}

export default () => {
  const { replace } = useHistory()
  const { app } = useAppState()

  useEffect(() => {
    fetchTipBlockNumber(replace)
  }, [replace])

  return (
    <MaintainPanel>
      <img src={getMaintainImage()} alt="maintain" />
      <div>{app.appErrors[2].message[0] || i18n.t('error.maintain')}</div>
    </MaintainPanel>
  )
}
