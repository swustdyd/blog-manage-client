import React from 'react';
import {Form, Input, Row, Col, Table, Icon, Popconfirm, Tag, Button } from 'antd';
import { connect } from 'dva';

import styles from './TagList.less'

const FormItem = Form.Item;

@connect(({ tag, loading}) => ({
    tag,
    searching: loading.effects['tag/searchTags'],
}))
@Form.create()
export default class TagList extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            currentIndex: 0,
            pageSize: 10,
        }
    }

    componentDidMount(){
        const {dispatch} = this.props;
        const {pageSize} = this.state;
        dispatch({
            type: 'tag/searchTags',
            payload: {
                offset: 0,
                pageSize,
            },
        });
    }

    handleSearch(e, options){
        if(e){
            e.preventDefault();
        }
        this.setState({
            currentIndex: options.pageIndex,
        })
        const {form, dispatch} = this.props;
        const {pageSize} = this.state;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                dispatch({
                    type: 'tag/searchTags',
                    payload: {
                        offset: options.pageIndex * pageSize,
                        pageSize,
                        condition: values,
                    },
                });
            }
        });
    }

    render(){
        const {form: {getFieldDecorator}, tag: {list: data, total}, searching} = this.props;
        const {currentIndex, pageSize} = this.state;
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
        const wrapperLayout = {
            row: {
                gutter: 24,
            },
            col: {
                xs: 24,
                sm: 24,
                md: 12,
            },
        }
        const columns = [
            {
                title: '标签名',
                dataIndex: 'name',
            },
            {
                title: '样式',
                dataIndex: 'color',
                render: (color, record) => <Tag key={record.id} color={color}>{record.name}</Tag>,
            },
            {
                title: '创建人',
                dataIndex: 'creater',
                render: (creater) => <a>{creater || 'unknown'}</a>,
            },
            {
                title: '最后更新时间',
                dataIndex: 'updateAt',
            },
            {
                // title: '描述',
                dataIndex: 'id',
                render: (id, record) => (
                    <Popconfirm key={id} title={`是否删除“${record.name}”`} okText="是" cancelText="否">
                        <Icon className={styles.deleteIcon} type="delete" />
                    </Popconfirm>
                ),
            },
        ]

        const pagination = {
            total,
            current: currentIndex + 1,
            pageSize,
            onChange: (pageIndex) => {
                this.handleSearch(null, {pageIndex: pageIndex - 1})
            },
        };
        return(
            <div>
                <Form className={styles.formContainer} onSubmit={(e) => this.handleSearch(e)}>
                    <Row {...wrapperLayout.row}>    
                        <Col {...wrapperLayout.col}>      
                            <FormItem {...formItemLayout} label="标签名">
                                {getFieldDecorator('searchKeyWord')(
                                    <Input placeholder="输入搜索的内容..." />
                                )}
                            </FormItem>
                        </Col>              
                        <Col {...wrapperLayout.col}>   
                            <FormItem {...formItemLayout}>                                                  
                                <Button type="primary" htmlType="submit">
                                    {
                                        searching ? (
                                            <span>
                                                <Icon type="loading" />&nbsp;搜索中...
                                            </span>
                                        ) : '搜索'
                                    }
                                </Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table
                    rowKey="id"
                    loading={searching}
                    className={styles.tableContainer}
                    columns={columns} 
                    dataSource={data}
                    pagination={pagination}
                    expandedRowRender={record => <p key={record.id} className={styles.desc}>{record.description}</p>} 
                />
            </div>
        )
    }
}