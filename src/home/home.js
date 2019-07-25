import React, { Component } from 'react'
import Loader from '../components/loader/loader';
import Calendar from '../components/calendar/calendar';
import Linechart from '../components/line-chart/line-chart';
import EventDialog from '../components/event-dialog/event-dialog';
import Header from '../components/header/header';
import * as moment from 'moment';
import axios from 'axios';
const API_URL = 'https://api.airtable.com/v0/appMbHwLZ3GCOpOH0/';
const API_KEY = 'key7KMtDyXPsfLEjt'

class Home extends Component {

    constructor(props) {
        super(props)

        this.state = {
            calendarEvents: [],
            chartData: [],
            startDate: null,
            endDate: null,
            maxProfit: null
        }
    }


    componentDidMount() {
        this.getAllPrices()
    }

    getAllPrices = () => {
        const url = `${API_URL}Price`;
        axios.get(url, { headers: { 'Authorization': `Bearer ${API_KEY}` } }).then(response => response.data)
            .then((data) => {
                console.log(data);
                this.formatPricesForCalendar(data.records);
                this.formatPricesForChart(data.records);
            })
    }

    formatPricesForCalendar = (prices) => {
        let temp = [], temp2 = [];
        prices.forEach(element => {
            temp.push({
                title: 'Rs. ' + element.fields.price,
                start: new Date(element.fields.date)
            })
            temp2.push({
                date: moment(element.fields.date),
                data: {
                    id: element.id,
                    eventId: element.fields.eventId,
                    date: element.fields.date,
                    price: element.fields.price
                }
            })
        });
        this.setState({
            calendarEvents: temp,
            datePriceData: temp2
        })
    }

    formatPricesForChart = (prices) => {
        let temp = []
        this.calculateMaxProfit(prices.map(ele => { return ele.fields.price }));
        prices.forEach(element => {
            temp.push([new Date(element.fields.date).getTime(), Number(element.fields.price)])
        })
        temp.sort();
        this.setState({
            startDate: moment(temp[0][0]).format('ll'),
            endDate: moment(temp[temp.length - 1][0]).format('ll'),
            chartData: temp
        })

    }

    calculateMaxProfit = (prices) => {
        prices.sort();
        this.setState({ maxProfit: (prices[prices.length - 1] * 10) - (prices[0] * 10) });
    }

    render() {
        return (
            //  <Loader/>
            //   <Calendar/>
            // <Linechart/>
            // <EventDialog/>
            <React.Fragment>

                <Header />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8">
                            <Calendar events={this.state.calendarEvents} prices={this.state.datePriceData} onDataChange={() => this.getAllPrices()} />
                        </div>
                        <div className="col-md-4">
                            <Linechart data={this.state.chartData} />
                            <div className="row mt-3 ml-0 mr-0">
                                <div className="col-md-6 text-center shadow-sm p-2">
                                    <p>Start Date</p>
                                    <span>{this.state.startDate}</span>
                                </div>
                                <div className="col-md-6 text-center shadow-sm p-2">
                                    <p>End Date</p>
                                    <span>{this.state.endDate}</span>
                                </div>
                            </div>
                            <div className="text-center shadow-sm mt-3">
                                <p>Max Profit</p>
                                <span>Rs. {this.state.maxProfit}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}

export default Home;