import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts'
import Content from '../../components/Content'
import { fetchStatisticsChart } from '../../http/fetcher'
import { StatisticsChartWrapper } from '../../http/response/StatisticsChart'

const ChartPanel = styled.div`
  margin: 30px 10% 30px 10%;
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
  waiting: {
    hash_rate: 0,
  },
}

export default () => {
  const [statisticsDatas, setStatisticsDatas] = useState([] as StatisticsData[])
  useEffect(() => {
    fetchStatisticsChart().then((wrapper: StatisticsChartWrapper) => {
      if (wrapper) {
        const { hash_rate: hashRates, difficulty: difficulties } = wrapper.attributes
        setStatisticsDatas(
          hashRates.map((hashRate, index) => {
            return {
              blockNumber: hashRate.block_number,
              hashRate: Number((Number(hashRate.hash_rate) * 1000).toFixed(0)),
              difficulty: difficulties[index].difficulty,
            }
          }),
        )
      }
    })
  }, [])
  return (
    <Content>
      <ChartPanel>
        <Chart height={window.innerHeight} scale={scale} forceFit data={statisticsDatas} padding={[50, 100, 100, 50]}>
          <Legend
            custom
            allowAllCanceled
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
                  stroke: '#ffae6b',
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
                fill: '#fdae6b',
              },
            }}
          />
          <Tooltip />
          <Geom type="line" position="blockNumber*difficulty" color="#3182bd" size={3} shape="line" />
          <Geom type="point" position="blockNumber*difficulty" color="#3182bd" size={3} shape="circle" />

          <Geom type="line" position="blockNumber*hashRate" color="#fdae6b" size={3} shape="line" />
          <Geom type="point" position="blockNumber*hashRate" color="#fdae6b" size={3} shape="circle" />
        </Chart>
      </ChartPanel>
    </Content>
  )
}
