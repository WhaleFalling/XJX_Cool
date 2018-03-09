import React, { Component } from 'react';
import ReactDom from 'react-dom';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state={
      data:[10, 52, 200, 334, 390, 330, 220]
    }
  }

  init(){
    const option = {
      color: ['#3398DB'],
      tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis : [
          {
              type : 'category',
              data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              axisTick: {
                  alignWithLabel: true
              }
          }
      ],
      yAxis : [
          {
              type : 'value'
          }
      ],
      series : [
          {
              name:'直接访问',
              type:'bar',
              barWidth: '60%',
              data:this.state.data
          }
      ]
  };
  
  let el = window.echarts.init(ReactDom.findDOMNode(this.refs.list));
  el.setOption(option);

  }

  componentDidMount(){
    this.init();
  }
  componentDidUpdate(){
    this.init()
  }

  render() {
    return (
      <div>
      <div className="App" ref="list" style={{height:600,width:600}}>
      </div>
      <button type="button" onClick={()=>{
        for(var i=0;i<7;i++){
          var data = [0,0,0,0,0,0,0];
          data[i] = Math.random()*100;
        }
        this.setState({
          data:data
        })}}>come on</button>
      </div>
    );
  }
}

export default App;
