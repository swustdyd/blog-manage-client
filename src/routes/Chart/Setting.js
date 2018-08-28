import React from 'react';
import { Table, Popconfirm, Modal, Icon, Tooltip } from 'antd';
import { connect } from 'dva';
import ChartEdit from './ChartEdit';

import styles from './Setting.less';

@connect(({ chart, loading }) => ({
  chart,
  searching: loading.effects['chart/searchCharts'],
}))
export default class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalSetting: {},
      modalContent: {},
    };
  }

  componentDidMount() {
    this.handleSearchCharts();
  }

  handleSearchCharts() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/searchCharts',
    });
  }

  handleDeleteChart(chart) {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/deleteChart',
      payload: { chart },
    });
  }

  render() {
    const {
      chart: { list, showModal },
      searching,
      dispatch,
    } = this.props;
    const { modalSetting, modalContent } = this.state;
    const columns = [
      {
        title: '报表名称',
        dataIndex: 'name',
      },
      {
        title: '最后更新时间',
        dataIndex: 'updateAt',
      },
      {
        key: 'view',
        render: (name, record) => (
          <Tooltip title="查看报表">
            <Icon
              onClick={() => {
                // this.setState({
                //   modalSetting: {
                //     title: `查看报表：“${record.name}”`,
                //     width: 800,
                //   },
                //   modalContent: <ChartSearch defaultChart={record} />,
                // });
                dispatch({
                  type: 'chart/viewChartSearch',
                  payload: {
                    chart: record,
                  },
                });
              }}
              className={styles.editIcon}
              type="eye-o"
            />
          </Tooltip>
        ),
      },
      {
        key: 'edit',
        render: (name, record) => (
          <Tooltip title="编辑报表">
            <Icon
              onClick={() => {
                this.setState({
                  modalSetting: {
                    title: `编辑报表：“${record.name}”`,
                    width: 800,
                  },
                  modalContent: <ChartEdit defaultChart={record} />,
                });
                dispatch({
                  type: 'chart/showModal',
                });
              }}
              className={styles.editIcon}
              type="setting"
            />
          </Tooltip>
        ),
      },
      {
        dataIndex: 'id',
        render: (id, record) => (
          <Tooltip title="删除报表">
            <Popconfirm
              title={`是否删除“${record.name}”`}
              okText="是"
              cancelText="否"
              onConfirm={() => this.handleDeleteChart(record)}
            >
              <Icon className={styles.deleteIcon} type="delete" />
            </Popconfirm>
          </Tooltip>
        ),
      },
    ];
    return (
      <div className={styles.container}>
        <Table
          className="search-result-container"
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
              type: 'chart/hideModal',
            });
          }}
        >
          {modalContent}
        </Modal>
      </div>
    );
  }
}
