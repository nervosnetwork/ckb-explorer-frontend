import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts'
import Content from '../../components/Content'
import { fetchStatisticsChart } from '../../http/fetcher'
import { StatisticsChartWrapper } from '../../http/response/StatisticsChart'
import { CachedKeys } from '../../utils/const'
import { storeCachedData, fetchCachedData } from '../../utils/cached'
import Loading from '../../assets/loading.gif'

const ChartPanel = styled.div`
  margin: 20px 10% 30px 10%;
  background: white;

  @media (max-width: 700px) {
    margin: 20px 4% 30px 4%;
  }
`

const LoadingPanel = styled.div`
  display: flex;
  width: 100%;
  height: 70vh;
  align-items: center;
  justify-content: center;

  > img {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 700px) {
      width: 50px;
      height: 50px;
    }
  }
`

interface StatisticsData {
  blockNumber: number
  difficulty: number
  hashRate: number
}

const scale = {
  difficulty: {
    min: 0,
  },
  hashRate: {
    min: 0,
  },
}

export default () => {
  const [statisticsDatas, setStatisticsDatas] = useState([] as StatisticsData[])

  useEffect(() => {
    const cachedStatisticsChart = fetchCachedData<StatisticsData[]>(CachedKeys.StatisticsChart)
    if (cachedStatisticsChart) {
      setStatisticsDatas(cachedStatisticsChart)
    }
  }, [])

  useEffect(() => {
    storeCachedData(CachedKeys.StatisticsChart, statisticsDatas)
  }, [statisticsDatas])

  useEffect(() => {
    fetchStatisticsChart().then((wrapper: StatisticsChartWrapper) => {
      if (wrapper) {
        const { hash_rate: hashRates, difficulty: difficulties } = wrapper.attributes
        if (hashRates && difficulties) {
          const length = Math.min(hashRates.length, difficulties.length)
          const datas: StatisticsData[] = []
          for (let index = 0; index < length; index++) {
            datas.push({
              blockNumber: hashRates[index].block_number,
              hashRate: Number((Number(hashRates[index].hash_rate) * 1000).toFixed(0)),
              difficulty: difficulties[index].difficulty,
            })
          }
          setStatisticsDatas(datas)
        }
      }
    })
  }, [])

  return (
    <Content>
      {statisticsDatas.length > 1 ? (
        <ChartPanel>
          <Chart
            height={window.innerHeight * 0.7}
            scale={scale}
            forceFit
            data={statisticsDatas}
            padding={[50, 90, 100, 90]}
          >
            <Legend
              custom
              allowAllCanceled
              textStyle={{
                fontSize: '15',
                fontWeight: 'bold',
              }}
              items={[
                {
                  value: 'Difficulty',
                  marker: {
                    symbol: 'square',
                    fill: '#3182bd',
                    radius: 5,
                  },
                },
                {
                  value: 'Hash Rate',
                  marker: {
                    symbol: 'hyphen',
                    stroke: '#66CC99',
                    radius: 5,
                    lineWidth: 3,
                  },
                },
              ]}
            />
            <Axis
              name="difficulty"
              grid={null}
              label={{
                textStyle: {
                  fill: '#3182bd',
                  fontWeight: 'bold',
                },
              }}
            />
            <Axis
              name="hashRate"
              grid={null}
              label={{
                textStyle: {
                  fill: '#66CC99',
                  fontWeight: 'bold',
                },
              }}
            />
            <Tooltip />
            <Geom type="line" position="blockNumber*difficulty" color="#3182bd" size={2} shape="line" />

            <Geom type="line" position="blockNumber*hashRate" color="#66CC99" size={2} shape="line" />
          </Chart>
        </ChartPanel>
      ) : (
        <LoadingPanel>
          <img src={Loading} alt="loading" />
        </LoadingPanel>
      )}
    </Content>
  )
}
