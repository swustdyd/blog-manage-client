import React from 'react'
import {Progress} from 'antd'

import styles from './index.less'

export default class PageProgress extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      target: undefined,
      percent: 0,
    }
  }

  componentDidMount(){
    const {targetId} = this.props;
    const target = document.getElementById(targetId);
    target.onscroll = this.handleWindowScroll;
    this.setState({
      target,
    })
  }

  handleWindowScroll = () => {
    let percent = 0;
    const {target} = this.state;
    const {scrollTop} = target;
    const {scrollHeight: totalScrollHeight} = target;
    const {clientHeight} = document.body;
    if(totalScrollHeight !== clientHeight){
      percent = Math.round( scrollTop / (totalScrollHeight - clientHeight ) * 100);
    }
    this.setState({
      percent,
    })
  }

  render(){
    const {className, showInfo} = this.props;
    const {percent} = this.state;
    return(
      <div className={`${styles.progress} ${className}`}>
        <Progress
          showInfo={false}
          strokeWidth={3}
          percent={percent}
          width={3}
          status="active"
        />
        {/* {showInfo ? (
          <span className={styles.info}>
            {percent}%
          </span>
        ) : ''} */}
      </div>
    )
  }
}