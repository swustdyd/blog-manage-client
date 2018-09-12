import React from 'react'
import {message, Card, Table, Icon, Tooltip, Select} from 'antd'
import copyToClipboard from 'copy-to-clipboard'
import {getAllRoutes} from '../../api'
import {HOST, PORT} from '../../../config'

import styles from './ServerApi.less'

const {Option} = Select;

class ApiItem extends React.Component{

  handleCopyClick = (path) => {
    copyToClipboard(path)
    message.success('已复制到粘贴板')
  }

  render(){
    const {
      api: {
        method,
        path, 
        name,
        description,
        functionName,
        controller,
        params,
      },
    } = this.props;
    const columns = [
      {
        key: "name",
        dataIndex: "name",
        title: "参数",
      },
      {
        key: "desc",
        dataIndex: "desc",
        title: "说明",
      },
      {
        key: 'type',
        dataIndex: 'type',
        title: '类型',
      },
      {
        key: "exp",
        dataIndex: "exp",
        title: "样例",
      },
    ]
    const finalPath = `${HOST}:${PORT}${path}`;
    return(
      <Card
        className={styles.apiItem}
        title={(
          <div>
            <p className={styles.name}>{`${name} ( ${controller}.${functionName} )`}</p>
            <p>
              <span className={styles.method}>{method.toUpperCase()}</span>
              &emsp;
              <span className={styles.path}>
                {finalPath}
                &emsp;
                <Tooltip title="复制">
                  <Icon onClick={() => this.handleCopyClick(finalPath)} className={styles.copy} type="copy" />
                </Tooltip>
              </span>
            </p>
            <p className={styles.description}>{description}</p>
          </div>
        )}
      >
        <h3>Params</h3>
        <div>
          <Table 
            size="small"
            columns={columns}
            dataSource={params}
            pagination={false}
          />
        </div>
      </Card>
    )
  }
}

ApiItem.defaultProps = {
  api: {
    method: '',
    path: '', 
    name: '',
    description: '',
    fuction: '',
    controller: '',
    params: [],
  },
}

// eslint-disable-next-line
export default class ServerApi extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {
      routes: [],
      defaultRoutes: [],
    }
  }

  componentDidMount(){
    getAllRoutes().then(res => {
      if(res.ok){
        const {list} = res.result;
        this.setState({
          routes: list,
          defaultRoutes: list,
        })
      }else{
        message.error(res.message);
      }
    }).catch(e => {
      message.error(e.message);
    })
  }

  handleSelectChange = (values) => {
    const {defaultRoutes} = this.state;
    const valuesString = values.join('');
    let routes = defaultRoutes.map(route => {
      if(valuesString.indexOf(route.path) !== -1){
        return route;
      }else{
        return undefined;
      }
    });

    routes = routes.filter(item => item !== undefined);
    
    if(values.length < 1){
      routes = defaultRoutes;
    }

    this.setState({
      routes,
    })
  }

  renderSelectOption = (routes = []) => {
    return routes.map(route => {
      const finalPath = `${HOST}:${PORT}${route.path}`;
      return (
        <Option key={route.path} value={route.path}>
          <Tooltip placement="topLeft" title={`${route.method.toUpperCase()} ${finalPath}`}>
            <div>{`${route.name} ( ${route.controller}.${route.functionName} )`}</div>
          </Tooltip>
        </Option>
      )
    })
  }

  render(){
    const {routes, defaultRoutes} = this.state;
    return(
      <div>
        <div>
          <Select 
            allowClear
            mode="multiple"
            size="large" 
            className={styles.apiSelect} 
            placeholder="选择或者输入要查看的Server Api..."
            onChange={this.handleSelectChange}
          >
            {this.renderSelectOption(defaultRoutes)}
          </Select>
        </div>
        {routes.map(item => {
          // return <p>{JSON.stringify(item)}</p>
          return <ApiItem key={item.path} api={item} />
        })}
      </div>
    )
  }
}