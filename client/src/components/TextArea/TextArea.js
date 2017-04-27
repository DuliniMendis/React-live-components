import React from 'react';
import './TextArea.css';
import {FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';



export default class TextArea extends React.Component {

  


  render() {

     return (
       
        <div className="askComponent">

       <FormGroup validationState={this.props.errorState}>

       <ControlLabel>{this.props.label}</ControlLabel>



       <textarea
       rows="4"
       className="form-control textarea"
       id={this.props.id}
       value={this.props.value}
       onChange={this.props.handleChange} 
       onKeyUp={this.props.handleKeyUp}
       onBlur={this.props.handleOnBlur}
       data-mask={this.props.mask} 
       placeholder={this.props.placeholder}>
       </textarea>      
     

       <FormControl.Feedback />
       <HelpBlock>{this.props.description}</HelpBlock>
       </FormGroup>

       {this.props.errorDiv} 

       </div>

         
       );
   }

 
}
