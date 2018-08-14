import React from 'react';
import {Form, Input, Select, Row, Col, List, Card, Icon, Popconfirm, Tag, Button } from 'antd';
import { connect } from 'dva';
import TagSelect from '../../components/TagSelect';
import Ellipsis from '../../components/Ellipsis';
import StandardFormRow from '../../components/StandardFormRow';

import styles from './SearchArticle.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({article, tag, loading}) => ({
    article,
    tag,
    searching: loading.effects['article/searchArticle'],
}))
@Form.create()
export default class SearchArticle extends React.Component{

    componentDidMount(){
        const {dispatch} = this.props;
        dispatch({
            type: 'article/searchArticle',
            payload: {},
        })
        dispatch({
            type: 'tag/searchTags',
            payload: {},
        })
    }

    handleSearch = (e) => {
        e.preventDefault();
        const {form, dispatch} = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
            dispatch({
                type: 'article/searchArticle',
                payload: values,
            });
            }
        });
    }

    renderTags = (tags = []) => {
        return tags.map((tag) => {
            return <TagSelect.Option key={tag.id} value={tag.id}>{tag.name}</TagSelect.Option>
        })
    }

    renderLoadMore = () => {
        const {article: {hasMore}, searching} = this.props;
        return (
            <div className={styles.loadMoreContainer}>
                {hasMore ? (
                    <Button onClick={this.handleSearch}>
                        {searching ? (
                            <span>
                                <Icon type="loading" />&emsp;加载中...
                            </span>
                        ) : '加载更多'}
                    </Button>
                ) : null}
            </div>
        )
        
    }

    renderCardTags = (item) => {
        if(item.tags && item.tags.length > 0){
            return (
                <div className={styles.cardTagsContainer}>
                    {item.tags.map((tag) => {
                        return <Tag className={styles.cardTag} key={tag.id} color={tag.color}>{tag.name}</Tag>
                    })}
                </div>
            )
        }
    }

    renderCardActions = (item) => {
        const previewAction = <Icon className={styles.itemCardAction} type="eye-o" />;
        const editAction = <Icon className={styles.itemCardAction} type="edit" />
        const deleteAction = (
            <Popconfirm title={`是否删除“${item.title}”`} okText="是" cancelText="否">
                <Icon className={styles.itemCardAction} type="delete" />
            </Popconfirm>
        )        
        return [previewAction, editAction, deleteAction];
    }

    render(){
        const {article, tag, searching, form} = this.props;
        const { getFieldDecorator, resetFields } = form;
        const tags = this.renderTags(tag.list); 
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
        }
        return(
            <div>
                <Form className={styles.searchForm} onSubmit={this.handleSearch}>
                    <StandardFormRow title="关键词">
                        <FormItem>
                            {getFieldDecorator('searchKeyWord')(
                                <Input placeholder="输入搜索的关键词..." />
                            )}
                        </FormItem>
                    </StandardFormRow>
                    <StandardFormRow title="所属标签">
                        <FormItem>
                            {getFieldDecorator('searchTags')(
                                <TagSelect expandable>
                                    {tags}
                                </TagSelect>
                            )}
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
                        <Button type="primary" htmlType="submit">
                            {
                                searching ? (
                                    <span>
                                        <Icon type="loading" />&nbsp;搜索中...
                                    </span>
                                ) : '搜索'
                            }
                        </Button>
                        &emsp;
                        <Button onClick={() => {resetFields()}}>
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
                    loading={article.list.length === 0 ? searching : false}
                    itemLayout="vertical"
                    loadMore={loadMore}
                    dataSource={article.list}
                    renderItem={(item) => (
                        <List.Item key={item.id}>
                            <Card
                                hoverable 
                                actions={this.renderCardActions(item)}
                            >
                                <Card.Meta
                                    title={<a href="#">{item.title}</a>}
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
            </div>
        )
    }
} 