import React from 'react';
import './TimeInputBox.css';
import {FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';
import TimePicker from '../TimePicker';
import onClickOutside from 'react-onclickoutside';


class TimeInputBox extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      value:props.value,
      isPickerVisible:false,
      x:0,
      y:0,
      isUp:false
    }
  }

  componentWillReceiveProps(nextProps)  {
      this.setState({value:nextProps.value});
  }
  

  handleClick = (evt) => {
    evt.stopPropagation();

    let clientY = window.innerHeight;
    let evtY = evt.clientY;
    let isUp = false;
    let x = evt.nativeEvent.offsetX-10;
    let y = evt.nativeEvent.offsetY-10;


    if(evtY>clientY/2){
      isUp = true;
      x = evt.nativeEvent.offsetX+10;
      y = evt.nativeEvent.offsetY+10;
    }

    this.setState({
      isPickerVisible:!this.state.isPickerVisible,
      x:x,
      y:y,
      isUp: isUp
    });
  }


  changeValues = (values) => {

      this.setState({value:values.hour+":"+values.minute},()=>{
        this.props.changeValue(this.state.value);
      });
  }

  getHours =(value) => {
    if(value){
      return value.substring(0,2)
    }
    else
      return "";
  }

  getMinutes =(value) => {
    if(value){
      return value.substring(3,5);
    }
    else
      return "";
  }


  setPickerVisibility = (value) => {
    this.setState({isPickerVisible:value});
  }

  handleClickOutside = (evt) => {
      this.setState({isPickerVisible:false});
  }



  render() {

    

     return (
       
       <div className="askComponent" onClick={this.handleClickOutside}>

       <FormGroup validationState={this.props.errorState}>

       <ControlLabel>{this.props.label}</ControlLabel>

       <input
       className="form-control"       
       value={this.state.value} 
       id={this.props.id}
       onClick={this.handleClick}
       onChange={this.props.handleChange} 
       onKeyUp={this.props.handleKeyUp}
       onBlur={this.props.handleOnBlur}
       data-mask={this.props.mask} 
       placeholder={this.props.placeholder}/>
       
       <TimePicker 
       isVisible={this.state.isPickerVisible} 
       hour={this.getHours(this.state.value)}
       minute={this.getMinutes(this.state.value)}
       x={this.state.x} 
       y={this.state.y} 
       isUp={this.state.isUp}
       changeValues={this.changeValues}
       setPickerVisibility={this.setPickerVisibility}/>

       <FormControl.Feedback />
       <HelpBlock>{this.props.description}</HelpBlock>
       </FormGroup>

       {this.props.errorDiv} 

       </div>

         
       );
   }

 
}

export default onClickOutside(TimeInputBox);
