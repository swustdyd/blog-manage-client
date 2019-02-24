import React from 'react';
import { Form, Button, Input, Icon, Tree, message, Spin, Transfer, Tooltip } from 'antd';
import { connect } from 'dva';
import {
  treeMenusToTree, 
  selectedTreeToTreeMenus, 
  createTreeMenusfromFlatMenus, 
  getCheckedKeyFromTreeMenus,
  createFlatMenusFromTreeMenus,
} from '../../utils/menu'
import {HOST, PORT} from '../../../config'

import styles from './RoleEdit.less';

const FormItem = Form.Item;
const { TreeNode } = Tree;

const rebuildRoutes = (routes = []) => {
  return routes.map(route => {
    return {
      ...route,
      key: route.path,
      title: route.name,
      description: route.description,
      tip: `${route.status ? `${route.method.toUpperCase()} ${HOST}:${PORT}${route.path}` : '已失效 '}`,
      disabled: !route.status,
    }
  })
}

@connect(({ role, loading }) => ({
  role,
  submiting: loading.effects['tag/saveOrUpdateRole'],
}))
@Form.create()
export default class RoleEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      defaultRoutes: [],
      targetKeys: [],
      // transferSelectKeys: [],
    };
  }

  componentDidMount(){
    const {dispatch, defaultRole} = this.props;
    new Promise((resolve, reject) => {
      dispatch({
        type: 'menu/searchMenus',
        payload: {
          roleId: defaultRole.id,
        },
        resolve,
        reject,
      })
    }).then(res =>{
      const {list} = res.result;
      const treeMenu = createTreeMenusfromFlatMenus(list);
      const checkedKeys = getCheckedKeyFromTreeMenus(treeMenu);
      this.setState({
        checkedKeys,
      })
    }).catch(err => {
      message.error(err.message);
    })
    
    new Promise((resolve, reject) => {
      dispatch({
        type: 'menu/getAllMenus',
        resolve,
        reject,
      })
    }).then(res =>{
      const {list} = res.result;
      const treeMenu = createTreeMenusfromFlatMenus(list);
      const treeData = treeMenusToTree(treeMenu);
      this.setState({
        treeData,
      })
    }).catch(err => {
      message.error(err.message);
    })

    new Promise((resolve, reject) => {
      dispatch({
        type: 'api/getAllRoutes',
        resolve,
        reject,
      })
    }).then(res =>{
      const {list} = res.result;
      this.setState({
        defaultRoutes: rebuildRoutes(list),
      })
    }).catch(err => {
      message.error(err.message);
    })

    new Promise((resolve, reject) => {
      dispatch({
        type: 'api/searchRoutes',
        payload: {
          roleId: defaultRole.id,
        },
        resolve,
        reject,
      })
    }).then(res =>{
      const {list = []} = res.result;
      
      this.setState({
        targetKeys: list.map(route => route.path),
      })
    }).catch(err => {
      message.error(err.message);
    })
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

  handleTransferSearch = (inputValue, option) => {
    return option.title.indexOf(inputValue) > -1;
  }

  // handleTransferSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
  //   this.setState({
  //     transferSelectKeys: [...sourceSelectedKeys, ...targetSelectedKeys],
  //   })
  // }

  handleTransferChange = (targetKeys) => {
    this.setState({
      targetKeys,
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    const { form, dispatch, defaultRole } = this.props;
    const { checkedKeys, halfCheckedKeys, treeData, targetKeys, defaultRoutes} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const role = values;
        let newTreeData = treeData;
        checkedKeys.concat(halfCheckedKeys).forEach(key => {
          newTreeData = this.setSelectTree(newTreeData, key);
        });
        const selectedMenus = selectedTreeToTreeMenus(newTreeData);
        let roleAndMenus = createFlatMenusFromTreeMenus(selectedMenus);
        roleAndMenus = roleAndMenus.map(menuItem => {
          return {
            menuId: menuItem.id,
            roleId: defaultRole.id,
          }
        })
        const targetKeysString = targetKeys.join('');
        let roleAndApis = defaultRoutes.map(route => {
          if(targetKeysString.indexOf(route.path) > -1){
            return {
              apiId: route.id,
              roleId: defaultRole.id,
            }
          }else{
            return undefined;
          }
        })
        roleAndApis = roleAndApis.filter(item => item !== undefined)
        new Promise((resolve, reject) => {
          dispatch({
            type: 'role/saveOrUpdateRole',
            payload: {
              role: { ...defaultRole, ...role },
              roleAndMenus,
              roleAndApis,
            },
            resolve,
            reject,
          });
        }).then(res => {
          message.success(res.message);
          dispatch({
            type: 'role/searchRoles',
          });
        })
        .catch(e => {
          message.error(e.message);
        });
      }
    });
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
      defaultRole,
      submiting,
      form: { getFieldDecorator },
    } = this.props;
    const { 
      expandedKeys, 
      autoExpandParent, 
      checkedKeys, 
      selectedKeys, 
      treeData,
      defaultRoutes,
      targetKeys,
      // transferSelectKeys,
    } = this.state;
    const loadedTreeData = treeData && treeData.length > 0;
    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
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
        <FormItem {...formItemLayout} label="导航菜单">
          <Spin spinning={!loadedTreeData}>
            <div className={styles.menuContainer}>
              {loadedTreeData ? (
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
              ) : ''}
            </div>            
          </Spin>          
        </FormItem>
        <FormItem {...formItemLayout} label="Server Api">
          <Transfer
            showSearch
            titles={['未选', '已选']}
            targetKeys={targetKeys}
            // selectedKeys={transferSelectKeys}
            filterOption={this.handleTransferSearch}
            onChange={this.handleTransferChange}
            // onSelectChange={this.handleTransferSelectChange}
            className={styles.transfer}
            listStyle={{height: 300, width: 205}}
            dataSource={defaultRoutes}
            render={item => (
              <Tooltip title={item.tip}>
                {item.title}
              </Tooltip>
            )}
          />
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
  defaultRole: {
    id: -1,
  },
}
