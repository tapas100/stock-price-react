import React, { Component } from 'react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


var options = {
  title: {
    text: "Stock Price"
  },
};


class Linechart extends Component {

  constructor(props) {
    super(props)

    this.state = {
       options : {}
    }
  }

  componentDidUpdate(prevProps){
    if(this.props.data != prevProps.data){
      this.setState({
        options : {
          title: {
            text: "Stock Price"
          },
    
          legend: {
            enabled: true
          },
    
          plotOptions: {
            series: {
              showInLegend: true
            }
          },
          xAxis: {
            type: 'datetime'
          },
          yAxis: {
            title: {
              text: 'Price'
            }
          }
          ,
          series: [
            {
              type: "line",
              id: "aapl",
              name: "Price Through Event",
              data: this.props.data  //changes.data.currentValue
            }
          ]
    
        }
      })
    }
  }

  componentWillMount() {
    
  }

  render() {
    return (
      <div className="pt-5">
        <HighchartsReact
          highcharts={Highcharts}
          options={this.state.options}
        />
      </div>
    )
  }
}

export default Linechart;