import React from 'react'
import ReactEcharts from 'echarts-for-react'

export default class Echarts extends React.Component{
  render(){
    return <ReactEcharts {...this.props} />
  }
}