import React from 'react'
import {
  Form, 
  Row, 
  Button, 
  Tabs, 
  Table, 
  message,
  Icon,
} from 'antd'
import Echarts from '../Echarts'
import SearchWhere from './SearchWhere'

import styles from './index.less'

const {TabPane} = Tabs;

@Form.create()
export default class ChartView extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      currentTagKey: '1',
    }
  }

  componentDidMount(){
    const {onSearch} = this.props;
    if(onSearch){
      onSearch()
    }else{
      message.error('未设置onSearch')
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {form, onSearch} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(!err){
        if(onSearch){
          onSearch(values)
        }else{
          message.error('未设置onSearch')
        }
      }
    })
  }

  handleTagChange = (key) => {
    this.setState({
      currentTagKey: key,
    })
  }

  renderSearchWhere = (where = []) => {
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
        md: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20 },
        md: { span: 22 },
      },
    };
    const {form: {getFieldDecorator}} = this.props;
    return <SearchWhere getFieldDecorator={getFieldDecorator} formItemLayout={formItemLayout} where={where} />
  }

  renderCharts = (chart) => {
    if(chart.script){
      try {     
        const func = eval(`(${chart.script})`);
        const options = func(chart.listData);
        return options.map(option => {
          return (          
            <Echarts
              key={chart.name || 'nokey'}
              className={styles.chart}
              option={option}
            />
          )
        })
      } catch (e) {
        console.log(e);
        message.error(e.message);
      }
    }
  }

  render(){
    const {currentTagKey} = this.state;
    const {currentChart = {}, searching, pagination} = this.props;
    const {listData} = currentChart;
    const columns = [];
    const hasData = currentChart.listData && currentChart.listData.length > 0
    if(hasData){
      const dataDemo = currentChart.listData[0];
      for (const key in dataDemo) {
        if (Object.prototype.hasOwnProperty.call(dataDemo, key)) {                    
            // const element = dataDemo[key];
            columns.push({
              title: key,
              key,
              dataIndex: key,
            }) 
        }
      }
    }
    return(
      <div>
        <h2>{currentChart.name}</h2>
        <Form className="search-form-container" onSubmit={this.handleSubmit}>
          {this.renderSearchWhere(currentChart.where)}
          <Row className="search-form-action-container">
            <Button type="primary" htmlType="submit">
              {searching ? (
                <span>
                  <Icon type="loading" />搜索中...
                </span>
              ) : '搜索'}
            </Button>   
          </Row>          
        </Form>
        <Tabs className="search-result-container" onChange={this.handleTagChange} activeKey={currentTagKey}>
          <TabPane tab="列表" key="1">
            {hasData ? (            
              <Table 
                rowKey={columns[0].dataIndex}
                dataSource={listData}
                columns={columns}
                pagination={pagination}
              />
            ) : '暂无数据'}
          </TabPane>
          <TabPane tab="图表" key="2">
            {hasData && currentTagKey === '2' ? this.renderCharts(currentChart) : '暂无数据'}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}