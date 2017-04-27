import React from 'react';
import './IntegerInputBox.css';
import {FormGroup, ControlLabel,FormControl,HelpBlock} from 'react-bootstrap';


export default class IntegerInputBox extends React.Component {




  handleKeyPress = (evt) => {
    var key = evt.charCode ? evt.charCode : evt.keyCode;

    if (key === 46) {
      evt.preventDefault();
    }
  }



  render() {

    return (

      <div className="askComponent">

      <FormGroup validationState={this.props.errorState}>

      <ControlLabel>{this.props.label}</ControlLabel>

      

      <input
       className="form-control"
      type={this.props.type} 
      value={this.props.value} 
      id={this.props.id}
      onChange={this.props.handleChange} 
      onKeyUp={this.props.handleKeyUp}
      onBlur={this.props.handleOnBlur}
      data-mask={this.props.mask} 
      onKeyPress={this.handleKeyPress}
      placeholder={this.props.placeholder}/>

      

      <FormControl.Feedback />
      <HelpBlock>{this.props.description}</HelpBlock>
      </FormGroup>

      {this.props.errorDiv} 

      </div>


      );
    
    
  } 
}


