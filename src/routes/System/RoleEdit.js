import React from 'react'
import { Form, Button, Input, Icon, Tree } from 'antd';
import { connect } from 'dva';

import styles from './RoleEdit.less'

const FormItem = Form.Item;
const {TreeNode} = Tree;

@connect(({role, loading}) => ({
    role,
    submiting: loading.effects['tag/saveOrUpdateRole'],
}))
@Form.create()
export default class Edit extends React.Component{
    handleSubmit(e){
        e.preventDefault();
        const {form, dispatch} = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if(!err){
                const role = values;
                dispatch({
                    type: 'role/saveOrUpdateRole',
                    payload: {role},
                })
            }
        })
    }

    render(){
        const {defaultRole = {}, submiting, form:{getFieldDecorator}} = this.props;
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
        return(
            <Form onSubmit={(e) => this.handleSubmit(e)}>
                <FormItem {...formItemLayout} label="角色名称">
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: '角色名称不能为空',
                            },  
                        ],
                        initialValue: defaultRole.name,
                    })(
                        <Input onChange={this.handleNameChange} placeholder="请填入角色名称..." />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="类型名称">
                    {getFieldDecorator('typeName', {
                        rules: [
                            {
                                required: true,
                                message: '类型名称不能为空',
                            },  
                            {
                                pattern: /^[a-zA-Z]{3,20}$/,
                                message: '类型名称必须是3-20位字母',
                            }, 
                        ],
                        initialValue: defaultRole.typeName,
                    })(
                        <Input placeholder="请填入类型名称..." />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="权限">
                    {getFieldDecorator('role', {
                            rules: [
                                {
                                    required: true,
                                    message: '类型名称不能为空',
                                },
                            ],
                            initialValue: defaultRole.typeName,
                        })(
                            <Input placeholder="请填入类型名称..." />
                        )}
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