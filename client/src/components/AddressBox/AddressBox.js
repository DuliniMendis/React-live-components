import React from 'react';
import './AddressBox.css';
import {FormGroup, ControlLabel, InputGroup,FormControl,HelpBlock} from 'react-bootstrap';


export default class AddressBox extends React.Component {


  componentDidMount() {
   
   try{
      this.autocomplete = new window.google.maps.places.Autocomplete(this.textInput, { types: ['geocode'] });
       if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              let geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              let circle = new window.google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
              });
              this.autocomplete.setBounds(circle.getBounds());
            });
          }

          window.google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
          let place = this.autocomplete.getPlace().formatted_address;
          this.props.handleAddressSelect(place);
            
      });
    }
    catch(error){
      console.log("Cannot load google address lookup");
    }
    
  }


  render() {

    return (
     <div className="askComponent">

     <FormGroup validationState={this.props.errorState}>

     <ControlLabel>{this.props.label}</ControlLabel>

     <InputGroup>

     <InputGroup.Addon><span className="glyphicon glyphicon-map-marker"></span></InputGroup.Addon>

     <input
     ref={(input) => { this.textInput = input; }}
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


