import React from 'react';
import { Table, Popconfirm, Button, Modal, Icon } from 'antd';
import { connect } from 'dva';
import RoleEdit from './RoleEdit';

import styles from './RoleList.less';

@connect(({ role, loading }) => ({
  role,
  searching: loading.effects['role/searchRoles'],
}))
export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalSetting: {},
      modalContent: {},
    };
  }

  componentDidMount() {
    this.handleSearchRole();
  }

  handleSearchRole() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/searchRoles',
    });
  }

  handleNewRole() {
    const { dispatch } = this.props;
    this.setState({
      modalSetting: {
        title: '新增角色',
      },
      modalContent: <RoleEdit />,
    });
    dispatch({
      type: 'role/showModal',
    });
  }

  handleDeleteRole(role) {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/deleteRole',
      payload: { role },
    });
  }

  render() {
    const {
      role: { list, showModal },
      searching,
      dispatch,
    } = this.props;
    const { modalSetting, modalContent } = this.state;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        render: (name, record) => (
          <a
            onClick={() => {
              this.setState({
                modalSetting: {
                  title: `编辑角色：“${name}”`,
                },
                modalContent: (
                  <RoleEdit
                    defaultRole={{
                      ...record,
                      menus: [
                        {
                          name: '文章管理',
                          path: 'article',
                          icon: 'file-text',
                          children: [
                            { name: '文章列表', path: 'list' },
                            { name: '标签设置', path: 'tag' },
                          ],
                        },
                        {
                          name: '系统设置',
                          path: 'system',
                          icon: 'setting',
                          children: [
                            { name: '角色设置', path: 'role' },
                            { name: '用户列表', path: 'user-list' },
                          ],
                        },
                        {
                          name: '我的',
                          path: 'user',
                          icon: 'user',
                          children: [{ name: '个人中心', path: 'detail' }],
                        },
                      ],
                    }}
                  />
                ),
              });
              dispatch({
                type: 'role/showModal',
              });
            }}
          >
            {name}
          </a>
        ),
      },
      {
        title: '创建者',
        dataIndex: 'creater',
        render: name => name || 'unknown',
      },
      {
        title: '编辑者',
        dataIndex: 'editer',
        render: name => name || 'unknown',
      },
      {
        title: '最后更新时间',
        dataIndex: 'updateAt',
      },
      {
        dataIndex: 'id',
        render: (id, record) => (
          <Popconfirm
            title={`是否删除“${record.name}”`}
            okText="是"
            cancelText="否"
            onConfirm={() => this.handleDeleteRole(record)}
          >
            <Icon className={styles.deleteIcon} type="delete" />
          </Popconfirm>
        ),
      },
    ];
    return (
      <div className={styles.container}>
        <Button type="primary" onClick={() => this.handleNewRole()}>
          新增角色
        </Button>
        <Table
          className={styles.table}
          rowKey="id"
          columns={columns}
          loading={searching}
          dataSource={list}
        />
        <Modal
          destroyOnClose
          visible={showModal}
          maskClosable={false}
          footer={null}
          {...modalSetting}
          onCancel={() => {
            dispatch({
              type: 'role/hideModal',
            });
          }}
        >
          {modalContent}
        </Modal>
      </div>
    );
  }
}
