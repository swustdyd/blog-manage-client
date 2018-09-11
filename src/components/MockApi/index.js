import React, { Component } from "react";
import { Row, Col, Button, Modal, Input, Card, Table, message, Select, Tooltip } from "antd";
import { stringify } from "qs";

import mock from "../../../.roadhogrc.mock";
import config from "./config";
import utils from './utils'
import request from './request'

import styles from "./index.less";

const { TextArea } = Input;
const {Option} = Select;

const { port, isStatic, docPort, host } = config;
const { isObject, parseKey, handleRequest } = utils;

const defaultMockData = mock.__mockData || mock;

class ApiItem extends Component {
  state = {
    urlValue: "",
    // theMockData: {},
    postParams: undefined,
  };
  
  handleChange = e => {
    this.setState({
      urlValue: e.target.value,
    });
  };

  handlePostParams = e => {
    const postParams = e.target.value;

    this.setState({
      postParams,
    });
  };

  handleShowData = data => {
    const {onPostClick} = this.props;
    if (onPostClick) {
      onPostClick(data);
    }
  };

  handlePostRequest = (u, url, postParams, method) => {
    let params;
    if (Object.prototype.toString.call(postParams) === "[object String]") {
      try {
        params = JSON.parse(postParams);
      } catch (e) {
        message.error("parse params error: ", JSON.stringify(e, null, 2));
      }
    }
    if (params) {
      if (method !== "GET" && port) {
        request(`${host || 'http://localhost'}:${docPort}${u}`, {
          method: "POST",
          body: params,
        }).then(data => {
          this.handleShowData(data);
        });
      } else {
        handleRequest(u, url, params, this.handleShowData);
      }
    }
  };

  render() {
    const { req, data } = this.props;
    const { method, url: u } = parseKey(req);
    const url = `${host || 'http://localhost'}${port ? `:${port}` : ":8000"}${u}`;
    let { urlValue, postParams } = this.state;

    const params = data.$params || {};
    const desc = data.$desc || "";

    const columns = [
      {
        key: "p",
        dataIndex: "p",
        title: "参数",
      },
      {
        key: "desc",
        dataIndex: "desc",
        title: "说明",
      },
      {
        key: "exp",
        dataIndex: "exp",
        title: "样例",
      },
    ];

    const dataSource = [];
    const getParams = {};
    Object.keys(params).forEach(p => {
      const pd = params[p];
      if (isObject(pd)) {
        getParams[p] = params[p].exp;
        dataSource.push({
          p,
          desc: params[p].desc,
          exp: params[p].exp,
        });
      } else {
        getParams[p] = params[p];
        dataSource.push({
          p,
          desc: "",
          exp: params[p],
        });
      }
    });

    if (method === "GET") {
      if (!urlValue && dataSource.length > 0) {
        urlValue = `${url}?${stringify(getParams)}`;
      }
    }
    if (!urlValue) {
      urlValue = url;
    }

    if (!postParams) {
      postParams = JSON.stringify(getParams, null, 2);
    }

    return (
      <Card
        className={styles.apiItem}
        title={(
          <div>        
            {desc && <p style={{ marginTop: 16 }}>{desc}</p>}
            <p className={styles.apiItemTitle}>
              <span>{method}</span>
              <span>{u}</span>
            </p>
          </div>
        )}
      >
        {!isStatic &&
          method === "GET" && (
            <div className={styles.apiItemOperator}>
              <Row gutter={16}>
                <Col span={20}>
                  <Input
                    value={urlValue}
                    onChange={this.handleChange}
                    placeholder={url}
                  />
                </Col>
                <Col span={4}>
                  <a href={urlValue}>
                    send
                  </a>
                </Col>
              </Row>
            </div>
          )}
        {((isStatic && method === "GET") || method !== "GET") && (
          <div className={styles.apiItemOperator}>
            <Row gutter={16}>
              <Col span={20}>
                <Input
                  value={urlValue}
                  onChange={this.handleChange}
                  placeholder={url}
                />
              </Col>
              <Col span={4}>
                <Button
                  type="primary"
                  onClick={() =>
                    this.handlePostRequest(u, url, postParams, method)
                  }
                  style={{ width: "100%" }}
                >
                  send
                </Button>
              </Col>
            </Row>
            {method !== "GET" &&
              dataSource.length > 0 && (
                <Row gutter={16}>
                  <Col span={24}>
                    <TextArea
                      style={{ marginTop: 16, width: "100%" }}
                      autosize={{ minRows: 2, maxRows: 20 }}
                      value={postParams}
                      onChange={this.handlePostParams}
                    />
                  </Col>
                </Row>
              )}
          </div>
        )}
        {dataSource.length > 0 && (
          <div className={styles.apiItemDocs}>
            <h3>Params</h3>
            <Table
              rowKey={record => record.p}
              pagination={false}
              size="small"
              columns={columns}
              dataSource={dataSource}
            />
          </div>
        )}
      </Card>
    );
  }
}

// eslint-disable-next-line
export default class ApiDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theMockData: {},
      modalVisible: false,
      /* eslint no-underscore-dangle:0 */
      mockData: defaultMockData,
    };
  }

  handleShowData = data => {
    this.setState({
      theMockData: data,
      modalVisible: true,
    });
  };

  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleSelectChange = (value = []) => {
    const data = {};
    for (const key in defaultMockData) {
      if (Object.hasOwnProperty.call(defaultMockData, key)) {
        const item = defaultMockData[key];
        if(value.join('').indexOf(key) !== -1){
          data[key] = item;
        }
      }
    }
    if(value.length < 1){
      this.setState({
        mockData: defaultMockData,
      })
    }else{
      this.setState({
        mockData: data,
      })
    }
  }

  renderSelectOption = () => {
    const options = [];
    for (const key in defaultMockData) {
      if (Object.hasOwnProperty.call(defaultMockData, key)) {
        const item = defaultMockData[key];
        options.push(
          <Option key={key} value={key}>
            <Tooltip title={key} placement="topLeft">
              <div>{item.$desc}</div>              
            </Tooltip>
          </Option>
        )
      }
    }
    return options;
  }

  render() {
    const { modalVisible, theMockData, mockData } = this.state;
    return (
      <div className={styles.apiDoc}>
        <Row>
          <Col span={24}>
            <Select 
              allowClear
              mode="multiple"
              size="large" 
              className={styles.apiSelect} 
              placeholder="选择或者输入要查看的MockApi..."
              onChange={this.handleSelectChange}
            >
              {this.renderSelectOption()}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className={styles.list}>
              {Object.keys(mockData).map(key => (
                <ApiItem
                  key={key}
                  req={key}
                  data={mockData[key]}
                  onPostClick={this.handleShowData}
                />
              ))}
            </div>
          </Col>
        </Row>
        <Modal
          title="Response Body"
          visible={modalVisible}
          onOk={this.handleModalCancel}
          onCancel={this.handleModalCancel}
        >
          <TextArea
            autosize={{ minRows: 2, maxRows: 20 }}
            value={JSON.stringify(theMockData, null, 2)}
          />
        </Modal>
      </div>
    );
  }
}
