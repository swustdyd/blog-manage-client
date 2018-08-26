import React from 'react';
import { Table, Popconfirm, Modal, Icon } from 'antd';
import { connect } from 'dva';
import UserEdit from './UserEdit';

import styles from './UserList.less';

@connect(({ user, loading }) => ({
  user,
  searching: loading.effects['user/searchUsers'],
}))
export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalSetting: {},
      modalContent: {},
    };
  }

  componentDidMount() {
    this.handleSearchUsers();
  }

  handleSearchUsers() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/searchUsers',
    });
  }

  handleDeleteUser(user) {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/deleteUser',
      payload: { user },
    });
  }

  render() {
    const {
      user: { list, showModal },
      searching,
      dispatch,
    } = this.props;
    const { modalSetting, modalContent } = this.state;
    const columns = [
      {
        title: '头像',
        key: 'icon',
        render: () => <Icon className={styles.userIcon} type="user" />,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        render: (name, record) => (
          <a
            onClick={() => {
              this.setState({
                modalSetting: {
                  title: `编辑用户：“${name}”`,
                },
                modalContent: <UserEdit defaultUser={record} />,
              });
              dispatch({
                type: 'user/showModal',
              });
            }}
          >
            {name}
          </a>
        ),
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
            onConfirm={() => this.handleDeleteUser(record)}
          >
            <Icon className={styles.deleteIcon} type="delete" />
          </Popconfirm>
        ),
      },
    ];
    return (
      <div className={styles.container}>
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
              type: 'user/hideModal',
            });
          }}
        >
          {modalContent}
        </Modal>
      </div>
    );
  }
}
