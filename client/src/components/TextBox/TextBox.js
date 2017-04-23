import React from 'react';
import { gql,  graphql , compose } from 'react-apollo';
import './TextBox.css';


class TextBox extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: false,
      id: props.id,
      type: "",
      value: "",
      mask: "",
      placeholder: "",
      regex: ""
    };
  }

  updateState = (data) => {
     this.setState({
      type:data.loading ? "" : data.component.type,
      value:data.loading ? "" : data.component.value,
      mask: data.loading ? "" : data.component.mask,
      placeholder: data.loading ? "" : data.component.placeholder,
      regex: data.loading ? "" : data.component.regex
    });
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
              value
              mask
              placeholder
              regex
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
          value:'',
          error:true, 
        });
      }
    } 
  }

  validate = (value,pattern) => {
    let re = new RegExp(pattern);
    return re.test(value);
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

      if(maskArr[dataArr.length] !== 'x' && maskArr[dataArr.length] !== '0')
        dataArr.push(maskArr[dataArr.length]);

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
      return (
       <div>

         <input type={this.state.type} value={this.state.value} 
         onChange={this.handleChange} onKeyUp={this.handleKeyUp}
         data-mask={this.state.mask} placeholder={this.state.placeholder}/>

         <div className="error">
         {this.state.error?'Please check the input value':''}
         </div>

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
    value
    mask
    placeholder
    regex
  }
}`

//query to change component details
const componentMutation = gql`
mutation changeComponent($id: ID!, $value: String!) {
  changeComponent(id: $id, value: $value) {
    id
    type
    value
    mask
    placeholder
    regex
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
  )(TextBox);


