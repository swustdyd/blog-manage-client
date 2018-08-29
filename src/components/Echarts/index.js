import React from 'react'
import ReactEcharts from 'echarts-for-react'

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
    return <ReactEcharts {...this.props} />
  }
}