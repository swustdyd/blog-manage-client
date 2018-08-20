import React from 'react';
import { Icon } from 'antd';

import styles from './index.less';

export default class TagSelect2 extends React.Component {
  constructor(props) {
    super(props);
    const propsExpandText = props.expandText || ['展开', '收起'];
    const expandText = propsExpandText[0];
    this.state = {
      expand: false,
      expandText,
      tags: [],
      selectedTags: new Map(),
      selectAll: false,
    };
  }

  componentWillReceiveProps(newProps) {
    const { tags } = newProps;
    const { selectedTags } = this.state;
    this.setState({
      tags: tags.map(tag => {
        const result = selectedTags.get(tag.id);
        if (result) {
          return { ...tag, selected: true };
        } else {
          return { ...tag, selected: false };
        }
      }),
    });
    return newProps;
  }

  onChange() {
    const { onChange: handleChange } = this.props;
    const { selectedTags } = this.state;
    if (handleChange) {
      const values = [];
      selectedTags.forEach(tag => {
        values.push(tag);
      });
      handleChange(values);
    }
  }

  handleSelectAllClick() {
    const { selectedTags, tags, selectAll } = this.state;
    const newTags = [];
    for (let index = 0; index < tags.length; index += 1) {
      const tag = tags[index];
      if (selectAll) {
        selectedTags.delete(tag.id);
      } else {
        selectedTags.set(tag.id, tag);
      }
      newTags.push({ ...tag, selected: !selectAll });
    }
    this.setState({
      tags: newTags,
      selectedTags,
      selectAll: !selectAll,
    });
    this.onChange();
  }

  handleTagClick(selectedTag) {
    const { selectedTags, tags } = this.state;

    if (selectedTag.selected) {
      selectedTags.delete(selectedTag.id);
    } else {
      selectedTags.set(selectedTag.id, selectedTag);
    }
    const selectAll = selectedTags.size === tags.length;
    this.setState({
      tags: tags.map(tag => {
        if (tag.id === selectedTag.id) {
          return { ...tag, selected: !selectedTag.selected };
        } else {
          return tag;
        }
      }),
      selectedTags,
      selectAll,
    });
    this.onChange();
  }

  handleExpandClick() {
    const { expand } = this.state;
    const { expandText } = this.props;
    const propsExpandText = expandText || ['展开', '收起'];
    this.setState({
      expand: !expand,
      expandText: expand ? propsExpandText[0] : propsExpandText[1],
    });
  }

  renderTags(tags) {
    const { allText } = this.props;
    const { selectAll } = this.state;
    const renderTags = tags.map(tag => {
      const className = `${styles.tag}${tag.selected ? ` ${styles.tagSelected}` : ''}`;
      const style = tag.selected && tag.color ? { backgroundColor: tag.color } : {};
      return (
        <span
          key={tag.id}
          className={className}
          style={style}
          onClick={() => this.handleTagClick(tag)}
        >
          {tag.name}
        </span>
      );
    });
    const allClassName = `${styles.tag}${selectAll ? ` ${styles.tagSelected}` : ''}`;
    return [
      <span key="all" onClick={() => this.handleSelectAllClick()} className={allClassName}>
        {allText || '全部'}
      </span>,
    ].concat(renderTags);
  }

  render() {
    const { expandable } = this.props;
    const { expand, expandText, tags } = this.state;
    // console.log(tags);
    return (
      <div className={styles.container}>
        <div className={`${styles.tagContainer}${expand ? ` ${styles.tagContainerExpand}` : ''}`}>
          {this.renderTags(tags)}
        </div>
        {expandable ? (
          <div className={styles.expandContainer}>
            <span onClick={() => this.handleExpandClick()}>
              {expand ? <Icon type="up" /> : <Icon type="down" />}
              &nbsp;
              {expandText}
            </span>
          </div>
        ) : null}
      </div>
    );
  }
}
