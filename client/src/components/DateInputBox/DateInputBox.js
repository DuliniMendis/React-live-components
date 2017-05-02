import React from 'react';
import './DateInputBox.css';
import {FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';
import dateFormat from 'dateformat';
//import DatePicker from "react-bootstrap-date-picker";
import 'rc-calendar/assets/index.css';
import DatePicker from 'rc-calendar/lib/Picker';
import Calendar from 'rc-calendar';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';

import 'rc-time-picker/assets/index.css';
import TimePickerPanel from 'rc-time-picker/lib/Panel';


import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

//const format = 'YYYY-MM-DD HH:mm:ss';
const cn = location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

const timePickerElement = <TimePickerPanel />;
const format = 'YYYY-MM-DD';

const disabledDate = (current) => {
  if (!current) {
    // allow empty select
    return false;
  }
  const date = moment();
  date.hour(0);
  date.minute(0);
  date.second(0);
  return current.date() + 10 < date.date();  // can not select days before today
}

const disabledTime = (date) => {

  if (date && (date.date() === 15)) {
    return {
      disabledHours() {
        return [3, 4];
      },
    };
  }
  return {
    disabledHours() {
      return [1, 2];
    },
  };
}





export default class DateInputBox extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      showTime: false,
      showDateInput: true,
      disabled: false,
      value: props.value?this.convertStrToDate(props.value):props.defaultValue
    }
  }


  componentWillReceiveProps(nextProps){

    this.setState({
      value: nextProps.value?this.convertStrToDate(nextProps.value):""
    });
  }

 convertStrToDate = (string) => {
   let date = new Date(string);
   date = moment(date);
   return date;
 }
  

 handleChange = (value) => {
  
    //value._d.toUTCString())
    if(value){
      this.setState({
        value: value,
      });
      this.props.changeValue(value._d.toUTCString());
    }
    else{
      this.setState({
        value: this.props.defaultValue,
      });
      this.props.changeValue("");
    }
  }

 formatValue = (value,mask) =>{
  if(value && mask)
    return dateFormat(value._d,mask);  
  else if(value && !mask)
    return dateFormat(value._d,format);
  else
    return value;
 }

  render() {

    const calendar = (<Calendar
      locale={cn ? zhCN : enUS}
      style={{ zIndex: 1000 }}
      formatter={this.props.mask ? this.props.mask: 'YYYY-MM-DD'}
      disabledTime={this.state.showTime ? disabledTime : null}
      timePicker={this.state.showTime ? timePickerElement : null}
      defaultValue={this.props.defaultCalendarValue}
      showDateInput={this.state.showDateInput}
      disabledDate={disabledDate}
      showToday={false} />);

     return (
       
        <div className="askComponent">

       <FormGroup validationState={this.props.errorState}>

       <ControlLabel>{this.props.label}</ControlLabel>


      <DatePicker
          animation="slide-up"
          disabled={this.state.disabled}
          calendar={calendar}
          value={this.convertStrToDate(this.state.value)}
          onChange={this.handleChange}
        >
       {
            ({ value }) => {
              return (
                <span tabIndex="0">
                <input
                  placeholder={this.props.placeholder}
                  disabled={this.state.disabled}                  
                  tabIndex="-1"
                  
                  className="form-control"
                  value={this.formatValue(this.state.value,this.props.mask)}   />
                </span>
              );
            }
          }
        </DatePicker>
       

     

       <FormControl.Feedback />
       <HelpBlock>{this.props.description}</HelpBlock>
       </FormGroup>

       {this.props.errorDiv} 

       </div>

         
       );
   }

 
}
