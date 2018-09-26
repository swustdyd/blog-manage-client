import React from 'react';
import { connect } from 'dva';
import { Form, Input, Icon, Button, Drawer, Tooltip } from 'antd';
import SearchWhere from '../../components/ChartView/SearchWhere'

import styles from './ChartEdit.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ chart, loading }) => ({
  chart,
  submiting: loading.effects['chart/saveOrUpdateChart'],
}))
@Form.create()
export default class ChartEdit extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      visible: false,
    }
  } 

  onClose = () => {
    this.setState({
      visible: false,
    });
  };  

  handleSubmit = e => {
    e.preventDefault();
  };

  preViewClick = () => {
    const {visible} = this.state;
    this.setState({
      visible: !visible,
    });
  }; 

  render() {
    const {
      defaultChart = {},
      form: { getFieldDecorator, getFieldValue},
      submiting,
    } = this.props;
    const {visible} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20 },
        md: { span: 20 },
      },
    };
    const textAreaAutosize = { 
      minRows: 1, 
      maxRows: 20,
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="报表名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '报表名称不能为空',
              },
            ],
            initialValue: defaultChart.name,
          })(<Input placeholder="请填入报表名称..." />)}
        </FormItem>
        <FormItem {...formItemLayout} label="报表SQL">
          {getFieldDecorator('sql', {
            rules: [
              {
                required: true,
                message: '报表SQL不能为空',
              },
            ],
            initialValue: defaultChart.sql,
          })(<TextArea autosize={textAreaAutosize} placeholder="请填入报表SQL..." />)}
        </FormItem>
        <FormItem {...formItemLayout} label="报表Script">
          {getFieldDecorator('script', {
            rules: [
              {
                required: true,
                message: '报表Script不能为空',
              },
            ],
            initialValue: defaultChart.script,
          })(<TextArea autosize={textAreaAutosize} placeholder="请填入报表Script..." />)}
        </FormItem>
        <FormItem 
          {...formItemLayout} 
          label={(
            <span>
              报表Where
              &nbsp;
              <Tooltip title="点击预览搜索框">
                <Icon className={styles.preViewIcon} type="eye-o" onClick={this.preViewClick} />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('where', {
            rules: [
              {
                required: true,
                message: '报表Where不能为空',
              },
            ],
            initialValue: JSON.stringify(defaultChart.where || []),
          })(<TextArea autosize={textAreaAutosize} placeholder="请填入报表Where..." />)}
        </FormItem>
        <div className={styles.submiContainer}>
          <Button type="primary" htmlType="submit">
            {submiting ? (
              <span>
                <Icon type="loading" />
                提交中...
              </span>
            ) : (
              '提交'
            )}
          </Button>
        </div>
        <Drawer
          title="Where预览"
          placement="top"
          closable={false}
          onClose={this.onClose}
          visible={visible}
          zIndex={1001}
          width="100%"
        >
          <SearchWhere where={JSON.parse(getFieldValue('where') || '[]')} />
        </Drawer>
      </Form>
    );
  }
}
