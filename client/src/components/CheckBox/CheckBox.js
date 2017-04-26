import React from 'react';
import { gql,  graphql , compose } from 'react-apollo';
import './CheckBox.css';
import {FormGroup, ControlLabel,  HelpBlock, Checkbox} from 'react-bootstrap'


class CheckBox extends React.Component {

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
    this.setState({value:this.state.value==="false"?"true":"false"},()=>{
      this.submit(); 
    });
       
  }





  submit = () => {

      this.setState({error:false});

      this.props.mutate({
        variables: { id:this.state.id, value:this.state.value }
      })
      .then(({ data }) => {})
      .catch((error) => {
        console.log('there was an error sending the query', error);
      });
    
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

      return (
       <div className="askComponent">

         <FormGroup validationState={this.state.errorState}>

           <ControlLabel>{this.state.label}</ControlLabel>         

             <Checkbox checked={this.state.value==="true"}
             id={this.props.id} 
             onChange={this.handleChange} 
             onBlur={this.handleOnBlur}>
             </Checkbox>

           <HelpBlock>{this.state.description}</HelpBlock>
         </FormGroup>

         {errorDiv} 

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
  )(CheckBox);


