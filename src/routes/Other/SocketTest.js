import React from 'react';
import { Button, Input, message, Row, Col, Badge, Icon, Tooltip } from 'antd';
import moment from 'moment';
import { SOCKETHOST, SOCKETPORT } from '../../../config';

import styles from './SocketTest.less';

const { Search } = Input;

const url = `${SOCKETHOST}:${SOCKETPORT}`;
const socketNum = 3;
const sockets = {};

const createSockets = num => {
  for (let i = 0; i < num; i += 1) {
    sockets[i] = {
      id: i,
      name: `Socket(${i})`,
      instance: undefined,
    };
  }
};

createSockets(socketNum);

export default class SocketPage extends React.Component {
  render() {
    const items = [];
    for (const key in sockets) {
      if (Object.hasOwnProperty.call(sockets, key)) {
        const element = sockets[key];
        items.push(
          <Col key={element.id} span={8}>
            <div className={styles.itemContainer}>
              <SocketItem ws={element} />
            </div>
          </Col>
        );
      }
    }
    return <div>{items}</div>;
  }
}

// eslint-disable-next-line
class SocketItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          from: 'System',
          data: 'Please Open Socket',
          date: new Date(),
        },
      ],
      socketOpened: false,
      ws: props.ws || {},
      inputValue: '',
    };
  }

  handleSendClick = value => {
    if (value && value.trim()) {
      const { ws } = this.state;
      if (ws.instance) {
        ws.instance.send(
          JSON.stringify({
            from: ws.name,
            data: value,
            date: new Date(),
            type: 'broadcast',
          })
        );
        this.setState({
          inputValue: '',
        });
      } else {
        message.error('Please Open Socket');
      }
    } else {
      message.error("message can't be null");
    }
  };

  handleInputChange = e => {
    const { value } = e.target;
    this.setState({
      inputValue: value,
    });
  };

  handleSocketOpenClick = () => {
    const { ws } = this.state;
    if (!ws.instance) {
      const newWs = new WebSocket(url, 'echo-protocol');
      this.setState({
        ws: {
          ...ws,
          instance: newWs,
        },
      });
      newWs.onopen = () => {
        const { messages } = this.state;
        const msg = {
          from: 'System',
          data: 'Connection open ...',
          date: new Date(),
        };
        messages.push(msg);
        this.setState({
          messages,
          socketOpened: true,
        });
      };

      newWs.onmessage = evt => {
        const { messages } = this.state;
        const msg = evt.data;
        messages.push(JSON.parse(msg));
        this.setState({
          messages,
        });
      };

      newWs.onclose = () => {
        const { messages, ws: originWs } = this.state;
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
        });
      };
    } else {
      ws.instance.close();
    }
  };

  handleMessageClearClick = () => {
    this.setState({
      messages: [],
    });
  };

  renderMessageHeader = (item, isCurrent) => {
    let header = null;
    if (isCurrent) {
      header = (
        <div className={styles.messageHeaderCurrent}>
          <strong>
            &nbsp;
            {item.from}
          </strong>
          -<i>({moment(item.date).format('HH:mm:ss')})</i>
          <span className={styles.headerIconRight} />
        </div>
      );
    } else {
      header = (
        <div className={styles.messageHeader}>
          <span className={styles.headerIconLeft} />
          <i>({moment(item.date).format('HH:mm:ss')})</i>-<strong>{item.from}</strong>
        </div>
      );
    }
    return header;
  };

  renderMessage() {
    const { messages, ws } = this.state;
    let items = [];

    items = items.concat(
      messages.map(item => {
        const isCurrent = ws.name === item.from;
        return (
          <div className={styles.messageItemContainer} key={item.date}>
            {this.renderMessageHeader(item, isCurrent)}
            <div className={isCurrent ? styles.messageDataCurrent : styles.messageData}>
              {item.data}
            </div>
          </div>
        );
      })
    );

    return items;
  }

  render() {
    const { ws, inputValue, socketOpened } = this.state;
    return (
      <div>
        <Badge status={socketOpened ? 'success' : 'error'} text={`Socket(${ws.id})`} />
        &emsp;
        <Tooltip title={socketOpened ? 'Close Socket' : 'Open Socket'}>
          <Button
            type={socketOpened ? 'danger' : 'primary'}
            onClick={this.handleSocketOpenClick}
            size="small"
          >
            <Icon type="poweroff" theme="outlined" />
          </Button>
        </Tooltip>
        &emsp;
        <Tooltip title="Clear Messages">
          <Button type="danger" onClick={this.handleMessageClearClick} size="small">
            <Icon type="delete" theme="outlined" />
          </Button>
        </Tooltip>
        <div className={styles.messageListContainer}>{this.renderMessage()}</div>
        <Row>
          <Search
            disabled={!socketOpened}
            value={inputValue}
            placeholder="input message..."
            enterButton="Send"
            onSearch={this.handleSendClick}
            onChange={this.handleInputChange}
          />
        </Row>
      </div>
    );
  }
}
