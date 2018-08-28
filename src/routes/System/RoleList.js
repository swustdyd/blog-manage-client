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
      pageSize: 10,
      currentIndex: 0,
    };
  }

  componentDidMount() {
    this.handleSearchRole();
  }

  handleSearchRole(e, options = {}) {
    if(e){
      e.preventDefault();
    }
    const currentIndex = options.pageIndex || 0;
    this.setState({
      currentIndex,
    })
    const { dispatch } = this.props;
    const {pageSize} = this.state;
    dispatch({
      type: 'role/searchRoles',
      payload: {
        offset: currentIndex * pageSize,
        pageSize,
      },
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
      role: { list, showModal, total },
      searching,
      dispatch,
    } = this.props;
    const { modalSetting, modalContent, pageSize, currentIndex } = this.state;

    const pagination = {
        total,
        current: currentIndex + 1,
        pageSize,
        onChange: (pageIndex) => {
            this.handleSearchRole(null, {pageIndex: pageIndex - 1})
        },
    };
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
                    defaultRole={record}
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
      <div className="search-result-container">
        <Button style={{marginBottom: 25}} type="primary" onClick={() => this.handleNewRole()}>
          新增角色
        </Button>
        <Table
          className={styles.table}
          rowKey="id"
          columns={columns}
          loading={searching}
          dataSource={list}
          pagination={pagination}
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
