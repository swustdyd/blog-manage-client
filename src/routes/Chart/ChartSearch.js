import React from 'react'
import {connect} from 'dva'
import ChartView from '../../components/ChartView'

@connect(({chart, loading}) => ({
  chart,
  searching: loading.effects['chart/getChartDatas'],
}))
export default class ChartSearch extends React.Component{

  handleSearch = (values) => {
    const {dispatch, chart: {currentChart = {}}} = this.props;
    const {sql} = currentChart;
    dispatch({
      type: 'chart/getChartDatas',
      payload: {
        sql,
        where: values,
      },
    })
  }

  render(){
    const {chart: {currentChart = {}}, searching} = this.props;
    return (
      <ChartView 
        searching={searching}
        currentChart={currentChart}
        onSearch={this.handleSearch}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '30', '50'],
        }}
      />
    )
  }
}