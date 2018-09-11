import React from 'react';
import { Form, Button, Input, Icon, message, TreeSelect, Select, Spin } from 'antd';
import { connect } from 'dva';
import IconChoose from '../../components/IconChoose'
import SortList from '../../components/SortList'
import {createTreeMenusfromFlatMenus, treeMenusToTree} from '../../utils/menu'

import styles from './MenuEdit.less';

const FormItem = Form.Item;
const {SortItem} = SortList;
const {Option} = Select;
const {TreeNode} = TreeSelect;

@connect(({ menu, loading }) => ({
  menu,
  submiting: loading.effects['menu/saveOrUpdateMenu'],
}))
@Form.create()
export default class RoleEdit extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      sortSiblingMenus: [],
      treeData: [],
      parentMenu: props.defaultMenu.parentMenu || 0,
    }
  }

  componentDidMount(){
    const {dispatch, defaultMenu} = this.props;
    const {parentMenu} = this.state;

    this.getAndSetDefaultSiblingMenus(parentMenu);

    new Promise((resolve, reject) => {
      dispatch({
        type: 'menu/getAllMenus',
        resolve, 
        reject,
      })
    }).then(res => {
      let {list} = res.result;
      list = list.map(menu => {
        if(menu.id === defaultMenu.id){
          return {
            ...menu,
            disabled: true,
          }
        }else{
          return menu;
        }
      })
      const treeMenu = createTreeMenusfromFlatMenus(list);      
      const treeData = treeMenusToTree(treeMenu);
      this.setState({
        treeData,
      })
    }).catch(err => {
      message.error(err.message);
    })
  }

  getAndSetDefaultSiblingMenus = (parentMenu = 0) => {
    const {dispatch, form, defaultMenu} = this.props;
    const values = form.getFieldsValue(['name', 'path', 'icon']);
    const currentMenu = {
      ...defaultMenu,
      ...values,
    }
    new Promise((resolve, reject) => {
      dispatch({
        type: 'menu/searchMenus',
        payload: {
          parentMenu,
        },
        resolve, 
        reject,
      })
    }).then(res => {
      const {list} = res.result;
      let newList = list.sort((a, b) => a.orderNo > b.orderNo);
      newList = newList.filter(item => item.id !== currentMenu.id);
      if(currentMenu.name){
        newList.push(currentMenu);
      }

      this.setState({
        sortSiblingMenus: newList.sort((a, b) => a.orderNo > b.orderNo ),
      })
    }).catch(err => {
      message.error(err.message);
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { form, defaultMenu, dispatch} = this.props;
    const {sortSiblingMenus, parentMenu = 0} = this.state;
    let siblingMenus = sortSiblingMenus;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const currentMenu = {
          ...defaultMenu,
          ...values,
          parentMenu,
        };
        siblingMenus = siblingMenus.map((menu, index) => {
          if(menu.id === currentMenu.id){
            currentMenu.orderNo = index;
            return undefined;
          }
          return {
            ...menu,
            orderNo: index,
          }
        })
        new Promise((resolve, reject) => {
          dispatch({
            type: 'menu/saveOrUpdateMenu',
            payload: {
              menu: {...currentMenu, id: defaultMenu.id === -1000 ? undefined : defaultMenu.id},
              siblingMenus: siblingMenus.filter(item => item),
            },
            resolve,
            reject,
          })
        }).then(res => {
          message.success(res.message);
          dispatch({
            type: 'menu/getAllMenus',
          })
        }).catch(error => {
          message.error(error.message);
        })
      }
    });
  }

  handleSiblingMenusChange = (menus) => {
    this.setState({
      sortSiblingMenus: menus,
    })
  }

  handleNameKeyUp = () => {
    this.resetDefaultSiblingMenus()
  }

  handleIconChange = () => {
    setTimeout(() => {      
      this.resetDefaultSiblingMenus()
    }, 0);
  }

  resetDefaultSiblingMenus = () => {
    const {form, defaultMenu} = this.props;
    const {sortSiblingMenus} = this.state;
    const values = form.getFieldsValue(['name', 'path', 'icon']);
    const currentMenu = {
      ...defaultMenu,
      ...values,
    }
    let hasCurrentMenu = false;
    const newMenus = sortSiblingMenus.map(menu => {
      if(menu.id === currentMenu.id){
        hasCurrentMenu = true;
        return currentMenu.name ? { ...menu, ...currentMenu } : undefined;
      }else{
        return menu;
      }
    })
    if(!hasCurrentMenu){
      newMenus.push(currentMenu)
    }
    this.setState({
      sortSiblingMenus: newMenus.filter(item => item !== undefined),
    })
  }

  handleParentChange = (value) => {
    this.getAndSetDefaultSiblingMenus(value);
    this.setState({
      parentMenu: value,
    })
  }

  renderSiblingMenus = (menus = []) => {
    const {defaultMenu} = this.props;
    return menus.map(menu => {
      let className = styles.siblingMenu;
      if(menu.id === defaultMenu.id){
        className += ` ${styles.currentMenu}`
      }
      return (
        <SortItem key={menu.id} data={menu}>
          <span className={className}>
            {menu.icon ? <Icon type={menu.icon} /> : <Icon />}
            &nbsp;
            {menu.name}
          </span>
        </SortItem> 
        )
      
    })
  }

  renderParentTreeNodes = (nodes) => {
    return nodes.map((node) => {
      const nodeProps = {
        title: node.title,
        key: node.key,
        value: node.value,
      }
      if (node.children) {
        return (
          <TreeNode {...nodeProps}>
            {this.renderParentTreeNodes(node.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...nodeProps} />;
    });
  }

  render() {
    const {
      defaultMenu,
      submiting,
      form: { getFieldDecorator },
    } = this.props;
    const {sortSiblingMenus, treeData} = this.state;
    const loadedTreeData = treeData && treeData.length > 0;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="菜单名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '菜单名称不能为空',
              },
            ],
            initialValue: defaultMenu.name,
          })(<Input onKeyUp={this.handleNameKeyUp} placeholder="请填入菜单名称..." />)}
        </FormItem>
        <FormItem {...formItemLayout} label="菜单路径">
          {getFieldDecorator('path', {
            rules: [
              {
                required: true,
                message: '菜单路径不能为空',
              },
              {
                pattern: /^[a-zA-Z]{3,20}$/,
                message: '菜单路径必须是3-20位字母',
              },
            ],
            initialValue: defaultMenu.path,
          })(<Input placeholder="请填入菜单路径..." />)}
        </FormItem>
        <FormItem {...formItemLayout} label="是否隐藏">
          {getFieldDecorator('hideInMenu', {
            rules: [
              {
                required: true,
                message: '请选择...',
              },
            ],
            initialValue: defaultMenu.hideInMenu ? '1' : '0',
          })(
            <Select>
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>
          )}
        </FormItem>       
        <FormItem {...formItemLayout} label="菜单图标">
          {getFieldDecorator('icon', {
            initialValue: defaultMenu.icon,
          })(<IconChoose onChange={this.handleIconChange} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="父级菜单">
          <Spin spinning={!loadedTreeData}>
            {loadedTreeData ? (
              <TreeSelect
                allowClear
                treeDefaultExpandAll
                defaultValue={defaultMenu.parentMenu <= 0 ? '' : `${defaultMenu.parentMenu}`}
                treeData={treeData}
                placeholder="请选择父级菜单..."
                onChange={this.handleParentChange}
              />
            ) : ''}
          </Spin>
        </FormItem>
        <FormItem {...formItemLayout} label="同级菜单预览">
          <div className={styles.sortListContainer}>
            {/* {parentLabel ? (
              <div>
                <span>{parentLabel}</span>
              </div>
            ) : ''} */}
            <SortList className={styles.sortList} onChange={this.handleSiblingMenusChange}>
              {this.renderSiblingMenus(sortSiblingMenus)}
            </SortList>
          </div>
        </FormItem>
        <div className={styles.submitContainer}>
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
        </div>
      </Form>
    );
  }
}

RoleEdit.defaultProps = {
  defaultMenu: {
    id: -1000,
    parentMenu: 0,
  },
}
