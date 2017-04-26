import React from 'react';
import { gql,  graphql , compose } from 'react-apollo';
import './InputBox.css';
import {FormGroup,InputGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'


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
      max: ""
    };
  }

  updateState = (data) => {
    let errorMsgs = this.state.errorMsgs;
    
    this.setState({
      type:data.loading ? "" : data.component.type,
      value:data.loading ? "" : data.component.value,
      label:data.loading ? "" : data.component.label,
      mask: data.loading ? "" : data.component.mask,
      placeholder: data.loading ? "" : data.component.placeholder,
      regex: data.loading ? "" : data.component.regex,
      description: data.loading ? "" : data.component.description,
      errorMsgs: data.loading ? new Set() : (data.component.errorMsgs?errorMsgs.add(data.component.errorMsgs): new Set()),
      min: data.loading ? "" : data.component.min,
      max: data.loading ? "" : data.component.max,
    });

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
    this.submit();
  }




  submit = () => {

    if(this.validate(this.state.value,this.state.regex)){

      this.setState({error:false});

      this.props.mutate({
        variables: { id:this.state.id, value:this.state.value }
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
    for(let i=0;i<patterns.length;i++){
     let re = new RegExp(patterns[i].regexStr);
     console.log(patterns[i].regexStr, re.test(value))
     if(!re.test(value)){
      this.setState({errorMsgs:this.state.errorMsgs.add(patterns[i].errorMsg)});
      result = false;
    }
  }
  if(value.length<this.state.min){
    this.setState({       
      errorMsgs:this.state.errorMsgs.add("Required field")
    });
    result = false;
  }
  if(value.length>this.state.max){
    result = false;
    this.setState({       
      errorMsgs:this.state.errorMsgs.add("Input exceeds maximum length")
    });
  }


  if(result===false || this.state.error===true){
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


  render() {

    //while data is loading
    if (this.props.data.loading) {     
      return (
        <div>
        "loading";
        </div>
        )
    } 
    //after data loads do this
    else{  

     let errorDiv = this.state.error===true?(<div className="error">
       {this.state.error?this.state.errorMsgs:''}
       </div>):"";

     if(this.props.hasAddon)

      return (
       <div className="askComponent">

         <FormGroup validationState={this.state.errorState}>

           <ControlLabel>{this.state.label}</ControlLabel>

           <InputGroup>

             <InputGroup.Addon>{this.props.addon}</InputGroup.Addon>

             <input
             className="form-control"
             type={this.state.type} 
             value={this.state.value} 
             id={this.props.id}
             onChange={this.handleChange} 
             onKeyUp={this.handleKeyUp}
             onBlur={this.handleOnBlur}
             data-mask={this.state.mask} 
             onKeyPress={this.props.keyPress}
             placeholder={this.state.placeholder}/>

           </InputGroup>

           <FormControl.Feedback />
           <HelpBlock>{this.state.description}</HelpBlock>
         </FormGroup>

         {errorDiv} 

       </div>
       );

    else

      return (
       <div className="askComponent">
         <FormGroup validationState={this.state.errorState}>

           <ControlLabel>{this.state.label}</ControlLabel>        
           
           <input
           className="form-control"
           type={this.state.type} 
           value={this.state.value} 
           id={this.props.id}
           onChange={this.handleChange} 
           onKeyUp={this.handleKeyUp}
           onBlur={this.handleOnBlur}
           data-mask={this.state.mask} 
           onKeyPress={this.props.keyPress}
           placeholder={this.state.placeholder}/>

           <FormControl.Feedback />
           <HelpBlock>{this.state.description}</HelpBlock>
            {errorDiv} 

         </FormGroup>

        
       </div>
       );
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


