import React from 'react'
import { Form, Button, Input, Icon, Select} from 'antd';
import { connect } from 'dva';

import styles from './UserEdit.less'

const FormItem = Form.Item;
const {Option} = Select;

@connect(({user, role, loading}) => ({
    user,
    role,
    submiting: loading.effects['user/saveOrUpdateUser'],
}))
@Form.create()
export default class Edit extends React.Component{    

    componentDidMount(){
        const { dispatch} = this.props;
        dispatch({
            type: 'role/searchRoles',
        })
    }

    handleSubmit(e){
        e.preventDefault();
        const {form, dispatch} = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if(!err){
                const user = values;
                dispatch({
                    type: 'user/saveOrUpdateUser',
                    payload: {user},
                })
            }
        })
    }

    renderRoleOptions(){
        const {role: {list}} = this.props;
        return list.map(item => {
            return <Option key={item.id} value={item.id}>{item.name}</Option>;
        })
    }

    render(){
        const {defaultUser = {}, submiting, form:{getFieldDecorator}} = this.props;
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
                <FormItem {...formItemLayout} label="姓名">
                    {getFieldDecorator('name', {
                        initialValue: defaultUser.name,
                    })(
                        <Input disabled onChange={this.handleNameChange} placeholder="请输入..." />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="角色">
                    {getFieldDecorator('role', {
                        initialValue: defaultUser.role,
                    })(
                        <Select placeholder="请选择角色...">
                            {this.renderRoleOptions()}
                        </Select>
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