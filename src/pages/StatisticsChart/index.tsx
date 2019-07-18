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
  margin: 0 10% 30px 10%;
  background: white;

  @media (max-width: 700px) {
    margin: 0 4% 30px 4%;
  }
`

const ChartTitle = styled.div`
  color: #66666;
  background: white;
  margin: 20px 10% 0 10%;
  padding-top: 10px;
  font-size: 24px;
  text-align: center;

  @media (max-width: 700px) {
    margin: 20px 4% 0 4%;
    font-size: 16px;
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
  difficulty?: number
  hashRate?: number
}

const scale = {
  difficulty: {
    min: 0,
    alias: 'Difficulty',
  },
  hashRate: {
    min: 0,
    alias: 'Hash Rate(gps)',
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
            blockNumber: hashRates[index].block_number,
            hashRate: Number((Number(hashRates[index].hash_rate) * 1000).toFixed(0)),
            difficulty: difficulties[index].difficulty,
          })
        }
        setStatisticsDatas(datas)
      } else if (hashRates) {
        setStatisticsDatas(
          hashRates.map(hashRate => {
            return {
              blockNumber: hashRate.block_number,
              hashRate: Number((Number(hashRate.hash_rate) * 1000).toFixed(0)),
            }
          }),
        )
      } else {
        setStatisticsDatas(
          difficulties.map(difficulty => {
            return {
              blockNumber: difficulty.block_number,
              difficulty: difficulty.difficulty,
            }
          }),
        )
      }
    })
  }, [])

  return (
    <Content>
      <ChartTitle>Difficulty & Hash Rate</ChartTitle>
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
                  value: 'Hash Rate(gps)',
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
