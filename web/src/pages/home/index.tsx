import React from 'react'
import Page from '../../components/page'

import Header from '../../components/header'
import Content from '../../components/content'
import Footer from '../../components/footer'

export default () => {
  return (
    <Page>
      <Header />
      <Content
        style={{
          padding: 20,
        }}
      >
        {new Array(100).fill(1).map(() => {
          const d = Math.random()
          return <p key={d}>{d}</p>
        })}
      </Content>
      <Footer />
    </Page>
  )
}
