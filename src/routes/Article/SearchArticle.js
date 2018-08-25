import React from 'react';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  List,
  Card,
  Icon,
  Popconfirm,
  Tag,
  Button,
  Modal,
} from 'antd';
import { connect } from 'dva';
import TagSelect2 from '../../components/TagSelect2';
import Ellipsis from '../../components/Ellipsis';
import StandardFormRow from '../../components/StandardFormRow';
import ArticleEdit from './ArticleEdit';

import styles from './SearchArticle.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ article, tag, loading }) => ({
  article,
  tag,
  searching: loading.effects['article/searchArticle'],
  moreLoading: loading.effects['article/loadMorArticle'],
}))
@Form.create()
export default class SearchArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalSetting: {},
      modalContent: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/searchArticle',
      payload: {},
    });
    dispatch({
      type: 'tag/searchTags',
      payload: {
        offset: 0,
        pageSize: 30,
      },
    });
  }

  handleSearch = (e, isLoadMore) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (isLoadMore) {
          dispatch({
            type: 'article/loadMorArticle',
            payload: values,
          });
        } else {
          dispatch({
            type: 'article/searchArticle',
            payload: values,
          });
        }
      }
    });
  };

  showNewArticleModal = () => {
    this.setState({
      modalSetting: {
        title: '新增文章',
        width: 1200,
      },
      modalContent: <ArticleEdit />,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'article/showModal',
    });
  };

  renderLoadMore = () => {
    const {
      article: { hasMore },
      moreLoading,
    } = this.props;
    return (
      <div className={styles.loadMoreContainer}>
        {hasMore ? (
          <Button onClick={e => this.handleSearch(e, true)}>
            {moreLoading ? (
              <span>
                <Icon type="loading" />
                &emsp;加载中...
              </span>
            ) : (
              '加载更多'
            )}
          </Button>
        ) : null}
      </div>
    );
  };

  renderCardTags = item => {
    if (item.tags && item.tags.length > 0) {
      return (
        <div className={styles.cardTagsContainer}>
          {item.tags.map(tag => {
            return (
              <Tag className={styles.cardTag} key={tag.id} color={tag.color}>
                {tag.name}
              </Tag>
            );
          })}
        </div>
      );
    }
  };

  renderCardActions = item => {
    const previewAction = <Icon className={styles.itemCardAction} type="eye-o" />;
    const editAction = (
      <Icon
        className={`${styles.itemCardAction} ${styles.itemCardActionEdit}`}
        type="edit"
        onClick={() => {
          this.setState({
            modalSetting: {
              title: `编辑文章“${item.title}”`,
              width: 1200,
            },
            modalContent: <ArticleEdit defaultArticle={item} />,
          });
          const { dispatch } = this.props;
          dispatch({
            type: 'article/showModal',
          });
        }}
      />
    );
    const deleteAction = (
      <Popconfirm title={`是否删除“${item.title}”`} okText="是" cancelText="否">
        <Icon className={`${styles.itemCardAction} ${styles.itemCardActionDelete}`} type="delete" />
      </Popconfirm>
    );
    return [previewAction, editAction, deleteAction];
  };

  render() {
    const {
      article: { list, showModal },
      tag: { list: tags },
      searching,
      form: { getFieldDecorator, resetFields },
      dispatch,
    } = this.props;
    const { modalSetting, modalContent } = this.state;
    const loadMore = this.renderLoadMore();
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
        md: { span: 18 },
      },
    };
    const wrapperLayout = {
      row: {
        gutter: 24,
      },
      col: {
        xs: 24,
        sm: 24,
        md: 8,
      },
    };
    return (
      <div>
        <Form className={styles.searchForm} onSubmit={this.handleSearch}>
          <StandardFormRow title={<span>&emsp;关键词</span>}>
            <FormItem>
              {getFieldDecorator('searchKeyWord')(<Input placeholder="输入搜索的关键词..." />)}
            </FormItem>
          </StandardFormRow>
          <StandardFormRow title="所属标签" block>
            <FormItem>
              {getFieldDecorator('searchTags')(<TagSelect2 tags={tags} expandable />)}
            </FormItem>
          </StandardFormRow>
          <StandardFormRow title="其他选项">
            <Row {...wrapperLayout.row}>
              <Col {...wrapperLayout.col}>
                <FormItem {...formItemLayout} label="好评度">
                  {getFieldDecorator('grade', {
                    // initialValue: ['1'],
                  })(
                    <Select mode="multiple" placeholder="请选择...">
                      <Option value="1">优秀</Option>
                      <Option value="2">一般</Option>
                      <Option value="3">差</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...wrapperLayout.col}>
                <FormItem {...formItemLayout} label="活跃用户">
                  {getFieldDecorator('activeUser', {
                    // initialValue: ['1'],
                  })(
                    <Select mode="multiple" placeholder="请选择...">
                      <Option value="1">用户1</Option>
                      <Option value="2">用户2</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </StandardFormRow>
          <Row className={styles.formActionContainer}>
            <Button
              className={styles.newArticleBtn}
              type="primary"
              onClick={this.showNewArticleModal}
            >
              新增文章
            </Button>
            <Button type="primary" htmlType="submit">
              {searching ? (
                <span>
                  <Icon type="loading" />
                  &nbsp;搜索中...
                </span>
              ) : (
                '搜索'
              )}
            </Button>
            &emsp;
            <Button
              onClick={() => {
                resetFields();
              }}
            >
              重置
            </Button>
          </Row>
        </Form>
        <List
          grid={{
            column: 3,
            gutter: 24,
            xs: 1,
            sm: 2,
            md: 3,
          }}
          className={styles.listContainer}
          loading={searching}
          itemLayout="vertical"
          loadMore={loadMore}
          dataSource={list}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card hoverable actions={this.renderCardActions(item)}>
                <Card.Meta
                  title={item.title}
                  description={
                    <Ellipsis className={styles.itemContent} lines={3}>
                      {item.content}
                    </Ellipsis>
                  }
                />
                {this.renderCardTags(item)}
              </Card>
            </List.Item>
          )}
        />
        <Modal
          destroyOnClose
          visible={showModal}
          maskClosable={false}
          footer={null}
          {...modalSetting}
          onCancel={() => {
            dispatch({
              type: 'article/hideModal',
            });
          }}
        >
          {modalContent}
        </Modal>
      </div>
    );
  }
}
