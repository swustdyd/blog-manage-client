import React from 'react';
import { Form, Button, Input, Icon, Tree,message } from 'antd';
import { connect } from 'dva';
import { menuData } from '../../common/menu';

import styles from './RoleEdit.less';

const FormItem = Form.Item;
const { TreeNode } = Tree;

const menusToTree = (menus, basePath = '') => {
  const tree = [];
  menus.forEach(menu => {
    const node = {
      title: menu.name,
      key: `${basePath ? `${basePath}/` : ''}${menu.path}`,
      icon: menu.icon,
    };
    if (menu.children && menu.children.length > 0) {
      node.children = menusToTree(menu.children, menu.path);
    }
    tree.push(node);
  });
  return tree;
};

const treeData = menusToTree(menuData);

const selectedTreeToMenus = tree => {
  const menus = [];
  tree.forEach(node => {
    // if (node.selected) {
    //   const paths = node.key.split('/');
    //   const menu = {
    //     name: node.title,
    //     path: paths[paths.length - 1],
    //     icon: node.icon,
    //   };
    //   if (node.children && node.children.length > 0) {
    //     menu.children = selectedTreeToMenus(node.children);
    //   }
    //   menus.push(menu);
    // }
    const paths = node.key.split('/');
    if (node.children && node.children.length > 0) {
        const childrenMenus = selectedTreeToMenus(node.children);
        if(childrenMenus.length > 0){
            const menu = {
              name: node.title,
              path: paths[paths.length - 1],
              icon: node.icon,
              children: childrenMenus,
            };
          menus.push(menu);
        }
    }else if(node.selected){
      menus.push({
        name: node.title,
        path: paths[paths.length - 1],
        icon: node.icon,
      });
    }
  });
  return menus;
};

const getCheckedKeyFromMenus = (menus = [], basePath) => {
  const checkedKeys = [];
  menus.forEach(menu => {
    if (menu.children && menu.children.length > 0) {
      checkedKeys.push(...getCheckedKeyFromMenus(menu.children, menu.path));
    } else {
      checkedKeys.push(`${basePath ? `${basePath}/` : ''}${menu.path}`);
    }
  });
  return checkedKeys;
};

@connect(({ role, loading }) => ({
  role,
  submiting: loading.effects['tag/saveOrUpdateRole'],
}))
@Form.create()
export default class Edit extends React.Component {
  constructor(props) {
    super(props);
    let checkedKeys = [];
    if (props.defaultRole) {
      checkedKeys = getCheckedKeyFromMenus(JSON.parse(props.defaultRole.menus));
    }
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys,
      selectedKeys: [],
    };
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = (checkedKeys, { halfCheckedKeys }) => {
    this.setState({
      checkedKeys,
      halfCheckedKeys,
    });
  };

  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
    info.node.onExpand(info);
  };

  setSelectTree = (tree = [], selectedKey) => {
    return tree.map(node => {
      if (node.key === selectedKey) {
        return {
          ...node,
          selected: true,
        };
      } else if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: this.setSelectTree(node.children, selectedKey),
        };
      } else {
        return node;
      }
    });
  };

  handleSubmit(event) {
    event.preventDefault();
    const { form, dispatch, defaultRole = {} } = this.props;
    const { checkedKeys, halfCheckedKeys } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const role = values;
        let newTreeData = treeData;
        checkedKeys.concat(halfCheckedKeys).forEach(key => {
          newTreeData = this.setSelectTree(newTreeData, key);
        });
        role.menus = selectedTreeToMenus(newTreeData);
        new Promise((resolve, reject) => {
          dispatch({
            type: 'role/saveOrUpdateRole',
            payload: { 
              role: {...defaultRole, ...role}, 
            },
            resolve,
            reject,
          });
        }).then(res => {
            message.success(res.message)
            dispatch({
              type: 'role/searchRoles',
            });
        }).catch(e => {
            message.error(e.message);
        });
    }});
  }

  renderTreeNodes(data) {
    return data.map(item => {
      if (item.children) {
        return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
            </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }

  render() {
    const {
      defaultRole = {},
      submiting,
      form: { getFieldDecorator },
    } = this.props;
    const { expandedKeys, autoExpandParent, checkedKeys, selectedKeys } = this.state;
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
        <Form onSubmit={e => this.handleSubmit(e)}>
            <FormItem {...formItemLayout} label="角色名称">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '角色名称不能为空',
                    },
                  ],
                  initialValue: defaultRole.name,
                })(<Input onChange={this.handleNameChange} placeholder="请填入角色名称..." />)}
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
                })(<Input placeholder="请填入类型名称..." />)}
            </FormItem>
            <FormItem {...formItemLayout} label="权限">
                <Tree
                  checkable
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onCheck={this.onCheck}
                  checkedKeys={checkedKeys}
                  onSelect={this.onSelect}
                  selectedKeys={selectedKeys}
                >
                    {this.renderTreeNodes(treeData)}
                </Tree>
            </FormItem>
            <FormItem className={styles.submitContainer}>
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
            </FormItem>
        </Form>
    );
  }
}
