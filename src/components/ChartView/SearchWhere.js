import React from 'react'
import {
  Row,
  Form,
  Input, 
  Select, 
  Checkbox, 
  Radio, 
  DatePicker,
} from 'antd'

import styles from './index.less'

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item;
const {Option} = Select;
const { RangePicker } = DatePicker;

export default class SearchWhere extends React.Component{
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

  render(){
    const {formItemLayout, getFieldDecorator, where} = this.props;
    return(
      <Row className={styles.searchWhereContainer}>
        {
          where.map(item => {
            const method = `render${item.type.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}`;
            return (
              <FormItem key={item.key} {...formItemLayout} label={item.label}>
                {getFieldDecorator ? getFieldDecorator(item.key)(
                  this[method](item)
                ) : this[method](item)}          
              </FormItem>
            )
          })
        }
      </Row>      
    )
  }
}

SearchWhere.defaultProps = {
  formItemLayout: {
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
  },
}