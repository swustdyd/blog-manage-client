import React from 'react'
import {Icon, Tooltip} from 'antd'
import PropTypes from 'prop-types';

import styles from './index.less'

const iconTypes = ['setting', 'user', 'form', 'appstore-o', 'line-chart', 'file-text'];

export default class IconChoose extends React.Component{
  constructor(props){
    super(props);
    const {value} = props;
    const defaultChoose = {};
    if(value){
      if(typeof value === 'string'){
        defaultChoose[value] = true;
      }
      if(value instanceof Array){
        value.forEach(item => {
          defaultChoose[item] = true;
        })
      }
    }
    this.state = {
      collapse: true,
      choose: defaultChoose,
    }
  }

  onChange = (choose) => {
    const {onChange, type} = this.props;
    if(onChange){
      if(type === 'radio'){
        let selectKey = '';
        for (const key in choose) {
          if (Object.hasOwnProperty.call(choose, key) && choose[key]) {
            selectKey = key;
            break;            
          }
        }
        onChange(selectKey)
      }else{
        const seletedKeys = [];
        for (const key in choose) {
          if (Object.hasOwnProperty.call(choose, key) && choose[key]) {
            seletedKeys.push(key)            
          }
        }
        onChange(seletedKeys)
      }
    }
  }

  handleIconClick = (iconType) => {
    const {type} = this.props;
    const {choose} = this.state;
    let newChoose = {};
    if(type === 'radio'){
      newChoose = {
        [iconType]: !choose[iconType],
      };
    }else{
      
      newChoose = {
        ...choose,
        [iconType]: !choose[iconType],
      }
    }    
    this.setState({
      choose: newChoose,
    })
    this.onChange(newChoose);
  }
  
  handleCollapseIconClick = (value) => {
    this.setState({
      collapse: value,
    })
  }

  renderIcons = (renderIconTypes = []) => {
    const {choose} = this.state;
    return renderIconTypes.map( type => {
      let className = styles.icon;
      if(choose[type]){
        className += ` ${styles.iconChoose}`
      }
      return (
        <Tooltip key={type} title={type}>
          <Icon onClick={() => this.handleIconClick(type)} key={type} className={className} type={type} />
        </Tooltip>        
      )
    })
  }

  render(){
    const {collapse} = this.state;
    const renderIconTypes = collapse ? iconTypes.slice(0, 12) : iconTypes;
    return (
      <div className={styles.container}>
        <div className={styles.iconContainer}>
          {this.renderIcons(renderIconTypes)}
        </div>
        <div className={styles.collapseContainer}>
          {iconTypes.length > 12 ? (
            collapse ? (
              <span>
                <Icon onClick={() => this.handleCollapseIconClick(false)} className={styles.collapseIcon} type="down" />
              </span>
            ) : (
              <span>
                <Icon onClick={() => this.handleCollapseIconClick(true)} className={styles.collapseIcon} type="up" />
              </span>
            )
          ) : ''}          
        </div>
      </div>
    )
  }
}

IconChoose.propTypes = {
  type: PropTypes.string,
}

IconChoose.defaultProps = {
  type: 'radio',
}