import React from 'react';
import './CheckBox.css';
import {FormGroup, ControlLabel,  HelpBlock, Checkbox} from 'react-bootstrap'


export default class CheckBox extends React.Component {


  render() {


      return (
       <div className="askComponent">

         <FormGroup>

           <ControlLabel>{this.props.label}</ControlLabel>         

             <Checkbox checked={this.props.value==="true"}
             id={this.props.id} 
             onChange={this.props.handleChange}>
             </Checkbox>

           <HelpBlock>{this.props.description}</HelpBlock>
         </FormGroup>

         {this.props.errorDiv} 

       </div>
       );

  
  }

 
}

