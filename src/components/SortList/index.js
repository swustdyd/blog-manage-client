import React from 'react'
import SortItem from './SortItem'

import styles from './index.less'


export default class SortList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      list: [],
    }
  }

  componentWillReceiveProps(newProps){
    const {children} = newProps;
    const newList = [];
    for (let index = 0; index < children.length; index += 1) {
      const item = children[index];
      if(item.type === SortItem){         
        newList.push({
          uniqueId: index,
          element: React.cloneElement(item, {
            uniqueId: index,
            onUpClick: this.handleUpClick,
            onDownClick: this.handleDownClick,
          }),
          data: item.props.data,
        });
      }
    }
    this.setState({
      list: newList,
    })
  }

  handleUpClick = (uniqueId) => {
    this.sortList(uniqueId, 'up');
  }

  handleDownClick = (uniqueId) => {
    this.sortList(uniqueId, 'down');
  }

  sortList(currentUniqueId, direction){
    const {list} = this.state;
    const newList = [];
    for (let index = 0; index < list.length; index += 1) {
      const item = list[index];
      if(item.uniqueId === currentUniqueId){
        if(direction === "up"){
          newList.splice(index - 1, 0, item);
        }else{
          // 先push后一个元素
          newList.push(list[index + 1]);
          newList.push(item);
          index += 1;
        }
      }else{
        newList.push(item);
      }
    }
    this.setState({
      list: newList,
    })
    const {onChange} = this.props;
    if(onChange){
      const returnList = newList.map(item => item.data)
      onChange(returnList)
    }
  }

  render(){
    const {list} = this.state;
    const {style, className} = this.props;
    return (
      <div style={style} className={`${styles.container} ${className}`}>
        {list.map((item, index) => {
          return React.cloneElement(item.element, {
            first: index === 0,
            last: index === list.length - 1,
          })
        } )}
      </div>
    )
  }
}

SortList.SortItem = SortItem;