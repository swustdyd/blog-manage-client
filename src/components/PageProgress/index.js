import React from 'react'
import {Progress} from 'antd'
import {getScrollTop} from '../../utils/utils'

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
    window.onscroll = this.handleWindowScroll;
    this.setState({
      target,
    })
  }

  handleWindowScroll = () => {
    const {target} = this.state;
    const scrollTop = getScrollTop();
    const {scrollHeight: totalScrollHeight} = target;
    const {clientHeight} = document.body;
    this.setState({
      percent: Math.round((scrollTop + (scrollTop ? clientHeight : 0)) / totalScrollHeight * 100),
    })
  }

  render(){
    const {className} = this.props;
    const {percent} = this.state;
    return(
      <Progress 
        className={`${styles.progress} ${className}`}
        showInfo={false}
        strokeWidth={3}
        percent={percent}
        width={3}
      />
    )
  }
}