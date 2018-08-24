import React from 'react'
import {Form, Button, Input, message, Icon, Tag} from 'antd'
import {connect} from 'dva'
import { Promise } from 'core-js'
import ColorPicker from '../../components/ColorPicker'

import styles from './Edit.less'

const FormItem = Form.Item;
const defaultColor = '#1890ff';

@connect(({tag, loading}) => ({
    tag,
    submiting: loading.effects['tag/saveOrUpdateTag'],
}))
@Form.create()
export default class Edit extends React.Component{

    constructor(props){
        super(props);
        const {defaultTag = {}} = props;
        this.state = {
            color: defaultTag.color || defaultColor,
            name: defaultTag.name || 'null',
        }
    }

    handleColorChange = (color) => {
        this.setState({
            color: color.hex,
        })
    }

    handleNameChange = (e) => {
        this.setState({
            name: e.target.value,
        })
    }

    handleSubmit(event){
        event.preventDefault();
        const {form, defaultTag = {}, dispatch} = this.props;
        const { color } = this.state;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const tag = values;
                tag.color = color;
                new Promise((resolve, reject) => {
                    dispatch({
                        type: 'tag/saveOrUpdateTag',
                        payload: {
                            tag: {...defaultTag, ...tag},
                        },                        
                        resolve,
                        reject,
                    })
                }).then(res => {
                    message.success(res.message)
                    dispatch({
                        type: 'tag/searchTags',
                        payload: {
                            offset: 0,
                            pageSize: 10,
                        },
                    });
                }).catch(e => {
                    message.error(e.message);
                });
            }
        });
    }

    render(){
        const {submiting, form: {getFieldDecorator}, defaultTag = {}} = this.props;
        const {name, color} = this.state;
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
            <Form onSubmit={(e) => this.handleSubmit(e)}>
                <FormItem {...formItemLayout} label="标签名">
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: '标签名不能为空',
                            },  
                        ],
                        initialValue: defaultTag.name,
                    })(
                        <Input onChange={this.handleNameChange} placeholder="请填入标签名..." />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="标签描述">
                    {getFieldDecorator('description', {
                        rules: [
                            {
                                required: true,
                                message: '标签描述不能为空',
                            },  
                        ],
                        initialValue: defaultTag.description,
                    })(
                        <Input placeholder="请填入对该标签的描述..." />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="标签颜色">
                    {getFieldDecorator('color', {
                         initialValue: defaultTag.color || defaultColor,
                    })(
                        <ColorPicker onChange={this.handleColorChange} />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="标签预览">
                    <Tag color={color}>{name}</Tag>
                </FormItem>
                <FormItem className={styles.submitContainer}>
                    <Button type="primary" htmlType="submit">
                        {submiting ? (
                            <span>
                                <Icon type="loading" />&nbsp;提交中...
                            </span>
                        ) : '提交'}
                    </Button>
                </FormItem>
            </Form>
        )
    }
}