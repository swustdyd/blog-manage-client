import React from 'react'
import {Timeline, Button, Input, message, Row, Col, Badge} from 'antd'
import moment from 'moment'

import styles from './SocketTest.less'

const {Search} = Input;

const url = 'ws://10.130.196.85:8081'
const sockets = {};

const createSockets = (num) => {
  for (let i = 0; i < num; i += 1) {
    sockets[i] = {
      id: i,
      instance: undefined,
    }
  }
}

createSockets(4);

export default class SocketPage extends React.Component{
  render(){
    const items = [];
    for (const key in sockets) {
      if (Object.hasOwnProperty.call(sockets, key)) {
        const element = sockets[key];        
        items.push(
          <Col key={element.id} span={12}>
            <div className={styles.itemContainer}>
              <SocketItem ws={element} />
            </div>
          </Col>
        );
      }
    }
    return(
      <div>
        {items}
      </div>
    )
  }
}

// eslint-disable-next-line
class SocketItem extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      messages: [{
        from: 'System',
        data: 'Please Click The Button \'Open Socket\' ',
        date: new Date(),
      }],
      socketOpened: false,
      ws: props.ws || {},
      inputValue: '',
    }
  }

  handleSendClick = (value) => {
    if(value){
      const {ws} = this.state
      if(ws.instance){
        ws.instance.send(JSON.stringify({
          from: `Socket(${ws.id})`,
          data: value,
          date: new Date(),
          type: 'broadcast',
        }))
        this.setState({
          inputValue: '',
        })
      }else{
        message.error('Please Click The Button \'Open Socket\' ');
      }
    }else{
      message.error('message can\'t be null');
    }
  }

  handleInputChange = (e) => {
    const {value} = e.target;
    this.setState({
      inputValue: value,
    })
  }

  handleSocketOpenClick = () => {
    const {ws} = this.state;
    if(!ws.instance){
      const newWs = new WebSocket(url, 'echo-protocol')
      this.setState({
        ws: {
          ...ws,
          instance: newWs,
        },
      })
      newWs.onopen = () => {
        const messages = [];
        const msg = {
          from: 'System',
          data: 'Connection open ...',
          date: new Date(),
        };
        messages.push(msg);
        this.setState({
          messages,
          socketOpened: true,
        })
      };
      
      newWs.onmessage = (evt) => {
        const {messages} = this.state;
        const msg = evt.data;
        messages.push(JSON.parse(msg));
        this.setState({
          messages,
        }) 
      };
      
      newWs.onclose = () => {
        const {messages, ws: originWs} = this.state;
        const msg = {
          from: 'System',
          data: 'Connection closed.',
          date: new Date(),
        };
        messages.push(msg);
        this.setState({
          messages,
          socketOpened: false,
          ws: {
            ...originWs,
            instance: undefined,
          },
        })
      }; 
    }
  }

  handleSocketCloseClick = () => {
    const {ws} = this.state;
    if(ws.instance){
      ws.instance.close();
    }
  }

  renderTimeline(){
    const {messages, ws} = this.state;
    const curentSokect = `Socket(${ws.id})`
    let items = [];

    items = items.concat(messages.map(item => {
      return(
        <Timeline.Item key={item.date} color={item.from === curentSokect ? 'green' : 'blue'}>
          <i>
            ({moment(item.date).format('HH:mm:ss')})
          </i>
          -&nbsp;
          <strong>{item.from}:&nbsp;</strong>
          {item.data}
        </Timeline.Item>
      )
    }))

    return(
      <Timeline>
        {items}
      </Timeline>
    )
  }

  render(){
    const {ws, inputValue, socketOpened} = this.state;
    return(
      <div>
        <Badge status={socketOpened ? 'success' : 'error'} text={`Socket(${ws.id})`} />
        <div>
          <Row style={{marginTop: 25}}>
            <Button 
              type="primary"
              onClick={this.handleSocketOpenClick}
            >
              Open Socket
            </Button>
            &emsp;
            <Button 
              type="danger"
              onClick={this.handleSocketCloseClick}
            >
              Close Socket
            </Button>
          </Row>
          <Row style={{marginTop: 25}}>
            <Search
              value={inputValue}
              placeholder="input message..."
              enterButton="Send"
              onSearch={this.handleSendClick}
              onChange={this.handleInputChange}
            />
          </Row>
          <Row style={{marginTop: 25}}>
            {this.renderTimeline()}
          </Row>
        </div>
      </div>
    )
  }
}