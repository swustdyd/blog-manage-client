import React from 'react'
import {connect} from 'dva'
import {Input, Select, Checkbox, Radio, Form, Row, Button, Tabs } from 'antd'

import styles from './ChartSearch.less'

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group
const {Option} = Select;
const FormItem = Form.Item;
const {TabPane} = Tabs;

@connect(({chart, loading}) => ({
  chart,
  searching: loading.effects['chart/searchCharts'],
}))
@Form.create()
export default class ChartSearch extends React.Component{

  handleSubmit = (e) => {
    e.preventDefault();
    const {form} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(!err){
        console.log(values);
      }
    })
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
      const method = `render${item.type.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}`;
      return (
        <FormItem key={item.key} {...formItemLayout} label={item.label}>
          {getFieldDecorator(item.key)(
            this[method](item)
          )}          
        </FormItem>
      )
    })
  }

  render(){
    const {chart: {currentChart = {}}} = this.props;
    return(
      <div className={styles.container}>
        <h2>{currentChart.name}</h2>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            {this.renderSearchWhere(currentChart.where)}
          </Row>
          <Row>
            <FormItem>
              <Button type="primary" htmlType="submit">搜索</Button>         
            </FormItem>
          </Row>          
        </Form>
        <Tabs defaultActiveKey="1">
          <TabPane tab="列表" key="1">列表</TabPane>
          <TabPane tab="图表" key="2">图表</TabPane>
        </Tabs>
      </div>
    )
  }
}