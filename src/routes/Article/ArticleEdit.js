import React from 'react';
import { Form, Input, Select, Tag, Button, Icon, message } from 'antd';
import { connect } from 'dva';
import Editor from '../../components/Editor';

import styles from './ArticleEdit.less';

const FormItem = Form.Item;
@connect(({ article, tag, loading }) => ({
  article,
  tag,
  submiting: loading.effects['article/saveOrUpdateArticle'],
}))
@Form.create()
export default class ArticleEdit extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'tag/searchTags',
      payload: {
        offset: 0,
        pageSize: 30,
      },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, defaultArticle = {} } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.content === '<p></p>') {
          message.error('内容不能为空');
          return;
        }
        new Promise((resolve, reject) => {
          dispatch({
            type: 'article/saveOrUpdateArticle',
            payload: {
              article: {
                ...defaultArticle,
                ...values,
              },
              resolve,
              reject,
            },
          });
        })
          .then(res => {
            dispatch({
              type: 'article/searchArticle',
            });
            message.success(res.message);
          })
          .catch(error => {
            message.error(error.message);
          });
      }
    });
  };

  renderSelectTag = (tags = []) => {
    return tags.map(tag => (
      <Select.Option key={tag.id} value={tag.id}>
        {<Tag color={tag.color}>{tag.name}</Tag>}
      </Select.Option>
    ));
  };

  render() {
    const {
      form: { getFieldDecorator },
      defaultArticle = {},
      tag: { list },
      submiting,
    } = this.props;
    const defaultArticleTags = [];
    if (defaultArticle.tags && defaultArticle.tags.length > 0) {
      defaultArticle.tags.forEach(tag => {
        defaultArticleTags.push(tag.id);
      });
    }
    const formItemLayout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22,
      },
    };
    return (
      <Form className={styles.formContainer} onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="标题">
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '标题不能为空',
              },
            ],
            initialValue: defaultArticle.title,
          })(<Input placeholder="请输入标题" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="标签">
          {getFieldDecorator('tags', {
            rules: [
              {
                required: true,
                message: '标签不能为空',
              },
            ],
            initialValue: defaultArticleTags,
          })(
            <Select mode="multiple" placeholder="请选择标签...">
              {this.renderSelectTag(list)}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="内容">
          {getFieldDecorator('content', {
            rules: [
              {
                required: true,
                message: '内容不能为空',
              },
            ],
            initialValue: defaultArticle.content || '请输入内容...',
          })(<Editor />)}
        </FormItem>
        <Button type="primary" htmlType="submit">
          {submiting ? (
            <span>
              <Icon type="loading" />
              &nbsp;提交中...
            </span>
          ) : (
            '提交'
          )}
        </Button>
      </Form>
    );
  }
}
