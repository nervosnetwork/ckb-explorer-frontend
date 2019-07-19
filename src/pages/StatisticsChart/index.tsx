import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts'
import Content from '../../components/Content'
import { fetchStatisticsChart } from '../../http/fetcher'
import { StatisticsChartWrapper } from '../../http/response/StatisticsChart'
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
  type: 'Difficulty' | 'HashRate'
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

const findHashRate = (hashRates: { hash_rate: string; block_number: number }[], blockNumber: number) => {
  const result = hashRates.find(hashRate => {
    return hashRate.block_number === blockNumber
  })
  return result ? Number((Number(result.hash_rate) * 1000).toFixed(0)) : undefined
}

const findDifficulty = (difficulties: { difficulty: number; block_number: number }[], blockNumber: number) => {
  const result = difficulties.find(difficulty => {
    return difficulty.block_number === blockNumber
  })
  return result ? result.difficulty : undefined
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

      let blockNumbers: number[] = []
      if (hashRates) {
        blockNumbers = blockNumbers.concat(hashRates.map(hashRate => hashRate.block_number))
      }
      if (difficulties) {
        blockNumbers = blockNumbers.concat(difficulties.map(difficulty => difficulty.block_number))
      }
      blockNumbers = Array.from(new Set(blockNumbers)).sort((item1: number, item2: number) => {
        return item1 - item2
      })
      const datas: StatisticsData[] = []
      blockNumbers.forEach(blockNumber => {
        if (findHashRate(hashRates, blockNumber)) {
          datas.push({
            blockNumber,
            type: 'HashRate',
            hashRate: findHashRate(hashRates, blockNumber),
            difficulty: findDifficulty(difficulties, blockNumber),
          })
        }
        if (findDifficulty(difficulties, blockNumber)) {
          const index = datas.findIndex(data => {
            return data.blockNumber === blockNumber
          })
          datas.push({
            blockNumber,
            type: 'Difficulty',
            hashRate: index === -1 ? findHashRate(hashRates, blockNumber) : undefined,
            difficulty: findDifficulty(difficulties, blockNumber),
          })
          if (index !== -1) {
            datas[index].difficulty = undefined
          }
        }
      })
      setStatisticsDatas(datas)
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
            <Tooltip />
            <Geom type="line" position="blockNumber*difficulty" color="type" size={1} shape="hv" />
            <Geom type="line" position="blockNumber*hashRate" color="type" size={1} shape="line" />
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
