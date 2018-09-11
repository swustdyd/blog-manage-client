import React from 'react';
import { Table, Button, Modal, Tabs, Tree, Icon } from 'antd';
import { connect } from 'dva';
import MenuEdit from './MenuEdit';
import {createTreeMenusfromFlatMenus, treeMenusToTree} from '../../utils/menu'

import styles from './MenuList.less';

const {TabPane} = Tabs;
const {TreeNode} = Tree;

@connect(({ menu, loading }) => ({
  menu,
  searching: loading.effects['menu/getAllMenus'],
}))
export default class MenuList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalSetting: {},
      modalContent: {},
      currentTagKey: '2',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/getAllMenus',
    });
  }

  handleTagChange = (key) => {
    this.setState({
      currentTagKey: key,
    })
  }

  showNewMenuModal = () => {
    this.setState({
      modalSetting: {
        title: '新增菜单',
      },
      modalContent: <MenuEdit />,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/showModal',
    });
  }

  showEditMenuModal = (menu) => {
    this.setState({
      modalSetting: {
        title: `编辑菜单：${menu.name}`,
      },
      modalContent: <MenuEdit defaultMenu={menu} />,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/showModal',
    });
  }

  renderTreeNodes = (nodes) => {
    return nodes.map((node) => {
      const nodeProps = {
        icon: <Icon type={node.icon} />,
        title: (
          <a className={styles.treeTitle} onClick={() => this.showEditMenuModal(node)}>
            <Icon type={node.icon} />
            &nbsp;
            {node.name}
          </a>
        ),
        key: node.key,
        dataRef: node,
      }
      if (node.children) {
        return (
          <TreeNode {...nodeProps}>
            {this.renderTreeNodes(node.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...nodeProps} />;
    });
  }

  renderTree = (flatMenus = []) => {
    const treeMenus = createTreeMenusfromFlatMenus(flatMenus);
    const treeData = treeMenusToTree(treeMenus);
    return (
      <Tree>
        {this.renderTreeNodes(treeData)}
      </Tree>
    )
  }

  render() {
    const {
      menu: { list, showModal },
      searching,
      dispatch,
    } = this.props;
    const { modalSetting, modalContent, currentTagKey } = this.state;
    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
        render: (name, record) => (
          <a onClick={() => this.showEditMenuModal(record)}>
            {name}
          </a>
        ),
      },
      {
        title: '创建人',
        dataIndex: 'creater',
        render: creater => <span>{creater || 'unknown'}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'createAt',
      },
      {
        title: '最后更新时间',
        dataIndex: 'updateAt',
      },
    ];

    return (
      <div className="search-result-container">
        <Button onClick={this.showNewMenuModal} type="primary">新增菜单</Button>
        <Tabs className="search-result-container" onChange={this.handleTagChange} activeKey={currentTagKey}>
          <TabPane tab="列表" key="1">
            <Table 
              rowKey="id"
              dataSource={list}
              columns={columns}
              pagination={false}
              loading={searching}
            />
          </TabPane>
          <TabPane tab="结构树" key="2">
            { currentTagKey === '2' && list.length > 0 ? this.renderTree(list) : '暂无数据'}
          </TabPane>
        </Tabs>
        <Modal
          destroyOnClose
          visible={showModal}
          maskClosable={false}
          footer={null}
          {...modalSetting}
          onCancel={() => {
            dispatch({
              type: 'menu/hideModal',
            });
          }}
        >
          {modalContent}
        </Modal>
      </div>
    );
  }
}
