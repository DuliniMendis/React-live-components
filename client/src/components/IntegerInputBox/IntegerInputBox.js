import React from 'react';
import InputBox from '../../components/InputBox'
import './IntegerInputBox.css';


export default class IntegerInputBox extends React.Component {

  

 
  handleKeyPress = (evt) => {
    var key = evt.charCode ? evt.charCode : evt.keyCode;
 
    if (key === 46) {
        evt.preventDefault();
    }
  }
 


  render() {
   
      return (
       
        <InputBox id={this.props.id} keyPress={this.handleKeyPress} />

         
       );
    
    
  } 
}


