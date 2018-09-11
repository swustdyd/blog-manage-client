import React from 'react'
import { Col } from 'antd'
import ReactEcharts from 'echarts-for-react'

import styles from './index.less'

export default class Echarts extends React.Component{

  setWatermakerOption = (option) => {    
    const {watermarker} = option;
    if(watermarker){
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 100;
      canvas.height = 100;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = 0.08;
      ctx.font = '20px Microsoft Yahei';
      ctx.translate(50, 50);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText('waterMarkText', 0, 0);
      option.backgroundColor = {
        type: 'pattern',
        image: canvas,
        repeat: 'repeat',
      }
    }
  }

  render(){
    const {option} = this.props;
    this.setWatermakerOption(option);
    const {style, wrapperLayout} = option;
    const colLayout = wrapperLayout || {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 12,
    };
    return (
      <Col
        className={styles.chartContainer} 
        {...colLayout}
      >
        <ReactEcharts style={style} {...this.props} onEvents={option.events} />
      </Col>
    )
  }
}