import React from 'react';
import './TextBox.css';
import {FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';



export default class TextBox extends React.Component {

  


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
       placeholder={this.props.placeholder}/>

     

       <FormControl.Feedback />
       <HelpBlock>{this.props.description}</HelpBlock>
       </FormGroup>

       {this.props.errorDiv} 

       </div>

         
       );
   }

 
}
