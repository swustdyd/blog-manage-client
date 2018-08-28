import React from 'react'
import {
  Input, 
  Select, 
  Checkbox, 
  Radio, 
  Form, 
  Row, 
  Col,
  Button, 
  Tabs, 
  Table, 
  message,
  DatePicker,
  Icon,
} from 'antd'
import Echarts from '../Echarts'

import styles from './index.less'

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group
const {Option} = Select;
const FormItem = Form.Item;
const {TabPane} = Tabs;
const { RangePicker } = DatePicker;

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

  renderDatePicker = (item) => {
    const {dateFormat, showTime} = item;
    return (
      <DatePicker 
        showTime={showTime}
        // defaultValue={moment(Date.now(), dateFormat)} 
        format={dateFormat}
      />
    )
  }

  renderRangePicker = (item) => {
    const {dateFormat, showTime} = item;
    return (
      <RangePicker 
        showTime={showTime}
        // defaultValue={[moment(Date.now(), dateFormat)]} 
        format={dateFormat}
      />
    )
  }

  renderInput = () => {
    return <Input />
  }

  renderSelect = (item) => {
    return (
      <Select>
        {
          item.datas.map(data => {
            return <Option key={data.value} value={data.value}>{data.label}</Option>
          })
        }
      </Select>
    )
  }

  renderRadio = (item) => {
    return (
      <RadioGroup name={item.key}>
        {
          item.datas.map(data => {
            return <Radio key={data.value} value={data.value}>{data.label}</Radio>
          })
        }
      </RadioGroup>
    )
  }

  renderCheckbox = (item) => {
    return (
      <CheckboxGroup name={item.key}>
        {
          item.datas.map(data => {
            return <Checkbox key={data.value} value={data.value}>{data.label}</Checkbox>
          })
        }
      </CheckboxGroup>
    )
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
    return where.map(item => {
      const method = `render${item.type.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}`;
      return (
        <FormItem key={item.key} {...formItemLayout} label={item.label}>
          {getFieldDecorator(item.key)(
            this[method](item)
          )}          
        </FormItem>
      )
    })
  }

  renderCharts = (chart) => {
    if(chart.script){
      try {   
        const colLayout = {
          xs: 24,
          sm: 24,
          md: 24,
          lg: 12,
        };     
        const func = eval(`(${chart.script})`);
        const options = func(chart.listData);
        return options.map(option => {
          return (          
            <Col 
              key={option.title.text} 
              className={styles.chartContainer} 
              {...colLayout}
            >            
              <Echarts
                className={styles.chart}
                option={option}
              />
            </Col>
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
    const {currentChart = {}, searching} = this.props;
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
          <Row>
            {this.renderSearchWhere(currentChart.where)}
          </Row>
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
                pagination={false}
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