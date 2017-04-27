import React from 'react';
import './EmailInputBox.css';
import {FormGroup, ControlLabel, InputGroup,FormControl,HelpBlock} from 'react-bootstrap';


export default class EmailInputBox extends React.Component {


  render() {

      return (
       
        <div className="askComponent">

       <FormGroup validationState={this.props.errorState}>

       <ControlLabel>{this.props.label}</ControlLabel>

       <InputGroup>

       <InputGroup.Addon>@</InputGroup.Addon>

       <input
       className="form-control"
       type={this.props.type} 
       value={this.props.value} 
       id={this.props.id}
       onChange={this.props.handleChange} 
       onKeyUp={this.props.handleKeyUp}
       onBlur={this.props.handleOnBlur}
       data-mask={this.props.mask} 
       placeholder={this.props.placeholder}/>

       </InputGroup>

       <FormControl.Feedback />
       <HelpBlock>{this.props.description}</HelpBlock>
       </FormGroup>

       {this.props.errorDiv} 

       </div>

         
       );
    
    
  } 
}


