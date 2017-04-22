import React from 'react';
import { gql,  graphql , compose } from 'react-apollo';
import './TextBox.css';


const cid = 1; // cahnge this for different text boxes

class TextBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: cid,
      type: this.props.data.loading ? "" : props.data.component.type,
      value: this.props.data.loading ? "" : props.data.component.value
    };
  }

  componentWillReceiveProps(newProps) {

    this.setState({
            type:newProps.data.loading ? "" : newProps.data.component.type,
            value:newProps.data.loading ? "" : newProps.data.component.value,
          });
   
    if (!newProps.data.loading) {  

      if (this.subscription) {        

        if (newProps.data.component !== this.props.data.component) {   

          //if component details have changed, change state
          this.setState({
            type:newProps.data.loading ? "" : newProps.data.component.type,
            value:newProps.data.loading ? "" : newProps.data.component.value,
          });

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

  //textbox value changes
  handleChange = (evt) => {    
      this.setState({value:evt.target.value});
  }

  //handles when enter is pressed --> send a mutation to the server
  handleKeyUp = (evt) =>{   
     if (evt.keyCode === 13) {
      this.props.mutate({
        variables: { id:this.state.id, value:this.state.value }
      })
      .then(({ data }) => {
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
     }
     
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
       <input type={this.state.type} value={this.state.value} onChange={this.handleChange} onKeyUp={this.handleKeyUp}/>
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
  }
}`

//query to change component details
const componentMutation = gql`
  mutation changeComponent($id: ID!, $value: String!) {
    changeComponent(id: $id, value: $value) {
      id
      type
      value
    }
  }
`;

//combines query and mutation
export default compose(
  graphql(componentQuery, { options: { 
      forceFetch: true,
      variables:{ 
        id: cid 
      } 
    }
  }),
  graphql(componentMutation)
)(TextBox);


