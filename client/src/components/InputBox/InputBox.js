import React from 'react';
import { gql,  graphql , compose } from 'react-apollo';
import './InputBox.css';

import EmailInputBox from '../../components/EmailInputBox';
import IntegerInputBox from '../../components/IntegerInputBox';
import CurrencyInputBox from '../../components/CurrencyInputBox';
import CheckBox from '../../components/CheckBox';
import TextBox from '../../components/TextBox';
import AddressBox from '../../components/AddressBox';
import SelectBox from '../../components/SelectBox';
import TextArea from '../../components/TextArea';

class InputBox extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: false,
      errorState:null,
      id: props.id,
      type: "",
      label: "",
      value: "",
      mask: "",
      placeholder: "",
      regex: "",
      description: "",
      errorMsgs: new Set(),
      min: "",
      max: "",
      options: ""
    };

  }

  updateState = (data) => {
    let errorMsgs = this.state.errorMsgs;

    if(!data.loading){
      if(data.component.errorMsgs)
        errorMsgs.add(data.component.errorMsgs)

      this.setState({
        type: data.component.type,
        value: data.component.value,
        label: data.component.label,
        mask: data.component.mask,
        placeholder: data.component.placeholder,
        regex: data.component.regex,
        description: data.component.description,
        errorMsgs: errorMsgs,
        min: data.component.min,
        max: data.component.max,
        options: data.component.options,
      });
    }

    if(this.state.errorMsgs.size>0)
      this.setState({error:true});


  }

  componentWillReceiveProps(newProps) {

    if(newProps.data.component.id==this.state.id){

      this.updateState(newProps.data);

      if (!newProps.data.loading) {  

        if (this.subscription) {        

          if (newProps.data.component !== this.props.data.component) {   
            //if component details have changed, change state
            this.updateState(newProps.data);
             // if the feed has changed, we need to unsubscribe before resubscribing
             this.subscription();

           } else {         
            // we already have an active subscription with the right params so don't do anything
            return
          }
        }

        this.subscription = newProps.data.subscribeToMore({
          document: gql`
          subscription component($id: ID!) {
            component (id:$id) {
              id
              type
              label
              value
              mask
              placeholder
              regex {
                id
                regexStr
                errorMsg
              }
              description
              errorMsgs
              min
              max
              options
            }
          }
          `,
          variables: {id:this.state.id}, //variables needed for the subscription query

          updateQuery: (previousState, {subscriptionData}) => {
            return {
              component: subscriptionData.data.component
            }
          },
          onError: (err) => console.error(err),
        })
        
      }
    }

  }

  //textbox value changes
  handleChange = (evt) => {

    this.applyMask(evt.target.value, evt.target.dataset.mask);    

  }

  //handles when enter is pressed --> send a mutation to the server
  handleKeyUp = (evt) => {   
    if (evt.keyCode === 13) {
      this.submit();
    } 
    else{
      this.validate(this.state.value,this.state.regex);
    }
  }

  handleOnBlur = (evt) => {

    if(this.props.id!=8)
      this.submit();
    else
      this.setState({errorState:"error"});
  }


//textbox value changes
  handleCheckboxChange = (evt) => {
    this.setState({value:this.state.value==="false"?"true":"false"},()=>{
      this.submit();   
    });    
  }

  submit = () => {


    if(this.validate(this.state.value,this.state.regex)){

      this.setState({error:false});

      this.props.mutate({
        variables: { id:this.props.id, value:this.state.value }
      })
      .then(({ data }) => {})
      .catch((error) => {
        console.log('there was an error sending the query', error);
      });
    }
    else{
      this.setState({
        error:true        
      });
    }
  }


  validate = (value,patterns) => {


    let result = true;
    let errorMsgs = this.state.errorMsgs;

    if(value.length<this.state.min){
      errorMsgs.add("Required field");
      this.setState({       
        errorMsgs:errorMsgs
      });
      result = false;
    }
    else{
      if(this.state.errorMsgs.size>0){
        errorMsgs.delete("Required field");
        this.setState({       
          errorMsgs:errorMsgs
        });
      }
      for(let i=0;i<patterns.length;i++){
       let re = new RegExp(patterns[i].regexStr);       
       if(!re.test(value)){
        errorMsgs.add(patterns[i].errorMsg);
        this.setState({errorMsgs:errorMsgs});
        result = false;
      }
      else{
        errorMsgs.delete(patterns[i].errorMsg);
        this.setState({errorMsgs:errorMsgs});
      }
    }

    if(value.length>this.state.max){
      result = false;
      errorMsgs.add("Input exceeds maximum length");
      this.setState({       
        errorMsgs:this.state.errorMsgs
      });
    }
  }


  if(result===false){
   this.setState({
    errorState:"error"        
  });
 }
 else{
  this.setState({
    errorState:"success"        
  });
}


return result;
}



  // Replace `x` characters with characters from `data`
  applyMask = (data,mask) => {
    let targetVal = '';

    if(mask!==''){
      let dataArr = data.split('');
      let maskArr = mask.split('');

      for(let i=0;i<maskArr.length;i++){   

        if(dataArr.length<=i)
          break
        if (maskArr[i] !== 'x' && maskArr[i] !== '0' && maskArr[i] !== dataArr[i]){
          dataArr.splice(i, 0, maskArr[i]);          
        }
        if (maskArr[i] === '0' && isNaN(dataArr[i])){
          dataArr.splice(i, 1);          
        } 

      }       
      if(dataArr.length>maskArr.length)
        dataArr = dataArr.splice(0,maskArr.length);

      // if(maskArr[dataArr.length] !== 'x' && maskArr[dataArr.length] !== '0')
      //   dataArr.push(maskArr[dataArr.length]);

      targetVal = dataArr.join('');
    }
    else{
      targetVal = data;
    }


    this.setState({value:targetVal});
  }

  handleAddressSelect = (place) => {
    this.setState({value:place, errorState:"success"});
    this.submit();
  }




  render() {

     let errorDiv = "";
     if(this.state.error===true){
      let errorArr = [...this.state.errorMsgs];
      errorDiv = errorArr.map((item,i)=>{
        return  (<div className="error" key={"e"+i}>{item}</div>);
      });
     }
 

    switch(this.props.id) {     
      case 1:
          return (<IntegerInputBox 
            label={this.state.label}
            description={this.state.description}
            type={this.state.type} 
             value={this.state.value} 
             id={this.props.id}
             handleChange={this.handleChange} 
             handleKeyUp={this.handleKeyUp}
             handleOnBlur={this.handleOnBlur}
             mask={this.state.mask} 
             placeholder={this.state.placeholder}
             errorState={this.state.errorState}
             errorDiv={errorDiv} />);          
      case 2:
          return (<EmailInputBox 
             label={this.state.label}
            description={this.state.description}
            type={this.state.type} 
             value={this.state.value} 
             id={this.props.id}
             handleChange={this.handleChange} 
             handleKeyUp={this.handleKeyUp}
             handleOnBlur={this.handleOnBlur}
             mask={this.state.mask} 
             placeholder={this.state.placeholder}
              errorState={this.state.errorState}
             errorDiv={errorDiv} />);
      case 3:
          return (<CurrencyInputBox 
             label={this.state.label}
            description={this.state.description}
            type={this.state.type} 
             value={this.state.value} 
             id={this.props.id}
             handleChange={this.handleChange} 
             handleKeyUp={this.handleKeyUp}
             handleOnBlur={this.handleOnBlur}
             mask={this.state.mask} 
             placeholder={this.state.placeholder}
              errorState={this.state.errorState}
             errorDiv={errorDiv} />);
        case 4:
          return (<CheckBox 
             label={this.state.label}
             description={this.state.description}
             type={this.state.type} 
             value={this.state.value} 
             id={this.props.id}
             handleChange={this.handleCheckboxChange}  
             errorState={this.state.errorState}
             errorDiv={errorDiv} />);
         case 5:
          return (<AddressBox 
             label={this.state.label}
             description={this.state.description}
             type={this.state.type} 
             value={this.state.value} 
             id={this.props.id}
             handleChange={this.handleChange} 
             handleKeyUp={this.handleKeyUp}
             handleOnBlur={this.handleOnBlur}
             handleAddressSelect={this.handleAddressSelect}
             mask={this.state.mask} 
             placeholder={this.state.placeholder}
             errorState={this.state.errorState}
             errorDiv={errorDiv} />);
          case 6:
          return (<SelectBox 
             label={this.state.label}
             description={this.state.description}
             type={this.state.type} 
             value={this.state.value} 
             id={this.props.id}
             handleChange={this.handleChange}              
             handleOnBlur={this.handleOnBlur}
             placeholder={this.state.placeholder}
             options={this.state.options}
             errorState={this.state.errorState}
             errorDiv={errorDiv} />);
          case 7:
          return (<TextArea
             label={this.state.label}
             description={this.state.description}
             type={this.state.type} 
             value={this.state.value} 
             id={this.props.id}
             handleChange={this.handleChange}              
             handleOnBlur={this.handleOnBlur}
             placeholder={this.state.placeholder}
             errorState={this.state.errorState}
             errorDiv={errorDiv} />);
      default:
          return (<TextBox 
             label={this.state.label}
            description={this.state.description}
            type={this.state.type} 
             value={this.state.value} 
             id={this.props.id}
             handleChange={this.handleChange} 
             handleKeyUp={this.handleKeyUp}
             handleOnBlur={this.handleOnBlur}
             mask={this.state.mask} 
             placeholder={this.state.placeholder}
              errorState={this.state.errorState}
             errorDiv={errorDiv} />);
    }

      
  }

 
}

//query to get component details
const componentQuery = gql`query component($id: ID!) {
  component(id: $id){
    id
    type
    label
    value
    mask
    placeholder
    regex {
      id
      regexStr
      errorMsg
    }
    description
    errorMsgs
    min
    max
    options
  }
}`

//query to change component details
const componentMutation = gql`
mutation changeComponent($id: ID!, $value: String!) {
  changeComponent(id: $id, value: $value) {
    id
    type
    label
    value
    mask
    placeholder
    regex {
      id
      regexStr
      errorMsg
    }
    description
    errorMsgs
    min
    max
    options
  }
}
`;

//combines query and mutation
export default compose(
  graphql(componentQuery, { 
    options: ({ id }) => ({ 
      forceFetch: true,
      variables:{ 
        id: id 
      } 
    })
  }),
  graphql(componentMutation)
  )(InputBox);


