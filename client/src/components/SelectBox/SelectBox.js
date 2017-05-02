import React from 'react';
import './SelectBox.css';
import {FormGroup, ControlLabel, FormControl,HelpBlock} from 'react-bootstrap';


export default class SelectBox extends React.Component {
  

 
  render() {
    
    let listOptions = "";

    if(this.props.options)
    listOptions = this.props.options.map((item,i)=>{
      return (<option value={item} key={"ov"+i}>{item}</option>);
    })
    
   
    return (
     
      <div className="askComponent">

      <FormGroup validationState={this.props.errorState}>

      <ControlLabel>{this.props.label}</ControlLabel> 


      <FormControl 
      componentClass="select" 
   
      value={this.props.value} 
      id={this.props.id.toString()}
      onChange={this.props.handleChange}       
      onBlur={this.props.handleOnBlur}        
      placeholder={this.props.placeholder}>
        {listOptions}
      </FormControl>     
     

      <FormControl.Feedback />
      <HelpBlock>{this.props.description}</HelpBlock>
      </FormGroup>

      {this.props.errorDiv} 

      </div>

      
      );
    
    
  } 
}


