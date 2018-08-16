import React from 'react'
import {ChromePicker} from 'react-color'

export default class ColorPiker extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            color: props.value || '#1890ff',
        }
    }

    handleChangeComplete = (color) => {
        this.setState({
            color,
        })
        const {onChange} = this.props;
        if(onChange){
            onChange(color);
        }
    };

    render(){
        const {color} = this.state;
        return <ChromePicker disableAlpha color={color} onChangeComplete={this.handleChangeComplete} />
    }
}