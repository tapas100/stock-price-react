import React, { Component } from 'react'
import './calendar.scss'
import * as moment from 'moment';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Modal from 'react-modal';
import axios from 'axios';
const API_URL = 'https://api.airtable.com/v0/appMbHwLZ3GCOpOH0/';
const API_KEY = 'key7KMtDyXPsfLEjt'
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
    }
};
Modal.setAppElement('#root')
class Calendar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalIsOpen: false,
            calendarWeekends: true,
            calendarEvents: [],
            currentEvent: {},
            modalTitle: 'Add Price',
            prices: this.props.prices
        };
        this.calendarComponentRef = React.createRef()
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }


    componentDidUpdate(prevProps) {
        if (this.props.events !== prevProps.events) {
            this.setState({
                calendarEvents: this.props.events,
                prices: this.props.prices
            })
        }

    }


    openModal() {
        this.setState({ modalIsOpen: true });
    }

    afterOpenModal() {
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }





    handleDateClick = (event) => {
        for (var i = 0; i < this.state.calendarEvents.length; i++) {
            if (moment(event.dateStr).format('l') === moment(this.state.calendarEvents[i].start).format('l')) {
                this.ShowEditScreen(this.state.prices[i]);
                break;
            }
            else if (i == this.state.calendarEvents.length - 1) {
                this.ShowCreateNew(event.dateStr);
            }
        }

    }


    ShowEditScreen = (value) => {
        this.setState({
            currentEvent: value.data,
            modalTitle: 'Edit Price'
        }, () => {
            this.openModal();
        })




    }

    ShowCreateNew = (date) => {
        this.setState({
            currentEvent: {
                eventId: 'event001',
                date: date,
                price: 0
            },
            modalTitle: 'Add Price'
        }, () => {
            this.openModal();
        })

    }

    updatePrice = (id, element) => {
        const url = `${API_URL}Price/${id}`;
        axios.put(url, {
            fields: element
        }, { headers: { 'Authorization': `Bearer ${API_KEY}` } }).then(response => response.data)
            .then((data) => {
                this.props.onDataChange()
            })
    }

    createPrice = (element) => {
        const url = `${API_URL}Price`;
        axios.post(url, {
            fields: element
        }, { headers: { 'Authorization': `Bearer ${API_KEY}` } }).then(response => response.data)
            .then((data) => {
                this.props.onDataChange()
            })
    }


    handleSubmit = () => {
          if(this.state.modalTitle == 'Add Price'){
              this.createPrice(this.state.currentEvent)
          }
          else if(this.state.modalTitle == 'Edit Price') {
               let temp;
               Object.assign(this.state.currentEvent,temp);
               let id = temp.id;
               delete  temp.id;
               this.updatePrice(id,temp)
          }
          this.closeModal()
    }

    handleChange(){
        let temp = this.state.currentEvent;
        temp.price  = document.getElementById('InputPrice').value;
        this.setState({
            currentEvent : temp
        })
       
    }

    render() {
        return (
            <React.Fragment>
                <div className='p-5 calendar'>
                    <div className='calendar-container'>
                        <FullCalendar
                            defaultView="dayGridMonth"
                            header={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                            }}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            ref={this.calendarComponentRef}
                            weekends={this.state.calendarWeekends}
                            events={this.state.calendarEvents}
                            dateClick={this.handleDateClick}
                            displayEventTime={false}
                            loading={true}
                            rerenderDelay={10}
                        />
                    </div>
                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >

                    <h2 ref={subtitle => this.subtitle = subtitle}>{this.state.modalTitle}</h2>
                    {/* <button onClick={this.closeModal}>close</button>
                    <div>I am a modal</div> */}
                    <form>
                        <div className="form-group">
                            <label htmlFor="InputPrice">Stock Price</label>
                            <input type="number" pattern="[0-9]"  onChange={this.handleChange.bind(this)}  className="form-control" id="InputPrice" aria-describedby="priceHelp" placeholder="Enter Price" />
                            <small id="priceHelp" className="form-text text-muted">Don't Enter Negative values</small>
                        </div>
                    </form>
                    <button type="submit" onClick={this.handleSubmit} className="btn btn-primary">Submit</button>
                </Modal>
            </React.Fragment>
        )
    }
}

export default Calendar;