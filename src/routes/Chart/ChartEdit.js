import React from 'react';
import { connect } from 'dva';
import { Form, Input, Icon, Button } from 'antd';

import styles from './ChartEdit.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ chart, loading }) => ({
  chart,
  submiting: loading.effects['chart/saveOrUpdateChart'],
}))
@Form.create()
export default class ChartEdit extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
  };

  render() {
    const {
      defaultChart = {},
      form: { getFieldDecorator },
      submiting,
    } = this.props;
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
            initialValue: defaultChart.name,
          })(<TextArea placeholder="请填入报表SQL..." />)}
        </FormItem>
        <FormItem {...formItemLayout} label="报表Script">
          {getFieldDecorator('script', {
            rules: [
              {
                required: true,
                message: '报表Script不能为空',
              },
            ],
            initialValue: defaultChart.name,
          })(<TextArea placeholder="请填入报表Script..." />)}
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
      </Form>
    );
  }
}
