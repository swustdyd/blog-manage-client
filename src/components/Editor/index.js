import React from 'react'

// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'

import styles from './index.less';

export default class Editor extends React.Component {
    render(){
        const {onChange, value, height = 500} = this.props;
        const editorProps = {
            height,
            contentFormat: 'html',
            initialContent: value,
            onChange,
        }

        return (
            <div className={styles.editorContainer}>
                <BraftEditor {...editorProps} />
            </div>
        )

    }
}