import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts'
import Content from '../../components/Content'
import { fetchStatisticsChart } from '../../service/http/fetcher'
import { CachedKeys } from '../../utils/const'
import { storeCachedData, fetchCachedData } from '../../utils/cached'
import Loading from '../../assets/loading.gif'
import { isMobile } from '../../utils/screen'

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
  type: 'Difficulty' | 'HashRate' | 'EpochNumber'
  difficulty?: number
  hashRate?: number
  epochNumber?: number
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
  epochNumber: {
    min: 0,
    alias: 'Epoch Number',
  },
}

const findDifficulty = (
  difficulties: { difficulty: number; block_number: number; epoch_number: number }[],
  blockNumber: number,
) => {
  const result = difficulties.find(difficulty => {
    return difficulty.block_number === blockNumber
  })
  return result || undefined
}

const handleStatistics = (wrapper: Response.Wrapper<State.StatisticsChart>) => {
  if (!wrapper) return []
  const { hash_rate: hashRates, difficulty: difficulties } = wrapper.attributes
  if (!hashRates && !difficulties) return []

  const datas: StatisticsData[] = []
  hashRates.forEach(hashRate => {
    datas.push({
      type: 'HashRate',
      blockNumber: hashRate.block_number,
      hashRate: Number((Number(hashRate.hash_rate) * 1000).toFixed(0)),
    })
    const difficulty = findDifficulty(difficulties, hashRate.block_number)
    if (difficulty !== undefined) {
      datas.push({
        type: 'Difficulty',
        blockNumber: difficulty.block_number,
        difficulty: difficulty.difficulty,
      })
      datas.push({
        type: 'EpochNumber',
        blockNumber: difficulty.block_number,
        difficulty: difficulty.epoch_number,
      })
    }
  })
  return datas
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
    fetchStatisticsChart().then((wrapper: Response.Wrapper<State.StatisticsChart>) => {
      const datas = handleStatistics(wrapper)
      if (datas && datas.length > 0) {
        setStatisticsDatas(datas)
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
            padding={isMobile() ? [40, 90, 80, 90] : [80, 90, 100, 90]}
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
              name="difficulty"
              title={!isMobile()}
              label={{
                textStyle: {
                  fill: '#3182bd',
                  fontWeight: 'bold',
                },
              }}
            />
            <Axis
              name="hashRate"
              title={!isMobile()}
              label={{
                textStyle: {
                  fill: '#66CC99',
                  fontWeight: 'bold',
                },
              }}
            />
            <Axis name="epochNumber" visible={false} />
            <Tooltip />
            <Geom type="line" position="blockNumber*difficulty" color={['type', ['#3182bd']]} size={1} shape="hv" />
            <Geom type="line" position="blockNumber*hashRate" color={['type', ['#66CC99']]} size={1} shape="line" />
            <Geom position="blockNumber*epochNumber" color={['type', ['#888888']]} size={0} />
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
