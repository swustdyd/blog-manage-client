import React from 'react'
import {Icon} from 'antd'

import styles from './SortItem.less'

export default class SortItem extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showAction: false,
    }
  }

  render(){
    const {children, uniqueId, onUpClick, onDownClick, first, last} = this.props;
    const {showAction} = this.state;
    return(
      <div 
        className={styles.container} 
        onMouseEnter={() => this.setState({showAction: true})}
        onMouseLeave={() => this.setState({showAction: false})}
      >
        {showAction ? (
          <div className={styles.actionContainer}>
            {first ? <Icon type="up-circle-o" className={`${styles.actionIcon} ${styles.actionIconDisable}`} /> : (
              <Icon 
                onClick={() => onUpClick(uniqueId)} 
                className={styles.actionIcon} 
                type="up-circle-o" 
              />
            )}
            {last ? <Icon type="down-circle-o" className={`${styles.actionIcon} ${styles.actionIconDisable}`} /> : (
              <Icon 
                onClick={() => onDownClick(uniqueId)} 
                className={styles.actionIcon} 
                type="down-circle-o"
              />
            )}
            
          </div>
        ) : ''}
        <div className={styles.childContainer}>
          {children}
        </div>
      </div>
    )
  }
}