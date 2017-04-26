import React from 'react';
import InputBox from '../../components/InputBox'
import './CurrencyInputBox.css';


export default class EmailInputBox extends React.Component {


  render() {
   
      return (
       
        <InputBox id={this.props.id} hasAddon={true} addon="$" />

         
       );
    
    
  } 
}


