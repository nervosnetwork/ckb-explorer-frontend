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
  BlockNumber: number
  Difficulty?: number
  HashRate?: number
}

const scale = {
  Difficulty: {
    min: 0,
  },
  HashRate: {
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
      if (!wrapper) return
      const { hash_rate: hashRates, difficulty: difficulties } = wrapper.attributes
      if (!hashRates && !difficulties) return
      if (hashRates && difficulties) {
        const length = Math.min(hashRates.length, difficulties.length)
        const datas: StatisticsData[] = []
        for (let index = 0; index < length; index++) {
          datas.push({
            BlockNumber: hashRates[index].block_number,
            HashRate: Number((Number(hashRates[index].hash_rate) * 1000).toFixed(0)),
            Difficulty: difficulties[index].difficulty,
          })
        }
        setStatisticsDatas(datas)
      } else if (hashRates) {
        setStatisticsDatas(
          hashRates.map(hashRate => {
            return {
              BlockNumber: hashRate.block_number,
              HashRate: Number((Number(hashRate.hash_rate) * 1000).toFixed(0)),
            }
          }),
        )
      } else {
        setStatisticsDatas(
          difficulties.map(difficulty => {
            return {
              BlockNumber: difficulty.block_number,
              Difficulty: difficulty.difficulty,
            }
          }),
        )
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
              clickable={false}
              textStyle={{
                fontSize: '15',
                fontWeight: 'bold',
                fill: '#666666',
              }}
              items={[
                {
                  value: 'Difficulty',
                  fill: '#3182bd',
                  marker: {
                    symbol: 'hyphen',
                    stroke: '#3182bd',
                    radius: 5,
                    lineWidth: 3,
                  },
                },
                {
                  value: 'Hash Rate',
                  fill: '#66CC99',
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
              name="Difficulty"
              grid={null}
              label={{
                textStyle: {
                  fill: '#3182bd',
                  fontWeight: 'bold',
                },
              }}
            />
            <Axis
              name="Hash Rate"
              grid={null}
              label={{
                textStyle: {
                  fill: '#66CC99',
                  fontWeight: 'bold',
                },
              }}
            />
            <Tooltip />
            <Geom type="line" position="BlockNumber*Difficulty" color="#3182bd" size={2} shape="line" />
            <Geom type="line" position="BlockNumber*HashRate" color="#66CC99" size={2} shape="line" />
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
